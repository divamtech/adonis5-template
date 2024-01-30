/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/

import Bull from '@ioc:Rocketseat/Bull'
import Env from '@ioc:Adonis/Core/Env'

Bull.process()
Bull.ui(Env.get('BULL_SERVER_PORT', 9999))
