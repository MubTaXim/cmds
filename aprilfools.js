module.exports = {
 config: {
 name: "claim",
 version: "1.0",
 author: "XyryllPanget",
 countDown: 5,
 role: 0,
 shortDescription: "claim money[real money]",
 longDescription: "claim money[real money]",
 category: "reply",
 },
onStart: async function(){}, 
onChat: async function({
 event,
 message,
 getLang
}) {
 if (event.body && event.body.toLowerCase() == "$claim") return message.reply("happy april fools!!! bleee😛");
}
};