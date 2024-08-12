import {
  createParamDecorator,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';

export const Metadata = createParamDecorator(
  (_: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    if (request.metadata) {
      return request.metadata;
    } else {
      throw new NotFoundException();
    }
  },
);
