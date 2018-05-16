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
const bot = new builder.UniversalBot(connector);

const server =  restify.createServer();

server.listen(process.env.PORT||3978,()=>{
    console.log('hello world',server.name,process.env.PORT);
});

server.post('/api/messages',connector.listen());

bot.dialog('/',[
    (sess, args, next)=>{
        if(!sess.userData.name) {
             sess.beginDialog('/profile');
        }else{
            next();
        }
    },
    (sess, result)=>{
              builder.Prompts.text(sess, `Hello ${sess.userData.name}! What is the code for the departure city?`);
    },
    (sess, result) => {
       sess.userData.departure= result.response;
       builder.Prompts.text(sess, "OKay, great! What is the code for the arrival city");
    },
    (sess, result) => {
        sess.userData.arrival  = result.response;
        const route: Route = amtrak.getTrainRoute(sess.userData.arrival, sess.userData.departure);

        if(route.toCode === undefined) {
            sess.replaceDialog('/noresults',{
                entry:'dialog'
            });
        } else{ 
            sess.userData.lastRoute = route;
            builder.Prompts.choice(sess, ` So you want to check the status of the train leaving 
            ${route.to} and arriving at ${route.from} correct?`, [
                "Yes",
                "No"
            ] )
        }
    },
    (sess, result) => {
           if(result.response.entity==="Yes"){
               const route = sess.userData.lastRoute;
               sess.send(`The current status of the train from ${route.from} to ${route.to} is ${route.status}` );
           }else{
                sess .replaceDialog("/");
           }
    }
])

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

