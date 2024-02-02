const Joi = require("joi")
const { ValidationError } = require("./error")
const idNumberValidation = (value) => {
  try {
    const charMap = {
      A: 10,
      B: 11,
      C: 12,
      D: 13,
      E: 14,
      F: 15,
      G: 16,
      H: 17,
      I: 34,
      J: 18,
      K: 19,
      L: 20,
      M: 21,
      N: 22,
      O: 35,
      P: 23,
      Q: 24,
      R: 25,
      S: 26,
      T: 27,
      U: 28,
      V: 29,
      W: 32,
      X: 30,
      Y: 31,
      Z: 33,
    }
    let sum = 0
    const convertedPrefix = charMap[value.charAt(0)].toString()
    sum += parseInt(convertedPrefix.charAt(0)) * 1
    sum += parseInt(convertedPrefix.charAt(1)) * 9

    for (let i = 1; i < 9; i++) {
      sum += parseInt(value.charAt(i)) * (9 - i)
    }
    sum += parseInt(value.charAt(9)) * 1

    if (sum % 10 !== 0) {
      throw `身分證格式錯誤`
    }
    return value
  } catch (err) {
    throw err
  }
}

const baseErrorMessages = {
  "string.base": "{#label} 必須是一個字串",
  "string.email": "請輸入有效的電子郵件地址",
  "string.empty": "{#label} 不得為空",
  "any.required": "{#label} 此欄位是必填的",
  "date.format":
    "{#label} 必須是有效的timestamp格式，ex:[2023-10-08T16:00:13.315Z]",
  "date.less": "{#label} 必須在當前日期之前",
  "boolean.base": "{#label} 必須為布林值",
  "object.base": "{#label} 必須為物件",
  "number.base": "{#label} 必須為數字",
  "string.guid": "{#label} 必須為UUID格式",
  "array.base": "{#label} 必須是一個陣列",
  "date.base":
    "{#label} 日期格式必須如是'YYYY-MM-DD'或'YYYY-MM-DDTHH:mm:ss.sssZ'",
}

const rules = {
  isDate: Joi.date()
    .label("日期")
    .iso()
    .messages({
      ...baseErrorMessages,
    }),
  email: Joi.string()
    .label("信箱")
    .email()
    .min(8)
    .max(255)
    .trim()
    .lowercase()
    .messages({
      ...baseErrorMessages,
      "string.min": "{#label}長度需再8~255字元之間",
      "string.max": "{#label}長度需再8~255字元之間",
    }),
  password: Joi.string()
    .label("密碼")
    .min(10)
    .max(16)
    .pattern(/[!@#$%^&*(),.?":{}|<>]/)
    .pattern(/[A-Z]/)
    .pattern(/[a-z]/)
    .invalid(new RegExp("^[a-zA-Z][1-2]\\d{8}$"))
    .messages({
      ...baseErrorMessages,
      "string.pattern.base": "{#label} 格式錯誤",
      "string.min": "{#label} 長度必須為10~16字之間",
      "string.max": "{#label} 長度必須為10~16字之間",
    }),
  isString: Joi.string().label("文字").trim().messages(baseErrorMessages),
  userName: Joi.string()
    .label("姓名")
    .trim()
    .pattern(/^[a-zA-Z\s\u4e00-\u9fa5]+$/)
    .min(2)
    .max(30)
    .messages({
      ...baseErrorMessages,
      "string.pattern.base": "{#label} 僅限中英文",
      "string.min": "{#label} 長度需在2字元以上",
      "string.max": "{#label} 長度需在30字元以內",
    }),
  birthday: Joi.date()
    .label("生日")
    .iso()
    .less("now")
    .messages(baseErrorMessages),
  idNumber: Joi.string()
    .label("身分證")
    .trim()
    .pattern(/^[a-zA-Z][1-2]\d{8}$/)
    .custom(idNumberValidation)
    .messages({
      ...baseErrorMessages,
      "string.pattern.base": "{#label} 格式錯誤",
    }),
  isBoolean: Joi.boolean().messages(baseErrorMessages),
  isObject: Joi.object().messages(baseErrorMessages),
  isAlphabet: Joi.string()
    .trim()
    .pattern(/^[a-zA-Z]+$/)
    .messages({
      ...baseErrorMessages,
      "string.pattern.base": "{#label}僅限英文",
    }),
  isAlphaNumeric: Joi.string()
    .label("英數字串")
    .trim()
    .pattern(/^[a-zA-Z0-9]+$/)
    .messages({
      ...baseErrorMessages,
      "string.pattern.base": "{#label} 只能包含英文字母和數字",
    }),
  isNumber: Joi.number()
    .integer()
    .messages({
      ...baseErrorMessages,
      "number.max": "{#label} 必須小於或等於{#limit}",
      "number.min": "{#label} 必須大於或等於{#limit}",
      "any.only": "{#label} 輸入錯誤",
    }),
  isUUID: Joi.string()
    .guid(/*{ version: ["uuidv4"]}*/)
    .messages(baseErrorMessages),
  isArray: Joi.array().when(Joi.ref("$isRequired"), {
    is: true,
    then: Joi.array()
      .min(1)
      .messages({
        ...baseErrorMessages,
        "array.min": "{#label}至少要有一個元素",
      }),
    otherwise: Joi.array()
      .allow(null, "")
      .optional()
      .messages(baseErrorMessages),
  }),
}

const validateInput = (inputArray) => {
  try {
    const schemaObj = {}

    for (const item of inputArray) {
      const {
        labelName, //錯誤時顯示的標籤名稱
        inputName, //欄位名稱
        inputValue, //欄位值
        validateWay, //驗證方式
        isRequired = true, //是否必填
        minLength, //最小長度
        maxLength, //最大長度
        enumValues, //enum限定有效值
        toLowerCase = false, //是否轉換為小寫
        toUpperCase = false,
      } = item

      // 新增：如果需要轉換為小寫
      let processedInputValue = inputValue
      if (toLowerCase && typeof inputValue === "string") {
        processedInputValue = inputValue.toLowerCase()
      }

      if (toUpperCase && typeof inputValue === "string") {
        processedInputValue = inputValue.toUpperCase()
      }

      // 如果欄位值為undefined或null且不是必填的，則跳過
      if (!inputValue && isRequired === false) continue

      let rule = rules[validateWay]
      if (!rule) {
        throw new Error(`Validation rule '${validateWay}' not found.`)
      }

      // 如果該欄位是必填的
      if (isRequired) {
        rule = rule.required()
      }

      if (minLength !== undefined) {
        rule = rule.min(minLength)
      }

      if (maxLength !== undefined) {
        rule = rule.max(maxLength)
      }

      if (enumValues && Array.isArray(enumValues)) {
        rule = rule.valid(...enumValues)
      }

      if (validateWay === "isArray" && item.itemValidateWay) {
        const itemRule = rules[item.itemValidateWay]
        if (!itemRule) {
          throw new Error(
            `Validation rule '${item.itemValidateWay}' not found.`
          )
        }
        rule = rule.items(itemRule) // 使用 itemRule 來驗證陣列內的項目
      }

      // 檢查規則是否有預設的標籤
      const defaultLabel = rule._flags.label

      schemaObj[inputName] = rule.label(labelName || defaultLabel || inputName)
    }
    const schema = Joi.object(schemaObj).unknown()
    const { error, value } = schema.validate(
      inputArray.reduce((acc, item) => {
        acc[item.inputName] = item.inputValue
        return acc
      }, {})
    )

    if (error) {
      const err = error.details[0].message.replace(/\"/g, "")
      throw new ValidationError(err)
    }

    return value
  } catch (err) {
    throw err
  }
}

module.exports = {
  validateInput,
}
