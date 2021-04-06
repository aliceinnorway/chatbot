var builder = require('botbuilder');
//console listener
var connector = new builder.ConsoleConnector().listen();
var bot = new builder.UniversalBot(connector);
//listens to all inputs at root level

bot.dialog('/', [
    function(session) {
        builder.Prompts.text(session, 'Hi, Who am I interacting with? What is your name?');
    },
    function(session, results) {
        session.send('Hi %s\r\n I am a newly born bot. I am still learning', results.response);
    }
]);