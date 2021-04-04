import { ChallengeServiceContext } from '../context';
import { Challenge } from '../entities/Challenge';

export const resolveChallengeReference = (
  challenge: Pick<Challenge, 'id'>,
  args: any,
  ctx: ChallengeServiceContext
) => {
  return ctx.models.Challenge.findById(challenge);
};
