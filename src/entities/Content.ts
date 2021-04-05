import {
  modelOptions as ModelOptions,
  prop as Property
} from '@typegoose/typegoose';
import { createUnionType, Field, ObjectType } from 'type-graphql';

@ModelOptions({
  schemaOptions: {
    discriminatorKey: 'type'
  }
})
export class BaseContent {
  @Field()
  @Property({
    default: Date.now()
  })
  createdAt: Date = new Date();
}

@ObjectType()
export class TextContent extends BaseContent {
  @Field()
  @Property()
  textContent!: string;
}

@ObjectType()
export class UploadedContent extends BaseContent {
  @Field()
  @Property()
  filename!: string;

  // TODO define mimetype enum
  @Field()
  @Property()
  mimetype!: string;
}

export const ContentUnionType = createUnionType({
  name: 'Content',
  types: () => [TextContent, UploadedContent] as const,
  resolveType: (value) => {
    if ('textContent' in value) {
      return TextContent;
    }
    if ('filename' in value) {
      return UploadedContent;
    }
    return undefined;
  }
});
