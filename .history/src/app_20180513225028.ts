/// <reference path="../node_modules/botbuilder/lib/botbuilder.d.ts" />

import * as builder from 'botbuilder';
import * as restify from 'restify';

const connector = new builder.ChatConnector();//.listen();
//const connector = new builder.ChatConnector().listen();

const bot = new builder.UniversalBot(connector,(session)=>{
      session.send('you said %s', session.message.text);
});

const server =  restify.createServer();

server.listen(process.env.PORT||3978,()=>{
    console.log('hello world',server.name,process.env.PORT);
});

server.post('/api/messages',connector.listen());

// bot.dialog('/',[
//     (seesion)=>{
//         builder.Prompts.text(session,"Hi what is your name?");
//     },
//     (sess,results)=>{
//         sess.endDialog('hello ended');
//     }
// ])

