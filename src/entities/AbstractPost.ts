import { prop as Property } from '@typegoose/typegoose';
import { ObjectId } from 'mongodb';
import { Field, ID, ObjectType } from 'type-graphql';
import { Content, TextContent, FileContent } from './Content';
import { User } from './User';
import { Config } from '../config';

@ObjectType({ isAbstract: true })
export abstract class AbstractPost {
  static getMaxUploads() {
    return Config.getInstance().getConfig().limits.contentUploads;
  }

  @Property()
  @Field(() => ID)
  id!: ObjectId;

  @Property({
    validate: {
      validator: (v) => {
        return Array.isArray(v) && v.length <= AbstractPost.getMaxUploads();
      },
      message: `Only ${AbstractPost.getMaxUploads()} are allowed per challenge`
    },
    type: () => [Content],
    discriminators: () => [TextContent, FileContent]
  })
  content!: Content[];

  @Property({
    type: () => User
  })
  @Field(() => User)
  posterId!: User;

  @Property({
    default: Date.now()
  })
  createdAt: Date = new Date();

  @Field()
  isActive!: boolean;
}
