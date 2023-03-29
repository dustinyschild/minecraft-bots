declare module 'mongoose' {
  namespace Schema {
    namespace Types {
      export class Coordinate extends SchemaType {}
      export class Boundary extends SchemaType {}
    }
  }
}
