module.exports = {
 config: {
 name: "mal",
 aliases: ["MyAnimeList"," myals","malinfo"],
 version: "1.0",
 author: "Shinpei",
 countDown: 5,
 role: 0,
 shortDescription: {
 en: "Search Anime from Myanimelist"
 },
 longDescription: {
 en: "Search Anime from Myanimelist"
 },
 category: "Anime",
 guide: {
 en: ""
 }
 },
 onStart: async function ({ api, event, }) {
 const axios = require("axios");
 const Scraper = require('mal-scraper');
	const request = require('request');
	const fs = require("fs");

let input = event.body;

 var query = input; query = input.substring(5)
let data = input.split(" ");
 
 let Replaced = query.replace(/ /g, " ");
 api.sendMessage(`🔎Searching for "${Replaced}"...`, event.threadID, event.messageID);

const Anime = await Scraper.getInfoFromName(Replaced)
 .catch(err => {
 api.sendMessage("⚠️" + err, event.threadID, event.messageID);
 }); 
 
 console.log(Anime) 
 let getURL = Anime.picture;

 let ext = getURL.substring(getURL.lastIndexOf(".") + 1);
 
 if (!Anime.genres[0] || Anime.genres[0] === null) Anime.genres[0] = "None";

 var title = Anime.title;
var japTitle = Anime.japaneseTitle
var type = Anime.type;
var status = Anime.status;
var premiered = Anime.premiered;
var broadcast = Anime.broadcast;
var aired = Anime.aired;
var producers = Anime.producers;
var studios = Anime.studios;
var source = Anime.source;
var episodes = Anime.episodes;
var duration = Anime.duration;
var genres = Anime.genres.join(", "); 
var popularity = Anime.popularity;
var ranked = Anime.ranked;
var score = Anime.score; 
var rating = Anime.rating;
var synopsis = Anime.synopsis;
var url = Anime.url; 
var endD = Anime.end_date;

 
 let callback = function () { 
 api.sendMessage({
 body:`Title: ${title}\nJapanese: ${japTitle}\nType: ${type}\nStatus: ${status}\nPremiered: ${premiered}\nBroadcast: ${broadcast}\nAired: ${aired}\nProducers: ${producers}\nStudios: ${studios}\nSource: ${source}\nEpisodes: ${episodes}\nDuration: ${duration}\nGenres: ${genres}\nPopularity: ${popularity}\nRanked: ${ranked}\nScore: ${score}\nRating: ${rating}\n\nSynopsis: \n${synopsis}\nLink: ${url}`, 
					attachment: fs.createReadStream(__dirname + `/tmp/mal.${ext}`)
					}, event.threadID, () => fs.unlinkSync(__dirname + `/tmp/mal.${ext}`), event.messageID)
				}
 
 // }
 request(getURL).pipe(fs.createWriteStream(__dirname + `/tmp/mal.${ext}`)).on("close", callback) 
 }
};