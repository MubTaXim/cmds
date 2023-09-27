module.exports = {
    config: {
        name: "easter",
        version: "1.0",
        author: "XyryllPanget",
        countDown: 5,
        role: 0,
        shortDescription: "non prefix ",
        longDescription: "non prefix",
        category: "reply",
    },
onStart: async function(){}, 
onChat: async function({
    event,
    message,
    getLang
}) {
    if (event.body && event.body.toLowerCase() == "sos") return message.reply("...---... ");
}
};