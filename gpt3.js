const axios = require('axios');

module.exports = {
    config: {
        name: "gpt2",
        aliases: ["ai2"],
        version: "1.0",
        shortDescription: "Ask a question to GPT-3.5.",
        longDescription: "Ask a question to GPT-3.5 using the provided API.",
        category: "ai",
        guide: "{pn} [question]"
    },

    onStart: async function ({ message, event, args, commandName }) {
        const id = event.senderID;
        const question = args.join(" ");
        if (!question) {
            return message.reply("Please provide a question to ask GPT.");
        } else {
            try {
                const response = await axios.get(`https://ai.tantrik-apis.repl.co/premium/chatgpt?id=${id}&prompt=${encodeURIComponent(question)}`);
                const gptAnswer = response.data.chatGPT;

                message.reply(gptAnswer);
            } catch (e) {
                console.error(e);
                message.reply("Error while fetching the GPT response.");
            }
        }
    },

    onReply: async function ({ Reply, message, event, args, getLang, commandName }) {
        const { author } = Reply;
        if (author !== event.senderID)
            return;

        try {
            const response = await axios.get(`https://ai.tantrik-apis.repl.co/premium/chatgpt?id=${author}&prompt=${encodeURIComponent(message)}`);
            const gptAnswer = response.data.chatGPT;

            Reply.gptAnswer(gptAnswer);
        } catch (e) {
            console.error(e);
            Reply("Error while fetching the GPT response.");
        }
    }
};