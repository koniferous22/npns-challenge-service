import { Type } from 'class-transformer';
import { ObjectId } from 'mongodb';
import { Field, InterfaceType, ObjectType } from 'type-graphql';
import { Challenge } from '../entities/Challenge';
import { TextContent, UploadedContent } from '../entities/Content';
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

@InterfaceType()
export abstract class BasePayload {
  @Field()
  message!: string;
}

@ObjectType({ implements: BasePayload })
export class PostChallengePayload {
  message!: string;

  @Field(() => ObjectIdScalar)
  postedChallengeId!: ObjectId;
}

@ObjectType({ implements: BasePayload })
export class PostSubmissionPayload {
  message!: string;

  @Field(() => ObjectIdScalar)
  postedSubmissionId!: ObjectId;
}

@ObjectType({ implements: BasePayload })
export class PostReplyPayload {
  message!: string;

  @Field(() => ObjectIdScalar)
  postedReplyId!: ObjectId;
}

@ObjectType({ implements: BasePayload })
export class PostChallengeEditPayload {
  message!: string;

  @Field(() => ObjectIdScalar)
  postedEditId!: ObjectId;
}

@ObjectType({ implements: BasePayload })
export class PostSubmissionEditPayload {
  message!: string;

  @Field(() => ObjectIdScalar)
  postedEditId!: ObjectId;
}

@ObjectType({ implements: BasePayload })
export class PostReplyEditPayload {
  message!: string;

  @Field(() => ObjectIdScalar)
  postedEditId!: ObjectId;
}

@ObjectType({ implements: BasePayload })
export class AddTextContentToChallengePayload {
  message!: string;

  @Field()
  content!: TextContent;

  @Field()
  createdAt!: Date;
}

@ObjectType({ implements: BasePayload })
export class AddTextContentToSubmissionPayload {
  message!: string;

  @Field()
  content!: TextContent;

  @Field()
  createdAt!: Date;
}

@ObjectType({ implements: BasePayload })
export class AddTextContentToReplyPayload {
  message!: string;

  @Field()
  content!: TextContent;

  @Field()
  createdAt!: Date;
}

@ObjectType({ implements: BasePayload })
export class AddTextContentToChallengeEditPayload {
  message!: string;

  @Field()
  content!: TextContent;

  @Field()
  createdAt!: Date;
}

@ObjectType({ implements: BasePayload })
export class AddTextContentToSubmissionEditPayload {
  message!: string;

  @Field()
  content!: TextContent;

  @Field()
  createdAt!: Date;
}

@ObjectType({ implements: BasePayload })
export class AddTextContentToReplyEditPayload {
  message!: string;

  @Field()
  content!: TextContent;

  @Field()
  createdAt!: Date;
}

@ObjectType({ implements: BasePayload })
export class AddUploadedContentToChallengePayload {
  message!: string;

  @Field()
  content!: UploadedContent;

  @Field()
  createdAt!: Date;
}

@ObjectType({ implements: BasePayload })
export class AddUploadedContentToSubmissionPayload {
  message!: string;

  @Field()
  content!: UploadedContent;

  @Field()
  createdAt!: Date;
}

@ObjectType({ implements: BasePayload })
export class AddUploadedContentToReplyPayload {
  message!: string;

  @Field()
  content!: UploadedContent;

  @Field()
  createdAt!: Date;
}

@ObjectType({ implements: BasePayload })
export class AddUploadedContentToChallengeEditPayload {
  message!: string;

  @Field()
  content!: UploadedContent;

  @Field()
  createdAt!: Date;
}

@ObjectType({ implements: BasePayload })
export class AddUploadedContentToSubmissionEditPayload {
  message!: string;

  @Field()
  content!: UploadedContent;

  @Field()
  createdAt!: Date;
}

@ObjectType({ implements: BasePayload })
export class AddUploadedContentToReplyEditPayload {
  message!: string;

  @Field()
  content!: UploadedContent;

  @Field()
  createdAt!: Date;
}
