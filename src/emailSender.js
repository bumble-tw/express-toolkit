const nodemailer = require("nodemailer")
const smime = require("nodemailer-smime")
const fs = require("fs")
const path = require("path")
require("dotenv").config()

async function sendMail(mailOptions, options = {}) {
  if (!options.MAIL_AC || !options.MAIL_PW) {
    throw new Error("請提供帳號密碼(MAIL_AC, MAIL_PW)")
  }

  const useSSL = options.USE_SSL !== "false" // 預設為 true
  const dirPath = path.join(__dirname, "..", "private")

  const transporterOption = {
    host: options.EMAIL_HOST || "smtp.gmail.com",
    port: options.EMAIL_PORT || 465,
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

  if (useSSL) {
    try {
      if (!fs.existsSync(dirPath)) {
        throw new Error("指定的目錄不存在")
      }

      const certFiles = fs
        .readdirSync(dirPath)
        .filter((file) => path.extname(file) === ".crt")

      if (certFiles.length === 0) {
        throw new Error("No .crt files found in the directory")
      }

      const certPath = path.join(dirPath, certFiles[0])

      const keyFiles = fs
        .readdirSync(dirPath)
        .filter((file) => path.extname(file) === ".key")

      if (keyFiles.length === 0) {
        throw new Error("No .key files found in the directory")
      }

      const keyPath = path.join(dirPath, keyFiles[0])

      transporter.use(
        "stream",
        smime({
          cert: fs.readFileSync(certPath, "utf8"),
          key: fs.readFileSync(keyPath, "utf8"),
          chain: "", // 如果有需要，添加 CA 憑證鏈
          signing: {
            signingTime: new Date(),
            from: options.MAIL_AC,
          },
        })
      )
    } catch (error) {
      console.error("SSL 設定錯誤:", error)
      throw error
    }
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log("信件寄送成功！")
  } catch (error) {
    console.error("信件寄送失敗:", error)
    throw error
  }
}

module.exports = sendMail
