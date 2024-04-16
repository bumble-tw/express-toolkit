const nodemailer = require("nodemailer")
const { HttpsProxyAgent } = require("https-proxy-agent")

async function sendMail(mailOptions, options = {}) {
  // 檢查基本的郵件配置是否存在
  if (!options.MAIL_AC || !options.MAIL_PW) {
    throw new Error("請提供帳號密碼(MAIL_AC, MAIL_PW)")
  }

  const transporterOption = {
    service: options.MAIL_HOST || "gmail",
    port: options.MAIL_PORT || 465,
    secure: true,
    auth: {
      user: options.MAIL_AC,
      pass: options.MAIL_PW,
    },
    // 初始無 proxy 配置
  }

  // 根據 options.PROXY_TYPE 設定 proxy
  if (options.PROXY_TYPE && options.TRANSPORTS_PROXY) {
    switch (options.PROXY_TYPE.toLowerCase()) {
      case "socks":
        transporterOption.proxy = options.TRANSPORTS_PROXY
        transporter.set("proxy_socks_module", require("socks"))
        break
      case "https":
        transporterOption.proxy = new HttpsProxyAgent(options.TRANSPORTS_PROXY)
        break
      default:
        throw new Error(
          "未支持的代理類型(PROXY_TYPE)，請選擇 'socks' 或 'https'"
        )
    }
  }

  const transporter = nodemailer.createTransport(transporterOption)

  try {
    await transporter.sendMail(mailOptions)
  } catch (error) {
    throw error
  }
}

module.exports = sendMail
