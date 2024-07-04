import {
  CacheTTL,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { BookService } from './book.service';
import { BookEntity } from './entity/book.entity';
import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedRequest,
} from '@nestjsx/crud';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorator/public.decorator';
import { Throttle } from '@nestjs/throttler';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
@Crud({
  model: {
    type: BookEntity,
  },
})
@Controller('api/v1/books')
@ApiTags('Books')
@Public()
export class BookController implements CrudController<BookEntity> {
  constructor(public service: BookService) {}

  get base(): CrudController<BookEntity> {
    return this;
  }

  @CacheTTL(60)
  @Throttle(30, 10 * 60)
  @Public()
  @Override('getManyBase')
  getMany(@ParsedRequest() req: CrudRequest) {
    return this.base.getManyBase(req);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const image = {
      name: file.originalname,
      path: '',
      mimeType: file.mimetype,
      size: 0,
      buffer: file.buffer,
    };
    return await this.service.uploadImage(image);
  }
}
