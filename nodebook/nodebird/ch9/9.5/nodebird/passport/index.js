const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');

module.exports = () => {
  // req.session 객체에 저장할 데이터설정(req.login시 실행)
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // req.session에 저장된 사용자 id로 DB조회 사용자 정보를 req.user에 저장
  // 모든 요청에 passport.session() 미들웨어가 passport.deserializeUser 메서드 호출
  passport.deserializeUser((id, done) => {
    User.findOne({
      where: { id },
      include: [{
        model: User,
        attributes: ['id', 'nick'],
        as: 'Followers',
      }, {
        model: User,
        attributes: ['id', 'nick'],
        as: 'Followings',
      }],
    })
      .then(user => done(null, user))
      .catch(err => done(err));
  });

  local(); // localStrategy 등록
  kakao();
};
