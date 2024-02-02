const { validateInput } = require("./src/validators")
const { ValidationError } = require("./src/error")

//test area
;(function testArea() {
  try {
    const testValue = "220220"
    const validateData = validateInput([
      {
        labelName: "郵遞區號",
        inputName: "postalCode",
        inputValue: testValue,
        validateWay: "isPostalCode",
        isRequired: true,
      },
    ])
    console.log(validateData)
  } catch (e) {
    throw new ValidationError(e.message)
  }
})()
