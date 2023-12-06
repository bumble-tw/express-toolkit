require("dotenv").config()
const FormData = require("form-data")
const fetch = require("node-fetch")
const { SocksProxyAgent } = require("socks-proxy-agent")

async function cfCheck(token, ip) {
  try {
    const agent = process.env.TRANSPORTS_PROXY
      ? new SocksProxyAgent(process.env.TRANSPORTS_PROXY)
      : null

    const SECRET_KEY = process.env.CFKEY

    const formData = new FormData()
    formData.append("secret", SECRET_KEY)
    formData.append("response", token)
    formData.append("remoteip", ip)

    const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify"
    const result = await fetch(url, {
      body: formData,
      method: "POST",
      agent,
    })

    const outcome = await result.json()
    return outcome.success
  } catch (err) {
    throw err
  }
}

module.exports = cfCheck
