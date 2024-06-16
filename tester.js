const { validateInput } = require("./src/validators")
const { ValidationError } = require("./src/error")
const sendMail = require("./src/emailSender")
require("dotenv").config()

function testPasswordValidate() {
  try {
    const testValue = "Aa123456789011121314"
    const validateData = validateInput([
      {
        labelName: "密碼",
        inputName: "password",
        inputValue: testValue,
        validateWay: "password",
        isRequired: true,
        minLength: 6,
        maxLength: 16,
        customMessages: {
          "string.min": "密碼至少需要 {#limit} 個字元",
        },
      },
    ])
    console.log(validateData)
  } catch (e) {
    if (e instanceof ValidationError) {
      console.error(e.message) // 或其他錯誤處理邏輯
    } else {
      throw e // 重新拋出非驗證相關的錯誤
    }
  }
}

async function testSendEmail() {
  try {
    const mailOptions = {
      from: process.env.MAIL_AC,
      to: process.env.MAIL_TO,
      subject: `帳號信箱驗證連結`,
      html: `
      <h1>請點擊以下連結完成您的信箱驗證</h1>
    `,
    }
    const options = {
      MAIL_AC: process.env.MAIL_AC,
      MAIL_PW: process.env.MAIL_PW,
      PROXY_TYPE: "http", //http, socks5
      TRANSPORTS_PROXY: process.env.TRANSPORTS_PROXY,
      DEBUG_MODE: true,
    }

    await sendMail(mailOptions, options)
  } catch (err) {
    console.error("郵件寄送失敗：", err)
  }
}

function valueTester() {
  try {
    const testValue = "3"
    const validateData = validateInput([
      {
        labelName: "數字",
        inputName: "number",
        inputValue: testValue,
        validateWay: "isNumber",
        isRequired: true,
        minValue: 6,
        maxValue: 16,
      },
    ])
    console.log(validateData)
  } catch (err) {
    if (err instanceof ValidationError) {
      console.error(err.message)
    } else {
      throw err
    }
  }
}

async function redisTester() {
  try {
    const {
      setRedisKey,
      deleteRedisKey,
      getRedisKey,
    } = require("./src/redisSetter")
    const cacheKey = "A"
    const cacheData4 = [1, 2, 3, 4, 5]
    const expired = 5 // seconds
    const options = {
      redisOn: process.env.REDIS_ON,
      redisHost: "127.0.0.1",
      redisPort: 6379,
      redisPassword: "",
      isDev: false,
    }

    // 刪除測試
    await setRedisKey(cacheKey, cacheData4, expired, options)
    const beforeDelGetResult = await getRedisKey(cacheKey, options)
    console.log("beforeDelGetResult: ", beforeDelGetResult)
    await deleteRedisKey(cacheKey, options)
    const afterDelGetResult = await getRedisKey(cacheKey, options)
    console.log("afterDelGetResult: ", afterDelGetResult)

    // timeout 測試
    await setRedisKey(cacheKey, cacheData4, expired, options)
    const beforeTimeoutGetResult = await getRedisKey(cacheKey, options)
    console.log("beforeTimeoutGetResult: ", beforeTimeoutGetResult)
    console.log("Executing next steps...")
    setTimeout(async () => {
      const afterTimeoutGetResult = await getRedisKey(cacheKey, options)
      console.log("afterTimeoutGetResult: ", afterTimeoutGetResult)

      console.log("End of redisTester")
    }, 6000)
  } catch (err) {
    console.error(err)
  }
}

redisTester()
// valueTester()
// testPasswordValidate()
// testSendEmail()
