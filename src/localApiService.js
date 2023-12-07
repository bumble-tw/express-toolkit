const axios = require("axios")
const { ThirdPartyApiError } = require("./error")

async function fetchLocalApiData(url, cookie, userId) {
  try {
    const response = await axios.get(url, {
      headers: {
        Cookie: `accessToken=${cookie?.accessToken}`,
        "x-user-id": userId,
      },
      proxy: false,
    })

    if (response.status !== 200) {
      throw new ThirdPartyApiError("Local API 抓取失敗")
    }

    return response.data
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const serverResponse = err
      throw new ThirdPartyApiError(serverResponse)
    } else {
      throw new ThirdPartyApiError(
        "An unexpected error occurred in fetchLocalApiData: " + err
      )
    }
  }
}

async function sendLocalApiData(url, data, cookie, userId) {
  try {
    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${cookie?.accessToken}`,
        "x-user-id": userId,
      },
      proxy: false,
    })
    if (response.status !== 200) {
      throw new ThirdPartyApiError("Local API 送出失敗")
    }
    return response.data
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const serverResponse = err.response
      throw new ThirdPartyApiError(serverResponse.data.rtnMsg)
    } else {
      throw new ThirdPartyApiError(
        "An unexpected error occurred in sendLocalApiData: " + err.message
      )
    }
  }
}

//putLocalApiData
async function modifiedLocalApiData(url, data, cookie, userId) {
  try {
    const response = await axios.put(url, data, {
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${cookie?.accessToken}`,
        "x-user-id": userId,
      },
      proxy: false,
    })
    if (response.status !== 200) {
      throw new ThirdPartyApiError("Local API 修改失敗")
    }
    return response.data
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const serverResponse = err.response
      throw new ThirdPartyApiError(serverResponse.data.rtnMsg)
    } else {
      throw new ThirdPartyApiError(
        "An unexpected error occurred in modifiedLocalApiData: " + err.message
      )
    }
  }
}

async function deleteLocalApiData(url, cookie, userId) {
  try {
    const response = await axios.delete(url, {
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${cookie?.accessToken}`,
        "x-user-id": userId,
      },
      proxy: false,
    })
    if (response.status !== 200) {
      throw new ThirdPartyApiError("Local API 刪除失敗")
    }
    return response.data
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const serverResponse = err.response
      throw new ThirdPartyApiError(serverResponse.data.rtnMsg)
    } else {
      throw new ThirdPartyApiError(
        "An unexpected error occurred in deleteLocalApiData: " + err.message
      )
    }
  }
}

module.exports = {
  fetchLocalApiData,
  sendLocalApiData,
  deleteLocalApiData,
  modifiedLocalApiData,
}
