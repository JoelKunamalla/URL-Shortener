import amqp from 'amqplib';

async function publishToQueue(queueName, message) {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        await channel.assertQueue(queueName, {
            durable: true
        });
        channel.sendToQueue(queueName, Buffer.from(message), {
            persistent: true
        });
        console.log(`[x] Sent ${message}`);
        await channel.close();
        await connection.close();
    } catch (error) {
        console.error('Error in publishing message:', error);
    }
}

export { publishToQueue };
