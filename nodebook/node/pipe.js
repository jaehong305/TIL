import fs from 'fs';

fs.createReadStream('./readme2.txt', { highWaterMark: 64 }).pipe(fs.createWriteStream('./writeme3.txt'));
