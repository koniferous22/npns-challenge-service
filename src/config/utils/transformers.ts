export const getNumber = (env: string, configPath: string) => {
  const number = parseInt(env, 10);
  if (Number.isNaN(number)) {
    throw new Error(
      `Invalid config value for "${configPath}" expected number, got "${env}"`
    );
  }
  return number;
};

export const getEndpoint = (env: string, configPath: string) => {
  // TODO validate allowed url characters
  if (!env.startsWith('/')) {
    throw new Error(
      `Invalid config value for "${configPath}" expected endpoint, got "${env}"`
    );
  }
  return env;
};
