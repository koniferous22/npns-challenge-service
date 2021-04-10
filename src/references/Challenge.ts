import { ContentServiceContext } from '../context';
import { Challenge } from '../entities/Challenge';

export const resolveChallengeReference = (
  challenge: Pick<Challenge, 'id'>,
  args: any,
  ctx: ContentServiceContext
) => {
  return ctx.models.Challenge.findById(challenge);
};
