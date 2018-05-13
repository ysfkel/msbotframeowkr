/// <reference path="../node_modules/botbuilder/lib/botbuilder.d.ts" />

import * as builder from 'botbuilder';
import * as  restify from 'restify';
import * as dotenv from 'dotenv';
dotenv.config();

const connector = new builder.ChatConnector();//.listen();

// const bot = new builder.UniversalBot(connector,(session)=>{
//       session.send('you said %s', session.message.text);
// });
const bot = new builder.UniversalBot(connector);

const server =  restify.createServer();

server.listen(process.env.PORT||3978,()=>{
    console.log('hello world',server.name,process.env.PORT);
});

server.post('/api/messages',connector.listen());

