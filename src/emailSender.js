const nodemailer = require("nodemailer")

async function sendMail(mailOptions, options = {}) {
  if (!options.MAIL_AC || !options.MAIL_PW) {
    throw new Error("請提供帳號密碼(MAIL_AC, MAIL_PW)")
  }

  const transporterOption = {
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: options.MAIL_AC,
      pass: options.MAIL_PW,
    },
    proxy: options.TRANSPORTS_PROXY,
    connectionTimeout: options.DEBUG_MODE ? 10000 : 120000,
    greetingTimeout: options.DEBUG_MODE ? 5000 : 30000,
    socketTimeout: options.DEBUG_MODE ? 60000 : 600000,
    logger: options.DEBUG_MODE || false,
    debug: options.DEBUG_MODE || false,
  }

  const transporter = nodemailer.createTransport(transporterOption)
  if (options.PROXY_TYPE === "socks5") {
    transporter.set("proxy_socks_module", require("socks"))
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log("信件寄送成功！")
  } catch (error) {
    throw error
  }
}

module.exports = sendMail
