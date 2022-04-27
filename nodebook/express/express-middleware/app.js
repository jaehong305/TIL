import dotenv from 'dotenv';
dotenv.config(); // 상단에 위치해 아래 모듈들에서 env를 쓸경우 대비해주는게 좋다.
import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set('port', process.env.PORT || 3000);

app.use(morgan('dev')); // 요청/응답 기록 해주는 미들웨어(로그에 찍힘) 배포시엔 'combined'를 쓰면 ip등 상세하게 정보가 뜸. // next()는 모건에서 내부적으로 해줌
// app.use('/', express.static(path.join(__dirname, 'public305'))); // 라우터에 없는 정적파일들 요청시 지정폴더 경로로가서 해당파일 보내줌 // 실제 파일이 있다면 next()하지않고 끝남 // 없다면 next() 라우터들까지 찾고 해당 API가 없다면 404

app.use(
  session({
    // 세션 쿠키가 없으면 서버에서 세션 객체를 만들고 세션 객체의 고유아이디값을 세션쿠키로 보내준다. // 세션 쿠키가 있다면 값으로 세션객체에서 키를 찾아 데이터를 req.session req.user에 담아넘겨준다.
    resave: false, // 요청이 왔을 때 세션에 수정사항이 생기지 않아도 다시 저장할지 여부 => true : 무조건 새로 저장해 여러 서버에서 분산 요청받을시 각자 다른 세션값을 저장해 문제 생길수 있음.
    saveUninitialized: false, // 세션에 저장할 내역이 없더라도 세션을 저장할지 여부 => false : 세션에 저장할 내역이 있어야 저장하고 쿠키를 보낸다.
    secret: process.env.COOKIE_SECRET, // 쿠키 암호화
    cookie: {
      // 세션 쿠키 옵션
      httpOnly: true,
      secure: false,
    },
    name: 'session-cookie', // 쿠키의 키값
  })
);

app.use('/', (req, res, next) => {
  console.log(req.session.id); // 요청한 사용자의 고유한 세션ID가 저장됨
  console.log('세션이름', req.session.name);
  // 로그인시에만 정적파일 주고싶을때 예시
  if (req.session.name) {
    express.static(path.join(__dirname, 'public305'))(req, res, next); // 미들웨어 확장법(미들웨어 안에 미들웨어 넣는 방법) - 익스프레스가 자동으로 콜백해주지 않으므로 (req, res, next)를 붙여 호출한다.
  } else {
    next();
  }
});

app.use(cookieParser(process.env.COOKIE_SECRET)); // 인수에 비밀키를 넣어 쿠키 뒤에 서명을 붙여(암호화) 내 서버가 만든 쿠키임을 검증가능
// 쿠키가 객체로 파싱되어있게 해주며(req.cookies / req.signedCookies - 암호화된 쿠키)
// 쿠키 관련 조작들을 좀 더 편리하게 해준다.
// res.cookie('키', encodeURIComponent('값'), { // 쿠키 담기
//  expires: new Date(),
//  httpOnly: true,
//  path: '/'
// })
// res.clearCookie('키', encodeURIComponent('값'), { // 쿠키 지우기 - expires/maxAge를 제외한 옵션들이 일치해야함
//   httpOnly: true,
//   path: '/'
//  })

app.use(express.json()); // post,put,patch 요청시에 json 데이터를 req.body로 파싱해서 넣어줌
app.use(express.urlencoded({ extended: true })); // form submit시 파싱해줌 // extended(쿼리스트링 처리여부) : true면 qs모듈 false면 querystring모듈로 처리

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}
const upload = multer({
  // multer로 폼(enctype="multipart/form-data")에서 파일(이미지등)들을 받기 위해 함수를 실행하여 미들웨어를 받아옴
  // 어디에 저장할지 설정(디스크, 메모리, 구글스토리지 등)
  storage: multer.diskStorage({
    // 어디에 업로드할지(저장폴더)
    destination(req, file, done) {
      done(null, 'uploads/');
    },
    // 어떤 이름으로 저장할지
    filename(req, file, done) {
      const ext = path.extname(file.originalname); // 확장자 추출
      done(null, path.basename(file.originalname, ext) + Date.now() + ext); // 파일 이름에 현재시각 붙이기
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB 제한
});

app.get('/upload', (req, res) => {
  res.sendFile(path.join(__dirname, 'multipart.html'));
});
// 한개의 파일만 업로드
app.post('/upload', upload.single('image'), (req, res) => {
  console.log(req.file);
  res.redirect('http://localhost:3025/upload');
});
// 하나의 요청 body이름 아래 여러 파일이 있는 경우(multiple)
app.post('/uploads', upload.array('image'), (req, res) => {
  console.log(req.files);
  console.log(req.body.title);
  res.redirect('http://localhost:3025/upload');
});
// 여러개의 요청 body이름 아래 파일들이 있는 경우
app.post(
  '/uploadf',
  upload.fields([
    { name: 'image1', maxCount: 2 },
    { name: 'image2', maxCount: 1 },
  ]),
  (req, res) => {
    console.log('이미지1', req.files.image1);
    console.log('이미지2', req.files.image2);
    console.log(req.body.title);
    res.redirect('http://localhost:3025/upload');
  }
);

app.use((req, res, next) => {
  req.data = '요청 한번동안 일회성 데이터전달 가능';
  next();
});

app.get(
  '/',
  (req, res, next) => {
    console.log(req.data);
    next('route');
  },
  (req, res) => {
    throw new Error('에러는 에러 처리 미들웨어로 갑니다.');
  }
);
app.get('/', (req, res) => {
  req.session.name = '세션 등록용 테스트!!'; // name이 아니라 어떤 값으로 등록해도 상관없다. 고유 아이디를 가진 세션객체의 속성명과 값으로 등록된다.
  console.log('세션아이디', req.sessionID); // 세션 아이디 확인
  // req.session.destroy(); // 세션 모두 제거
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.use((req, res, next) => {
  res.status(404).send('404 Page Not Found');
});
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중');
});
