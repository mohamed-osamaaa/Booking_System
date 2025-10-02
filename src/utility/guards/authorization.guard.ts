import {
    CanActivate,
    ExecutionContext,
    mixin,
    UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
  
export const AuthorizeGuard = (allowedRoles: string[]) => {
    class RolesGuardMixin implements CanActivate {
      canActivate(context: ExecutionContext): boolean {
        const ctx = GqlExecutionContext.create(context);
        const { currentUser } = ctx.getContext();
  
        if (!currentUser.role) {
            throw new UnauthorizedException('User has no role.');
          }
          
        const hasRole = allowedRoles.includes(currentUser.role);
        if (hasRole) return true;
        
        throw new UnauthorizedException('Sorry, you are not authorized.');
      }
    }
  
    return mixin(RolesGuardMixin);
};
  