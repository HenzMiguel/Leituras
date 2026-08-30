import fs from 'node:fs';
import path from 'node:path';
import { config } from 'dotenv';

const cwd = process.cwd();
const envPath = path.resolve(cwd, '.env');
const outputPath = path.resolve(cwd, 'src/app/environment.ts');

let apiUrl = process.env.NG_APP_API_URL;

if (!apiUrl && fs.existsSync(envPath)) {
  const env = config({ path: envPath }).parsed ?? {};
  apiUrl = env.NG_APP_API_URL;
}

if (!apiUrl) {
  throw new Error('NG_APP_API_URL deve ser configurada em .env ou em variáveis de ambiente.');
}

const output = `export const environment = {\n  apiUrl: ${JSON.stringify(apiUrl)},\n} as const;\n`;
fs.writeFileSync(outputPath, output, 'utf8');