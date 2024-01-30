import Env from '@ioc:Adonis/Core/Env'
import { BullConfig } from '@ioc:Rocketseat/Bull'

/*
|--------------------------------------------------------------------------
| Bull configuration
|--------------------------------------------------------------------------
|
| Following is the configuration used by the Bull provider to connect to
| the redis server.
|
| Do make sure to pre-define the connections type inside `contracts/bull.ts`
| file for Rocketseat/Bull to recognize connections.
|
| Make sure to check `contracts/bull.ts` file for defining extra connections
*/

const bullConfig: BullConfig = {
  connection: Env.get('BULL_CONNECTION', 'bull'),

  connections: {
    bull: {
      host: Env.get('REDIS_HOST', 'localhost'),
      port: Env.get('REDIS_PORT', 6379),
      password: Env.get('REDIS_PASSWORD'),
      db: Env.get('REDIS_DATABASE'),
    },
    direct_uri: Env.get('REDIS_URI'),
  },
}

export default bullConfig
