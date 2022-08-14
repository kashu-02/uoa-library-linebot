import { Storage } from '@google-cloud/storage';
import axios from 'axios';

const storage = new Storage();

export default async (googleThumbnailLink, ISBN_13) =>
  new Promise((resolve) => {
    const writefile = storage
      .bucket('uoa-library-search-bookcover')
      .file(`${ISBN_13}.jpg`);
    axios
      .get(googleThumbnailLink, {
        responseType: 'stream',
      })
      .then((response) => {
        console.log(`responsed`);
        response.data
          .pipe(writefile.createWriteStream())
          .on('finish', () => {
            // The file upload is complete
            console.log(`wrote`);
            resolve(
              `https://storage.googleapis.com/uoa-library-search-bookcover/${ISBN_13}.jpg`
            );
          })
          .on('error', (e) => {
            console.log(`Error in thumb:\n ${e}`);
            resolve('');
          });
      })
      .catch(() => {
        resolve('');
      });
  });
