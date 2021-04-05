import { ObjectId } from 'bson';
import { IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { GraphQLString } from 'graphql';
import { InputType, Field, Int } from 'type-graphql';
import { ObjectIdScalar } from '../scalars/ObjectId';

@InputType()
export class ChallengesByTagsInput {
  @Field(() => [GraphQLString])
  @IsNotEmpty({
    each: true
  })
  @IsString({
    each: true
  })
  tags!: string[];

  @Field(() => Int)
  @IsPositive()
  first!: number;

  @Field(() => ObjectIdScalar)
  afterCursorId!: ObjectId;

  @Field()
  afterCursorBoost!: number;

  @Field(() => Int)
  afterCursorViews!: number;

  @Field()
  shouldPrioritizeBoostedChallenges!: boolean;
}
