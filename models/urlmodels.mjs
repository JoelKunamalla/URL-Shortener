import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const urlSchema = new Schema({
    fullUrl: { type: String, required: true, unique: true },
    shortUrl: { type: String, required: true, unique: true },
    visits: { type: Number, default: 0 }
}, { timestamps: true });

urlSchema.index({ fullUrl: 1 }, { unique: true });
urlSchema.index({ shortUrl: 1 }, { unique: true });

const Url = model("Url", urlSchema);

export { Url };
