import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookEntity } from './entity/book.entity';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import {
  BookCoverEntity,
  FileFillableFields,
} from './entity/book-cover.entity';

@Injectable()
export class BookService extends TypeOrmCrudService<BookEntity> {
  public s3;
  private readonly logger = new Logger(BookService.name);
  constructor(
    @InjectRepository(BookEntity)
    private bookRepository: Repository<BookEntity>,
    @InjectRepository(BookCoverEntity)
    private bookCoverRepository: Repository<BookCoverEntity>,
    private readonly configService: ConfigService,
  ) {
    super(bookRepository);
    this.s3 = new S3Client({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }
  async uploadImage(image: FileFillableFields) {
    const uploadParam = {
      Bucket: this.configService.get('AWS_PUBLIC_BUCKLET'),
      Body: image.buffer,
      Key: `${Date.now().toString()}-${image.name}`,
    };
    this.s3.send(new PutObjectCommand(uploadParam)).then((result) => {
      this.logger.log(
        ' Command Sent with : ' + result.$metadata.httpStatusCode,
      );
    });
    const href =
      'https://s3.' + this.configService.get('AWS_REGION') + '.amazonaws.com/';
    const path =
      href +
      this.configService.get('AWS_PUBLIC_BUCKLET') +
      '/' +
      uploadParam.Key;
    const uploadedImage = await this.bookCoverRepository.save(
      this.bookCoverRepository.create({
        name: image.name,
        path: path,
        mimeType: image.mimeType,
        size: image.size,
        key: uploadParam.Key,
      }),
    );
    /**
     * Update Image URL
     */
    this.bookCoverRepository
      .update(uploadedImage.id, {
        url:
          this.configService.get('APP_URL') + `/v1/files/${uploadedImage.id}`,
      })
      .then((r) => {
        this.logger.log('Image: ' + uploadedImage.id + ' saved');
      });
    return uploadedImage;
  }
}
