const { WAConnection } = require("@adiwajshing/baileys")
const chalk = require('chalk')
const fs = require("fs")

const megayaa = new WAConnection()
exports.megayaa = megayaa

exports.connect = async() => {
    console.log(chalk.whiteBright('╭─── [ LOG ]'))
    let auth = './client.json'
    megayaa.logger.level = 'warn'
    megayaa.on("qr", () => {
        console.log(`Qr ready, scan`)
    })
    fs.existsSync(auth) && megayaa.loadAuthInfo(auth)
    megayaa.on('connecting', () => {
        console.log(chalk.whiteBright("├"), chalk.keyword("aqua")("[  STATS  ]"), chalk.whiteBright("Connecting..."))
    })
    megayaa.on('open', () => {
        console.log(chalk.whiteBright("├"), chalk.keyword("aqua")("[  STATS  ]"), chalk.whiteBright("WA Version : " + megayaa.user.phone.wa_version))
        console.log(chalk.whiteBright("├"), chalk.keyword("aqua")("[  STATS  ]"), chalk.whiteBright("OS Version : " + megayaa.user.phone.os_version))
        console.log(chalk.whiteBright("├"), chalk.keyword("aqua")("[  STATS  ]"), chalk.whiteBright("Device : " + megayaa.user.phone.device_manufacturer))
        console.log(chalk.whiteBright("├"), chalk.keyword("aqua")("[  STATS  ]"), chalk.whiteBright("Model : " + megayaa.user.phone.device_model))
        console.log(chalk.whiteBright("├"), chalk.keyword("aqua")("[  STATS  ]"), chalk.whiteBright("OS Build Number : " + megayaa.user.phone.os_build_number))
        console.log(chalk.whiteBright("├"), chalk.keyword("aqua")("[  STATS  ]"), chalk.whiteBright('Welcome My Senpai'))
        const authInfo = megayaa.base64EncodedAuthInfo()
        fs.writeFileSync(auth, JSON.stringify(authInfo, null, '\t'))
    })
    await megayaa.connect({ timeoutMs: 30 * 1000 })
    return megayaa
}