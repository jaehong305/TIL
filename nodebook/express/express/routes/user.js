import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hi, User');
});

export default router;
