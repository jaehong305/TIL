import { promises as fs } from 'fs';

fs.readFile('./readme.txt')
  .then(data => {
    console.log(data); // <Buffer ed 95 98 ec 9d b4>
    console.log(data.toString()); // 하이
  })
  .catch(err => {
    throw err;
  });

fs.writeFile('./writeme.txt', '내용입니다.')
  .then(() => {
    return fs.readFile('./writeme.txt');
  })
  .then(data => {
    console.log(data.toString()); // 내용입니다.
  })
  .catch(err => {
    throw err;
  });
