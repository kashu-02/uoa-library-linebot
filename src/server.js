// モジュールの読み込み
import express from 'express';
import { middleware } from '@line/bot-sdk';
import 'dotenv/config';

// ファイルの読み込み
import  webhook  from './bot.js';

const PORT = process.env.PORT || 3000;
const app = express();

// /にGETするとHello World!
app.get('/', (req, res) => { res.send('Hello World!'); });

// /webhookにアクセスがあったとき、bot.jsのindexを呼び出す
app.post('/webhook', middleware({
  channelSecret: process.env.channelSecret,
}), webhook);

app.listen(PORT);
console.log(`Server running at ${PORT}`);