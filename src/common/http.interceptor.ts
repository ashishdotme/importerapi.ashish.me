import { CallHandler, ExecutionContext, HttpService, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class HttpInterceptor implements NestInterceptor {
  constructor(private httpService: HttpService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
  
    const ctx = context.switchToHttp();
    const token = ctx.getRequest().headers['authorization'];

    if (token) {
      this.httpService.axiosRef.defaults.headers.common['authorization'] =
        token;
    }
    return next.handle().pipe();
  }
}