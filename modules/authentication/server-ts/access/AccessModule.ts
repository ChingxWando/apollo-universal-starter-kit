import { merge } from 'lodash';
import { ServerRestModule, ServerRestModuleShape } from '@gqlapp/module-server-ts';

// TODO: Change type of identity variable from any to User type, after converting the User DAO into Typescript
interface AccessModuleShape extends ServerRestModuleShape {
  grant: Array<(identity: any, req: Request, passwordHash: string) => { [key: string]: any } | void>;
}

interface AccessModule extends AccessModuleShape {}

class AccessModule extends ServerRestModule {
  constructor(...modules: AccessModuleShape[]) {
    super(...modules);
  }

  get grantAccess() {
    return async (identity: any, req: Request, passwordHash: string) => {
      let result = {};
      for (const grant of this.grant) {
        result = merge(result, await grant(identity, req, passwordHash));
      }
      return result;
    };
  }
}

export default AccessModule;
