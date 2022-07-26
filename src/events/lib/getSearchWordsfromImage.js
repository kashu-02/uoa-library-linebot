import vision from '@google-cloud/vision'
const gclient = new vision.ImageAnnotatorClient();

export default async (fileName) => {
  const [result] = await gclient.textDetection(`gs://uoa-library-search-by-image/${fileName}`);
  const detections = result.textAnnotations;
  console.log('Text:');

  let searchtext = '';
  detections.forEach((detection) => {
    searchtext += `${detection.description} `
  });
  searchtext = searchtext.replace(/\r?\n/g, ' ');
  searchtext = searchtext.replace(/[\.]*/g, '');
 // searchtext = searchtext.slice(0, 30);
  console.log(`searchedtext: ${searchtext}`)

  return searchtext
}