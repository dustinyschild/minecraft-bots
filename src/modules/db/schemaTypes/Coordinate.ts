import { Schema, SchemaType } from 'mongoose';
import { ICoordinate } from '../../../types';

export class Coordinate extends SchemaType {
  cast = (vector: ICoordinate) => {
    if (vector.length !== 3) {
      throw new Error('Coordinate must have exactly 3 values');
    }

    return vector;
  };
}

Schema.Types.Coordinate = Coordinate;
