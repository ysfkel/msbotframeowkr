const builder = require('botbuilder');
const restify =require('restify');
require('dotenv').config();

const connector = new builder.ConsoleConnector().listen();
//const connector = new builder.ChatConnector().listen();

const bot = new builder.UniversalBot(connector,(session)=>{
      session.send('you said %s', session.message.text);
});

const server =  restify.createServer();

server.listen(process.env.PORT||3978,()=>{
    console.log('hello world',server.name);
});

bot.dialog('greetings',[
    (seesion)=>{
        builder.Prompts.text(session,"Hi what is your name?");
    }
])
