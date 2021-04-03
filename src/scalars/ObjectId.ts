import { GraphQLScalarType, Kind } from 'graphql';
import { ObjectId } from 'mongodb';
import { ScalarParseError, ScalarSerializeError } from '../utils/exceptions';

// NOTE: inspiration: https://github.com/MichalLytek/type-graphql/blob/master/examples/typegoose/object-id.scalar.ts
export const ObjectIdScalar = new GraphQLScalarType({
  name: 'ObjectId',
  description: 'Mongo object id scalar type',
  serialize(value: unknown): string {
    if (!(value instanceof ObjectId)) {
      throw new ScalarSerializeError('ObjectIdScalar', ['ObjectId']);
    }
    return value.toHexString();
  },
  parseValue(value: unknown): ObjectId {
    if (typeof value !== 'string') {
      throw new ScalarParseError('ObjectIdScalar', ['string']);
    }
    return new ObjectId(value);
  },
  parseLiteral(ast): ObjectId {
    if (ast.kind !== Kind.STRING) {
      throw new ScalarParseError('ObjectIdScalar', ['string']);
    }
    return new ObjectId(ast.value);
  }
});
