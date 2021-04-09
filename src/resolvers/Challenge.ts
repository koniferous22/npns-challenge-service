import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { ObjectId } from 'mongodb';
import { GraphQLString } from 'graphql';
import { plainToClass } from 'class-transformer';
import { Document } from 'mongoose';
import { DocumentType, getName } from '@typegoose/typegoose';
import { ChallengeServiceContext } from '../context';
import { Challenge } from '../entities/Challenge';
import { ObjectIdScalar } from '../scalars/ObjectId';
import {
  AddTextContentToChallengeEditPayload,
  AddTextContentToChallengePayload,
  AddTextContentToReplyEditPayload,
  AddTextContentToReplyPayload,
  AddTextContentToSubmissionEditPayload,
  AddTextContentToSubmissionPayload,
  AddUploadedContentToChallengeEditPayload,
  AddUploadedContentToChallengePayload,
  AddUploadedContentToReplyEditPayload,
  AddUploadedContentToReplyPayload,
  AddUploadedContentToSubmissionEditPayload,
  AddUploadedContentToSubmissionPayload,
  ChallengeConnection,
  PostChallengeEditPayload,
  PostChallengePayload,
  PostReplyEditPayload,
  PostReplyPayload,
  PostSubmissionEditPayload,
  PostSubmissionPayload,
  PublishPostPayload,
  RemoveContentPayload
} from '../utils/payloads';
import {
  AddTextContentToChallengeContract,
  AddTextContentToChallengeEditContract,
  AddTextContentToReplyContract,
  AddTextContentToReplyEditContract,
  AddTextContentToSubmissionContract,
  AddTextContentToSubmissionEditContract,
  AddUploadedContentToChallengeContract,
  AddUploadedContentToChallengeEditContract,
  AddUploadedContentToReplyContract,
  AddUploadedContentToReplyEditContract,
  AddUploadedContentToSubmissionContract,
  AddUploadedContentToSubmissionEditContract,
  ChallengesByTagsInput,
  PostChallengeContract,
  PostChallengeEditContract,
  PostReplyContract,
  PostReplyEditContract,
  PostSubmissionContract,
  PostSubmissionEditContract,
  PublishChallengeContract,
  PublishChallengeEditContract,
  PublishReplyContract,
  PublishReplyEditContract,
  PublishSubmissionContract,
  PublishSubmissionEditContract,
  RemoveContentFromChallengeContract,
  RemoveContentFromChallengeEditContract,
  RemoveContentFromReplyContract,
  RemoveContentFromReplyEditContract,
  RemoveContentFromSubmissionContract,
  RemoveContentFromSubmissionEditContract
} from '../utils/inputs';
import { convertMongoDocument } from '../utils/convertMongoDocument';
import {
  ChallengeNotFoundError,
  ContentNotFoundError,
  EditNotFoundError,
  InvalidContentTypeError,
  SubmissionNotFoundError,
  SubmittingOnOwnChallenge
} from '../utils/exceptions';
import { Reply } from '../entities/Reply';
import { Submission } from '../entities/Submission';
import { Edit } from '../entities/Edit';
import { TextContent, UploadedContent } from '../entities/Content';

type ConfigLookupArgs =
  | {
      type: 'challenge';
      args: {
        challengeId: ObjectId;
      };
      result: Challenge;
    }
  | {
      type: 'submission';
      args: {
        challengeId: ObjectId;
        submissionId: ObjectId;
      };
      result: Submission;
    }
  | {
      type: 'reply';
      args: {
        challengeId: ObjectId;
        submissionId: ObjectId;
        replyId: ObjectId;
      };
      result: Reply;
    }
  | {
      type: 'challengeEdit';
      args: {
        challengeId: ObjectId;
        editId: ObjectId;
      };
      result: Edit;
    }
  | {
      type: 'submissionEdit';
      args: {
        challengeId: ObjectId;
        submissionId: ObjectId;
        editId: ObjectId;
      };
      result: Edit;
    }
  | {
      type: 'replyEdit';
      args: {
        challengeId: ObjectId;
        submissionId: ObjectId;
        replyId: ObjectId;
        editId: ObjectId;
      };
      result: Edit;
    };

@Resolver(() => Challenge)
export class ChallengeResolver {
  // TODO it's possible to fix generic inferring by using single object instead of 2 args
  private async getContent<T extends ConfigLookupArgs['type']>(
    type: T,
    args: Extract<ConfigLookupArgs, { type: T }>['args'],
    challengeModel: ChallengeServiceContext['models']['Challenge']
  ): Promise<{
    challenge: DocumentType<Challenge>;
    post: DocumentType<Extract<ConfigLookupArgs, { type: T }>['result']>;
  }> {
    const challenge = await challengeModel.findById(args.challengeId);
    if (!challenge) {
      throw new ChallengeNotFoundError(args.challengeId);
    }
    if (type === 'challenge') {
      return {
        challenge,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        post: challenge as any
      };
    }
    if (type === 'challengeEdit') {
      // @ts-expect-error didn't manage to find proper mongoose type :(
      const edit = challenge.edits.id(args.editId);
      if (!edit) {
        throw new EditNotFoundError(
          // @ts-expect-error TODO note
          args.editId,
          args.challengeId,
          // @ts-expect-error TODO note
          args.submissionId
        );
      }
      return {
        challenge,
        post: edit
      };
    }
    // @ts-expect-error didn't manage to find proper mongoose type :(
    const submission = challenge.submissions.id(args.submissionId);
    if (!submission) {
      // @ts-expect-error TODO note
      throw new SubmissionNotFoundError(challenge.id, args.submissionId);
    }
    if (type === 'submission') {
      return {
        challenge,
        post: submission
      };
    }
    if (type === 'submissionEdit') {
      // @ts-expect-error didn't manage to find proper mongoose type :(
      const edit = submission.edits.id(args.editId);
      if (!edit) {
        throw new EditNotFoundError(
          // @ts-expect-error TODO fix bad generic infering
          args.editId,
          args.challengeId,
          // @ts-expect-error TODO fix bad generic infering
          args.submissionId
        );
      }
      return {
        challenge,
        post: edit
      };
    }
    // @ts-expect-error didn't manage to find proper mongoose type :(
    const reply = submission.replies.id(args.replyId);
    if (!reply) {
      // @ts-expect-error TODO note
      throw new ReplyNotFoundError(
        args.challengeId,
        // @ts-expect-error TODO fix bad generic infering
        args.submissionId,
        // @ts-expect-error TODO fix bad generic infering
        args.replyId
      );
    }
    if (type === 'reply') {
      return {
        challenge,
        post: reply
      };
    }
    if (type === 'replyEdit') {
      // @ts-expect-error didn't manage to find proper mongoose type :(
      const edit = reply.edits.id(args.editId);
      if (!edit) {
        throw new EditNotFoundError(
          // @ts-expect-error TODO fix bad generic infering
          args.editId,
          args.challengeId,
          // @ts-expect-error TODO fix bad generic infering
          args.submissionId,
          // @ts-expect-error TODO fix bad generic infering
          args.replyId
        );
      }
      return {
        challenge,
        post: edit
      };
    }
    throw new InvalidContentTypeError(type);
  }

  @Query(() => GraphQLString)
  challengeById(
    @Arg('id', () => ObjectIdScalar) id: ObjectId,
    @Ctx() ctx: ChallengeServiceContext
  ) {
    // TODO challenge view cache goes here
    return ctx.models.Challenge.findById(id);
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
          views: { $lte: input.afterCursorViews ?? undefined },
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

  @Authorized()
  @Mutation(() => PostChallengePayload)
  async postChallenge(
    @Arg('input', () => PostChallengeContract) input: PostChallengeContract,
    @Ctx() ctx: ChallengeServiceContext
  ) {
    // TODO double check authorization
    const newChallenge = new ctx.models.Challenge({
      tag: input.tag,
      posterId: ctx.user?.data.id
    });
    await newChallenge.save();
    return plainToClass(PostChallengePayload, {
      message: `Challenge posted: "${newChallenge.id}"`,
      postedChallengeId: newChallenge.id
    });
  }

  @Authorized()
  @Mutation(() => PostSubmissionPayload)
  async postSubmission(
    @Arg('input', () => PostSubmissionContract) input: PostSubmissionContract,
    @Ctx() ctx: ChallengeServiceContext
  ) {
    const { challenge } = await this.getContent(
      'challenge',
      input,
      ctx.models.Challenge
    );
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const posterId = ctx.user!.data.id;
    if (posterId === challenge.poster.id) {
      throw new SubmittingOnOwnChallenge(posterId, challenge.id);
    }
    // @ts-expect-error didn't manage to find proper mongoose type :(
    const newSubmission = challenge.submissions.create({
      posterId
    });
    challenge.submissions.push(newSubmission);
    await challenge.save();
    return plainToClass(PostSubmissionPayload, {
      message: `Submission posted: "${newSubmission.id}"`,
      postedSubmissionId: newSubmission.id
    });
  }

  @Authorized()
  @Mutation(() => PostReplyPayload)
  async postReply(
    @Arg('input', () => PostReplyContract) input: PostReplyContract,
    @Ctx() ctx: ChallengeServiceContext
  ) {
    // TODO double check authorization
    const { challenge, post: submission } = await this.getContent(
      'submission',
      input,
      ctx.models.Challenge
    );
    // @ts-expect-error didn't manage to find proper mongoose type :(
    const newReply = submission.replies.create({
      posterId: ctx.user?.data.id
    });
    submission.replies.push(newReply);
    await challenge.save();
    return plainToClass(PostReplyPayload, {
      message: `Reply posted: "${newReply.id}"`,
      postedReplyId: newReply.id
    });
  }

  @Authorized()
  @Mutation(() => PostChallengeEditPayload)
  async postChallengeEdit(
    @Arg('input', () => PostChallengeEditContract)
    input: PostChallengeEditContract,
    @Ctx() ctx: ChallengeServiceContext
  ) {
    const { challenge } = await this.getContent(
      'challenge',
      input,
      ctx.models.Challenge
    );
    // TODO double check authorization
    // @ts-expect-error didn't manage to find proper mongoose type :(
    const newEdit = challenge.edits.create({
      posterId: ctx.user?.data.id
    });
    challenge.edits.push(newEdit);
    await challenge.save();
    return plainToClass(PostChallengeEditPayload, {
      message: `Edit posted: "${newEdit.id}"`,
      postedEditId: newEdit.id
    });
  }

  @Authorized()
  @Mutation(() => PostSubmissionEditPayload)
  async postSubmissionEdit(
    @Arg('input', () => PostSubmissionEditContract)
    input: PostSubmissionEditContract,
    @Ctx() ctx: ChallengeServiceContext
  ) {
    const { challenge, post: submission } = await this.getContent(
      'submission',
      input,
      ctx.models.Challenge
    );
    // TODO double check authorization
    // @ts-expect-error didn't manage to find proper mongoose type :(
    const newEdit = submission.edits.create({
      posterId: ctx.user?.data.id
    });
    submission.edits.push(newEdit);
    await challenge.save();
    return plainToClass(PostSubmissionEditPayload, {
      message: `Edit posted: "${newEdit.id}"`,
      postedEditId: newEdit.id
    });
  }

  @Authorized()
  @Mutation(() => PostReplyEditPayload)
  async postReplyEdit(
    @Arg('input', () => PostReplyEditContract)
    input: PostReplyEditContract,
    @Ctx() ctx: ChallengeServiceContext
  ) {
    const { challenge, post: reply } = await this.getContent(
      'reply',
      input,
      ctx.models.Challenge
    );
    // TODO double check authorization
    // @ts-expect-error didn't manage to find proper mongoose type :(
    const newEdit = reply.edits.create({
      posterId: ctx.user?.data.id
    });
    reply.edits.push(newEdit);
    await challenge.save();
    return plainToClass(PostReplyEditPayload, {
      message: `Edit posted: "${newEdit.id}"`,
      postedEditId: newEdit.id
    });
  }

  @Authorized()
  @Mutation(() => AddTextContentToChallengePayload)
  async addTextContentToChallenge(
    @Arg('input', () => AddTextContentToChallengeContract)
    { textContent, ...identifiers }: AddTextContentToChallengeContract,
    @Ctx() ctx: ChallengeServiceContext
  ) {
    // TODO double check authorization
    const { challenge } = await this.getContent(
      'challenge',
      identifiers,
      ctx.models.Challenge
    );
    // @ts-expect-error didn't manage to find proper mongoose type :(
    const content = challenge.content.create({
      type: getName(TextContent),
      createdAt: new Date(),
      textContent
    });
    challenge.content.push((content as unknown) as UploadedContent);
    await challenge.save();
    return plainToClass(AddTextContentToChallengePayload, {
      message: `Text content uploaded for challenge "${challenge.id}"`,
      content
    });
  }

  @Authorized()
  @Mutation(() => AddTextContentToSubmissionPayload)
  async addTextContentToSubmission(
    @Arg('input', () => AddTextContentToSubmissionContract)
    { textContent, ...identifiers }: AddTextContentToSubmissionContract,
    @Ctx() ctx: ChallengeServiceContext
  ) {
    const { challenge, post: submission } = await this.getContent(
      'submission',
      identifiers,
      ctx.models.Challenge
    );
    // @ts-expect-error didn't manage to find proper mongoose type :(
    const content = submission.content.create({
      type: getName(TextContent),
      createdAt: new Date(),
      textContent
    });
    submission.content.push((content as unknown) as UploadedContent);
    await challenge.save();
    return plainToClass(AddTextContentToSubmissionPayload, {
      message: `Text content uploaded for submission "${submission.id}"`,
      content
    });
  }

  @Authorized()
  @Mutation(() => AddTextContentToReplyPayload)
  async addTextContentToReply(
    @Arg('input', () => AddTextContentToReplyContract)
    { textContent, ...identifiers }: AddTextContentToReplyContract,
    @Ctx() ctx: ChallengeServiceContext
  ) {
    // TODO double check authorization
    const { challenge, post: reply } = await this.getContent(
      'reply',
      identifiers,
      ctx.models.Challenge
    );
    // @ts-expect-error didn't manage to find proper mongoose type :(
    const content = reply.content.create({
      type: getName(TextContent),
      createdAt: new Date(),
      textContent
    });
    reply.content.push((content as unknown) as UploadedContent);
    await challenge.save();
    return plainToClass(AddTextContentToReplyPayload, {
      message: `Text content uploaded for reply "${reply.id}"`,
      content
    });
  }

  @Authorized()
  @Mutation(() => AddTextContentToChallengeEditPayload)
  async addTextContentToChallengeEdit(
    @Arg('input', () => AddTextContentToChallengeEditContract)
    { textContent, ...identifiers }: AddTextContentToChallengeEditContract,
    @Ctx() ctx: ChallengeServiceContext
  ) {
    const { challenge, post: edit } = await this.getContent(
      'challengeEdit',
      identifiers,
      ctx.models.Challenge
    );
    // TODO double check authorization
    // @ts-expect-error didn't manage to find proper mongoose type :(
    const content = edit.content.create({
      type: getName(TextContent),
      createdAt: new Date(),
      textContent
    });
    edit.content.push((content as unknown) as UploadedContent);
    await challenge.save();
    return plainToClass(AddTextContentToChallengeEditPayload, {
      message: `Text content uploaded for challenge edit "${edit.id}"`,
      content
    });
  }

  @Authorized()
  @Mutation(() => AddTextContentToSubmissionEditPayload)
  async addTextContentToSubmissionEdit(
    @Arg('input', () => AddTextContentToSubmissionEditContract)
    { textContent, ...identifiers }: AddTextContentToSubmissionEditContract,
    @Ctx() ctx: ChallengeServiceContext
  ) {
    const { challenge, post: edit } = await this.getContent(
      'submissionEdit',
      identifiers,
      ctx.models.Challenge
    );
    // TODO double check authorization
    // @ts-expect-error didn't manage to find proper mongoose type :(
    const content = edit.content.create({
      type: getName(TextContent),
      createdAt: new Date(),
      textContent
    });
    edit.content.push(content);
    await challenge.save();
    return plainToClass(AddTextContentToSubmissionEditPayload, {
      message: `Text content uploaded for submission edit"${edit.id}"`,
      content
    });
  }

  @Authorized()
  @Mutation(() => AddTextContentToReplyEditPayload)
  async addTextContentToReplyEdit(
    @Arg('input', () => AddTextContentToReplyEditContract)
    { textContent, ...identifiers }: AddTextContentToReplyEditContract,
    @Ctx() ctx: ChallengeServiceContext
  ) {
    const { challenge, post: edit } = await this.getContent(
      'replyEdit',
      identifiers,
      ctx.models.Challenge
    );
    // TODO double check authorization
    // @ts-expect-error didn't manage to find proper mongoose type :(
    const content = edit.content.create({
      type: getName(TextContent),
      createdAt: new Date(),
      textContent
    });
    edit.content.push(content);
    await challenge.save();
    return plainToClass(AddTextContentToReplyEditPayload, {
      message: `Text content uploaded for reply edit "${edit.id}"`,
      content
    });
  }

  @Authorized()
  @Mutation(() => AddUploadedContentToChallengePayload)
  async addUploadedContentToChallenge(
    @Arg('input', () => AddUploadedContentToChallengeContract)
    { upload, ...identifiers }: AddUploadedContentToChallengeContract,
    @Ctx() ctx: ChallengeServiceContext
  ) {
    // TODO double check authorization
    const { challenge } = await this.getContent(
      'challenge',
      identifiers,
      ctx.models.Challenge
    );
    const { filename, mimetype } = await ctx.gridFileSystem.fileUpload(upload);
    // @ts-expect-error didn't manage to find proper mongoose type :(
    const content = challenge.content.create({
      type: getName(UploadedContent),
      createdAt: new Date(),
      filename,
      mimetype
    });
    challenge.content.push((content as unknown) as UploadedContent);
    await challenge.save();
    return plainToClass(AddUploadedContentToChallengePayload, {
      message: `File content uploaded for challenge "${challenge.id}"`,
      content
    });
  }

  @Authorized()
  @Mutation(() => AddUploadedContentToSubmissionPayload)
  async addUploadedContentToSubmission(
    @Arg('input', () => AddUploadedContentToSubmissionContract)
    { upload, ...identifiers }: AddUploadedContentToSubmissionContract,
    @Ctx() ctx: ChallengeServiceContext
  ) {
    const { challenge, post: submission } = await this.getContent(
      'submission',
      identifiers,
      ctx.models.Challenge
    );
    const { filename, mimetype } = await ctx.gridFileSystem.fileUpload(upload);
    // @ts-expect-error didn't manage to find proper mongoose type :(
    const content = submission.content.create({
      type: getName(UploadedContent),
      createdAt: new Date(),
      filename,
      mimetype
    });
    submission.content.push((content as unknown) as UploadedContent);
    await challenge.save();
    return plainToClass(AddUploadedContentToSubmissionPayload, {
      message: `File content uploaded for submission "${submission.id}"`,
      content
    });
  }

  @Authorized()
  @Mutation(() => AddUploadedContentToReplyPayload)
  async addUploadedContentToReply(
    @Arg('input', () => AddUploadedContentToReplyContract)
    { upload, ...identifiers }: AddUploadedContentToReplyContract,
    @Ctx() ctx: ChallengeServiceContext
  ) {
    // TODO double check authorization
    const { challenge, post: reply } = await this.getContent(
      'reply',
      identifiers,
      ctx.models.Challenge
    );
    const { filename, mimetype } = await ctx.gridFileSystem.fileUpload(upload);
    // @ts-expect-error didn't manage to find proper mongoose type :(
    const content = reply.content.create({
      type: getName(UploadedContent),
      createdAt: new Date(),
      filename,
      mimetype
    });
    reply.content.push((content as unknown) as UploadedContent);
    await challenge.save();
    return plainToClass(AddUploadedContentToReplyPayload, {
      message: `File content uploaded for reply "${reply.id}"`,
      content
    });
  }

  @Authorized()
  @Mutation(() => AddUploadedContentToChallengeEditPayload)
  async addUploadedContentToChallengeEdit(
    @Arg('input', () => AddUploadedContentToChallengeEditContract)
    { upload, ...identifiers }: AddUploadedContentToChallengeEditContract,
    @Ctx() ctx: ChallengeServiceContext
  ) {
    const { challenge, post: edit } = await this.getContent(
      'challengeEdit',
      identifiers,
      ctx.models.Challenge
    );
    // TODO double check authorization
    const { filename, mimetype } = await ctx.gridFileSystem.fileUpload(upload);
    // @ts-expect-error didn't manage to find proper mongoose type :(
    const content = edit.content.create({
      type: getName(UploadedContent),
      createdAt: new Date(),
      filename,
      mimetype
    });
    edit.content.push((content as unknown) as UploadedContent);
    await challenge.save();
    return plainToClass(AddUploadedContentToChallengeEditPayload, {
      message: `File content uploaded for challenge edit "${edit.id}"`,
      content
    });
  }

  @Authorized()
  @Mutation(() => AddUploadedContentToSubmissionEditPayload)
  async addUploadedContentToSubmissionEdit(
    @Arg('input', () => AddUploadedContentToSubmissionEditContract)
    { upload, ...identifiers }: AddUploadedContentToSubmissionEditContract,
    @Ctx() ctx: ChallengeServiceContext
  ) {
    const { challenge, post: edit } = await this.getContent(
      'submissionEdit',
      identifiers,
      ctx.models.Challenge
    );
    // TODO double check authorization
    const { filename, mimetype } = await ctx.gridFileSystem.fileUpload(upload);
    // @ts-expect-error didn't manage to find proper mongoose type :(
    const content = edit.content.create({
      type: getName(UploadedContent),
      createdAt: new Date(),
      filename,
      mimetype
    });
    edit.content.push((content as unknown) as UploadedContent);
    await challenge.save();
    return plainToClass(AddUploadedContentToSubmissionEditPayload, {
      message: `File content uploaded for challenge edit "${edit.id}"`,
      content
    });
  }

  @Authorized()
  @Mutation(() => AddUploadedContentToReplyEditPayload)
  async addUploadedContentToReplyEdit(
    @Arg('input', () => AddUploadedContentToReplyEditContract)
    { upload, ...identifiers }: AddUploadedContentToReplyEditContract,
    @Ctx() ctx: ChallengeServiceContext
  ) {
    const { challenge, post: edit } = await this.getContent(
      'replyEdit',
      identifiers,
      ctx.models.Challenge
    );
    // TODO double check authorization
    const { filename, mimetype } = await ctx.gridFileSystem.fileUpload(upload);
    // @ts-expect-error didn't manage to find proper mongoose type :(
    const content = edit.content.create({
      type: getName(UploadedContent),
      createdAt: new Date(),
      filename,
      mimetype
    });
    edit.content.push((content as unknown) as UploadedContent);
    await challenge.save();
    return plainToClass(AddUploadedContentToReplyEditPayload, {
      message: `File content uploaded for reply edit "${edit.id}"`,
      content
    });
  }

  @Authorized()
  @Mutation(() => RemoveContentPayload)
  async removeContentFromChallenge(
    @Arg('input', () => RemoveContentFromChallengeContract)
    { contentId, ...identifiers }: RemoveContentFromChallengeContract,
    @Ctx() ctx: ChallengeServiceContext
  ) {
    // TODO double check authorization
    const { challenge } = await this.getContent(
      'challenge',
      identifiers,
      ctx.models.Challenge
    );
    // @ts-expect-error didn't manage to find proper mongoose type :(
    const content = challenge.content.id(contentId);
    if (!content) {
      throw new ContentNotFoundError(contentId, identifiers.challengeId);
    }
    content.isActive = false;

    await challenge.save();
    return plainToClass(RemoveContentPayload, {
      message: `Content "${content._id}" removed from challenge "${challenge.id}"`
    });
  }

  @Authorized()
  @Mutation(() => RemoveContentPayload)
  async removeContentFromSubmission(
    @Arg('input', () => RemoveContentFromSubmissionContract)
    { contentId, ...identifiers }: RemoveContentFromSubmissionContract,
    @Ctx() ctx: ChallengeServiceContext
  ) {
    const { challenge, post: submission } = await this.getContent(
      'submission',
      identifiers,
      ctx.models.Challenge
    );
    // @ts-expect-error didn't manage to find proper mongoose type :(
    const content = submission.content.id(contentId);
    if (!content) {
      throw new ContentNotFoundError(
        contentId,
        identifiers.challengeId,
        identifiers.submissionId
      );
    }
    content.isActive = false;

    await challenge.save();
    return plainToClass(RemoveContentPayload, {
      message: `Content "${content._id}" removed from submission "${submission.id}"`
    });
  }

  @Authorized()
  @Mutation(() => RemoveContentPayload)
  async removeContentFromReply(
    @Arg('input', () => RemoveContentFromReplyContract)
    { contentId, ...identifiers }: RemoveContentFromReplyContract,
    @Ctx() ctx: ChallengeServiceContext
  ) {
    // TODO double check authorization
    const { challenge, post: reply } = await this.getContent(
      'reply',
      identifiers,
      ctx.models.Challenge
    );
    // @ts-expect-error didn't manage to find proper mongoose type :(
    const content = reply.content.id(contentId);
    if (!content) {
      throw new ContentNotFoundError(
        contentId,
        identifiers.challengeId,
        identifiers.submissionId,
        identifiers.replyId
      );
    }
    content.isActive = false;

    await challenge.save();
    return plainToClass(RemoveContentPayload, {
      message: `Content "${content._id}" removed from reply "${reply.id}"`
    });
  }

  @Authorized()
  @Mutation(() => RemoveContentPayload)
  async removeContentFromChallengeEdit(
    @Arg('input', () => RemoveContentFromChallengeEditContract)
    { contentId, ...identifiers }: RemoveContentFromChallengeEditContract,
    @Ctx() ctx: ChallengeServiceContext
  ) {
    const { challenge, post: edit } = await this.getContent(
      'challengeEdit',
      identifiers,
      ctx.models.Challenge
    );
    // TODO double check authorization
    // @ts-expect-error didn't manage to find proper mongoose type :(
    const content = edit.content.id(contentId);
    if (!content) {
      throw new ContentNotFoundError(
        contentId,
        identifiers.challengeId,
        undefined,
        undefined,
        identifiers.editId
      );
    }
    content.isActive = false;

    await challenge.save();
    return plainToClass(RemoveContentPayload, {
      message: `Content "${content._id}" removed from challenge edit "${edit.id}"`
    });
  }

  @Authorized()
  @Mutation(() => RemoveContentPayload)
  async removeContentFromSubmissionEdit(
    @Arg('input', () => RemoveContentFromSubmissionEditContract)
    { contentId, ...identifiers }: RemoveContentFromSubmissionEditContract,
    @Ctx() ctx: ChallengeServiceContext
  ) {
    const { challenge, post: edit } = await this.getContent(
      'submissionEdit',
      identifiers,
      ctx.models.Challenge
    );
    // TODO double check authorization
    // @ts-expect-error didn't manage to find proper mongoose type :(
    const content = edit.content.id(contentId);
    if (!content) {
      throw new ContentNotFoundError(
        contentId,
        identifiers.challengeId,
        identifiers.submissionId,
        undefined,
        identifiers.editId
      );
    }
    content.isActive = false;

    await challenge.save();
    return plainToClass(RemoveContentPayload, {
      message: `Content "${content._id}" removed from submission edit "${edit.id}"`
    });
  }

  @Authorized()
  @Mutation(() => RemoveContentPayload)
  async removeContentFromReplyEdit(
    @Arg('input', () => RemoveContentFromReplyEditContract)
    { contentId, ...identifiers }: RemoveContentFromReplyEditContract,
    @Ctx() ctx: ChallengeServiceContext
  ) {
    const { challenge, post: edit } = await this.getContent(
      'replyEdit',
      identifiers,
      ctx.models.Challenge
    );
    // TODO double check authorization
    // @ts-expect-error didn't manage to find proper mongoose type :(
    const content = edit.content.id(contentId);
    if (!content) {
      throw new ContentNotFoundError(
        contentId,
        identifiers.challengeId,
        identifiers.submissionId,
        identifiers.replyId,
        identifiers.editId
      );
    }
    content.isActive = false;

    await challenge.save();
    return plainToClass(RemoveContentPayload, {
      message: `Content "${content._id}" removed from reply edit "${edit.id}"`
    });
  }

  @Authorized()
  @Mutation(() => PublishPostPayload)
  async publishChallenge(
    @Arg('input', () => PublishChallengeContract)
    identifiers: PublishChallengeContract,
    @Ctx() ctx: ChallengeServiceContext
  ) {
    // TODO double check authorization
    const { challenge } = await this.getContent(
      'challenge',
      identifiers,
      ctx.models.Challenge
    );
    challenge.isActive = true;

    await challenge.save();
    return plainToClass(PublishPostPayload, {
      message: `Challenge "${challenge.id}" published`,
      challenge
    });
  }

  @Authorized()
  @Mutation(() => PublishPostPayload)
  async publishSubmission(
    @Arg('input', () => PublishSubmissionContract)
    identifiers: PublishSubmissionContract,
    @Ctx() ctx: ChallengeServiceContext
  ) {
    const { challenge, post: submission } = await this.getContent(
      'submission',
      identifiers,
      ctx.models.Challenge
    );
    submission.isActive = true;

    await challenge.save();
    return plainToClass(PublishPostPayload, {
      message: `Submission "${submission.id}" published`,
      challenge
    });
  }

  @Authorized()
  @Mutation(() => PublishPostPayload)
  async publishReply(
    @Arg('input', () => PublishReplyContract)
    identifiers: PublishReplyContract,
    @Ctx() ctx: ChallengeServiceContext
  ) {
    // TODO double check authorization
    const { challenge, post: reply } = await this.getContent(
      'reply',
      identifiers,
      ctx.models.Challenge
    );
    reply.isActive = true;
    await challenge.save();
    return plainToClass(PublishPostPayload, {
      message: `Reply "${reply.id}" published`,
      challenge
    });
  }

  @Authorized()
  @Mutation(() => PublishPostPayload)
  async publishChallengeEdit(
    @Arg('input', () => PublishChallengeEditContract)
    identifiers: PublishChallengeEditContract,
    @Ctx() ctx: ChallengeServiceContext
  ) {
    const { challenge, post: edit } = await this.getContent(
      'challengeEdit',
      identifiers,
      ctx.models.Challenge
    );
    // TODO double check authorization
    edit.isActive = true;

    await challenge.save();
    return plainToClass(PublishPostPayload, {
      message: `Challenge edidt "${edit.id}" publisehd`,
      challenge
    });
  }

  @Authorized()
  @Mutation(() => PublishPostPayload)
  async publishSubmissionEdit(
    @Arg('input', () => PublishSubmissionEditContract)
    identifiers: PublishSubmissionEditContract,
    @Ctx() ctx: ChallengeServiceContext
  ) {
    const { challenge, post: edit } = await this.getContent(
      'submissionEdit',
      identifiers,
      ctx.models.Challenge
    );
    // TODO double check authorization
    edit.isActive = true;

    await challenge.save();
    return plainToClass(PublishPostPayload, {
      message: `Submission edit "${edit.id}" published`,
      challenge
    });
  }

  @Authorized()
  @Mutation(() => PublishPostPayload)
  async publishReplyEdit(
    @Arg('input', () => PublishReplyEditContract)
    identifiers: PublishReplyEditContract,
    @Ctx() ctx: ChallengeServiceContext
  ) {
    const { challenge, post: edit } = await this.getContent(
      'replyEdit',
      identifiers,
      ctx.models.Challenge
    );
    // TODO double check authorization
    edit.isActive = true;

    await challenge.save();
    return plainToClass(PublishPostPayload, {
      message: `Reply edit "${edit.id}" published`,
      challenge
    });
  }
}
