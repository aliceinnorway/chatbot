var builder = require('botbuilder');
var connector = new builder.ConsoleConnector().listen();
var bot = new builder.UniversalBot(connector);

bot.dialog('/', [
    function(session, args, next) {
        if(!session.userData.name) {
            session.beginDialog('/collect_name');
        }
        else {
            next();
        }
    },
    function(session, results) {
        session.send('Hi %s\r\n I am a newlyborn bot. I am still learning',
        session.userData.name);
    }
]);

bot.dialog('/collect_name', [
    function(session) {
        builder.Prompts.text(session, 'Hi, Who am I interacting with? What is your name?');
    },
    function(session, results) {
        session.userData.name = results.response;
        session.endDialog();
    }
])

