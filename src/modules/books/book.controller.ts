import { Controller } from '@nestjs/common';
import { BookService } from './book.service';
import { BookEntity } from './entity/book.entity';
import { Crud, CrudController } from '@nestjsx/crud';
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
  constructor(public service: BookService) {}
}
