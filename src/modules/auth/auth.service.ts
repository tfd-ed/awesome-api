import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Hash } from '../../utils/Hash';
import { UserEntity, UsersService } from '../user';
import { LoginPayload } from './payloads/login.payload';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersType } from '../common/enum/users-type.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
    private readonly httpService: HttpService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createToken(user: UserEntity) {
    return {
      expiresIn: this.configService.get<string>('JWT_EXPIRATION_TIME'),
      accessToken: this.jwtService.sign({ id: user.id }),
      user,
    };
  }

  async validateUser(payload: LoginPayload): Promise<UserEntity> {
    const user = await this.userService.getByUsername(payload.username);
    if (!user || !Hash.compare(payload.password, user.password)) {
      throw new UnauthorizedException('Username or Password is not correct!');
    }
    if (user.userType == UsersType.OAUTH) {
      throw new UnauthorizedException('OAuth User not allowed here!');
    }
    return user;
  }

  async registerGoogleUser(code: any): Promise<any> {
    // Get code to exchange access_token to call googleapi
    // -> use access_token to get userinfo (email, name, date of birth, photo)
    // If no user with email, register user on our own database
    // If user already existed, create JWT token
    // return JWT token back
    const { data } = await this.httpService.axiosRef.post(
      'https://oauth2.googleapis.com/token',
      {
        client_id: this.configService.get('GOOGLE_CLIENT_ID'),
        client_secret: this.configService.get('GOOGLE_CLIENT_SECRET'),
        code: code,
        redirect_uri: this.configService.get('GOOGLE_CALLBACK'),
        grant_type: 'authorization_code',
      },
    );
    const access_token = data.access_token;
    const response = await this.httpService.axiosRef.get(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: { Authorization: `Bearer ${access_token}` },
      },
    );
    // return response.data;
    // Check if user exist
    const users = await this.userService.getAll();
    // let exitedUser;
    // if (
    //   users.some((user) => {
    //     if (user.email == response.data.email) {
    //       exitedUser = user;
    //       return true;
    //     }
    //   })
    // ) {
    //   return this.createToken(exitedUser);
    // }
    const user = await this.userRepository.findOne({
      where: { email: response.data.email },
    });
    if (user) {
      return this.createToken(user);
    }
    // Create new user
    const newUser = this.userRepository.create({
      userType: UsersType.OAUTH,
      name: response.data.name,
      username: response.data.given_name + new Date().getTime(),
      email: response.data.email,
      picture: response.data.picture,
    });
    this.userRepository.save(newUser);
    return this.createToken(newUser);
  }
}
