import { Model } from 'mongoose';
import { MiddlewareFn } from 'type-graphql';
import { convertMongoDocument } from '../utils/convertMongoDocument';

// NOTE inspiration
// https://github.com/MichalLytek/type-graphql/blob/v1.1.1/examples/typegoose/typegoose-middleware.ts
export const TypegooseConvertor: MiddlewareFn = async (_, next) => {
  const result = await next();

  if (Array.isArray(result)) {
    return result.map((item) =>
      item instanceof Model ? convertMongoDocument(item) : item
    );
  }

  if (result instanceof Model) {
    return convertMongoDocument(result);
  }

  return result;
};
