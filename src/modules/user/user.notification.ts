import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, Interval } from '@nestjs/schedule';
import { UserEntity } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserNotification {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) { }
    private readonly logger = new Logger(UserNotification.name);

    @Interval(10000)
    async informUser() {
        const users = await this.userRepository.find({ select: ['email', 'id'] });
        this.logger.log('Printing');
        users.forEach((user) => {
            // Email service
            this.logger.log(user.email);
        });
    }
}
