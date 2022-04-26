import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // CommonJS가 아닌 module을 사용할경우 ES모듈에는 __dirname 변수가 없어 만들어줘야 한다.

const app = express();
app.set('port', process.env.PORT || 3000); // 전역객체처럼 값을 담았다가 app.get('port')으로 쓸 수 있다.
app.use((req, res, next) => {
  console.log('미들웨어(콜백함수)는 모든 요청에 다 실행되어 공통으로 실행할 것들의 중복을 제거해줍니다.');
  next(); // 미들웨어 실행후 다음(요청된 라우터) 실행해줘야 함, 라우터에서는 보통 send로 끝내주어 next()해주지 않아 생략됨.
});

app.use(
  '/about',
  (req, res, next) => {
    console.log('미들웨어(콜백함수)를 어바웃 요청에서만 실행');
    next();
  },
  (req, res, next) => {
    console.log('미들웨어(콜백함수)를 어바웃 요청에서만 두번째실행');
    next();
  }
);

// 위에서부터 아래로 실행되며 해당되는 라우터만 실행한다.
app.get('/', (req, res) => {
  // res.send('hello'); // send()는 두번씩 할 수 없음(return으로 함수가 종료되는건 아님). Cannot set headers after they are sent to the client
  // res.json({ hi: 'hello' }); // json()/render()도 마찬가지 // res.setHeader('Content-Type', 'text/plain') 또한 뒤에 올수 없다.
  res.sendFile(path.join(__dirname, 'index.html')); // 환경마다 다른 경로 \ / 를 통일하기 위해 현재 디렉토리와 파일을 조인
});

// 라우트 파라미터(와일드 카드처럼 어떤 이름도 가능. 밑에 /category/js 등이 있어도 실행안되기에 아래에 있어야한다.)
app.get(
  '/category/:name',
  (req, res, next) => {
    // next()에 인수로 'route'를 넣어주면 다음 미들웨어들을 건너뛰고 다음 라우터로 넘어감.
    +req.params.name ? next() : next('route');
  },
  (req, res, next) => {
    try {
      throw new Error('에러발생!');
    } catch (error) {
      next(error); // next()에 인수가 있으면 에러처리 미들웨어로 넘어감.
    }
  }
);

app.get('/category/:name', (req, res) => {
  res.send(`${req.params.name}`);
});

app.get('/category', (req, res) => {
  res.send('category!');
});

// app.get('*', (req, res) => {
//   res.send('모든 요청 처리, 최하단 위치');
// });

// express에서 제공해주는 에러처리 대신 처리
app.use((req, res, next) => {
  res.status(404).send('404 Page Not Found');
});

// 에러처리 미들웨어
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
});

app.listen(app.get('port'), () => {
  console.log('익스프레스 서버 실행');
});
