import http from 'http';

http
  .createServer((req, res) => {
    console.log('url', req.url);
    console.log('cookie', req.headers.cookie);
    res.writeHead(200, { 'Set-Cookie': 'name=test; HttpOnly; Secure; Path=/; domain=.ljh305.shop; SameSite=None' });
    res.end('aaa');
  })
  .listen(3000);
