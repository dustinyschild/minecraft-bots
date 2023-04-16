import { Schema } from 'mongoose';

export const serverSchema = new Schema({
  host: {
    type: String,
    default: 'localhost',
    required: true,
  },
  port: {
    type: Number,
    default: 25565,
    required: true,
  },
  version: {
    type: String,
    required: true,
  },
});
