import isExistonUoA from "../lib/isExistonUoA.js"

export default async (data, client) => {

  const collection = await isExistonUoA(data.ISBN_13);
  console.log(`aaaa: ${JSON.stringify(collection)}`);

  if (collection.length == 0 || !collection) {
    return {
      type: 'text',
      text: '蔵書が見つかりませんでした。',
    };
  }

  const contents = [];
  collection.forEach(element => {
    let color;
    let status;
    if (element.condition == "available") {
      color = "#7cfc00";
      status = "貸出可";
    } else if (element.condition == "on-loan") {
      color = "#dc143c";
      status = "貸出中";
    } else if (element.condition == "reference-only") {
      color = "#c0c0c0";
      status = "貸出不可(館内のみ)";
    }
    contents.push({
      type: "box",
      layout: "horizontal",
      contents: [
        {
          type: "text",
          text: element.volume || ' ', 
          align: "center",
          adjustMode: "shrink-to-fit",
          wrap: true
        },
        {
          type: "text",
          text: element.location || '',
          align: "center",
          adjustMode: "shrink-to-fit",
          wrap: true
        },
        {
          type: "text",
          text: element.requestNumber || '',
          align: "center",
          adjustMode: "shrink-to-fit",
          wrap: true
        },
        {
          type: "text",
          text: status,
          align: "center",
          adjustMode: "shrink-to-fit",
          wrap: true,
          color: color
        }
      ]
    })
  });

  return {
    type: "flex",
      altText: "検索結果",
      contents: {
        type: "bubble",
        size: "giga",
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: data.title,
              weight: "bold",
              size: "xl",
              align: "center",
              offsetBottom: "none"
            },
            {
              type: "separator",
              margin: "lg"
            },
            {
              type: "box",
              layout: "vertical",
              contents,
              paddingStart: "none",
              paddingTop: "xl"
            }
          ],
        }
      }
  }
}