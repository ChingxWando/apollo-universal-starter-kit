import Chat from './sql';

import schema from './schema';
import createResolvers, { onAppCreate } from './resolvers';
import ServerModule from '@gqlapp/module-server-ts';
import resources from './locales';

export default new ServerModule({
  schema: [schema],
  createResolversFunc: [createResolvers],
  createContextFunc: [() => ({ Chat: new Chat() })],
  localization: [{ ns: 'chat', resources }],
  onAppCreate: [onAppCreate]
});
