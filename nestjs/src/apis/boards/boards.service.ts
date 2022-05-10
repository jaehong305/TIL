import { Injectable } from '@nestjs/common';
import { Board } from './entities/board.entity';

@Injectable()
export class BoardsService {
  private boards: Board[] = [];

  findAll(): Board[] {
    return this.boards;
  }
}
