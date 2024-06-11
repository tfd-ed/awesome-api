import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './user.service';
import { UserEntity } from './entity/user.entity';
import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';
import { Roles } from '../common/decorator/roles.decorator';
import { AppRoles } from '../common/enum/roles.enum';
import { Public } from '../common/decorator/public.decorator';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserPayload } from './payload/user.payload';

@Crud({
  model: {
    type: UserEntity,
  },
  dto: {
    create: UserPayload,
  },
})
@Controller('api/v1/users')
@ApiTags('User')
export class UserController implements CrudController<UserEntity> {
  constructor(
    public service: UsersService,
    private eventEmitter: EventEmitter2,
  ) {}

  get base(): CrudController<UserEntity> {
    return this;
  }

  @ApiBearerAuth()
  @Roles(AppRoles.ADMINS)
  @Override('deleteOneBase')
  deleteOne(@ParsedRequest() req: CrudRequest) {
    return this.base.deleteOneBase(req);
  }

  @ApiBearerAuth()
  @Roles(AppRoles.ADMINS)
  @Override('createOneBase')
  async createOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: UserEntity,
  ) {
    const user = await this.base.createOneBase(req, dto);
    this.eventEmitter.emit('user.created', user);
    // this.service.sendUserToClient(user);
    return user;
  }

  @Public()
  @Override('getManyBase')
  getMany(@ParsedRequest() req: CrudRequest) {
    return this.base.getManyBase(req);
  }

  @Public()
  @Override('getOneBase')
  getOne(@ParsedRequest() req: CrudRequest) {
    return this.base.getOneBase(req);
  }
}
