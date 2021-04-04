import { ObjectId } from 'bson';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { InputType, Field } from 'type-graphql';
import { ObjectIdScalar } from '../scalars/ObjectId';

@InputType()
export class ChallengesByTagsCursorInput {
  @Field(() => ObjectIdScalar)
  id!: ObjectId;

  @Field()
  boost!: number;

  @Field()
  views!: number;
}

@InputType()
export class ChallengesByTagsInput {
  @Field()
  @IsNotEmpty({
    each: true
  })
  @IsString({
    each: true
  })
  tags!: string[];

  @Field()
  @IsPositive()
  first!: number;

  @Type(() => ChallengesByTagsCursorInput)
  @Field(() => ChallengesByTagsInput)
  after!: ChallengesByTagsCursorInput;

  @Field()
  shouldPrioritizeBoostedChallenges!: boolean;
}
