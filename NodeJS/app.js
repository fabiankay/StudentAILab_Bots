var builder = require('botbuilder'); // Framework to handle Bot Interactions
var restify = require('restify'); // To create an API endpoint

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Root Dialog - Initialize the bot
var bot = new builder.UniversalBot(connector, require('./dialogs/root_choice'));

/*
* Dialogs
*/

// Dialog to order food
bot.dialog('orderFood', require('./dialogs/order'))
    .triggerAction({
        matches: /^order food/i,
        confirmPrompt: "This will cancel your current request. Are you sure?"
    })
    .endConversationAction("endOrderDinner", "Ok. Goodbye.", {
        matches: /^cancel$|^goodbye$/i,
        confirmPrompt: "This will cancel your order. Are you sure?"
    })
    .beginDialogAction('orderFoodHelpAction', 'orderFoodHelp', { matches: /^help$/i })

// Context Help To order food
bot.dialog('orderFoodHelp', function (session, args, next) {
    var msg = "To order a meal, please enter the respective number ('1' for Margherita).";
    session.endDialog(msg);
});

//Dialog to reserve a table
bot.dialog('reserveTable', require('./dialogs/reserve'))
    .triggerAction({
        matches: /^reserve table$/i,
        confirmPrompt: "This will cancel your current request. Are you sure?"
    })
    .endConversationAction("endOrderDinner", "Ok. Goodbye.", {
        matches: /^cancel$|^goodbye$/i,
        confirmPrompt: "This will cancel your order. Are you sure?"
    });

// Global Help menu
bot.dialog('support', require('./dialogs/support'))
    .triggerAction({
        matches: [/help/i, /support/i, /problem/i],
        onSelectAction: (session, args, next) => {
            // Add the help dialog to the dialog stack 
            // (override the default behavior of replacing the stack)
            session.beginDialog(args.action, args);
        }
    })

/*
* Helper Dialogs
*/

// Dialog to ask for a date and time
bot.dialog('askForDateTime', [
    function (session) {
        builder.Prompts.time(session, "Please provide a reservation date and time (e.g.: June 6th at 5pm)");
    },
    function (session, results) {
        session.endDialogWithResult(results); //removes 'askForDateTime' from the stack and returns result
    }
]);

// Dialog to ask for number of people in the party
bot.dialog('askForPartySize', [
    function (session) {
        builder.Prompts.text(session, "How many people are in your party?");
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
]);

// Dialog to ask for the reservation name.
bot.dialog('askForReserverName', [
    function (session) {
        builder.Prompts.text(session, "Who's name will this reservation be under?");
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
]);