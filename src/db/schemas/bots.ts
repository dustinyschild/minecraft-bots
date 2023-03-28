import { model, Schema } from 'mongoose';
import { ICoordinate } from '../../types';
import { Coordinate } from '../schemaTypes/Coordinate';

const Chest = {
  position: { type: Coordinate, required: true },
  items: [String],
};

const botSchema = new Schema(
  {
    username: { type: String, required: true },
    type: {
      type: String,
      enum: ['none', 'farmer', 'sorter', 'courier', 'carrier'],
      default: 'none',
      required: true,
    },
    server: { type: Schema.Types.ObjectId, required: true },
  },
  { discriminatorKey: 'type' },
);

export const Bot = model('Bot', botSchema);

const fieldSchema = new Schema({
  boundary: {
    type: [Coordinate],
    validate: (props: ICoordinate[]) => props.length === 2,
  },
  block: {
    type: String,
    enum: ['wheat', 'carrots', 'beetroots', 'potatoes'],
    required: true,
  },
  crop: {
    type: String,
    enum: ['wheat', 'carrot', 'beetroot', 'potato'],
    required: true,
  },
  seed: {
    type: String,
    enum: ['wheat_seeds', 'carrot', 'beetroot_seeds', 'potato'],
    required: true,
  },
  maturity: { type: Number, required: true },
  depositChests: {
    type: [Chest],
    default: [],
  },
});

const farmerSchema = new Schema({
  standByPosition: { type: Coordinate, required: true },
  fields: {
    type: [fieldSchema],
    default: [],
  },
});

export const Farmer = Bot.discriminator('farmer', farmerSchema);
