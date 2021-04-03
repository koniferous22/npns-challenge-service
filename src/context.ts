// TODO use when cache is implemented
// import { Tedis } from 'tedis';
import { Config } from './config';
import { models } from './entities';
import { GridFS } from './external/GridFS';
// import { ChallengeViewService } from './external/challenge-cache';

export type ChallengeServiceContext = {
  user: {
    data: {
      username: string;
      email: string;
      alias: string;
    };
  } | null;
  models: typeof models;
  config: Config;
  gridFileSystem: GridFS;
};
