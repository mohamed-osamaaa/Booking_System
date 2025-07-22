import { UsersService } from 'src/users/users.service';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { User } from 'src/users/entities/user.entity';
import { Injectable, NestMiddleware } from '@nestjs/common';

declare global {
    namespace Express {
        interface Request {
            currentUser?: User | null;
        }
    }
}

interface JwtPayload {
    id: string;
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {

    constructor(
        private readonly usersService: UsersService,
    ) { }

    async use(req: Request, res: Response, next: NextFunction) {
        const authHeader =
            typeof req.headers.authorization === 'string'
                ? req.headers.authorization
                : Array.isArray(req.headers.authorization)
                    ? req.headers.authorization[0]
                    : null;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            req.currentUser = null;
            return next();
        }

        const token = authHeader.split(' ')[1];

        try {
            const { id } = verify(token, process.env.ACCESS_TOKEN_SECRET_KEY!) as JwtPayload; // ! in TS to make sure it not null

            const user = await this.usersService.findOneById(id);

            req.currentUser = user || null;
        } catch (err) {
            console.error('Token verification failed:', err);
            req.currentUser = null;
        }

        next();
    }
}
