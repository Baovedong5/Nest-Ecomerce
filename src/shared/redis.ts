import Client from 'ioredis';
import Redlock from 'redlock';

export const redis = new Client('redis://localhost:6379');
export const redlock = new Redlock([redis], {
  retryCount: 3,
  retryDelay: 200,
});
