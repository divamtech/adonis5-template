import Event from '@ioc:Adonis/Core/Event'
import Database from '@ioc:Adonis/Lucid/Database'

import Logger from '@ioc:Adonis/Core/Logger'
import Application from '@ioc:Adonis/Core/Application'

Event.on('db:query', (query) => {
  const qBinding = query.bindings
  let finalQuery = query.sql
  if (qBinding) {
    qBinding.forEach(b => {
      finalQuery = finalQuery.replace('?', typeof (b) == 'string' ? `'${b}'` : b)
    })
  }
  if (Application.inProduction) {
    Logger.debug(`sql: ${query.sql}, bindings: ${query.bindings}, Query: ${finalQuery}`)
  } else {
    Database.prettyPrint(query)
    Logger.info(`Query: ${finalQuery}`)
  }
})
