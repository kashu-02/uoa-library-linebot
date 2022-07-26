import axios from 'axios'
import moment from 'moment'
moment.locale = 'ja'
import getThumbnailLink from './getThumbnailLink.js'

export default async (searchWord,searchIndex) => {
  
  const { data } = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchWord)}&maxResults=4&startIndex=${searchIndex || 0}&fields=totalItems,items(volumeInfo,saleInfo/isEbook)`);
 
  if (!data || data.totalItems === 0) { //If google API returns empty (= not hit).
    return ("No books.");
  }
  console.log(`totalitem: ${data.totalItems}\n\n`)
  console.log(`datas: ${JSON.stringify(data)}`)
  let isEnd = false;
  if (data.totalItems == searchIndex - 4) { //The provided information 
    isEnd = true;
  }

  const filtered = data.items.filter((item) => { //Filter books which are NOT Ebook and have ISBN-13 number.
    if (!item.saleInfo || !item.volumeInfo || !item.volumeInfo.industryIdentifiers) {
      return false;
    }
    return item.saleInfo.isEbook === false && item.volumeInfo.industryIdentifiers.some(element => element.type === 'ISBN_13');
  })

  const result = await Promise.all(filtered.map(async (element, index) => {
    console.log(`map: ${index}`)
    let author;
    if (!element.volumeInfo?.authors) { //If authors info is not served
      author = '';
    } else if (element.volumeInfo.authors.length >= 2) { //If there are two or more authors,
      author = element.volumeInfo.authors.join(', '); //Join the array with comma
    } else {
      author = element.volumeInfo.authors[0];
    }
    const ISBN_13 = element.volumeInfo.industryIdentifiers.find(element => element.type === 'ISBN_13').identifier;
    return {
      title: element.volumeInfo.title,
      authors: author,
      publisher: element.volumeInfo?.publisher || '',
      publishedDate: element.volumeInfo?.publishedDate || '',
      description: element.volumeInfo?.description || '',
      ISBN_13: ISBN_13,
      pageCount: element.volumeInfo?.pageCount || '',
      thumbnailLink: element.volumeInfo?.imageLinks?.thumbnail ? await getThumbnailLink(element.volumeInfo.imageLinks.thumbnail, ISBN_13) : '',
      language: element.volumeInfo?.language || '',
    }
  }));
  console.log(`\n\n\nsearched: ${JSON.stringify(result)}\n\n\n`)
  return ({
    isEnd: isEnd,
    items: result
  })

  }
