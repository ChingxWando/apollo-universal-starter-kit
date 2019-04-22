import { GraphQLSchema } from 'graphql';
import { Server } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import ServerModule from '@gqlapp/module-server-ts';

/**
 * GraphQL config shape
 */
export interface GraphQLConfigShape {
  // A GraphQL schema list of modules
  schema: GraphQLSchema;
  // A function to create GraphQL context
  createGraphQLContext: (req: any, res: any) => object;
}

/**
 * Subscription server config shape
 */
export interface SubsServerConfigShape {
  // HTTP server
  httpServer: Server;
  // A GraphQL schema list of modules
  schema: GraphQLSchema;
  // App modules
  modules: ServerModule;
}

/**
 * A function that creates a GraphQL Subscription server
 *
 * @param httpServer HTTP server
 * @param schema A GraphQL schema list of modules
 * @param modules App modules
 *
 * @returns Subscription Server
 */
export type CreateSubscriptionServer = ({ httpServer, schema, modules }: SubsServerConfigShape) => SubscriptionServer;

/**
 * A function that reloads a GraphQL Subscription server
 *
 * @param prevServer Previous HTTP server
 * @param subscriptionConfig Subscription server config
 */
export type ReloadSubscriptionServer = (prevServer: any, subscriptionConfig: SubsServerConfigShape) => void;

/**
 * A function that adds GraphQL Subscriptions
 *
 * @param httpServer HTTP server
 * @param schema A GraphQL schema list of modules
 * @param modules App modules
 * @param entryModule Entry module
 */
export type AddGraphQLSubs = (
  httpServer: Server,
  schema: GraphQLSchema,
  modules: ServerModule,
  entryModule?: NodeModule
) => any;

export { GraphQLSchema };
