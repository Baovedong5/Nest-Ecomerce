import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MulterModule } from '@nestjs/platform-express';
import multer from 'multer';
import { generateRandomFileName } from 'src/shared/helper';
import { existsSync, mkdirSync } from 'fs';
import { UPLOAD_DIR } from 'src/shared/constants/other.constant';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const newFileName = generateRandomFileName(file.originalname);
    cb(null, newFileName);
  },
});

@Module({
  imports: [
    MulterModule.register({
      storage,
    }),
  ],
  controllers: [MediaController],
})
export class MediaModule {
  constructor() {
    if (!existsSync(UPLOAD_DIR)) {
      mkdirSync(UPLOAD_DIR, { recursive: true });
    }
  }
}
