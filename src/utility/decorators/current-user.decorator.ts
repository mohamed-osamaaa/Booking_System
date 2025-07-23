import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const ctx = context.getArgByIndex(2); // GraphQL context
        return ctx.req.currentUser;
    },
);
