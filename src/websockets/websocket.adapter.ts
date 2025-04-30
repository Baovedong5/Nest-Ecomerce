import { INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions, Server, Socket } from 'socket.io';
import { SharedWebsocketRepo } from 'src/shared/repositories/shared-websocket.repo';
import { TokenService } from 'src/shared/services/token.service';

const namespaces = ['/', 'payment', 'chat'];

export class WebsocketAdapter extends IoAdapter {
  private readonly sharedWebsocketRepo: SharedWebsocketRepo;
  private readonly tokenService: TokenService;

  constructor(app: INestApplicationContext) {
    super(app);
    this.sharedWebsocketRepo = app.get(SharedWebsocketRepo);
    this.tokenService = app.get(TokenService);
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

      await this.sharedWebsocketRepo.create({
        id: socket.id,
        userId,
      });

      socket.on('disconnect', async () => {
        await this.sharedWebsocketRepo.delete(socket.id).catch(() => {});
      });

      next();
    } catch (error) {
      next(error);
    }
  };
}
