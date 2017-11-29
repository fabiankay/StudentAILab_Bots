var builder = require('botbuilder')

module.exports = [
    function (session) {
        session.send("You said: %s", session.message.text);
    }
]