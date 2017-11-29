// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, function (session) {
    session.send("You said: %s", session.message.text);
});

/*
Pizza/Lunch order
*/

/** Reservation Block **/
function (session) {
    session.send("Welcome to the dinner reservation.");
    session.beginDialog('askForDateTime');
},
function (session, results) {
    session.dialogData.reservationDate = builder.EntityRecognizer.resolveTime([results.response]);
    session.beginDialog('askForPartySize');
},
function (session, results) {
    session.dialogData.partySize = results.response;
    session.beginDialog('askForReserverName');
},
function (session, results) {
    session.dialogData.reservationName = results.response;

    // Process request and display reservation details
    session.send(`Reservation confirmed. Reservation details: <br/>Date/Time: ${session.dialogData.reservationDate} <br/>Party size: ${session.dialogData.partySize} <br/>Reservation name: ${session.dialogData.reservationName}`);
    session.endDialog();
}


/** Default single order Item
bot.dialog('orderDinner', [
    function (session) {
        session.send("Lets order some food!");
        builder.Prompts.choice(session, "Menu:", menuOptions);
    },
    function (session, results) {
        if (results.response) {
            var order = menuOptions[results.response.entity];
            var msg = `You ordered: ${order.Description} for a total of $${order.Price}.`;
            session.dialogData.order = order;
            session.send(msg);
            builder.Prompts.text(session, "What is your address?");
        }
    },
    function (session, results) {
        if (results.response) {
            session.dialogData.address = results.response;
            var msg = `Thank you. Your order will be delivered to ${session.dialogData.address}`;
            session.endConversation(msg);
        }
    }
])
    .triggerAction({
        matches: /^order food/i,
        confirmPrompt: "This will cancel your order. Are you sure?"
    })
    .endConversationAction("endOrderDinner", "Ok. Goodbye.",
    {
        matches: /^cancel$|^goodbye$/i,
        confirmPrompt: "This will cancel your order. Are you sure?"
    });
*/