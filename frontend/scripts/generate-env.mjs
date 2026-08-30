import { config } from 'dotenv';
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const environment = config({ path: '.env' }).parsed;
const apiUrl = environment?.NG_APP_API_URL;

if (!apiUrl) {
  throw new Error('NG_APP_API_URL deve ser configurada em .env.');
}

const output = `export const environment = {\n  apiUrl: ${JSON.stringify(apiUrl)},\n} as const;\n`;
await writeFile(resolve('src/app/environment.ts'), output);