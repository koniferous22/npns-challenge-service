import { prop as Property, getModelForClass } from '@typegoose/typegoose';
import { ObjectId } from 'mongodb';
import { Directive, Field, ID, ObjectType } from 'type-graphql';
import { AbstractPost } from './AbstractPost';
import { Content, FileContent, TextContent } from './Content';
import { Edit } from './Edit';
import { Submission } from './Submission';

@Directive(`@key(fields: "id")`)
@ObjectType()
export class Challenge extends AbstractPost {
  // TODO if sharded db is implemented, tag should be the shard key
  @Property({
    index: true
  })
  @Field()
  tag!: string;

  @Property({
    index: true
  })
  @Field()
  views!: number;

  @Property({
    index: true
  })
  @Field()
  boost!: number;

  @Property()
  @Field()
  title!: string;

  @Property()
  @Field(() => ID)
  acceptedSubmission!: ObjectId;

  @Property({
    validate: {
      validator: (v) => {
        return Array.isArray(v) && v.length <= Challenge.getMaxUploads();
      },
      message: `Only ${Challenge.getMaxUploads()} are allowed per challenge`
    },
    type: () => [Content],
    discriminators: () => [TextContent, FileContent]
  })
  content!: Content[];

  @Property({
    type: () => Submission
  })
  @Field(() => Submission)
  submissions!: Submission[];

  @Property({
    type: () => Edit
  })
  @Field(() => Edit)
  edits!: Edit[];
  // TODO link transactions with this collection
}

export const ChallengeModel = getModelForClass(Challenge);
