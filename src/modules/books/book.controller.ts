import { CacheTTL, Controller } from '@nestjs/common';
import { BookService } from './book.service';
import { BookEntity } from './entity/book.entity';
import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedRequest,
} from '@nestjsx/crud';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorator/public.decorator';

@Crud({
  model: {
    type: BookEntity,
  },
})
@Controller('api/v1/books')
@ApiTags('Books')
@Public()
export class BookController implements CrudController<BookEntity> {
  constructor(public service: BookService) { }

  get base(): CrudController<BookEntity> {
    return this;
  }

  @CacheTTL(60)
  @Public()
  @Override('getManyBase')
  getMany(@ParsedRequest() req: CrudRequest) {
    return this.base.getManyBase(req);
  }
}
