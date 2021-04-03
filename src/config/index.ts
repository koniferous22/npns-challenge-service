import { ConfigError } from '../utils/exceptions';
import {
  resolveConfigNode,
  GetConfigValueByKeyString,
  ResolveConfigAstNode,
  ConfigAstNode
} from './utils/generics';
import { getEndpoint, getNumber } from './utils/transformers';

const configWithParser = {
  type: 'node' as const,
  children: {
    port: {
      type: 'leaf' as const,
      originalValue: process.env.PORT,
      transform: getNumber,
      overridenValue: null as null | string
    },
    graphqlPath: {
      type: 'leaf' as const,
      originalValue: process.env.GRAPHQL_PATH,
      transform: getEndpoint,
      overridenValue: null as null | string
    },
    mongoose: {
      type: 'node' as const,
      children: {
        host: {
          type: 'leaf' as const,
          originalValue: process.env.CHALLENGE_DB_HOST,
          overridenValue: null as null | string
        },
        port: {
          type: 'leaf' as const,
          originalValue: process.env.CHALLENGE_DB_PORT,
          transform: getNumber,
          overridenValue: null as null | string
        },
        username: {
          type: 'leaf' as const,
          originalValue: process.env.CHALLENGE_DB_USERNAME,
          overridenValue: null as null | string
        },
        password: {
          type: 'leaf' as const,
          originalValue: process.env.CHALLENGE_DB_PASSWORD,
          overridenValue: null as null | string
        },
        database: {
          type: 'leaf' as const,
          originalValue: process.env.CHALLENGE_DB_DATABASE,
          overridenValue: null as null | string
        }
      }
    }
  }
};

export type ResolvedConfigType = ResolveConfigAstNode<typeof configWithParser>;

export class Config {
  private _value: ResolvedConfigType;
  private _settingsChanged: boolean;

  private static _instance: Config | null;
  private resolveConfig() {
    const { config, errors } = resolveConfigNode(configWithParser);
    if (errors.length > 0) {
      throw new ConfigError(errors);
    }
    return config;
  }

  private constructor() {
    this._value = this.resolveConfig();
    this._settingsChanged = false;
  }

  getConfig() {
    if (this._settingsChanged) {
      this._value = this.resolveConfig();
      this._settingsChanged = false;
    }
    return this._value;
  }

  override<KeyString extends string>(
    keyString: KeyString,
    newValue: GetConfigValueByKeyString<KeyString, typeof configWithParser>
  ) {
    const keys = keyString.split('.');
    let current: ConfigAstNode = configWithParser;
    keys.forEach((key) => {
      switch (current.type) {
        case 'node': {
          current = current.children[key];
          break;
        }
        case 'array': {
          const index = parseInt(key, 10);
          current = current.values[index];
          break;
        }
        case 'leaf': {
          throw new Error(`Key string "${keyString}" out of range`);
        }
        default: {
          throw new Error(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            `Encountered invalid node type: "${current && current!.type}"`
          );
        }
      }
    });
    if (!['leaf'].includes(current.type)) {
      throw new Error(
        `Configuration key '${keyString}' references object and not leaf value`
      );
    }
    // @ts-expect-error Wrong ts inferring because of for-each
    current.overridenValue = newValue.toString();
    this._settingsChanged = true;
  }

  public static getInstance() {
    if (!Config._instance) {
      Config._instance = new Config();
    }
    return Config._instance;
  }
}
