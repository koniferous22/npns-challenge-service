import { prop as Property, getModelForClass } from '@typegoose/typegoose';
import { ObjectId } from 'mongodb';
import { Directive, Field, ID, ObjectType } from 'type-graphql';
import { AbstractPost } from './AbstractPost';
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
    index: true,
    default: 0
  })
  @Field()
  views!: number;

  @Property({
    index: true,
    default: 0
  })
  @Field()
  boost!: number;

  @Property({
    default: ''
  })
  @Field()
  title!: string;

  @Property()
  @Field(() => ID, {
    nullable: true
  })
  acceptedSubmission!: ObjectId | undefined;

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
