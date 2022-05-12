import { PickType } from '@nestjs/mapped-types';
import { Board } from '../entities/board.entity';

export class UpdateBoardDto extends PickType(Board, [
  'title',
  'description',
  'status',
]) {}
