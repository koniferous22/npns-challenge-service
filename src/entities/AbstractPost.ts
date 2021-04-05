import { prop as Property } from '@typegoose/typegoose';
import { ObjectId } from 'mongodb';
import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseContent,
  TextContent,
  UploadedContent,
  ContentUnionType
} from './Content';
import { User } from './User';
import { Config } from '../config';

@ObjectType({ isAbstract: true })
export abstract class AbstractPost {
  static getMaxUploads() {
    return Config.getInstance().getConfig().limits.contentUploads;
  }

  // NOTE probably not necessary because of typegoose
  // @Property()
  @Field(() => ID)
  id!: ObjectId;

  @Property({
    validate: {
      validator: (v) => {
        return Array.isArray(v) && v.length <= AbstractPost.getMaxUploads();
      },
      message: `Only ${AbstractPost.getMaxUploads()} are allowed per challenge`
    },
    type: () => [BaseContent],
    discriminators: () => [TextContent, UploadedContent]
  })
  @Field(() => [ContentUnionType])
  content!: BaseContent[];

  @Property({
    type: () => User,
    required: true
  })
  @Field(() => User)
  poster!: User;

  @Property({
    default: Date.now()
  })
  @Field()
  createdAt: Date = new Date();

  @Property({
    default: true
  })
  @Field()
  isActive!: boolean;
}
