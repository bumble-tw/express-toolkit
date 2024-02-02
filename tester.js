const { validateInput } = require("./src/validators")

//test area
const validateData = validateInput([
  {
    labelName: "結束時間",
    inputName: "endAt",
    inputValue: "2021-12-31T23:59:59Z",
    validateWay: "isDate",
    isRequired: true,
  },
])

console.log(validateData)
