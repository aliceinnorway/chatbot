var builder = require('botbuilder');
var restify = require('restify');

var server = restify.createServer();
    server.listen(process.env.port || process.env.PORT || 6530, function() {
        console.log('%s listening', server.name);
    });

//appID and appPassword will be relevant for deployment

var connector = new builder.ChatConnector ({
    appID : '',
    appPassword : ''
});

    server.post('/api/messages', connector.listen());

    var inMemoryStorage = new builder.MemoryBotStorage();
    var bot = new builder.UniversalBot(connector).set('storage', inMemoryStorage);

// Intent Initalisation

var intents = new builder.IntentDialog(); 
bot.dialog('/', intents); // root dialogue

intents.onDefault([
    function (session, args, next) {
        if (!session.userData.name) {
            session.beginDialog('/collect_name');
        } else {
            next(); // go to next dialog
        }
    },

    function (session, results) {
        session.send('Hi %s\r\n I am a newborn bot. I am still learning', session.userData.name);
    }
]);

intents.matches(/^change name/i, [
    function (session) {
        session.beginDialog('/collect_name'); 
    },

    function (session, results) {
        session.send('Ok, I have updated your name to %s', session.userData.name);
    }
])

bot.dialog('/collect_name', [
    function(session) {
        builder.Prompts.text(session, 'Hi, Who am I interacting with? What is your name?');
    },
    function(session, results) {
        session.userData.name = results.response;
        session.endDialog();
    }
])