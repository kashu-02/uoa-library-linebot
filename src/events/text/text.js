import searchBooks from '../lib/searchbooks.js';

export default async (event) => {
  let message;
  // メッセージタイプごとの条件分岐
  switch (event.message.text) {
    case '蔵書検索': {
      break;
    }
    default: {
      const searchedresult = await searchBooks(event.message.text);
      const contents = [];
      if (searchedresult === 'No books.') {
        return {
          type: 'text',
          text: 'No books.',
        };
      }
      searchedresult.items.forEach((element) => {
        contents.push({
          type: 'bubble',
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'image',
                url:
                  element.thumbnailLink ||
                  'https://via.placeholder.com/500x500.png?text=No+image',
                // url: 'https://via.placeholder.com/278x50.png?text=No+image',
                size: 'xxl',
              },
              {
                type: 'text',
                text: element.title,
                align: 'center',
                size: 'xl',
                weight: 'bold',
                wrap: true,
                margin: 'lg',
              },
              {
                type: 'text',
                text: element.description || ' ',
                wrap: true,
                margin: 'md',
                maxLines: 5,
              },
              {
                type: 'text',
                text: `著者: ${element.authors || '不明'}`,
                size: 'xs',
                wrap: false,
                margin: 'md',
                color: '#808080',
              },
              {
                type: 'text',
                text: `出版: ${element.publisher || '不明'}`,
                color: '#808080',
                size: 'xs',
                wrap: false,
              },
              {
                type: 'text',
                text: `ISBN: ${element.ISBN_13}`,
                color: '#808080',
                size: 'xs',
                wrap: false,
                align: 'start',
                position: 'relative',
                adjustMode: 'shrink-to-fit',
              },
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  {
                    type: 'text',
                    text: `ページ数:${element.pageCount || '不明'}p`,
                    color: '#808080',
                    size: 'xs',
                    wrap: false,
                    position: 'relative',
                    align: 'start',
                  },
                  {
                    type: 'text',
                    text: `出版日:${element.publishedDate || '不明'}`,
                    color: '#808080',
                    size: 'xs',
                    wrap: false,
                    align: 'start',
                    position: 'relative',
                  },
                ],
                spacing: 'none',
              },
            ],
            action: {
              type: 'postback',
              label: '選択',
              displayText: element.title,
              data: JSON.stringify({
                type: 'collectionInfo',
                ISBN_13: element.ISBN_13,
                title: element.title,
              }),
            },
          },
          footer: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'button',
                action: {
                  type: 'postback',
                  label: '選択',
                  displayText: element.title,
                  data: JSON.stringify({
                    type: 'collectionInfo',
                    ISBN_13: element.ISBN_13,
                    title: element.title,
                  }),
                },
                style: 'link',
              },
            ],
          },
        });
      }); // End of forEach

      if (!searchedresult.isEnd) {
        // If
        contents.push({
          type: 'bubble',
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'button',
                action: {
                  type: 'postback',
                  label: '次のページ',
                  displayText: '次のページ',
                  data: JSON.stringify({
                    type: 'searchDetailNextPage',
                    index: 0,
                    words: event.message.text,
                  }),
                },
              },
            ],
            justifyContent: 'center',
            alignItems: 'center',
            action: {
              type: 'postback',
              label: '次のページ',
              displayText: '次のページ',
              data: JSON.stringify({
                type: 'searchDetailNextPage',
                index: 0,
                words: event.message.text,
              }),
            },
          },
        });
      }
      console.log(`\n\n\ncontents: \n${JSON.stringify(contents)}\n\n\n\n`);
      message = {
        type: 'flex',
        altText: '検索結果',
        contents: {
          type: 'carousel',
          contents,
        },
      };
      break;
    }
  }
  return message;
};
