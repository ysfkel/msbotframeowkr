/// <reference path="../node_modules/botbuilder/lib/botbuilder.d.ts" />
/// <reference path="../amtrak/dist/amtrak.d.ts" />

import * as builder from 'botbuilder';
import * as  restify from 'restify';
import * as dotenv from 'dotenv';
import * as amtrak from '../amtrak/dist/amtrak';
import { Route } from '../base/dist/types';
dotenv.config();

const connector = new builder.ChatConnector();//.listen();
// const bot = new builder.UniversalBot(connector,(session)=>{
//       session.send('you said %s', session.message.text);
// });
const server =  restify.createServer();
server.listen(process.env.PORT||3978,()=>{
    console.log('hello world',server.name,process.env.PORT);
});
server.post('/api/messages',connector.listen());

const bot = new builder.UniversalBot(connector);

const intents = new builder.IntentDialog();

intents.onDefault([
    (sess, args, next) => {
         sess.userData.arrival = undefined;
         sess.userData.departure = undefined;

         if(!sess.userData.name) {
             sess.beginDialog('/profile');
         }else{
              next();
         }
    },
    (sess, result) => {
        sess.send(`Hello ${sess.userData.name} how may I help you?`);
    }
]);

bot.dialog('/',intents);

bot.dialog('/profile', [
      (sess, args, next) => {
           builder.Prompts.text(sess,"Hello, what is your name?");
      },
      (sess, result) => {
          sess.userData.name = result.response;
          sess.endDialog();
      }
]);

bot.dialog('/noresults', [
    (sess, args,  next)=> {
      if(args && args.entry === 'dialog') {
         builder.Prompts.choice(sess, ` Sorry, no results were found, would you like to try again? `, [
             "Yes", "No"
         ]);
        }else{
            sess.send("Oh! hey! You're back! Lets start this all over.");
            sess.replaceDialog('/');
        }
    },
    (sess, result) => {

         if(result.response.entity==='Yes'){
              sess.replaceDialog('/');
         }else {
              sess.send('Okay, bye');
         }
    }
])

