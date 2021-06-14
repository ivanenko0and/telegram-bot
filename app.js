
const MongoClient = require("mongodb").MongoClient;


const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);


 
const mongoClient = new MongoClient("mongodb://localhost:27017/", { useUnifiedTopology: true });
mongoClient.connect(function(err, client){
 


    const db = client.db("userDB");
    const collection = db.collection("users");

    if(err) return console.log(err);


    
    var inputStage = '0';
    
    
    bot.command('write', ctx => {
        bot.telegram.sendMessage(ctx.chat.id, `Enter login:`)
        inputStage = '1';
    })
    
    bot.command('read', ctx => {


        collection.find().toArray(function(err, results){
            
            var str = "Entered data:\n";
            
            results.forEach(element => str += `\nlogin: ` + element.login + `;   pass: ` + element.pass);
            bot.telegram.sendMessage(ctx.chat.id, str)

            console.log(results);
        });
        
    })
    

    bot.command('del', ctx => {

        bot.telegram.sendMessage(ctx.chat.id, `Enter deleted login:`)
        inputStage = 'd1';
        
    })




    var login = "";
    var pass = "";
    
    bot.hears(/.*/, ctx => {


        if(inputStage == '1'){
            login = ctx.message.text;
            inputStage = '2';
            bot.telegram.sendMessage(ctx.chat.id, `Enter password:`)
        }else{
            if(inputStage == '2'){
                pass = ctx.message.text;
                inputStage = '0';

                let user = {login: login, pass: pass};
                collection.insertOne(user, function(err, result){
            
                    if(err) return console.log(err);

                    console.log(result.ops);
                });


            }
        }
        
        if(inputStage == 'd1'){
            login = ctx.message.text;
            inputStage = '0';
            

            db.collection("users").deleteOne({login: login}, function(err, result){
              
                bot.telegram.sendMessage(ctx.chat.id, `Deleted login: \n` + login)
                console.log(result);
            });

        }

    })
    
    
    bot.launch();


});

