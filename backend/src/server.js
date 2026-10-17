import app from './app.js'
import { connectDatabase } from './config/database.js'
import { env, validateRuntimeEnvironment } from './config/env.js'

try {
  validateRuntimeEnvironment()
  await connectDatabase()
  app.listen(env.port, () => console.info(`API listening on port ${env.port}.`))
} catch (error) {
  console.error(`API startup failed: ${error.message}`)
  process.exitCode = 1
}