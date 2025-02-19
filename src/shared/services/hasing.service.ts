import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';

const salt = 10;

@Injectable()
export class HasingService {
  hash(value: string) {
    return hash(value, salt);
  }

  compare(value: string, hash: string) {
    return compare(value, hash);
  }
}
