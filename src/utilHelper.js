module.exports = {
  offsetTime: (time) => {
    const dateOffset = 8 * 60 * 60 * 1000
    return new Date(time.getTime() + dateOffset)
  },
  getLaterDate: (nowDate, delay, type) => {
    const multipliers = {
      month: 30 * 24 * 60 * 60 * 1000,
      day: 24 * 60 * 60 * 1000,
      hour: 60 * 60 * 1000,
      minute: 60 * 1000,
      second: 1000,
    }
    const multiplier = multipliers[type] || multipliers.day
    const expiresInMilliseconds = delay * multiplier
    return new Date(nowDate.getTime() + expiresInMilliseconds)
  },
  getImageBase64: async (imagePath) => {
    const fs = require("fs")
    const util = require("util")
    const path = require("path")
    const readFile = util.promisify(fs.readFile)
    try {
      if (!imagePath) {
        return ""
      }
      const buffer = await readFile(imagePath, { encoding: "base64" })
      const ext = path.extname(imagePath)
      return `data:image/${ext};base64,${buffer}`
    } catch (err) {
      throw err
    }
  },
  errorResponse: async (
    res,
    rtnCode,
    rtnMsg,
    rollbackFunction,
    data = null
  ) => {
    try {
      if (rollbackFunction) {
        await rollbackFunction()
      }
    } catch (err) {
      throw err
    }
    res.status(200).json({ rtnCode, rtnMsg, data })
  },
  snakeToCamel: function (obj) {
    const convertKey = (key) => {
      return key
        .replace(/([-_][a-zA-Z])/g, (group) => group.charAt(1).toUpperCase())
        .replace(/^[A-Z]/, (match) => match.toLowerCase())
    }
    if (Array.isArray(obj)) {
      return obj.map(this.snakeToCamel, this)
    } else if (obj !== null && obj.constructor === Object) {
      return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [
          convertKey(key),
          this.snakeToCamel(value),
        ])
      )
    }
    return obj
  },
  camelToSnake: function (obj) {
    if (Array.isArray(obj)) {
      return obj.map((item) => this.camelToSnake(item))
    } else if (obj !== null && obj.constructor === Object) {
      return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [
          key.replace(/([A-Z])/g, (group) => `_${group.toLowerCase()}`),
          this.camelToSnake(value),
        ])
      )
    }
    return obj
  },
  trimAllSpace: (str) => {
    return str.replace(/\s/g, "")
  },
  flattenObject: function (data) {
    let flattenedData = { ...data }

    for (let key in flattenedData) {
      if (
        typeof flattenedData[key] === "object" &&
        !(flattenedData[key] instanceof Date) &&
        flattenedData[key] !== null
      ) {
        const nestedObject = flattenedData[key]
        delete flattenedData[key]
        flattenedData = {
          ...flattenedData,
          ...this.flattenObject(nestedObject),
        }
      }
    }

    return flattenedData
  },
  formatQueryData: function (queryData) {
    const dataJson = queryData.toJSON()
    const dataCamel = this.snakeToCamel(dataJson)
    return this.flattenObject(dataCamel)
  },
  formatQueryAllData: function (queryData) {
    return queryData.map((data) => {
      const dataJson = data.toJSON()
      const dataCamel = this.snakeToCamel(dataJson)
      return this.flattenObject(dataCamel)
    })
  },
  getCleanedIP: (ip) => {
    if (ip.startsWith("::ffff:")) {
      return ip.substr(7)
    }
    return ip
  },
  writeToJSON: (filePath, data) => {
    const fs = require("fs")
    try {
      const dataJSON = JSON.stringify(data, null, 2)
      fs.writeFileSync(filePath, dataJSON, { flag: "w" })
    } catch (err) {
      throw err
    }
  },
  bypassQueryCheckIfAdmin: (
    roles,
    originalWhereObject,
    removeProperties = ["user_id", "creator_id"]
  ) => {
    const isAdmin = roles.some((role) => role.roleName === "admin")
    // 創建一個新的對象來避免修改原始對象
    const newWhereObject = { ...originalWhereObject }

    if (isAdmin) {
      // 循環需要移除的屬性並從新對象中移除它們
      removeProperties.forEach((property) => {
        delete newWhereObject[property]
      })
    }

    return isAdmin ? newWhereObject : originalWhereObject
  },
  generatePassword: () => {
    const charset =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*(),.?":{}|<>'
    let password = ""
    let isValid = false

    while (!isValid) {
      password = ""
      let hasUpperCase = false
      let hasLowerCase = false
      let hasSpecialChar = false

      for (let i = 0; i < 10; i++) {
        const randomChar = charset.charAt(
          Math.floor(Math.random() * charset.length)
        )
        password += randomChar

        if (!hasUpperCase && /[A-Z]/.test(randomChar)) hasUpperCase = true
        if (!hasLowerCase && /[a-z]/.test(randomChar)) hasLowerCase = true
        if (!hasSpecialChar && /[!@#$%^&*(),.?":{}|<>]/.test(randomChar))
          hasSpecialChar = true
      }

      isValid =
        hasUpperCase &&
        hasLowerCase &&
        hasSpecialChar &&
        !/^[a-zA-Z][1-2]\d{8}$/.test(password)
    }

    return password
  },
}
