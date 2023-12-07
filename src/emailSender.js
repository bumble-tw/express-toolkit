const nodemailer = require("nodemailer")

async function sendMail(mailOptions, options = {}) {
  // 檢查基本的郵件配置是否存在
  if (!options.MAIL_AC || !options.MAIL_PW) {
    throw new Error("請提供帳號密碼(MAIL_AC, MAIL_PW)")
  }

  const transporterOption = {
    host: options.MAIL_HOST || "gmail",
    port: options.MAIL_PORT || 465,
    secure: true,
    auth: {
      user: options.MAIL_AC,
      pass: options.MAIL_PW,
    },
    proxy: options.TRANSPORTS_PROXY || null,
  }

  const transporter = nodemailer.createTransport(transporterOption)

  if (transporterOption.proxy) {
    transporter.set("proxy_socks_module", require("socks"))
  }

  try {
    await transporter.sendMail(mailOptions)
  } catch (error) {
    throw error
  }
}

module.exports = sendMail
