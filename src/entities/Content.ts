import {
  modelOptions as ModelOptions,
  prop as Property
} from '@typegoose/typegoose';
import { ObjectId } from 'mongodb';
import { createUnionType, Field, ID, ObjectType } from 'type-graphql';

@ModelOptions({
  schemaOptions: {
    discriminatorKey: 'type'
  }
})
export class BaseContent {
  @Field(() => ID)
  id!: ObjectId;

  @Field()
  @Property({
    default: Date.now()
  })
  createdAt: Date = new Date();

  @Property({
    default: true
  })
  @Field()
  isActive!: boolean;
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
