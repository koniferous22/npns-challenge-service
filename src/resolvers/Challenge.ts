import { Arg, Ctx, Query, Resolver } from 'type-graphql';
import { ObjectId } from 'mongodb';
import { GraphQLString } from 'graphql';
import { ChallengeServiceContext } from '../context';
import { Challenge } from '../entities/Challenge';
import { ObjectIdScalar } from '../scalars/ObjectId';

@Resolver(() => Challenge)
export class ChallengeResolver {
  @Query(() => GraphQLString)
  challengeById(
    @Arg('id', () => ObjectIdScalar) id: ObjectId,
    @Ctx() ctx: ChallengeServiceContext
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const response = ctx.models.Challenge.findById(id);
    return 'Not yet implemented';
  }
}
