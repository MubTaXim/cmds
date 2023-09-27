const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const formData = new FormData();
formData.append('size', 'auto');
module.exports = {
	config: {
		name: "rbg",
 aliases: ["removebg"],
		version: "1.0",
		author: "NIB",
		countDown: 5,
		role: 1,
		shortDescription: {
			en: "remove picture background"
		},
		longDescription: {
			en: "remove picture background"
		},
		category: "box chat",
		},
	onStart: async function ({ message, event, api, getLang }) {
		//message.send (event.messageReply.attachments[0].url)
			formData.append('image_url', `${event.messageReply.attachments[0].url}`);
 try{
			let res = await axios.post("https://api.remove.bg/v1.0/removebg", formData,{
 responseType: 'arraybuffer',
 headers: {
 ...formData.getHeaders(),
 'X-Api-Key': 'iDCaLMAZ9FEUkGiWUbZRbH1d',
 },
 encoding: null
})
 await fs.writeFileSync(__dirname+"/tmp/rmv.png", res.data)
message.send({body:" ",attachment:fs.createReadStream(__dirname+"/tmp/rmv.png", res.data)}, () => {fs.unlinkSync(__dirname+"/tmp/rmv.png")})
 }catch(e){
 message.send("")
 console.log(e)
 }
 }
}