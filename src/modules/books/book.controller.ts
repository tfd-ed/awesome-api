import { Controller } from '@nestjs/common';
import { BookService } from './book.service';
import { BookEntity } from './entity/user.entity';
import { Crud, CrudController } from '@nestjsx/crud';
import { ApiTags } from '@nestjs/swagger';

@Crud({
  model: {
    type: BookEntity,
  },
})
@Controller('books')
@ApiTags('Books')
export class BookController implements CrudController<BookEntity> {
  constructor(public service: BookService) {}
}
