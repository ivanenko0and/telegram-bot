
const MongoClient = require("mongodb").MongoClient;


const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);


 
const mongoClient = new MongoClient("mongodb://localhost:27017/", { useUnifiedTopology: true });
mongoClient.connect(function(err, client){
 


    const db = client.db("userDB");
    const collection = db.collection("telegramUsers");

    if(err) return console.log(err);



    bot.command('write', ctx => {
        bot.telegram.sendMessage(ctx.chat.id, `Can we get access to your contacts?`, requestContacts)

    })
    
    const requestContacts = {
        "reply_markup": {
            "one_time_keyboard": true,
            "keyboard": [
                [{
                    text: "My contacts",
                    request_contact: true,
                    one_time_keyboard: true
                }],
                ["Cancel"]
            ]
        }
    };


    bot.command('read', ctx => {


        collection.find().toArray(function(err, results){
            
            var str = "Entered data:\n";
            
            results.forEach(element => str += `\nname: ` + element.name + `;   phone: ` + element.phone);
            bot.telegram.sendMessage(ctx.chat.id, str)

            console.log(results);
        });
        
    })


    bot.on("contact",(ctx)=>{

        let user = {name: ctx.message.contact.first_name + " " + ctx.message.contact.last_name, phone: ctx.message.contact.phone_number};
        collection.insertOne(user, function(err, result){
    
            if(err) return console.log(err);

            console.log(result.ops);
        });

    })

 
    bot.launch();
   
});

