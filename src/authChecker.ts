import { AuthChecker } from 'type-graphql';
import { ContentServiceContext } from './context';

export const authChecker: AuthChecker<ContentServiceContext> = ({
  context
}) => {
  return Boolean(context.user);
  // TODO when roles are implemented as user field
  // user.roles.some((role) => roles.includes(role))
};
