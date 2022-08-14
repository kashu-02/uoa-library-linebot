import textEvent from './text/text.js';
import imageEvent from './image/image.js';

// メッセージイベントが飛んできた時に呼び出される
export default async (event, client) => {
  let message;
  // メッセージタイプごとの条件分岐
  switch (event.message.type) {
    case 'text': {
      // テキストの場合はtextEventを呼び出す
      // 実行結果をmessageに格納する
      message = await textEvent(event, client);
      break;
    }
    case 'image': {
      // イメージの場合はimageEventを呼び出す
      message = await imageEvent(event, client);
      // 実行結果をmessageに格納する

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
