import { Type } from 'class-transformer';
import { ObjectId } from 'mongodb';
import { Field, ObjectType } from 'type-graphql';
import { Challenge } from '../entities/Challenge';
import { ObjectIdScalar } from '../scalars/ObjectId';

@ObjectType()
class ChallengeEdge {
  @Field(() => ObjectIdScalar)
  cursor!: ObjectId;

  @Type(() => Challenge)
  @Field(() => Challenge)
  node!: Challenge;
}

@ObjectType()
class ChallengePageInfo {
  @Field()
  hasNextPage!: boolean;
  @Field()
  hasNextPageBoostedResults!: boolean;
}

@ObjectType()
export class ChallengeConnection {
  @Type(() => ChallengeEdge)
  @Field(() => [ChallengeEdge])
  edges!: ChallengeEdge[];

  @Type(() => ChallengePageInfo)
  @Field(() => ChallengePageInfo)
  pageInfo!: ChallengePageInfo;
}
