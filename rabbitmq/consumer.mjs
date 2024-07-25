import 'dotenv/config'; 
// import amqp from 'amqplib';
// import { Url } from '../models/urlmodels.mjs';
// import { customHash } from '../utils/customhash.mjs';

// async function startConsumer(queueName) {
//     const mongoUri = process.env.mongoDbUri || 'mongodb://127.0.0.1:27017/mydatabase?retryWrites=false';

//     mongoose.connect(mongoUri, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true
//     }).then(() => {
//         console.log("MongoDB successfully connected!");
//         try {

//             const connection = await amqp.connect('amqp://localhost');
//             const channel = await connection.createChannel();
//             await channel.assertQueue(queueName, {
//                 durable: true
//             });
//             console.log(`[*] Waiting for messages in ${queueName}`);

//             channel.consume(queueName, async (msg) => {
//                 if (msg !== null) {
//                     const fullUrl = msg.content.toString();
//                     console.log(`[x] Received ${fullUrl}`);
//                     try {
//                         let url = await Url.findOne({ fullUrl });
//                         if (!url) {
//                             let shortUrl;
//                             let isUnique = false;

//                             while (!isUnique) {
//                                 shortUrl = customHash(fullUrl);
//                                 const existingUrl = await Url.findOne({ shortUrl });

//                                 if (!existingUrl) {
//                                     isUnique = true;
//                                 }
//                             }

//                             url = new Url({ fullUrl, shortUrl });
//                             await url.save();
//                         }
//                     } catch (error) {
//                         console.error('Error in consumer:', error);
//                     }
//                     channel.ack(msg);
//                 }
//             }, {
//                 noAck: false
//             });
//         } catch (error) {
//             console.error('Error in consumer:', error);
//         }).catch(error => {
//             console.error("Error connecting to MongoDB:", error);
//         }   




// Ensure this is at the very top


import mongoose from 'mongoose';
import amqp from 'amqplib';
import { Url } from '../models/urlmodels.mjs';
import { customHash } from '../utils/customhash.mjs';

async function startConsumer(queueName) {
    const mongoUri = 'mongodb+srv://joelk:joelk123@urlshortner.ttet9ca.mongodb.net/?retryWrites=true&w=majority&appName=urlshortner';
    console.log("MongoDB URI:", mongoUri);

    // Mongoose connection event listeners
    mongoose.connection.on('connected', () => {
        console.log('Mongoose connected to ' + mongoUri);
    });

    mongoose.connection.on('error', (err) => {
        console.error('Mongoose connection error: ' + err);
    });

    mongoose.connection.on('disconnected', () => {
        console.log('Mongoose disconnected');
    });

    try {
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("MongoDB successfully connected!");

        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        await channel.assertQueue(queueName, {
            durable: true
        });
        console.log(`[*] Waiting for messages in ${queueName}`);

        channel.consume(queueName, async (msg) => {
            if (msg !== null) {
                const fullUrl = msg.content.toString();
                console.log(`[x] Received ${fullUrl}`);
                try {
                    console.log("Finding URL in database...");
                    let url = await Url.findOne({ fullUrl });
                    console.log("Find operation completed.");

                    if (!url) {
                        console.log("URL not found. Generating short URL...");
                        let shortUrl;
                        let isUnique = false;

                        while (!isUnique) {
                            shortUrl = customHash(fullUrl);
                            console.log(`Generated short URL: ${shortUrl}. Checking uniqueness...`);
                            const existingUrl = await Url.findOne({ shortUrl });
                            if (!existingUrl) {
                                isUnique = true;
                                console.log("Short URL is unique.");
                            } else {
                                console.log("Short URL is not unique. Regenerating...");
                            }
                        }

                        url = new Url({ fullUrl, shortUrl });
                        await url.save();
                        console.log(`Successfully saved the URL: ${fullUrl} with short URL: ${shortUrl} in the DB`);
                    } else {
                        console.log("URL already exists in the database.");
                    }
                } catch (error) {
                    console.error('Error in consumer:', error);
                }
                channel.ack(msg);
            }
        }, {
            noAck: false
        });
    } catch (error) {
        console.error('Error in MongoDB consumer:', error);
    }
}

startConsumer('urlQueue');
