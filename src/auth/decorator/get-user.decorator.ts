import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const GetUser = createParamDecorator(
    (data: string | undefined, ctx: ExecutionContext) => 
        data ? ctx.switchToHttp().getRequest().user[data]
            : ctx.switchToHttp().getRequest().user
)