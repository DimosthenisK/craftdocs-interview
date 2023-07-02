import { Socket } from 'socket.io';
import { User } from '@prisma/client';

export interface AuthSocket extends Socket {
  user: User;
}
