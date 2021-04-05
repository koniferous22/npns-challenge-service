import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { ObjectId } from 'mongodb';
import { GraphQLString } from 'graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { plainToClass } from 'class-transformer';
import { Document } from 'mongoose';
import { ChallengeServiceContext } from '../context';
import { Challenge } from '../entities/Challenge';
import { ObjectIdScalar } from '../scalars/ObjectId';
import { ChallengeConnection } from '../utils/payloads';
import { ChallengesByTagsInput } from '../utils/inputs';
import { convertMongoDocument } from '../utils/convertMongoDocument';

@Resolver(() => Challenge)
export class ChallengeResolver {
  @Query(() => GraphQLString)
  challengeById(
    @Arg('id', () => ObjectIdScalar) id: ObjectId,
    @Ctx() ctx: ChallengeServiceContext
  ) {
    // TODO challenge view cache goes here
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const response = ctx.models.Challenge.findById(id);
    return 'Not yet implemented';
  }

  @Query(() => ChallengeConnection)
  async challengesByTags(
    @Arg('input') input: ChallengesByTagsInput,
    @Ctx() ctx: ChallengeServiceContext
  ) {
    // TODO delete after proper testing
    // PSEUDOCODE
    // * if prioritize: find challenges where boost > 0 && boost <= after.boostValue && id !== after.id
    // * limit input.first
    // ! ALWAYS filter by tag
    // * if shouldn't prioritize || previous query didn't land full results: find challenges where views <= after.views && id !== after.id
    // * limit should prioritize ? input.first - actualInputResults : input.first
    // ! MAP Reduce into edges
    // * NEXT page verification
    // * a) prioritize: search for views > 0 || (boost < nextCursor.boost && boost > 0)... hasPageBoostedResult === 2nd part of expression
    // * b) not prioritize: search for views > 0... hasNextPageBoostedResults = null
    // let prioritizedResults = [];
    const challengeModel = ctx.models.Challenge;
    let prioritizedChallenges: Document[] = [];
    let standardChallenges: Document[] = [];
    if (input.shouldPrioritizeBoostedChallenges) {
      prioritizedChallenges = await challengeModel
        .find({
          boost: { $gt: 0, $lte: input.afterCursorBoost ?? undefined },
          id: { $gt: input.afterCursorId },
          tag: { $in: input.tags }
        })
        .sort({
          boost: -1
        })
        .limit(input.first);
    }
    if (
      !input.shouldPrioritizeBoostedChallenges ||
      prioritizedChallenges.length < input.first
    ) {
      standardChallenges = await challengeModel
        .find({
          views: { $lte: input.afterCursorViews },
          id: { $gt: input.afterCursorId },
          tag: { $in: input.tags }
        })
        .sort({
          views: -1
        })
        .limit(
          input.shouldPrioritizeBoostedChallenges
            ? input.first - prioritizedChallenges.length
            : input.first
        );
    }
    const allResults = [...prioritizedChallenges, ...standardChallenges].map(
      convertMongoDocument
    ) as Challenge[];

    let hasNextPage = false;
    let hasNextPageBoostedResults: boolean | null = false;
    if (allResults.length === input.first) {
      const lastElem = allResults[input.first - 1];
      if (input.shouldPrioritizeBoostedChallenges) {
        hasNextPage = await challengeModel.exists(
          lastElem.boost > 0
            ? {
                $or: [
                  {
                    boost: { $lte: lastElem.boost, $gt: 0 },
                    id: { $gt: lastElem.id },
                    tag: { $in: input.tags }
                  },
                  {
                    boost: 0,
                    tag: { $in: input.tags }
                  }
                ]
              }
            : {
                boost: 0,
                tag: { $in: input.tags }
              }
        );
      } else {
        hasNextPage = await challengeModel.exists({
          views: { $lte: lastElem.views },
          id: { $gt: lastElem.id },
          tag: { $in: input.tags }
        });
        hasNextPageBoostedResults = null;
      }
    }

    const edges = allResults.map((challengeObject) => ({
      cursor: {
        id: challengeObject.id,
        boost: challengeObject.boost,
        views: challengeObject.views
      },
      node: challengeObject
    }));
    const pageInfo = {
      hasNextPage,
      hasNextPageBoostedResults
    };
    return plainToClass(ChallengeConnection, { edges, pageInfo });
  }

  // @Mutation()
  // async postChallenge(
  // )

  // TODO Auth decorator should go here
  @Mutation(() => GraphQLString)
  async uploadContent(
    @Arg('file', () => GraphQLUpload) file: Promise<FileUpload>,
    @Ctx() ctx: ChallengeServiceContext
  ) {
    return ctx.gridFileSystem.fileUpload(file);
  }
}
