import zod from 'zod';
import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';

config({
  path: '.env',
});

//Kiểm tra xem có file .env không
if (!fs.existsSync(path.resolve('.env'))) {
  console.log('Không tìm thấy file .env');
  process.exit(1);
}

const configSchema = zod.object({
  ACCESS_TOKEN_SECRET: zod.string(),
  ACCESS_TOKEN_EXPIRES_IN: zod.string(),
  REFRESH_TOKEN_SECRET: zod.string(),
  REFRESH_TOKEN_EXPIRES_IN: zod.string(),
  SECRET_API_KEY: zod.string(),
});

const configServer = configSchema.safeParse(process.env);

if (!configServer.success) {
  console.log('Các giá trị khai báo trong file .env không hợp lệ');
  console.error(configServer.error);
  process.exit(1);
}

const envConfig = configServer.data;

export default envConfig;
