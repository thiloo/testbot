if (!process.env.token) {
    process.exit(1);
}

const Botkit = require('botkit');
const axios = require('axios');

const controller = Botkit.slackbot({debug: true});

controller.spawn({token: process.env.token}).startRTM();


controller.on('direct_mention', (bot, message) => {
    const text = message.text;

// --------------------------------------------------------------------------------------
// Take students attendance

    if(text.includes('attendance')) {
        const query = text.split(' ');

        let score = query.filter(item => {
            return !isNaN(item);
        });

        if(score.length != 1) {
            return bot.reply(message, 'Please include one score only');
        }

        score = score.pop();
        console.log(score);

        let students = query.filter(item => {
            return item.includes('<@');
        });

        if(students.length == 0) {
            return bot.reply(message, 'Please include at least one student');
        }

        axios.post(`http://3bbd8974.ngrok.io/slack/attendance/${score}`, {score, students})
            .then(() => bot.reply(message, 'I took their attendance'))
            .catch(err => bot.reply(message, `Shit something went wrong ${err.message}`));

    }

//--------------------------------------------------------------------------------------------
// Add exercise score


//------------------------------------------------------------------------------------------
// Other replies

    // bot.reply(message, `Oh no, couldn't figure out what you said there 💩`);

});
