let restify = require('restify');
let builder = require('botbuilder');
const crypto = require('crypto');

const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 6530, function() {
    console.log('%s listening', server.name)
});

// appID and appPassword will be relevant for deployment

const connector = new builder.ChatConnector({
    appId : '',
    appPassword : ''
});
server.post('/api/messages'), connector.listen();

const inMemoryStorage = new builder.MemoryBotStorage();
const bot = new builder.UniversalBot(connector).set('storage', inMemoryStorage);

// intent initialisation

let intents = new builder.IntentDialog();
bot.dialog('/', intents); // root dialog

intents.onDefault(
    function (session) {
        session.send('Hi, I am your student helper. Let us see if I can make your day.');
        session.beginDialog('/studentmenu');
    }
);

bot.dialog('/studentmenu', [
    function (session) {
        builder.Prompts.choice(session, 'Choose an option', 'Enrold student | Prospective student | Quit');
    },

    function (session, results) {
        switch(results.response.index) {
            case 0:
                session.send('You have chosen an enrolled student type. Here are your options.');
                session.beginDialog('/enrolledmenu');
                break;
            case 1:
                session.send('You have chosen a prospective student type. Here are your options.');
                session.beginDialog('/prospectivemenu');
                break;
            default:
                session.send('Goodbye. Have a nice day.');
                session.endDialog();
                break;
        }
    }
]);

bot.dialog('/enrolledmenu', [
    function (session) {
        builder.Prompts.choice(session, 'Choose an option', 'Introduce yourself | Show other options | Quit');
    },

    function (session, results) {
        switch(results.response.index) {
            case 0:
                session.beginDialog('/introducestudent');
                break;
            case 1:
                session.beginDialog('/prospectivemenu');
                break;
            default:
                session.send('Goodbye. Have a nice day');
                session.endDialog();
                break;
        }
    }
])

bot.dialog('/prospectivemenu', [
    function (session) {
        builder.Prompts.choice(session, 'Choose an option', 'Show News | Show all courses | Quit');
    },

    function (session, results) {
        switch(results.response.index) {
            case 0:
                session.beginDialog('/news');
                break;
            case 1:
                session.beginDialog('/allcourses');
                break;
            default:
                session.send('Goodbye. Have a nice day');
                session.endDialog();
                break;
        }
    }
])

bot.dialog('/knownstudent', [
    function (session) {
        builder.Prompts.choice(session, 'Choose an option', 'Show my courses | Show my free days next week | Quit');
    },

    function (session, results) {
        switch(results.response.index) {
            case 0:
                session.beginDialog('/studentcourses');
                break;
            case 1:
                session.beginDialog('/nextweekfreedays');
                break;
            default:
                session.send('Goodbye. Have a nice day');
                session.endDialog();
                break;
        }
    }
])

bot.dialog('/introducestudent', [
    function(session) {
        builder.Prompts.text(session, 'What is your student id?');
    },

    function (session, result) {
        session.userData.studentId = results.response;
        let studentData = data.find(x => x.studentId == parseInt(session.userData.studentId));
        // find student using id
        session.send('Hi %s, Thank you for introducing yourself.', studentData.name);
        session.send('I can see that you are studying in %s student program.', studentData.program);
        session.send("How can you I help you?");
        session.beginDialog('/knownstudent;');
    }
]);

// data for test

let data = [
    {
        studentid : 1001,
        name : 'Abid Hussain', 
        program : 'Computer Science', 
        courses : [

            {
                courseid: 'CS654',
                coursename: 'Introduction to Programming',
                credithours: 7.5
            },
            
            {
                courseid: 'CS081',
                coursename: 'Database Management',
                credithours: 7.5
            },

            {
                courseid: 'CS943',
                coursename: 'System Design',
                credithours: 7.5
            }
    ] },
    
    {
        studentid : 1002,
        name : 'Adam Duke',
        program : 'Computer Science',
        courses : [
            {
                courseid: 'CS666',
                coursename: 'Web Security',
                credithours: 5.0
            },
            {
                courseid: 'CS832',
                coursename: 'Web API Dev',
                credithours: 7.5
            },
        {
            courseid: 'CS777',
            coursename: 'Network Design',
            credithours: 7.5
        }
    ] }

]