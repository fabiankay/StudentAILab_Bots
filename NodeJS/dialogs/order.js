var builder = require('botbuilder')

// Menu Options
var menuOptions = {
    "Margherita - $5.99": {
        Description: "Pizza Margherita",
        Price: 5.99
    },
    "Tuna - $6.99": {
        Description: "Pizza Tuna",
        Price: 6.99
    },
    "Vegetarian - $7.49": {
        Description: "Vegetarian Pizza",
        Price: 7.49
    },
};

module.exports = [
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
]