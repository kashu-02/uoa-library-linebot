import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import { Storage } from '@google-cloud/storage';

const storage = new Storage();

// イメージを処理する関数
export default (event, client) =>
  new Promise((resolve, reject) => {
    const sharpData = sharp().jpeg();
    const filename = uuidv4();
    const writefile = storage
      .bucket('uoa-library-search-by-image')
      .file(`${filename}.jpg`);
    // ファイルを保存する
    client.getMessageContent(event.message.id).then((stream) => {
      stream
        .pipe(sharpData)
        .pipe(writefile.createWriteStream())
        .on('finish', () => {
          // The file upload is complete
          console.log(`wrote: ${filename}.jpg`);
          resolve(`${filename}.jpg`);
        })
        .on('error', (e) => {
          console.log(`Error in thumb:\n ${e}`);
          reject(e);
        });
    });
  });
