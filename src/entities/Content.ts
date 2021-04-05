import {
  modelOptions as ModelOptions,
  prop as Property
} from '@typegoose/typegoose';
import { createUnionType, Field } from 'type-graphql';

@ModelOptions({
  schemaOptions: {
    discriminatorKey: 'type'
  }
})
export class Content {
  @Field()
  @Property({
    default: Date.now()
  })
  createdAt: Date = new Date();
}

export class TextContent extends Content {
  @Field()
  @Property()
  description!: string;
}

export class FileContent extends Content {
  @Field()
  @Property()
  cdnUrl!: string;
}

export const ContentUnionType = createUnionType({
  name: 'Content',
  types: () => [TextContent, FileContent] as const,
  resolveType: (value) => {
    if ('description' in value) {
      return TextContent;
    }
    if ('cdnUrl' in value) {
      return FileContent;
    }
    return undefined;
  }
});
