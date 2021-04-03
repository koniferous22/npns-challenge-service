import 'reflect-metadata';
import { buildFederatedSchema } from '@apollo/federation';
import { ApolloServer } from 'apollo-server';
// import { addResolversToSchema } from 'apollo-graphql';
import gql from 'graphql-tag';
import { buildSchema, createResolversMap } from 'type-graphql';
import { printSchemaWithDirectives } from '@graphql-tools/utils';
import { specifiedDirectives } from 'graphql';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
// eslint-disable-next-line import/no-named-as-default
import federationDirectives from '@apollo/federation/dist/directives';
import { ChallengeServiceContext } from './context';
import { Config } from './config';
// TODO reimplement Redis logic
// import { ChallengeViewCache } from './external/challenge-cache';
// import { resolveChallengeReference } from './references/Challenge';
import { fixFieldSchemaDirectives } from './utils/fixFieldDirectives';
import { buildMongooseConnectionString } from './utils/buildMongooseConnectionString';
import { ObjectIdScalar } from './scalars/ObjectId';
import { ChallengeResolver } from './resolvers/Challenge';
import { models } from './entities';

const federationFieldDirectivesFixes: Parameters<
  typeof fixFieldSchemaDirectives
>[1] = [];

const bootstrap = async () => {
  const {
    port,
    graphqlPath,
    mongoose: mongooseConfig
  } = Config.getInstance().getConfig();
  await mongoose.connect(buildMongooseConnectionString(mongooseConfig));
  const typeGraphQLSchema = await buildSchema({
    resolvers: [ChallengeResolver],
    directives: [...specifiedDirectives, ...federationDirectives],
    scalarsMap: [{ type: ObjectId, scalar: ObjectIdScalar }]
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

  // TODO uncomment when implemented
  // addResolversToSchema(schema, {
  //   Challenge: {
  //     __resolveReference: resolveChallengeReference
  //   }
  // });
  const server = new ApolloServer({
    schema,
    context: ({ req }) => {
      const userFromRequest = req.headers.user as string;
      return {
        user: userFromRequest ? JSON.parse(userFromRequest) : null,
        config: Config.getInstance(),
        models
      } as ChallengeServiceContext;
    }
  });
  server.setGraphQLPath(graphqlPath);
  server.listen({ port }).then(({ url }) => {
    console.log(`🚀 Challenge service ready at ${url}`);
  });
};

bootstrap();
