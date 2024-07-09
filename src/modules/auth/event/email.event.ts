import { Mailman, MailMessage } from '@squareboat/nest-mailman';
import { OnEvent } from '@nestjs/event-emitter';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export default class EmailEvent {
  private readonly logger = new Logger(EmailEvent.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  /**
   * An event triggered to send verification code to tester
   * @param payload
   */
  @OnEvent('user.registered', { async: true })
  async verifyEmail(payload: any) {
    console.log(payload.email);
    // const token = this.jwtService.sign(payload, {
    //   secret: this.configService.get('JWT_SECRET_KEY'),
    //   expiresIn: this.configService.get('JWT_EXPIRATION_TIME'),
    // });
    const mail = new MailMessage();
    console.log('Hello1');
    mail.subject('Welcome to TFD').view('confirm', {
      mjml: {
        minify: true,
      },
      hello: 'Hello',
      header_text: 'Thanks for registration',
      purpose_one: 'we_need_to_verify',
      // instruction: this.translateService.t('event.email', {
      //   lang: payload.lang,
      // }),
      email: payload.email,
    });
    console.log('Hello2');
    Mailman.init()
      .to(payload.email)
      .from('"TFD" <info@tfdevs.com>')
      .replyTo('no-reply@info.com')
      .send(mail)
      .then(() => {
        this.logger.log('Email to: ' + payload.email + ' sent!');
      });
  }
}
