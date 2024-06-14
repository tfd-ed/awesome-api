import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerException, ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class WsThrottlerGuard extends ThrottlerGuard {
    async handleRequest(
        context: ExecutionContext,
        limit: number,
        ttl: number,
    ): Promise<boolean> {
        const client = context.switchToWs().getClient();
        const ip = client.conn.remoteAddress;
        const key = this.generateKey(context, ip);
        const ttls = await this.storageService.getRecord(key);
        if (ttls.length > limit) {
            throw new ThrottlerException();
        }
        await this.storageService.addRecord(key, ttl);
        return true;
    }
}
