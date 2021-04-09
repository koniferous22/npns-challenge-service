import { ObjectId } from 'mongodb';

export const formatContentIds = (
  challengeId: ObjectId,
  submissionId?: ObjectId,
  replyId?: ObjectId,
  editId?: ObjectId,
  contentId?: ObjectId
) =>
  `"${challengeId}" [challenge]${
    submissionId ? ` -> "${submissionId}" [submission]` : ''
  }${replyId ? ` -> "${replyId}" [reply]` : ''}${
    editId ? ` -> "${editId}" [edit]` : ''
  }${contentId ? ` -> "${contentId}" [content]` : ''}`;
