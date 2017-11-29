var builder = require('botbuilder');

var DialogLabels = {
    Food: 'Order Food',
    Table: 'Reserve Table'
};

module.exports = [
    function (session) {
        // prompt for option
        builder.Prompts.choice(
            session,
            'Hi, are you looking for a table or food?',
            [DialogLabels.Table, DialogLabels.Food],
            {
                maxRetries: 3,
                retryPrompt: 'Not a valid option. Please select:',
                listStyle: builder.ListStyle.button 
            });
    },
    function (session, result) {
        var selection = result.response.entity;
        switch (selection) {
            case DialogLabels.Food:
                return session.beginDialog('orderFood');
            case DialogLabels.Table:
                return session.beginDialog('reserveTable');
        }
    }
]