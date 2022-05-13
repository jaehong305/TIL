import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';
import { BoardStatus } from 'src/apis/boards/entities/board.entity';

export class BoardStatusValidationPipe implements PipeTransform {
  readonly StatusOptions = [BoardStatus.PRIVATE, BoardStatus.PUBLIC];

  transform(value: any, metadata: ArgumentMetadata) {
    value = value.toUpperCase();

    if (this.isStatusValid(value)) throw new BadRequestException('status 값이 올바르지않습니다.');

    return value;
  }

  private isStatusValid(status) {
    const index = this.StatusOptions.indexOf(status);
    return index === -1;
  }
}
