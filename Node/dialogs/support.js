var builder = require('botbuilder')

module.exports = [
    function (session) {
        session.endDialog("Sorry - I can't help you right now"); // important to provide "endDialog" to remove "help" from the stack
    }
]