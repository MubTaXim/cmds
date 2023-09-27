const fs = require('fs');
module.exports = {
	config: {
		name: "chargame",
		aliases: ["character","guesschar"],
		version: "1.0",
		author: "Mero | Apon",
		countDown: 20,
		role: 0,
		shortDescription: {
			vi: "",
			en: "game to earn money"
		},
		longDescription: {
			vi: "",
			en: "game"
		},
		category: "games",
		guide: {
			en: "{pn}"
		},
		envConfig: {
			reward: 100
		}
	},
 
	langs: {
		en: {
			reply: "⚠️ | You are not the player of this question",
			correct: "✅ | You win %1 coins! ",
			wrong: "wrong answer❗"
		}
	},
 
	onStart: async function ({ message, event, commandName, getLang }) {
 
    const json = JSON.parse(fs.readFileSync('char.json'));
    const Qdata = json[Math.floor(Math.random() * json.length)];
 
const image = Qdata.image
 
    message.reply({ 
			body: '✅ | Reply with the name of the character in the picture', attachment:await global.utils.getStreamFromURL(image)}, (err, info) => {
			global.GoatBot.onReply.set(info.messageID, {
				commandName,
				messageID: info.messageID,
				author: event.senderID,
        answer: Qdata.name
			});
		});
	},
 
	onReply: async ({ message, Reply, event, getLang, usersData, envCommands, commandName }) => {
 
    const { author, messageID, answer } = Reply;
 
		if (formatText(event.body) == formatText(answer)) {
			global.GoatBot.onReply.delete(messageID);
      message.unsend(event.messageReply.messageID);
			await usersData.addMoney(event.senderID, envCommands[commandName].reward);
			message.reply(getLang("correct", envCommands[commandName].reward));
		}
		else
			message.reply(getLang("wrong"));
	}
};
 
function formatText(text) {
	return text.normalize("NFD")
		.toLowerCase()
}