const {
    MessageType,
    Mimetype
} = require("@adiwajshing/baileys");
const connect = require('./connect');
const { getRandomExt } = require("./help");
const fs = require('fs')

const megayaa = connect.megayaa
const bufferFakeReply = fs.readFileSync('./lib/image/foto.jpg')

exports.sendSticker = (from, filename, lin) => {
	megayaa.sendMessage(from, filename, MessageType.sticker, {quoted: lin})
}

exports.setName = async function(query){
    const response = await megayaa.updateProfileName(query)
    return response
}

exports.setBio = async function(query){
    const response = await megayaa.setStatus(query)
    return response
}

exports.sendFakeStatus2 = (from, teks, faketeks) => {
	megayaa.sendMessage(from, teks, MessageType.text, { quoted: { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {}) }, message: { "imageMessage": { "mimetype": "image/jpeg", "caption": faketeks, "jpegThumbnail": fs.readFileSync(`./lib/image/foto.jpg`)} } } })
}

exports.FakeTokoForwarded = (from, teks, fake) => {
	anu = {
		key: {
			fromMe: false,
			participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {})
		},
		message: {
			"productMessage": {
				"product": {
					"productImage":{
						"mimetype": "image/jpeg",
						"jpegThumbnail": fs.readFileSync(`./lib/image/foto.jpg`)
					},
					"title": fake,
					"description": "Lindow Selfbot",
					"currencyCode": "IDR",
					"priceAmount1000": "50000000",
					"retailerId": "Self Bot",
					"productImageCount": 1
				},
				"businessOwnerJid": `0@s.whatsapp.net`
		}
	}
}
	megayaa.sendMessage(from, teks, MessageType.text, {quoted: anu, contextInfo: {"forwardingScore": 999, "isForwarded": true}})
}

exports.FakeStatusImgForwarded = (from, image, caption, faketeks) => {
	megayaa.sendMessage(from, image, MessageType.image, { quoted: { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {}) }, message: { "imageMessage": { "mimetype": "image/jpeg", "caption": faketeks, "jpegThumbnail": fs.readFileSync(`./lib/image/foto.jpg`)} } }, caption: caption, contextInfo: {"forwardingScore": 999, "isForwarded": true} })
}

exports.sendMessage = async(from, text) => {
    await megayaa.sendMessage(from, text, MessageType.text)
}

exports.sendAudio = async(from, buffer) => {
    await megayaa.sendMessage(from, buffer, MessageType.mp4Audio, { mimetype: Mimetype.mp4Audio, ptt: true })
}

exports.sendImage = async(from, buffer, caption = "") => {
    await megayaa.sendMessage(from, buffer, MessageType.image, { caption: caption })
}

exports.sendVideo = async(from, buffer, caption = "") => {
    await megayaa.sendMessage(from, buffer, MessageType.video, { caption: caption })
}

exports.sendSticker = async(from, buffer) => {
    await megayaa.sendMessage(from, buffer, MessageType.sticker)
}

exports.sendPdf = async(from, buffer, title = "LoL Human.pdf") => {
    await megayaa.sendMessage(from, buffer, MessageType.document, { mimetype: Mimetype.pdf, title: title })
}

exports.sendGif = async(from, buffer) => {
    await megayaa.sendMessage(from, buffer, MessageType.video, { mimetype: Mimetype.gif })
}

exports.sendContact = async(from, nomor, nama) => {
    const vcard = 'BEGIN:VCARD\n' + 'VERSION:3.0\n' + 'FN:' + nama + '\n' + 'ORG:Kontak\n' + 'TEL;type=CELL;type=VOICE;waid=' + nomor + ':+' + nomor + '\n' + 'END:VCARD'
    await megayaa.sendMessage(from, { displayname: nama, vcard: vcard }, MessageType.contact)
}

exports.sendMention = async(from, text, mentioned) => {
    await megayaa.sendMessage(from, text, MessageType.text, { contextInfo: { mentionedJid: mentioned } })
}

exports.sendImageMention = async(from, buffer, text, mentioned) => {
    await megayaa.sendMessage(from, buffer, MessageType.image, { contextInfo: { mentionedJid: [mentioned], participant: [mentioned] }, caption: text })
}

exports.sendFakeStatus = async(from, text, faketext, mentioned = []) => {
    const options = {
        contextInfo: {
            participant: '0@s.whatsapp.net',
            remoteJid: 'status@broadcast',
            quotedMessage: {
                imageMessage: {
                    caption: faketext,
                    jpegThumbnail: bufferFakeReply
                }
            },
            mentionedJid: mentioned
        }
    }
    await megayaa.sendMessage(from, text, MessageType.text, options)
}

exports.fakeStatusForwarded = async(from, text, faketext) => {
    const options = {
        contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            participant: '0@s.whatsapp.net',
            remoteJid: 'status@broadcast',
            quotedMessage: {
                imageMessage: {
                    caption: faketext,
                    jpegThumbnail: bufferFakeReply
                }
            }
        }
    }
    await megayaa.sendMessage(from, text, MessageType.text, options)
}

exports.sendFakeThumb = async(from, buffer, caption = "") => {
    let options = {
        thumbnail: fs.readFileSync('./lib/image/foto2.jpg'),
        caption: caption
    }
    await megayaa.sendMessage(from, buffer, MessageType.image, options)
}

exports.downloadMedia = async(media) => {
    const filePath = await megayaa.downloadAndSaveMediaMessage(media, `./temp/${getRandomExt()}`)
    const fileStream = fs.createReadStream(filePath)
    const fileSizeInBytes = fs.statSync(filePath).size
    fs.unlinkSync(filePath)
    return { size: fileSizeInBytes, stream: fileStream }
}

exports.hideTag = async(from, text) => {
    members = await this.getGroupParticipants(from)
    await megayaa.sendMessage(from, text, MessageType.text, { contextInfo: { mentionedJid: members } })
}

exports.hideTagImage = async(from, buffer) => {
    members = await this.getGroupParticipants(from)
    await megayaa.sendMessage(from, buffer, MessageType.image, { contextInfo: { mentionedJid: members } })
}

exports.hideTagSticker = async(from, buffer) => {
    members = await this.getGroupParticipants(from)
    await megayaa.sendMessage(from, buffer, MessageType.sticker, { contextInfo: { mentionedJid: members } })
}

exports.hideTagContact = async(from, nomor, nama) => {
    let vcard = 'BEGIN:VCARD\n' + 'VERSION:3.0\n' + 'FN:' + nama + '\n' + 'ORG:Kontak\n' + 'TEL;type=CELL;type=VOICE;waid=' + nomor + ':+' + nomor + '\n' + 'END:VCARD'
    members = await this.getGroupParticipants(from)
    await megayaa.sendMessage(from, { displayname: nama, vcard: vcard }, MessageType.contact, { contextInfo: { mentionedJid: members } })
}

exports.blockUser = async(id, block) => {
    if (block) return await megayaa.blockUser(id, "add")
    await megayaa.blockUser(id, "remove")
}

exports.getGroupParticipants = async(id) => {
    var members = await megayaa.groupMetadata(id)
    var members = members.participants
    let mem = []
    for (let i of members) {
        mem.push(i.jid)
    }
    return mem
}

exports.getGroupAdmins = async(participants) => {
    admins = []
    for (let i of participants) {
        i.isAdmin ? admins.push(i.jid) : ''
    }
    return admins
}

exports.getGroupInvitationCode = async(id) => {
    const linkgc = await megayaa.groupInviteCode(id)
    const code = "https://chat.whatsapp.com/" + linkgc
    return code
}

exports.kick = function(from, orangnya){
	for (let i of orangnya){
		megayaa.groupRemove(from, [i])
	}
}

exports.add = function(from, orangnya){
	megayaa.groupAdd(from, orangnya)
}

exports.kickMember = async(id, target = []) => {
    const group = await megayaa.groupMetadata(id)
    const owner = g.owner.replace("c.us", "s.whatsapp.net")
    const me = megayaa.user.jid
    for (i of target) {
        if (!i.includes(me) && !i.includes(owner)) {
            await megayaa.groupRemove(to, [i])
        } else {
            await this.sendMessage(id, "Not Premited!")
            break
        }
    }
}

exports.sendKontak = (from, nomor, nama) => {
	const vcard = 'BEGIN:VCARD\n' + 'VERSION:3.0\n' + 'FN:' + nama + '\n' + 'ORG:Kontak\n' + 'TEL;type=CELL;type=VOICE;waid=' + nomor + ':+' + nomor + '\n' + 'END:VCARD'
	megayaa.sendMessage(from, {displayname: nama, vcard: vcard}, MessageType.contact)
}

exports.promoteAdmin = async(to, target = []) => {
    const g = await megayaa.groupMetadata(to)
    const owner = g.owner.replace("c.us", "s.whatsapp.net")
    const me = megayaa.user.jid
    for (i of target) {
        if (!i.includes(me) && !i.includes(owner)) {
            await megayaa.groupMakeAdmin(to, [i])
        } else {
            await this.sendMessage(to, "Not Premited!")
            break
        }
    }
}

exports.demoteAdmin = async(to, target = []) => {
    const g = await megayaa.groupMetadata(to)
    const owner = g.owner.replace("c.us", "s.whatsapp.net")
    const me = megayaa.user.jid
    for (i of target) {
        if (!i.includes(me) && !i.includes(owner)) {
            await megayaa.groupDemoteAdmin(to, [i])
        } else {
            await this.sendMessage(to, "Not Premited!")
            break
        }
    }
}

exports.getUserName = async(jid) => {
    const user = megayaa.contacts[jid]
    return user != undefined ? user.notify : ""
}

exports.getBio = async(mids) => {
    const pdata = await megayaa.getStatus(mids)
    if (pdata.status == 401) {
        return pdata.status
    } else {
        return pdata.status
    }
}

exports.getPictProfile = async(mids) => {
    try {
        var url = await megayaa.getProfilePicture(mids)
    } catch {
        var url = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
    }
    return url
}
