import { AnyObject, Schema, SchemaType } from 'mongoose';
import { IBoundary } from '../../types';

export class Boundary extends SchemaType {
  cast = (vectors: IBoundary) => {
    if (vectors.length !== 2) {
      throw new Error('Boundary must have exactly 2 values');
    }

    return vectors;
  };
}

Schema.Types.Boundary = Boundary;
