import { ObjectId } from 'bson';
import { formatContentIds } from './formatContentIds';

export class ComposedConfigError extends Error {
  name = 'ComposedConfigError';
  constructor(public errors: string[]) {
    super(errors.join('\n'));
  }
}

export class ConfigError extends Error {
  name = 'ConfigError';
  constructor(public message: string) {
    super(message);
  }
}

export class InvalidValueError extends Error {
  name = 'InvalidValueError';
  constructor(public expected: string, public actual: string) {
    super(`Expected value: "${expected}", actual "${actual}"`);
  }
}

export class SchemaFixParseError extends Error {
  name = 'SchemaFixParseError';
  constructor(message?: string) {
    super(
      `Error during GQL schema parsing for fixing field directives${
        message ? `: ${message}` : ''
      }`
    );
  }
}

export class ConfigValidationError extends Error {
  name = 'ConfigValidationError';
  constructor(configPath: string, expectedValue: string, actual: string) {
    super(
      `Invalid config value for "${configPath}" - expected ${expectedValue}, got "${actual}"`
    );
  }
}

export class DatabaseNotConnectedError extends Error {
  name = 'DatabaseNotConnectedError';
  constructor(instance: string) {
    super(`Database "${instance}" not initialized`);
  }
}

export class ScalarParseError extends Error {
  name = 'ScalarParseError';
  constructor(scalarName: string, allowedValues: string[]) {
    super(`"${scalarName}" can only parse ${allowedValues.join(', ')} values`);
  }
}

export class ScalarSerializeError extends Error {
  name = 'ScalarSerializeError';
  constructor(scalarName: string, allowedValues: string[]) {
    super(
      `"${scalarName}" can only serialize ${allowedValues.join(', ')} values`
    );
  }
}

export class ChallengeNotFoundError extends Error {
  name = 'ChallengeNotFoundError';
  constructor(challengeId: ObjectId) {
    super(`No content found with ${formatContentIds(challengeId)}`);
  }
}

export class SubmissionNotFoundError extends Error {
  name = 'SubmissionNotFoundError';
  constructor(challengeId: ObjectId, submissionId: ObjectId) {
    super(
      `No content found with ${formatContentIds(challengeId, submissionId)}`
    );
  }
}

export class ReplyNotFoundError extends Error {
  name = 'ReplyNotFoundError';
  constructor(
    challengeId: ObjectId,
    submissionId: ObjectId,
    replyId: ObjectId
  ) {
    super(
      `No content found with ${formatContentIds(
        challengeId,
        submissionId,
        replyId
      )}`
    );
  }
}

export class EditNotFoundError extends Error {
  name = 'EditNotFoundError';
  constructor(
    editId: ObjectId,
    challengeId: ObjectId,
    submissionId?: ObjectId,
    replyId?: ObjectId
  ) {
    super(
      `No content found with ${formatContentIds(
        challengeId,
        submissionId,
        replyId,
        editId
      )}`
    );
  }
}

export class ContentNotFoundError extends Error {
  name = 'ContentNotFoundError';
  constructor(
    contentId: ObjectId,
    challengeId: ObjectId,
    submissionId?: ObjectId,
    replyId?: ObjectId,
    editId?: ObjectId
  ) {
    super(
      `No content found with ${formatContentIds(
        challengeId,
        submissionId,
        replyId,
        editId,
        contentId
      )}`
    );
  }
}

export class InvalidContentTypeError extends Error {
  name = 'InvalidContentType';
  constructor(contentType: string) {
    super(`Searching for invalid content type "${contentType}"`);
  }
}

export class SubmittingOnOwnChallenge extends Error {
  name = 'SubmittingOnOwnChallenge';
  constructor(userId: string, challengeId: ObjectId) {
    super(
      `User "${userId}" posting submission on own challenge "${challengeId}"`
    );
  }
}
