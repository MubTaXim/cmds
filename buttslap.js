const axios = require('axios');
const jimp = require("jimp");
const fs = require("fs")


module.exports = {
    config: {
        name: "buttslap",
        aliases: ["buttslap"],
        version: "1.0",
        author: "mero",
        countDown: 10,
        role: 0,
        shortDescription: "slap",
        longDescription: "",
        category: "slap",
        guide: {
          en: "{pn} <@tag> or <@tag1 @tag2>", 
        }
    },



    onStart: async function ({ message, event, args }) {
        const mention = Object.keys(event.mentions);
        if (mention.length == 0) return message.reply("Please mention someone");
        else if (mention.length == 1) {
            const one = event.senderID, two = mention[0];
            bal(one, two).then(ptth => { message.reply({ body: "👋😹 move your butt", attachment: fs.createReadStream(ptth) }) })
        } else {
            const one = mention[1], two = mention[0];
            bal(one, two).then(ptth => { message.reply({ body: "👋😹 move your butt", attachment: fs.createReadStream(ptth) }) })
        }
    }


};

async function bal(one, two) {

    let avone = await jimp.read(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)
    avone.circle()
    let avtwo = await jimp.read(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)
    avtwo.circle()
    let pth = "butt.png"
    let img = await jimp.read("https://i.postimg.cc/W3NwfQTB/butt.png")

    img.resize(720, 405).composite(avone.resize(90, 90), 368, 34).composite(avtwo.resize(90, 90), 190, 225);

    await img.writeAsync(pth)
    return pth
}