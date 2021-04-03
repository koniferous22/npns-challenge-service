import { ConfigValidationError } from '../../utils/exceptions';

export const getNumber = (env: string, configPath: string) => {
  const number = parseInt(env, 10);
  if (Number.isNaN(number)) {
    throw new ConfigValidationError(configPath, 'number', env);
  }
  return number;
};

export const getEndpoint = (env: string, configPath: string) => {
  // TODO validate allowed url characters
  if (!env.startsWith('/')) {
    throw new ConfigValidationError(configPath, 'endpoint', env);
  }
  return env;
};
