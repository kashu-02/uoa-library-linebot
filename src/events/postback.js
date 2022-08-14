import searchDetailNextPage from './postback/searchDetailNextPage.js';
import collectionInfo from './postback/collectionInfo.js';

// Postbackイベントが飛んできた時に呼び出される
export default async (event, client) => {
  let message;
  const data = JSON.parse(event.postback.data);
  switch (data.type) {
    case 'searchDetailNextPage': {
      console.log(`Postback`);
      message = await searchDetailNextPage(data, client);
      break;
    }
    case 'collectionInfo': {
      message = await collectionInfo(data, client);
      break;
    }
    case 'image': {
      // イメージの場合はimageEventを呼び出す
      // 実行結果をmessageに格納する
      message = {
        type: 'text',
        text: 'Got Image',
      };
      break;
    }
    // それ以外の場合
    default: {
      // 返信するメッセージを作成
      message = {
        type: 'text',
        text: 'そのイベントには対応していません...',
      };
      break;
    }
  }
  // 関数の呼び出し元（bot.jsのindex）に返信するメッセージを返す
  return message;
};
