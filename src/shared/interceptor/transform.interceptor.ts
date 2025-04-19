import { CallHandler, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ZodSerializerInterceptor } from 'nestjs-zod'
import { map, Observable } from 'rxjs'
import { RESPONSE_MESSAGE } from 'src/shared/decorators/message.decorator'

export class CustomZodSerializerInterceptor extends ZodSerializerInterceptor {
  constructor(
    reflector: any,
    private readonly schema: any,
  ) {
    super(reflector)
  }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const statusCode = context.switchToHttp().getResponse().statusCode
    const message = (this.reflector as Reflector).get<string | undefined>(RESPONSE_MESSAGE, context.getHandler()) ?? ''
    return next.handle().pipe(
      map((data) => {
        return {
          data: this.schema ? this.schema.parse(data) : (data ?? []),
          message,
          statusCode,
        }
      }),
    )
  }
}
