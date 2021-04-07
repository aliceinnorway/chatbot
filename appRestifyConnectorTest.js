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

bot.dialog('/', [
    function(session, args, next) {
        if(!session.userData.name) {
            session.beginDialog('/collect_name');
        } else {
            next();
        }
    },
    function(session, results) {
        session.send('Hi %s\r\n I am a newlyborn bot. I am still learning.',
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