import { prop as Property, getModelForClass } from '@typegoose/typegoose';
import { ObjectId } from 'mongodb';
import { Directive, Field, ID, ObjectType } from 'type-graphql';

@Directive(`@key(fields: "id")`)
@ObjectType()
export class Challenge {
  @Property()
  @Field(() => ID)
  id!: ObjectId;

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
}

export const ChallengeModel = getModelForClass(Challenge);
