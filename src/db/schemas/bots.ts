import { Document, model, Schema } from 'mongoose';
import { IBot } from '../../types';
import { IFarmer, IField } from '../../types/farmer';
import { Boundary } from '../schemaTypes/Boundary';
import { Coordinate } from '../schemaTypes/Coordinate';

const Chest = {
  position: { type: Coordinate, required: true },
  items: [String],
};

export const botSchema = new Schema(
  {
    username: { type: String, required: true },
    type: {
      type: String,
      enum: ['farmer', 'sorter', 'courier', 'carrier'],
      required: true,
    },
    server: { type: Schema.Types.ObjectId, required: true },
  },
  { discriminatorKey: 'type' },
);

const fieldSchema = new Schema({
  boundary: { type: Boundary, required: true },
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

export const farmerSchema = new Schema({
  standByPosition: { type: Coordinate, required: true },
  fields: {
    type: [fieldSchema],
    default: [],
  },
});
