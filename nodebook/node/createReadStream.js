import fs from 'fs';

const data = [];
fs.createReadStream('./readme2.txt', { highWaterMark: 64 }) // 기본 64KB(64000byte)씩 처리 => 64byte로 변경
  .on('data', chunk => {
    data.push(chunk); // 일정 크기로 넘어오는 데이터를 배열에 담아준다.
    console.log('data: ', chunk, chunk.length);
  })
  .on('end', () => {
    // 끝나면 실행되는 이벤트리스너
    console.log('end: ', Buffer.concat(data).toString());
  })
  .on('error', err => {
    console.log('error: ', err);
  });

const writeStream = fs
  .createWriteStream('./writeme2.txt')
  .on('finish', () => {
    console.log('파일 쓰기 완료');
  })
  .on('error', err => {
    console.log('error: ', err);
  });
writeStream.write('글을 씁니다.\n'); // 버퍼단위로 나눠 쓰기 (메모리 효율적 사용)
writeStream.write('2222222222222');
writeStream.end();
