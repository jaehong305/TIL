import { Controller, Get } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { Board } from './entities/board.entity';

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Get()
  getAllBoards(): Board[] {
    return this.boardsService.findAll();
  }
}
