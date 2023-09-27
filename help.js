const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;
const doNotDelete = "  「  🌸 Riruru 🌸   」";
/** 
* @author NTKhang
* @author: do not delete it
* @message if you delete or edit it you will get a global ban
*/

module.exports = {
	config: {
		name: "help",
		version: "1.12",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		shortDescription: {
			vi: "Xem cách dùng lệnh",
			en: "View command usage"
		},
		longDescription: {
			vi: "Xem cách sử dụng của các lệnh",
			en: "View command usage"
		},
		category: "info",
		guide: {
			en: "{pn} [empty or <command name>]"
		},
		priority: 1
	},

	langs: {
		en: {
			help:   `
╭─     『 AI 』
│✧ai/gpt ✧imagine
│✧art ✧art2 ✧art3
│✧draw ✧miku ✧miku3
│✧ask(no prefix) ✧teach
╰───────────◊
╭─     『 ISLAM 』
│✧hadith ✧prayer
│✧Mokka ✧namaj
╰───────────◊
╭─     『 ANIME 』
│✧anime ✧waifu 
│✧anivid ✧manga
│✧mal ✧malnews
│✧charinfo
╰───────────◊
╭─     『 PREMIUM 』
│✧imagine18 ✧xnxx
│✧nude ✧nsfw
│✧hentai ✧hentaivid
╰───────────◊
╭─     『 GAMES 』
│✧guessnum ✧flag
│✧ttt ✧pubg ✧chargame
│✧bank ✧balance ✧rps
│✧wordgame ✧slot 
│✧truthordare ✧dhbc
│✧quiz ✧quiz2
╰───────────◊
╭───     『 POKÉMON 』
│✧pokebot ✧poke 
│✧pokedex ✧poketrade
│✧pokechamps 
│✧pokemon
╰───────────◊
╭─     『 GROUP 』
│✧adduser ✧adboxonly
│✧uid ✧autosetname 
│✧badwords ✧warn ✧all
│✧busy ✧count ✧resend
│✧filteruser ✧unsend
│✧tid ✧kick ✧rules 
│✧grptag ✧setname  
│✧setrole ✧sendnoti 
╰───────────◊
╭─     『 BOT 』
│✧prefix ✧setalias
│✧uptime
╰───────────◊
╭─     『 SUPPORT 』
│✧called ✧supportgc
│✧fungc
╰───────────◊
╭─     『 CUSTOM 』
│✧setleave ✧setwelcome
│✧shortcut 
│✧customrankcard
╰───────────◊
╭─     『 ENTERTAINMENT 』
│✧spank ✧fak ✧marry
│✧pair ✧meme ✧hug
│✧kiss ✧alert ✧hell
│✧hack ✧buttslap ✧jail
│✧say ✧slap ✧kiss ✧gay 
│✧spidy ✧balls ✧dhbc(!)
│✧fact ✧quote ✧joke
│✧delete
│✧trigger ✧trash
╰───────────◊
╭─     『 IMAGE 』
│✧profile
│✧pin ✧pin2 ✧pin3
│✧rbg ✧hubble ✧moon
│✧cat ✧pairdp
│✧blink? ✧njr ✧messi
│✧anipic ✧cosplay
│✧gg3✧catsay ✧catsay2 
│✧gfx ✧gfx2 ✧gfx3 
│✧gfx4 ✧gfx5 ✧gfx6 
╰───────────◊
╭─     『 COVER 』
│✧avatar ✧avatar2 
│✧fbcover ✧cover
│✧cover2 ✧cover3 
╰───────────◊
╭─     『 INFO 』
│✧lyrics ✧superhero?
│✧movieinfo ✧element
│✧ss ✧prompt
│✧gsearch ✧fixgrammar
│✧eval ✧music ✧element
│✧dictionary ✧translate
╰───────────◊
╭─     『 NON PREFIX 』
│✧sos 
╰───────────◊
╭─     『 OTHERS 』
│✧sendmsg 
│✧sendusermsg
╰───────────◊
╭─     『 MEDIA 』
│✧insta? ✧tik ✧fb
│✧videofb ✧ytb ✧v2a
╰───────────◊
╭─     『 RANK 』
│✧customrankcard 
│✧rank ✧rankup
╰───────────◊
╭─     『 UTILITY 』
│✧translate ✧weather
╰───────────◊
╭─     『 WIKI 』
│✧emojimean ✧emojimix
╰───────────◊\n╭──────◊\n│ » Total cmds: [ %4 ]\n│ » Type[ %5help <cmd> ]\n│ to learn the usage.\n├────────⭔\n│ %6\n╰─────────────⭓`,
			help2: "%1├───────⭔\n│ » Currently, the bot has %2 commands that can be used\n│ » Type [ %5help <cmd> ]\n│ to learn the usage.\n│ %4\n╰─────────────⭓",
			commandNotFound: "Command \"%1\" does not exist",
			getInfoCommand: "───『 NAME 』 ────✧\n» %1\n───『 INFO 』\n» Author: %8\n» Other names: %3\n» Other names in your group: %4\n» Description: %2\n──『 Usage 』\n%9\n────────✧",
			onlyInfo: "╭──『 INFO 』────⭓\n│ Command name: %1\n│ Description: %2\n│ Other names: %3\n│ Other names in your group: %4\n│ Author: %8\n╰─────────────⭓",
			onlyUsage: "╭── USAGE ────⭓\n│%1\n╰─────────────⭓",
				onlyAlias: "╭── ALIAS ────⭓\n│ Other names: %1\n│ Other names in your\n| group: %2\n╰─────────────⭓",
				onlyRole: "╭── ROLE ────⭓\n│%1\n╰─────────────⭓",
			doNotHave: "Do not have",
			roleText0: "0 (All users)",
			roleText1: "1 (Group administrators)",
			roleText2: "2 (Admin bot)",
			roleText0setRole: "0 (set role, all users)",
			roleText1setRole: "1 (set role, group administrators)",
			pageNotFound: "Page %1 does not exist"
		}
	},

	onStart: async function ({ message, args, event, threadsData, getLang, role }) {
		const langCode = await threadsData.get(event.threadID, "data.lang") || global.GoatBot.config.language;
		let customLang = {};
		const pathCustomLang = path.join(__dirname, "..", "..", "languages", "cmds", `${langCode}.js`);
		if (fs.existsSync(pathCustomLang))
			customLang = require(pathCustomLang);
		const { threadID } = event;
		const threadData = await threadsData.get(threadID);
		const prefix = getPrefix(threadID);
		let sortHelp = threadData.settings.sortHelp || "name";
		if (!["category", "name"].includes(sortHelp))
			sortHelp = "name";
		const commandName = (args[0] || "").toLowerCase();
		const command = commands.get(commandName) || commands.get(aliases.get(commandName));
		// ———————————————— LIST ALL COMMAND ——————————————— //
		if (!command && !args[0] || !isNaN(args[0])) {
			const arrayInfo = [];
			let msg = "";
			if (sortHelp == "name") {
				const page = parseInt(args[0]) || 1;
				const numberOfOnePage = 30;
				for (const [name, value] of commands) {
					if (value.config.role > 1 && role < value.config.role)
						continue;
					let describe = name;
					let shortDescription;
					const shortDescriptionCustomLang = customLang[name]?.shortDescription;
					if (shortDescriptionCustomLang != undefined)
						shortDescription = checkLangObject(shortDescriptionCustomLang, langCode);
					else if (value.config.shortDescription)
						shortDescription = checkLangObject(value.config.shortDescription, langCode);
					if (shortDescription && shortDescription.length < 40)
						describe += `: ${shortDescription.charAt(0).toUpperCase() + shortDescription.slice(1)}`;
					arrayInfo.push({
						data: describe,
						priority: value.priority || 0
					});
				}
				arrayInfo.sort((a, b) => a.data - b.data);
				arrayInfo.sort((a, b) => a.priority > b.priority ? -1 : 1);
				const { allPage, totalPage } = global.utils.splitPage(arrayInfo, numberOfOnePage);
				if (page < 1 || page > totalPage)
					return message.reply(getLang("pageNotFound", page));
				const returnArray = allPage[page - 1] || [];
				const startNumber = (page - 1) * numberOfOnePage + 1;
				msg += (returnArray || []).reduce((text, item, index) => text += ` ${index + startNumber}${index + startNumber < 10 ? " " : ""}. ${item.data}\n`, '').slice(0, -1);
				await message.reply(getLang("help", msg, page, totalPage, commands.size, prefix, doNotDelete));
			}
			else if (sortHelp == "category") {
				for (const [, value] of commands) {
					if (value.config.role > 1 && role < value.config.role)
						continue;
					if (arrayInfo.some(item => item.category == value.config.category.toLowerCase())) {
						const index = arrayInfo.findIndex(item => item.category == value.config.category.toLowerCase());
						arrayInfo[index].names.push(value.config.name);
					}
					else
						arrayInfo.push({
							category: value.config.category.toLowerCase(),
							names: [value.config.name]
						});
				}
				arrayInfo.sort((a, b) => (a.category < b.category ? -1 : 1));
				arrayInfo.forEach((data, index) => {
					const categoryUpcase = `${index == 0 ? `╭` : `├`}─── ${data.category.toUpperCase()} ${index == 0 ? "⭓" : "⭔"}`;
					data.names = data.names.sort().map(item => item = `${item}`);
					msg += `${categoryUpcase}\n${data.names.join("\n")}\n`;
				});
				message.reply(getLang("help2", msg, commands.size, prefix, doNotDelete));
			}
		}
		// ———————————— COMMAND DOES NOT EXIST ———————————— //
		else if (!command && args[0]) {
			return message.reply(getLang("commandNotFound", args[0]));
		}
		// ————————————————— INFO COMMAND ————————————————— //
		else {
			const configCommand = command.config;
			const author = configCommand.author;

			const descriptionCustomLang = customLang[configCommand.name]?.longDescription;
			let description;
			if (descriptionCustomLang != undefined)
				description = checkLangObject(descriptionCustomLang, langCode);
			else if (configCommand.longDescription)
				description = checkLangObject(configCommand.longDescription, langCode);
			const aliasesString = configCommand.aliases ? configCommand.aliases.join(", ") : getLang("doNotHave");
			const aliasesThisGroup = threadData.data.aliases ? (threadData.data.aliases[configCommand.name] || []).join(", ") : getLang("doNotHave");
			let roleOfCommand = configCommand.role;
			let roleIsSet = false;
			if (threadData.data.setRole?.[configCommand.name]) {
				roleOfCommand = threadData.data.setRole[configCommand.name];
				roleIsSet = true;
			}

			const roleText = roleOfCommand == 0 ?
				(roleIsSet ? getLang("roleText0setRole") : getLang("roleText0")) :
				roleOfCommand == 1 ?
					(roleIsSet ? getLang("roleText1setRole") : getLang("roleText1")) :
					getLang("roleText2");

			let guide;
			if (customLang[configCommand.name]?.guide != undefined)
				guide = customLang[configCommand.name].guide;
			else
				guide = configCommand.longDescription[langCode] || configCommand.guide["en"];
			guide = guide || {
				body: ""
			};
			if (typeof guide == "string")
				guide = { body: guide };
			const guideBody = guide.body
				.replace(/\{prefix\}|\{p\}/g, prefix)
				.replace(/\{name\}|\{n\}/g, configCommand.name)
				.replace(/\{pn\}/g, prefix + configCommand.name);

			const formSendMessage = {
				body: getLang("getInfoCommand", configCommand.name, description, aliasesString, aliasesThisGroup, configCommand.version, roleText, configCommand.countDown || 1, author || "", `${guideBody.split("\n").join("\n")}`)
			};

			if (guide.attachment) {
				if (typeof guide.attachment == "object") {
					formSendMessage.attachment = [];
					for (const pathFile in guide.attachment) {
						if (!fs.existsSync(pathFile)) {
							const cutFullPath = pathFile.split("/").filter(item => item != "");
							cutFullPath.pop();
							for (let i = 0; i < cutFullPath.length; i++) {
								const path = cutFullPath.slice(0, i + 1).join('/');
								if (!fs.existsSync(path))
									fs.mkdirSync(path);
							}
							const getFile = await axios.get(guide.attachment[pathFile], { responseType: 'arraybuffer' });
							fs.writeFileSync(pathFile, Buffer.from(getFile.data));
						}
						formSendMessage.attachment.push(fs.createReadStream(pathFile));
					}
				}
			}
			return message.reply(formSendMessage);
		}
	}
};

function checkLangObject(data, langCode) {
	if (typeof data == "string")
		return data;
	if (typeof data == "object" && !Array.isArray(data))
		return data[langCode] || data.en || "";
	return "";
  }