module.exports = {
	config: {
		name: "bio",
		version: "1.7",
		author: "al-rulex/loufi",
		countDown: 5,
		role: 2,
		shortDescription: {
			vi: " ",
			en: "change bot bio "
		},
		longDescription: {
			vi: " ",
			en: "change bot bio "
		},
		category: "owner",
		guide: {
			en: "{pn} (text)"
		}
  },
  onStart: async function ({ args, message, api }) {
api.changeBio(args.join(" "))
    message.reply("change bot bio to:" + args.join(" "))
  }
}

//this code moded by al-rulex loufi do not change.