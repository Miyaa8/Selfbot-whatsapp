const { 
    WAConnection,
		MessageType,
		Presence,
		MessageOptions,
		Mimetype,
		WALocationMessage,
		WA_MESSAGE_STUB_TYPES,
		ReconnectMode,
		ProxyAgent,
		GroupSettingChange,
		ChatModification,
		waChatKey,
		WA_DEFAULT_EPHEMERAL,
		mentionedJid,
		processTime
} = require("@adiwajshing/baileys")
const moment = require("moment-timezone");
const FormData = require('form-data')
const imageToBase64 = require('image-to-base64');
const chalk = require('chalk')
const fs = require("fs")
const { exec } = require('child_process');

const conn = require("./lib/connect")
const msg = require("./lib/message")
const wa = require("./lib/wa")
const { recognize } = require('./lib/ocr');
const help = require("./lib/help")
const postBuffer = help.postBuffer
const getBuffer = help.getBuffer
const getRandom = help.getRandomExt
const postJson = help.postJson
const getJson = help.getJson
const config = JSON.parse(fs.readFileSync("./config.json"))
const owner = config.owner
const mods = config.mods
var public = config.public

conn.connect()
const megayaa = conn.megayaa

const sleep = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

fakeimage = fs.readFileSync(`./lib/image/foto2.jpg`)
fake = 'Simple Selfbot'
prefix = 'z'

megayaa.on('group-participants-update', async(chat) => {
    try {
        var member = chat.participants
        for (var x of member) {
            try {
                if (x == megayaa.user.jid) return
                var photo = await wa.getPictProfile(x)
                var username = await wa.getUserName(x) || "Guest"
                var from = chat.jid
                var group = await megayaa.groupMetadata(from)
                if (chat.action == 'add') {
                     text = `${username}, Wecome to ${group.subject}`
                        wa.sendImage(from, image, text)
                }
                if (chat.action == 'remove') {
                    text = `${username}, Sayonara 👋`
                    await wa.sendMessage(from, text)
                }
            } catch {
                continue
            }
        }
    } catch (e) {
        console.log(chalk.whiteBright("├"), chalk.keyword("aqua")("[  ERROR  ]"), chalk.keyword("red")(e))
    }
})

megayaa.on('chat-update', async(lin) => {
    try {
        if (!lin.hasNewMessage) return
        if (!lin.messages) return
        if (lin.key && lin.key.remoteJid == 'status@broadcast') return
        lin = lin.messages.all()[0]
        if (!lin.message) return
        const from = lin.key.remoteJid
        const type = Object.keys(lin.message)[0]
        const quoted = type == 'extendedTextMessage' && lin.message.extendedTextMessage.contextInfo != null ? lin.message.extendedTextMessage.contextInfo.quotedMessage || [] : []
        const typeQuoted = Object.keys(quoted)[0]
        const body = lin.message.conversation || lin.message[type].caption || lin.message[type].text || ""
        chats = (type === 'conversation') ? lin.message.conversation : (type === 'extendedTextMessage') ? lin.message.extendedTextMessage.text : ''
        if (prefix != "") {
            if (!body.startsWith(prefix)) {
                cmd = false
                comm = ""
            } else {
                cmd = true
                comm = body.slice(1).trim().split(" ").shift().toLowerCase()
            }
        } else {
            cmd = false
            comm = body.trim().split(" ").shift().toLowerCase()
        }

        const reply = async(teks) => {
            await megayaa.sendMessage(from, teks, MessageType.text, { quoted: lin })
        }

        const command = comm
        const args = body.trim().split(/ +/).slice(1)
        const isCmd = cmd
        const meNumber = megayaa.user.jid
        const botNumber = megayaa.user.jid.split("@")[0]
        const isGroup = from.endsWith('@g.us')
        const arg = chats.slice(command.length + 2, chats.length)
        const sender = lin.key.fromMe ? megayaa.user.jid : isGroup ? lin.participant : lin.key.remoteJid
        const senderNumber = sender.split("@")[0]
        const groupMetadata = isGroup ? await megayaa.groupMetadata(from) : ''
        const groupName = isGroup ? groupMetadata.subject : ''
        const groupMembers = isGroup ? groupMetadata.participants : ''
        const groupAdmins = isGroup ? await wa.getGroupAdmins(groupMembers) : []
        const isAdmin = groupAdmins.includes(sender) || false
        const botAdmin = groupAdmins.includes(megayaa.user.jid)
        const totalChat = megayaa.chats.all()
        const itsMe = senderNumber == botNumber
        const isOwner = senderNumber == owner || senderNumber == botNumber || mods.includes(senderNumber)

        const mentionByTag = type == "extendedTextMessage" && lin.message.extendedTextMessage.contextInfo != null ? lin.message.extendedTextMessage.contextInfo.mentionedJid : []
        const mentionByReply = type == "extendedTextMessage" && lin.message.extendedTextMessage.contextInfo != null ? lin.message.extendedTextMessage.contextInfo.participant || "" : ""
        const mention = typeof(mentionByTag) == 'string' ? [mentionByTag] : mentionByTag
        mention != undefined ? mention.push(mentionByReply) : []
        const mentionUser = mention != undefined ? mention.filter(n => n) : []
      
      // Ucapan Waktu
      const hour_now = moment().format('HH')
      var ucapanWaktu = 'Pagi lindow'
      if (hour_now >= '03' && hour_now <= '10') {
       ucapanWaktu = 'Pagi lindow'
      } else if (hour_now >= '10' && hour_now <= '14') {
       ucapanWaktu = 'Siang lindow'
      } else if (hour_now >= '14' && hour_now <= '17') {
        ucapanWaktu = 'Soree lindow'
      } else if (hour_now >= '17' && hour_now <= '18') {
        ucapanWaktu = 'Selamat petang'
      } else if (hour_now >= '18' && hour_now <= '23') {
        ucapanWaktu = 'Malam lindow'
      } else {
        ucapanWaktu = 'Selamat Malam!'
      }

        const isImage = type == 'imageMessage'
        const isVideo = type == 'videoMessage'
        const isAudio = type == 'audioMessage'
        const isSticker = type == 'stickerMessage'
        const isContact = type == 'contactMessage'
        const isLocation = type == 'locationMessage'
        const isMedia = (type === 'imageMessage' || type === 'videoMessage')
        
        typeMessage = body.substr(0, 50).replace(/\n/g, '')
        if (isImage) typeMessage = "Image"
        else if (isVideo) typeMessage = "Video"
        else if (isAudio) typeMessage = "Audio"
        else if (isSticker) typeMessage = "Sticker"
        else if (isContact) typeMessage = "Contact"
        else if (isLocation) typeMessage = "Location"

        const isQuoted = type == 'extendedTextMessage'
        const isQuotedImage = isQuoted && typeQuoted == 'imageMessage'
        const isQuotedVideo = isQuoted && typeQuoted == 'videoMessage'
        const isQuotedAudio = isQuoted && typeQuoted == 'audioMessage'
        const isQuotedSticker = isQuoted && typeQuoted == 'stickerMessage'
        const isQuotedContact = isQuoted && typeQuoted == 'contactMessage'
        const isQuotedLocation = isQuoted && typeQuoted == 'locationMessage'

        if (!public) {
            mods.indexOf(botNumber) === -1 ? mods.push(botNumber) : false
            mods.indexOf(owner) === -1 ? mods.push(owner) : false
            if (!mods.includes(senderNumber)) return
            mods.slice(mods.indexOf(owner), 1)
        }

        if (!isGroup && !isCmd) console.log(chalk.whiteBright("├"), chalk.keyword("aqua")("[ PRIVATE ]"), chalk.whiteBright(typeMessage), chalk.greenBright("from"), chalk.keyword("yellow")(senderNumber))
        if (isGroup && !isCmd) console.log(chalk.whiteBright("├"), chalk.keyword("aqua")("[  GROUP  ]"), chalk.whiteBright(typeMessage), chalk.greenBright("from"), chalk.keyword("yellow")(senderNumber), chalk.greenBright("in"), chalk.keyword("yellow")(groupName))
        if (!isGroup && isCmd) console.log(chalk.whiteBright("├"), chalk.keyword("aqua")("[ COMMAND ]"), chalk.whiteBright(typeMessage), chalk.greenBright("from"), chalk.keyword("yellow")(senderNumber))
        if (isGroup && isCmd) console.log(chalk.whiteBright("├"), chalk.keyword("aqua")("[ COMMAND ]"), chalk.whiteBright(typeMessage), chalk.greenBright("from"), chalk.keyword("yellow")(senderNumber), chalk.greenBright("in"), chalk.keyword("yellow")(groupName))
        
        switch (command) {
            case 'owner':
                await wa.sendContact(from, owner, "Your Name")
                break
            case 'help':
                textnya = `*${ucapanWaktu}*

*> for eval*

1. *${prefix}owner*
To send contact owner

2. *${prefix}public*
To activate public mode

3. *${prefix}self*
To activate self mode

4. *${prefix}setprefix*
To set prefix
Usage : ${prefix}setprefix yournewprefix

5. *${prefix}broadcast*
Broadcast message
Usage : ${prefix}broadcast yourmessags

6. *${prefix}setthumb*
To set or change thumbnail in menu
Usage : ${prefix}setthumb and reply your image or webp

7. *${prefix}fakethumb*
To change menu image
Usage : ${prefix}fakethumb and reply your image

8. *${prefix}stats*
To view your stat

9. *${prefix}block*
Block user
Usage : ${prefix}block 62xxxx

10. *${prefix}unblock*
Unblock user
Usage : ${prefix}unblock 62xxxx

11. *${prefix}leave*
To leave group

12. *${prefix}join*
To join group

13. *${prefix}clearall*
To clearall message

14. *${prefix}hidetag*
Hidetag group
Usage : ${prefix}hidetag halo everyone

15. *${prefix}imagetag*
Hidetag use image
Usage : send image or reply with caption ${prefix}imagetag

16. *${prefix}stickertag*
Hidetag use sticker
Usage : send sticker or reply with caption ${prefix}stickertag

17. *${prefix}promote*
Promote Member in group
Usage : ${prefix}promote @tag

18. *${prefix}demote*
Demote Member in group
Usage : ${prefix}demote @tag

19. *${prefix}admin*
To view list admin

20. *${prefix}linkgc*
To view link gc

21. *${prefix}group open/close*
To unlock or close group

22. *${prefix}setnamegc*
To change subject name gc
Usage : ${prefix}setnamegc yournewsubject

22. *${prefix}setdesc*
To set decs group

23. *${prefix}bugimg*
Usage : ${prefix}bugimg yourtext, don't space!

24. *${prefix}demoteall*
Yes, this is for demote all admin :D

25. *${prefix}ocr*
Usage : send image and reply with caption

26. *${prefix}toimg*
Make sticker to image
Usage : send image and reply with caption ${prefix}toimg

27. *${prefix}shutdown*
To shutdown bot

28. *${prefix}spam*
Spam text
Usage : ${prefix}spam text|jumlahspam

29. *${prefix}add*
Add member or someone
Usage : ${prefix}add 6289xxxx

30. *${prefix}kick*
Kick member
Usage : ${prefix}kick @tag or member

31. *${prefix}setpp*
Set or change your profile picture
Usage : send image and reply with ${prefix}setpp`
            wa.FakeStatusImgForwarded(from, fakeimage, textnya, fake)
                break
          case 'setpp':
             if (!itsMe) return reply('This command only for lindow')
			      	megayaa.updatePresence(from, Presence.composing) 
			       if (!isQuotedImage) return reply(`Kirim gambar dengan caption ${prefix}setpp atau tag gambar yang sudah dikirim`)
			     		var media1 = JSON.parse(JSON.stringify(lin).replace('quotedM','m')).message.extendedTextMessage.contextInfo
					    var media2 = await megayaa.downloadAndSaveMediaMessage(media1)
			    		await megayaa.updateProfilePicture(meNumber, media2)
				    	reply('Done!')
			     		break
          case 'kick':
              if (!isAdmin) return reply('this command only for admin')
			      	if (!args) return reply(`Penggunaan ${prefix}kick @tag atau nomor`)
			      	if (lin.message.extendedTextMessage != undefined){
                    mentioned = lin.message.extendedTextMessage.contextInfo.mentionedJid
				    	await wa.FakeTokoForwarded(from, `Bye...`, fake)
		    			wa.kick(from, mentioned)
			      	} else {
				    	await wa.FakeTokoForwarded(from, `Bye...`, fake)
			    		wa.kick(from, [args[0] + '@s.whatsapp.net'])
		      		}
		      		break
          case 'add':
              if (!isAdmin) return reply('only for admin group')
		     	  	if (!args) return reply(`Penggunaan ${prefix}add 628xxxx`)
		          wa.add(from, [args[0] + '@s.whatsapp.net'])
				      wa.FakeTokoForwarded(from, `Sukses`, fake)
			       	break
          case 'spam':
              if (!itsMe) return reply('This command only for mega')
			      	if (!arg) return reply(`Penggunaan ${prefix}spam teks|jumlahspam`)
				        argz = arg.split("|")
				      if (!argz) return reply(`Penggunaan ${prefix}spam teks|jumlah`)
			      	if (isNaN(argz[1])) return reply(`harus berupa angka`)
			      	for (let i = 0; i < argz[1]; i++){
			    		megayaa.sendMessage(from, argz[0], MessageType.text)
				      }
	      			break
          case 'shutdown':
              if (!itsMe) return reply('This command only for megaa')
			      	await wa.FakeTokoForwarded(from, `Bye...`, fake)
				      await sleep(5000)
			      	megayaa.close()
				      break
          case 'ocr': 
			    	if ((isMedia && !lin.message.videoMessage || isQuotedImage) && args.length == 0) {
	    	    var media1 = isQuotedImage ? JSON.parse(JSON.stringify(lin).replace('quotedM','m')).message.extendedTextMessage.contextInfo : lin
			      var media2 = await megayaa.downloadAndSaveMediaMessage(media1)
			  	  reply("*waitt*")
	    			await recognize(media2, {lang: 'eng+ind', oem: 1, psm: 3})
							.then(teks => {
								reply(teks.trim())
								fs.unlinkSync(media2)
							})
							.catch(err => {
								reply(err.message)
								fs.unlinkSync(media2)
							})
					} else {
						reply(`Send image and reply with caption ${prefix}ocr`)
					}
			     		break
          case 'demoteall':
            members_id = []
		  			for (let mem of groupMembers) {
	   				members_id.push(mem.jid)
	  				}
           megayaa.groupDemoteAdmin(from, members_id)
                break
          case 'bugimg':
            var nnn = body.slice(12)
            var urlnyee = nnn.split("|")[0];
            var titlenyee = nnn.split("|")[1];
            var descnyee = nnn.split("|")[2];
            var run = help.getRandomExt('.jpeg')
            var media1 = isQuotedImage ? JSON.parse(JSON.stringify(lin).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : lin
            var media2 = await megayaa.downloadAndSaveMediaMessage(media1)
            var ddatae = await imageToBase64(JSON.stringify(media2).replace(/\"/gi, ''))
            megayaa.sendMessage(from, {
                                        text: `${body.slice(8)}`,
                                        matchedText: `${urlnyee}`,
                                        canonicalUrl: `${urlnyee}`,
                                        description: `${descnyee}`,
                                        title: `${titlenyee}`,
                                        jpegThumbnail: ddatae
                                }, 'extendedTextMessage', { detectLinks: false})
                megayaa.sendMessage(from, 'Coba reply tuh', MessageType.text)
                  break
            case 'public':
                if (!isOwner && !itsMe) return await reply('This command only for owner or mega')
                if (public) return await reply('already in public mode')
                config["public"] = true
                public = true
                fs.writeFileSync("./config.json", JSON.stringify(config, null, 4))
                await wa.sendFakeStatus(from, "*Success changed to public mode*", "Public : true")
                break
            case 'self':
                if (!isOwner && !itsMe) return await reply('This command only for mega or owner')
                if (!public) return await reply('mode private is already')
                config["public"] = false
                public = false
                fs.writeFileSync("./config.json", JSON.stringify(config, null, 4))
                await wa.sendFakeStatus(from, "*Success changed to self mode*", "Self : true")
                break
            case 'setprefix':
                if (!isOwner && !itsMe) return await reply('This command only for owner or mega')
                var newPrefix = args[0] || ""
                prefix = newPrefix
                await reply("Success change prefix to: " + prefix)
                break
            case 'broadcast':
                if (!isOwner && !itsMe) return await reply('This command only for owner or mega')
                text = args.join(" ")
                for (let chat of totalChat) {
                    await wa.sendMessage(chat.jid, text)
                }
                break
            case 'setthumb':
                if (!isOwner && !itsMe) return await reply('This command only for owner or mega')
                if (!isQuotedImage && !isImage) return await reply('Gambarnya mana?')
                media = isQuotedImage ? JSON.parse(JSON.stringify(lin).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : lin
                media = await megayaa.downloadMediaMessage(media)
                fs.writeFileSync(`./lib/image/foto2.jpg`, media)
                await wa.sendFakeStatus(from, "*Succes changed image for fakethumb*", "success")
                break
            case 'fakethumb':
                if (!isOwner && !itsMe) return await reply('This command only for owner or mega')
                if (!isQuotedImage && !isImage) return await reply('reply image!')
                media = isQuotedImage ? JSON.parse(JSON.stringify(lin).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : lin
                media = await megayaa.downloadMediaMessage(media)
                await wa.sendFakeThumb(from, media)
                break
            case 'stats':
                if (!isOwner && !itsMe) return await reply('This command only for owner or mega')
                text = await msg.stats(totalChat)
                await wa.sendFakeStatus(from, text, "BOT STATS")
                break
            case 'block':
                if (!isOwner && !itsMe) return await reply('This command only for owner or mega')
                if (isGroup) {
                    if (mentionUser.length == 0) return await reply("tag target!")
                    return await wa.blockUser(sender, true)
                }
                await wa.blockUser(sender, true)
                break
            case 'unblock':
                if (!isOwner && !itsMe) return await reply('This command only for owner or mega')
                if (isGroup) {
                    if (mentionUser.length == 0) return await reply("Tag targer!")
                    return await wa.blockUser(sender, false)
                }
                await wa.blockUser(sender, false)
                break
            case 'leave':
                if (!isOwner && !itsMe) return await reply('This command only for owner or mega')
                if (!isGroup) return await reply('This command only for group baka')
                reply(`Akan keluar dari group ${groupName} dalam 3 detik`).then(async() => {
                    await help.sleep(3000)
                    await megayaa.groupLeave(from)
                })
                break
            case 'join':
                if (!isOwner && !itsMe) return await reply('This command only for owner or mega')
                if (isGroup) return await reply('This command only for private chat')
                if (args.length == 0) return await reply('Link group?')
                var link = args[0].replace("https://chat.whatsapp.com/", "")
                await megayaa.acceptInvite(link)
                break
            case 'clearall':
                if (!isOwner && !itsMe) return await reply('This command only for owner or mega')
                for (let chat of totalChat) {
                    await megayaa.modifyChat(chat.jid, "delete")
                }
                await wa.sendFakeStatus(from, "Success clear all chat", "success")
                break

            /** Group **/
            case 'hidetag':
                if (!isOwner && !itsMe) return await reply('This command only for owner or mega')
                if (!isAdmin && !isOwner && !itsMe) return await reply('this command only for admin, baka!')
                await wa.hideTag(from, args.join(" "))
                break
            case 'imagetag':
                if (!isGroup) return await reply('this command only for group')
                if (!isAdmin && !isOwner && !itsMe) return await reply('this command only for admin, baka!')
                if (!isQuotedImage && !isImage) return await reply(`Send image, and reply with caption ${prefix}imagetag`)
                media = isQuotedImage ? JSON.parse(JSON.stringify(lin).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : lin
                buffer = await megayaa.downloadMediaMessage(media)
                await wa.hideTagImage(from, buffer)
                break
            case 'toimg':
			    	    if (!isQuotedSticker) return reply(`send sticker and reply with caption ${prefix}toimg`)
			        	if (lin.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage.isAnimated === true){
					      reply(`Maaf tidak mendukung sticker gif`)
			        	} else {
				      	var media1 = JSON.parse(JSON.stringify(lin).replace('quotedM','m')).message.extendedTextMessage.contextInfo
				       	var media2 = await megayaa.downloadAndSaveMediaMessage(media1)
					      ran = getRandom('.png')
				      	exec(`ffmpeg -i ${media2} ${ran}`, (err) => {
			     			fs.unlinkSync(media2)
			    			if (err) {
							  reply(`error\n\n${err}`)
							  fs.unlinkSync(ran)
					    	} else {
							  buffer = fs.readFileSync(ran)
						  	megayaa.sendMessage(from, buffer, MessageType.image, {quoted: lin, caption: 'success'})
						   	fs.unlinkSync(ran)
					          	}
				          	})
		     	        	}
			        	break
            case 'stickertag':
                if (!isGroup) return await reply('this command only for group')
                if (!isAdmin && !isOwner && !itsMe) return await reply('This command only for admin')
                if (!isQuotedImage && !isImage) return await reply('Stickernya mana?')
                media = isQuotedSticker ? JSON.parse(JSON.stringify(lin).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : lin
                buffer = await megayaa.downloadMediaMessage(media)
                await wa.hideTagSticker(from, buffer)
                break
            case 'promote':
                if (!isGroup) return await reply('this command only for group')
                if (!isAdmin) return await reply('This command only for admin')
                if (!botAdmin) return await reply('jadikan bot admin')
                if (mentionUser.length == 0) return await reply('Tag member')
                await wa.promoteAdmin(from, mentionUser)
                await reply(`Success promote member`)
                break
            case 'demote':
                if (!isGroup) return await reply('this command only for group')
                if (!isAdmin) return await reply('This command only for admin')
                if (!botAdmin) return await reply('This command is available if the bot admin')
                if (mentionUser.length == 0) return await reply('Tag member!')
                await wa.demoteAdmin(from, mentionUser)
                await reply(`Success demote member`)
                break
            case 'admin':
                var text = msg.admin(groupAdmins, groupName)
                await wa.sendFakeStatus(from, text, "LIST ADMIN", groupAdmins)
                break
            case 'linkgc':
                var link = await wa.getGroupInvitationCode(from)
                await wa.sendFakeStatus(from, link, "This link group")
                break
            case 'group':
                if (!isGroup) return await reply('this command only for group')
                if (!isAdmin) return await reply('This command only for admin')
                if (!botAdmin) return await reply('This command is available if the bot admin')
                if (args[0] === 'open') {
                    megayaa.groupSettingChange(from, GroupSettingChange.messageSend, false).then(() => {
                        wa.sendFakeStatus(from, "*Success open group*", "GROUP SETTING")
                    })
                } else if (args[0] === 'close') {
                    megayaa.groupSettingChange(from, GroupSettingChange.messageSend, true).then(() => {
                        wa.sendFakeStatus(from, "*Succes close group*", "GROUP SETTING")
                    })
                } else {
                    await reply(`Example: ${prefix}${command} open/close`)
                }
                break
            case 'setnamegc':
                if (!isGroup) return await reply('this command only for groups')
                if (!isAdmin) return await reply('This command only for admin')
                if (!botAdmin) return await reply('This command is available if the bot admin')
                var newName = args.join(" ")
                megayaa.groupUpdateSubject(from, newName).then(() => {
                    wa.sendFakeStatus(from, "Succes change subject name to" + newName, "GROUP SETTING")
                })
                break
            case 'setdesc':
                if (!isGroup) return await reply('This command only for groups')
                if (!isAdmin) return await reply('This command only for admin')
                if (!botAdmin) return await reply('This command is available if the bot admin')
                var newDesc = args.join(" ")
                megayaa.groupUpdateDescription(from, newDesc).then(() => {
                    wa.sendFakeStatus(from, "Succes change description group to" + newDesc, "GROUP SETTING")
                })
            default:
                if (body.startsWith(">")) {
                    if (!itsMe) return await reply('This command only for meguy')
                    return await reply(JSON.stringify(eval(args.join(" ")), null, 2))
                }
        }
    } catch (e) {
        console.log(chalk.whiteBright("├"), chalk.keyword("aqua")("[  ERROR  ]"), chalk.keyword("red")(e))
    }
})