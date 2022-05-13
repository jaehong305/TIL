import { Injectable, NotFoundException } from '@nestjs/common';
import { Board, BoardStatus } from './entities/board.entity';
import { v1 as uuid } from 'uuid';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardRepository } from './board.repository';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(BoardRepository)
    private readonly boardRepository: BoardRepository,
  ) {}

  // private boards: Board[] = [];
  // findAll(): Board[] {
  //   return this.boards;
  // }
  // findOne(id: string): Board {
  //   const board = this.boards.find((board) => board.id === id);
  //   if (!board) throw new NotFoundException('게시글이 없습니다.');
  //   return board;
  // }

  async findOne(id: number): Promise<Board> {
    const found = await this.boardRepository.findOneById(id);
    if (!found) throw new NotFoundException(`Can't find Board with id ${id}`);
    return found;
  }

  // create(createBoardDto: CreateBoardDto) {
  //   const board: Board = {
  //     id: uuid(),
  //     ...createBoardDto,
  //     status: BoardStatus.PUBLIC,
  //   };
  //   this.boards.push(board);
  //   return board;
  // }
  // update(id: string, updateBoardDto: UpdateBoardDto): Board {
  //   const { title, description, status } = updateBoardDto;
  //   const board = this.findOne(id);
  //   board.title = title;
  //   board.description = description;
  //   board.status = status;
  //   return board;
  // }
  // updateStatus(id: string, status: BoardStatus): Board {
  //   const board = this.findOne(id);
  //   board.status = status;
  //   return board;
  // }
  // delete(id: string): void {
  //   const found = this.findOne(id);
  //   this.boards = this.boards.filter((board) => board.id !== found.id);
  // }
}
