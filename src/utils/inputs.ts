import { ObjectId } from 'bson';
import {
  IsMongoId,
  IsNotEmpty,
  IsPositive,
  IsString,
  ValidateIf
} from 'class-validator';
import { GraphQLString } from 'graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { InputType, Field, Int, Float } from 'type-graphql';
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

  @Field(() => ObjectIdScalar, {
    nullable: true
  })
  @ValidateIf((o: ChallengesByTagsInput) => Boolean(o.afterCursorId))
  @IsMongoId()
  afterCursorId!: ObjectId | null;

  @Field(() => Float, {
    nullable: true
  })
  // NOTE should fail only when number is negative (null, undefined and 0 are all accepted)
  @ValidateIf((o: ChallengesByTagsInput) => Boolean(o.afterCursorBoost))
  @IsPositive()
  afterCursorBoost!: number | null;

  @Field(() => Int, {
    nullable: true
  })
  @ValidateIf((o: ChallengesByTagsInput) => Boolean(o.afterCursorViews))
  @IsPositive()
  afterCursorViews!: number | null;

  @Field()
  shouldPrioritizeBoostedChallenges!: boolean;
}

@InputType()
export class PostChallengeContract {
  @Field()
  @IsString()
  tag!: string;
}

@InputType()
export class PostSubmissionContract {
  @Field(() => ObjectIdScalar)
  @IsMongoId()
  challengeId!: ObjectId;
}

@InputType()
export class PostReplyContract {
  @Field(() => ObjectIdScalar)
  @IsMongoId()
  challengeId!: ObjectId;

  @Field(() => ObjectIdScalar)
  @IsMongoId()
  submissionId!: ObjectId;
}

@InputType()
export class PostChallengeEditContract {
  @Field(() => ObjectIdScalar)
  @IsMongoId()
  challengeId!: ObjectId;
}

@InputType()
export class PostSubmissionEditContract {
  @Field(() => ObjectIdScalar)
  @IsMongoId()
  challengeId!: ObjectId;

  @Field(() => ObjectIdScalar)
  @IsMongoId()
  submissionId!: ObjectId;
}

@InputType()
export class PostReplyEditContract {
  @Field(() => ObjectIdScalar)
  @IsMongoId()
  challengeId!: ObjectId;

  @Field(() => ObjectIdScalar)
  @IsMongoId()
  submissionId!: ObjectId;

  @Field(() => ObjectIdScalar)
  @IsMongoId()
  replyId!: ObjectId;
}

@InputType()
export class AddTextContentToChallengeContract {
  @Field(() => ObjectIdScalar)
  @IsMongoId()
  challengeId!: ObjectId;

  @Field()
  @IsString()
  textContent!: string;
}

@InputType()
export class AddTextContentToSubmissionContract {
  @Field(() => ObjectIdScalar)
  @IsMongoId()
  challengeId!: ObjectId;

  @Field(() => ObjectIdScalar)
  @IsMongoId()
  submissionId!: ObjectId;

  @Field()
  @IsString()
  textContent!: string;
}

@InputType()
export class AddTextContentToReplyContract {
  @Field(() => ObjectIdScalar)
  @IsMongoId()
  challengeId!: ObjectId;

  @Field(() => ObjectIdScalar)
  @IsMongoId()
  submissionId!: ObjectId;

  @Field(() => ObjectIdScalar)
  @IsMongoId()
  replyId!: ObjectId;

  @Field()
  @IsString()
  textContent!: string;
}

@InputType()
export class AddTextContentToChallengeEditContract {
  @Field(() => ObjectIdScalar)
  @IsMongoId()
  challengeId!: ObjectId;

  @Field(() => ObjectIdScalar)
  @IsMongoId()
  editId!: ObjectId;

  @Field()
  @IsString()
  textContent!: string;
}

@InputType()
export class AddTextContentToSubmissionEditContract {
  @Field(() => ObjectIdScalar)
  @IsMongoId()
  challengeId!: ObjectId;

  @Field(() => ObjectIdScalar)
  @IsMongoId()
  submissionId!: ObjectId;

  @Field(() => ObjectIdScalar)
  @IsMongoId()
  editId!: ObjectId;

  @Field()
  @IsString()
  textContent!: string;
}

@InputType()
export class AddTextContentToReplyEditContract {
  @Field(() => ObjectIdScalar)
  @IsMongoId()
  challengeId!: ObjectId;

  @Field(() => ObjectIdScalar)
  @IsMongoId()
  submissionId!: ObjectId;

  @Field(() => ObjectIdScalar)
  @IsMongoId()
  replyId!: ObjectId;

  @Field(() => ObjectIdScalar)
  @IsMongoId()
  editId!: ObjectId;

  @Field()
  @IsString()
  textContent!: string;
}

@InputType()
export class AddUploadedContentToChallengeContract {
  @Field(() => ObjectIdScalar)
  @IsMongoId()
  challengeId!: ObjectId;

  @Field(() => GraphQLUpload)
  upload!: Promise<FileUpload>;
}

@InputType()
export class AddUploadedContentToSubmissionContract {
  @Field(() => ObjectIdScalar)
  @IsMongoId()
  challengeId!: ObjectId;

  @Field(() => ObjectIdScalar)
  @IsMongoId()
  submissionId!: ObjectId;

  @Field(() => GraphQLUpload)
  upload!: Promise<FileUpload>;
}

@InputType()
export class AddUploadedContentToReplyContract {
  @Field(() => ObjectIdScalar)
  @IsMongoId()
  challengeId!: ObjectId;

  @Field(() => ObjectIdScalar)
  @IsMongoId()
  submissionId!: ObjectId;

  @Field(() => ObjectIdScalar)
  @IsMongoId()
  replyId!: ObjectId;

  @Field(() => GraphQLUpload)
  upload!: Promise<FileUpload>;
}

@InputType()
export class AddUploadedContentToChallengeEditContract {
  @Field(() => ObjectIdScalar)
  @IsMongoId()
  challengeId!: ObjectId;

  @Field(() => ObjectIdScalar)
  @IsMongoId()
  editId!: ObjectId;

  @Field(() => GraphQLUpload)
  upload!: Promise<FileUpload>;
}

@InputType()
export class AddUploadedContentToSubmissionEditContract {
  @Field(() => ObjectIdScalar)
  @IsMongoId()
  challengeId!: ObjectId;

  @Field(() => ObjectIdScalar)
  @IsMongoId()
  submissionId!: ObjectId;

  @Field(() => ObjectIdScalar)
  @IsMongoId()
  editId!: ObjectId;

  @Field(() => GraphQLUpload)
  upload!: Promise<FileUpload>;
}

@InputType()
export class AddUploadedContentToReplyEditContract {
  @Field(() => ObjectIdScalar)
  @IsMongoId()
  challengeId!: ObjectId;

  @Field(() => ObjectIdScalar)
  @IsMongoId()
  submissionId!: ObjectId;

  @Field(() => ObjectIdScalar)
  @IsMongoId()
  replyId!: ObjectId;

  @Field(() => ObjectIdScalar)
  @IsMongoId()
  editId!: ObjectId;

  @Field(() => GraphQLUpload)
  upload!: Promise<FileUpload>;
}
