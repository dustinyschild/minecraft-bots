import { model, Schema } from 'mongoose';
import { IServer } from '../../types';

const serverSchema = new Schema<IServer>({
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

export const Server = model<IServer>('Server', serverSchema);
