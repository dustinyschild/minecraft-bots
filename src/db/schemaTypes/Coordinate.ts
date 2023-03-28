import { Schema, SchemaType } from 'mongoose';

export class Coordinate extends SchemaType {
  cast = (vectors: number[]) => {
    if (vectors.length !== 3) {
      throw new Error('Coordinate must have 3 values');
    }

    return vectors;
  };
}

Schema.Types.Coordinate = Coordinate;
