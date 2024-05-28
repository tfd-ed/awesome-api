import { CacheInterceptor, ExecutionContext } from '@nestjs/common';
import { IGNORE_CACHE } from '../decorator/no-cache.decorator';

export class NoCacheInterceptor extends CacheInterceptor {
    protected isRequestCacheable(context: ExecutionContext): boolean {
        const http = context.switchToHttp();
        const request = http.getRequest();
        const ignoreCache = this.reflector.get(IGNORE_CACHE, context.getHandler());
        if (ignoreCache) {
            return false;
        }
        if (request.method === 'GET') {
            return true;
        }
    }
}
