import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

import { config } from 'dotenv'

let envLoaded = false

export function loadEnv() {
  if (envLoaded) {
    return
  }

  const envPath = resolve(process.cwd(), '.env')
  const fallbackEnvPath = resolve(process.cwd(), '.env.example')

  if (existsSync(envPath)) {
    config({ path: envPath })
  } else if (existsSync(fallbackEnvPath)) {
    config({ path: fallbackEnvPath })
  }

  envLoaded = true
}
