// TODO use when cache is implemented
// import { Tedis } from 'tedis';
import { Config } from './config';
import { models } from './entities';
import { GridFS } from './external/GridFS';
// import { ChallengeViewService } from './external/challenge-cache';

export type ContentServiceContext = {
  user: {
    data: {
      id: string;
      createdAt: string;
      updatedAt: string;
      username: string;
      email: string;
      alias: null | string;
      hasNsfwAllowed: boolean;
    };
  } | null;
  models: typeof models;
  config: Config;
  gridFileSystem: GridFS;
};
