import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthenticationGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const gqlCtx = GqlExecutionContext.create(context).getContext();
        return !!gqlCtx.currentUser;
    }
}