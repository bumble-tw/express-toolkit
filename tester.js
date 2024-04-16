const { validateInput } = require("./src/validators")
const { ValidationError } = require("./src/error")
const sendMail = require("./src/emailSender")

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
      from: "",
      to: "",
      subject: `帳號信箱驗證連結`,
      html: `
      <h1>請點擊以下連結完成您的信箱驗證</h1>
    `,
    }
    const options = {
      MAIL_AC: "",
      MAIL_PW: "",
      PROXY_TYPE: "https",
      TRANSPORTS_PROXY: "http://localhost:3128",
    }

    await sendMail(mailOptions, options)
  } catch (err) {
    console.error(err)
  }
}

// testPasswordValidate()
testSendEmail()
