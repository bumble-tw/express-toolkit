const cfCheck = require("./src/cloudFlareTurnstile")
const sendMail = require("./src/emailSender")
const {
  ValidationError,
  DatabaseConflictError,
  PermissionError,
  ThirdPartyApiError,
} = require("./src/error")
const {
  fetchLocalApiData,
  sendLocalApiData,
  deleteLocalApiData,
  modifiedLocalApiData,
} = require("./src/localApiService")
const {
  setRedisKey,
  deleteRedisKey,
  getRedisKey,
} = require("./src/redisSetter")
const {
  offsetTime,
  getLaterDate,
  getImageBase64,
  errorResponse,
  snakeToCamel,
  camelToSnake,
  trimAllSpace,
  flattenObject,
  formatQueryData,
  formatQueryAllData,
  getCleanedIP,
  writeToJSON,
  bypassQueryCheckIfAdmin,
  generatePassword,
} = require("./src/utilHelper")
const { validateInput } = require("./src/validators")

module.exports = {
  validateInput,
  offsetTime,
  getLaterDate,
  getImageBase64,
  errorResponse,
  snakeToCamel,
  camelToSnake,
  trimAllSpace,
  flattenObject,
  formatQueryData,
  formatQueryAllData,
  getCleanedIP,
  writeToJSON,
  bypassQueryCheckIfAdmin,
  generatePassword,
  cfCheck,
  sendMail,
  fetchLocalApiData,
  sendLocalApiData,
  deleteLocalApiData,
  modifiedLocalApiData,
  setRedisKey,
  deleteRedisKey,
  getRedisKey,
  ValidationError,
  DatabaseConflictError,
  PermissionError,
  ThirdPartyApiError,
}
