import { Config } from '../config';

export const buildMongooseConnectionString = ({
  username,
  password,
  database,
  port,
  host
}: ReturnType<Config['getConfig']>['mongoose']) =>
  `mongodb://${username}:${password}@${host}:${port}/${database}`;
