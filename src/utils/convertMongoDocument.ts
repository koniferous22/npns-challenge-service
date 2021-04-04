import { getClassForDocument } from '@typegoose/typegoose';
import { Document } from 'mongoose';

// NOTE inspiration:
// https://github.com/MichalLytek/type-graphql/blob/v1.1.1/examples/typegoose/typegoose-middleware.ts
export const convertMongoDocument = (doc: Document) => {
  const convertedDocument = doc.toObject();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const DocumentClass = getClassForDocument(doc)!;
  Object.setPrototypeOf(convertedDocument, DocumentClass.prototype);
  return convertedDocument;
};
