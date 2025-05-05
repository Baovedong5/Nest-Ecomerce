import { INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions, Server, Socket } from 'socket.io';
import { generateRoomUserId } from 'src/shared/helper';
import { SharedWebsocketRepo } from 'src/shared/repositories/shared-websocket.repo';
import { TokenService } from 'src/shared/services/token.service';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';

const namespaces = ['/', 'payment', 'chat'];

export class WebsocketAdapter extends IoAdapter {
  private readonly sharedWebsocketRepo: SharedWebsocketRepo;
  private readonly tokenService: TokenService;
  private adapterConstructor: ReturnType<typeof createAdapter>;

  constructor(app: INestApplicationContext) {
    super(app);
    this.sharedWebsocketRepo = app.get(SharedWebsocketRepo);
    this.tokenService = app.get(TokenService);
  }

  async connectToRedis(): Promise<void> {
    const pubClient = createClient({ url: `redis://localhost:6379` });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const server: Server = super.createIOServer(3003, {
      ...options,
      cors: {
        origin: '*',
        credentials: true,
      },
    });

    namespaces.forEach((namespace) => {
      server.of(namespace).use(this.authMiddleware);
    });

    return server;
  }

  authMiddleware = async (socket: Socket, next: (err?: any) => void) => {
    const { authorization } = socket.handshake.headers;

    if (!authorization) {
      return next(new Error('Missing authorization header'));
    }

    const accessToken = authorization.split(' ')[1];

    if (!accessToken) {
      return next(new Error('Missing access token'));
    }

    try {
      const { userId } = await this.tokenService.verifyAccessToken(accessToken);

      // await this.sharedWebsocketRepo.create({
      //   id: socket.id,
      //   userId,
      // });

      // socket.on('disconnect', async () => {
      //   await this.sharedWebsocketRepo.delete(socket.id).catch(() => {});
      // });

      await socket.join(generateRoomUserId(userId));

      next();
    } catch (error) {
      next(error);
    }
  };
}
