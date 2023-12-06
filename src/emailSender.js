const nodemailer = require("nodemailer")
require("dotenv").config()

async function sendMail(mailOptions) {
  const transporterOption = {
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_AC,
      pass: process.env.MAIL_PW,
    },
    proxy: process.env.TRANSPORTS_PROXY,
  }

  const transporter = nodemailer.createTransport(transporterOption)
  if (process.env.TRANSPORTS_PROXY) {
    transporter.set("proxy_socks_module", require("socks"))
  }
  try {
    await transporter.sendMail(mailOptions)
  } catch (error) {
    throw error
  }
}

module.exports = sendMail
