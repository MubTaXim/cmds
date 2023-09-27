const axios = require('axios'); 
  
 module.exports = { 
      config: { 
    name: "hentai", 
   aliases: ["hent","hen"], 
  version: "1.0", 
   author: "Upen Basnet", 
  countDown: 5, 
  role: 0, 
  shortDescription: "get random hent**", 
  longDescription: "", 
   category: "18+ anime", 
  guide: {en: "{pn} {{<name>}}" },
         },
         langs: {
         		en: {
         			error: "An error occurred, please try again later",
         approve_success: "'Hentai' command has been approved!",
         	approve_error: "Only administrators can approve the 'hentai' command",
         	disapprove_success: " command has been disapproved!",
         	disapprove_error: "Only administrators can disapprove the 'hentai' command",
         	already_approved: "'hentai command has already been approved",
         	already_disapproved: "'hentai' command has already been disapproved",
         	group_not_approved: "'hentai' is a premium cmd. You need approval from admin to use this cmd."
         }
         },
         
   onStart: async function({ event, message, getLang, threadsData, api, args }) {
         			const { threadID } = event;
         
         			if (args[0] === "approve") {
         				if (global.GoatBot.config.adminBot.includes(event.senderID)) {
         					const approved = await threadsData.get(threadID, "settings.imagine_approved");
         					if (approved) {
         						return message.reply(getLang("already_approved"));
         					}
         					await threadsData.set(threadID, true, "settings.imagine_approved");
         					return message.reply(getLang("approve_success"));
         				}
         				return message.reply(getLang("approve_error"));
         			} else if (args[0] === "disapprove") {
         				if (global.GoatBot.config.adminBot.includes(event.senderID)) {
         					const approved = await threadsData.get(threadID, "settings.imagine_approved");
         					if (!approved) {
         						return message.reply(getLang("already_disapproved"));
         					}
         					await threadsData.set(threadID, false, "settings.imagine_approved");
         					return message.reply(getLang("disapprove_success"));
         				}
         				return message.reply(getLang("disapprove_error"));
         			}
         
         			const approved = await threadsData.get(threadID, "settings.imagine_approved");
         			if (!approved) {
         				return message.reply(getLang("group_not_approved"));
         			}
 
                 const name = args.join(" "); 
                 if (!name) 
  
                         try { 
                                 let res = await axios.get(`https://api.waifu.pics/nsfw/waifu`) 
  
  
                                 let res2 = res.data 
                                 let img = res2.url 
  
                                 const form = { 
                                         body: `   「 Damn Fucking Hot🥵 」   ` 
  
                                 }; 
                                 if (img) 
                                         form.attachment = await global.utils.getStreamFromURL(img); 
                                 message.reply(form); 
                         } catch (e) { 
                                 message.reply(`🥺 Not Found`) 
                         } 
  
  
                 else { 
  
                         try { 
                                 let res = await axios.get(`https://api.waifu.pics/nsfw/${name}`) 
  
  
                                 let res2 = res.data 
                                 let img1 = res2.url 
  
                                 const form = { 
                                         body: `   「 Damn Kati Hot Ho🥵  」   ` 
  
                                 }; 
                                 if (img1) 
                                         form.attachment = await global.utils.getStreamFromURL(img1); 
                                 message.reply(form); 
                         } catch (e) { message.reply(`🥺 No waifu 🥲 \n category: waifu, neko, shinobu, megumin, bully, cuddle, cry, kiss, lick, hug, awoo, pat, smug, bonk, yeet, blush, smile, wave, highfive, handhold, nom, bite, glomp, slap, kill, kick, happy, wink, poke, dance, cringe `) } 
  
                 } 
         } 
 };