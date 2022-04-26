# 버퍼와 스트림

버퍼: 일정한 크기로 모아두는 데이터 (한번에 처리)
버퍼링: 버퍼에 데이터가 찰 때까지 모으는 작업

```js
import fs from 'fs';

const fsP = fs.promises;

fsP
  .readFile('./readme.txt')
  .then(data => {
    console.log(data); // <Buffer ed 95 98 ec 9d b4>
    console.log(data.toString()); // 하이
  })
  .catch(err => {
    throw err;
  });
```

스트림: 데이터의흐름(버퍼(또는 청크)의 크기를 작게 여러번에 걸쳐 처리)
스트리밍: 일정한 크기의 데이터를 지속적으로 전달하는 작업