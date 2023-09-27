
const fs = require("fs-extra")
const axios = require("axios")
module.exports = {
	config: {
		name: "pin2",
    aliases: ["pinterest2"],
		version: "1.1",
		author: "NTKhang",
		countDown: 60,
		role: 0,
		shortDescription: {
			vi: "Xem uid",
			en: "get pictures from Pinterest"
		},
		longDescription: {
			uid: "Xem user id facebook của người dùng",
			en: "get pictures from Pinterest"
		},
		category: "picture ",
		guide: {
			vi: "   {pn}: dùng để xem id facebook của bạn"
				+ "\n   {pn} @tag: xem id facebook của những người được tag"
				+ "\n   {pn} <link profile>: xem id facebook của link profile",
			en: "{pn} <search query> <number of img>"
				+ "\n   example: {pn} naruto-9"
		}
	},

	langs: {
		vi: {
			syntaxError: "Vui lòng tag người muốn xem uid hoặc để trống để xem uid của bản thân"
		},
		en: {
			syntaxError: "Baka! that's not how you do it\nlearn first!"
		}
	},

	onStart: async function ({ api, message, event, args, getLang }) 
  {
    
    const keySearch = args.join(" ");
    if(keySearch.includes("-") == false) return api.sendMessage('please add to your key search - (1-15)', event.threadID, event.messageID)
    const keySearchs = keySearch.substr(0, keySearch.indexOf('-'))
    let numberSearch = keySearch.split("-").pop() || 6
    if(numberSearch>15){
      numberSearch = 15
    }
    const res = await axios.get(`https://api-dien.kira1011.repl.co/pinterest?search=${encodeURIComponent(keySearchs)}`);
    const data = res.data.data;
    var num = 0;
    var imgData = [];
    for (var i = 0; i < parseInt(numberSearch); i++) {
      let path = __dirname + `/tmp/${num+=1}.jpg`;
      let getDown = (await axios.get(`${data[i]}`, { responseType: 'arraybuffer' })).data;
      fs.writeFileSync(path, Buffer.from(getDown, 'utf-8'));
      imgData.push(fs.createReadStream(__dirname + `/tmp/${num}.jpg`));
    }
    api.sendMessage({
        attachment: imgData,
        body:""
    }, event.threadID, event.messageID)
    for (let ii = 1; ii < parseInt(numberSearch); ii++) {
        fs.unlinkSync(__dirname + `/tmp/${ii}.jpg`)
    }
}
  
};