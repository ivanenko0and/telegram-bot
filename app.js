const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

const fs = require("fs");

var inputStage = 0;


bot.command('write', ctx => {
    bot.telegram.sendMessage(ctx.chat.id, `Enter login:`)
    inputStage = 1;
})

bot.command('read', ctx => {
    var fileContent = fs.readFileSync("data.txt", "utf8");
    bot.telegram.sendMessage(ctx.chat.id, `Entered data:\n` + fileContent);
})


bot.hears(/.*/, ctx => {
    if(inputStage == 1){
        var login = ctx.message.text;
        fs.writeFileSync("data.txt", login);
        inputStage = 2;
        bot.telegram.sendMessage(ctx.chat.id, `Enter password:`)
    }else{
        if(inputStage == 2){
            var pass = ctx.message.text;
            fs.appendFileSync("data.txt", "\n" + pass);
            inputStage = 0;
        }
    }
    
})


bot.launch();

