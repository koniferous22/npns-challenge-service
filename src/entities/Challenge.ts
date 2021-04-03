import { prop as Property, getModelForClass } from '@typegoose/typegoose';
import { ObjectId } from 'mongodb';
import { Directive, Field, ID, ObjectType } from 'type-graphql';

@Directive(`@key(fields: "id")`)
@ObjectType()
export class Challenge {
  @Property()
  @Field(() => ID)
  id!: ObjectId;
  @Property()
  @Field()
  title!: string;
}

export const ChallengeModel = getModelForClass(Challenge);
