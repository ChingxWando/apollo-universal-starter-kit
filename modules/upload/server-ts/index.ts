import express, { Express } from 'express';
import { GraphQLModule } from '@gqlapp/graphql-server-ts';

import Upload from './sql';
import schema from './schema.graphql';
import createResolvers from './resolvers';
import resources from './locales';
import fileSystemStorage from './FileSystemStorage';

const middleware = (app: Express) => {
  app.use('/public', express.static('public'));
};

export * from './FileSystemStorage';

export default new GraphQLModule({
  schema: [schema],
  appContext: {
    fileSystemStorage
  },
  createResolversFunc: [createResolvers],
  createContextFunc: [() => ({ Upload: new Upload() })],
  middleware: [middleware],
  localization: [{ ns: 'upload', resources }]
});
