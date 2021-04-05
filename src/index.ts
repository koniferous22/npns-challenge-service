import 'reflect-metadata';
import { buildFederatedSchema } from '@apollo/federation';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { addResolversToSchema } from 'apollo-graphql';
import gql from 'graphql-tag';
import { buildSchema, createResolversMap } from 'type-graphql';
import { printSchemaWithDirectives } from '@graphql-tools/utils';
import { specifiedDirectives } from 'graphql';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import { graphqlUploadExpress } from 'graphql-upload';
// eslint-disable-next-line import/no-named-as-default
import federationDirectives from '@apollo/federation/dist/directives';
import { ChallengeServiceContext } from './context';
import { Config } from './config';
// TODO reimplement Redis logic
// import { ChallengeViewCache } from './external/challenge-cache';
import { resolveChallengeReference } from './references/Challenge';
import { fixFieldSchemaDirectives } from './utils/fixFieldDirectives';
import { buildMongooseConnectionString } from './utils/buildMongooseConnectionString';
import { ObjectIdScalar } from './scalars/ObjectId';
import { ChallengeResolver } from './resolvers/Challenge';
import { models } from './entities';
import { GridFS } from './external/GridFS';
import { TypegooseConvertor } from './middleware/Typegoose';

const federationFieldDirectivesFixes: Parameters<
  typeof fixFieldSchemaDirectives
>[1] = [
  {
    objectTypeName: 'User',
    fieldDefinitionName: 'id',
    directiveName: 'external'
  }
];

const bootstrap = async () => {
  const {
    port,
    graphqlPath,
    gridFs,
    mongoose: mongooseConfig
  } = Config.getInstance().getConfig();
  await mongoose.connect(buildMongooseConnectionString(mongooseConfig));
  const typeGraphQLSchema = await buildSchema({
    resolvers: [ChallengeResolver],
    directives: [...specifiedDirectives, ...federationDirectives],
    scalarsMap: [{ type: ObjectId, scalar: ObjectIdScalar }],
    globalMiddlewares: [TypegooseConvertor]
  });

  const schema = buildFederatedSchema({
    typeDefs: gql(
      fixFieldSchemaDirectives(
        printSchemaWithDirectives(typeGraphQLSchema),
        federationFieldDirectivesFixes
      )
    ),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolvers: createResolversMap(typeGraphQLSchema) as any
  });

  addResolversToSchema(schema, {
    Challenge: {
      __resolveReference: resolveChallengeReference
    }
  });
  const app = express();
  app.use(graphqlUploadExpress(gridFs));
  const gridFileSystem = new GridFS();
  const server = new ApolloServer({
    schema,
    context: ({ req }) => {
      const userFromRequest = req.headers.user as string;
      return {
        user: userFromRequest ? JSON.parse(userFromRequest) : null,
        config: Config.getInstance(),
        models,
        gridFileSystem
      } as ChallengeServiceContext;
    },
    uploads: false
  });
  server.applyMiddleware({ app });
  server.setGraphQLPath(graphqlPath);
  app.listen(port, () => {
    console.log(
      `🚀 Challenge service ready at http://localhost:${port}${graphqlPath}`
    );
  });
};

bootstrap();
