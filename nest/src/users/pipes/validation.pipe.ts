import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

// 기본제공해주는 ValidationPipe를 커스텀파이프처럼 직접 구현해보기
@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    // 인자로 전달된 값의 메타데이터의 메타타입이 파이프가 지원하는 타입인지 검사
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    // 네트워크 요청을 통해 들어온 데이터는 역직렬화 과정에서 본문의 객체가 타입정보를 잃어버리기에 유효성검사불가능, plainToClass로 순수 자바스크립트객체를 타입을 가진 클래스의 객체로 변환
    const object = plainToClass(metatype, value);
    const errors = await validate(object); // 유효성 검사
    if (errors.length > 0) {
      throw new BadRequestException('유효성 검사 실패');
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
