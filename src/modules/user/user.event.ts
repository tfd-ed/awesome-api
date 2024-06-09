import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class UserEvent {
    private logger = new Logger(UserEvent.name);

    @OnEvent('user.created')
    emailUserVerificationLink(payload: any) {
        // Send email to user
        this.logger.log(payload);
        console.log(payload);
    }
}
