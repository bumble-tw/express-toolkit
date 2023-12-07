const Redis = require("ioredis")
const JSONbig = require("json-bigint")

function createRedisClient(options) {
  const redisOptions = {
    host: options.redisHost || "localhost",
    port: options.redisPort || 6379,
    password: options.redisPassword || "",
    maxRetriesPerRequest: 1,
    retryStrategy(times) {
      const delay = Math.min(times * 500, 2000)
      return delay
    },
  }
  return new Redis(redisOptions)
}

function redisListener(clients) {
  clients.forEach((client, index) => {
    client.on("connect", function () {
      console.log(`Client ${index + 1} connected`)
    })

    client.on("error", function (err) {
      console.log("Error " + err)
    })

    client.on("end", function () {
      console.log(`Client ${index + 1} disconnected`)
    })
  })
}

module.exports = {
  setRedisKey: async (cacheKey, cacheData, expired, options = {}) => {
    try {
      const redisClients = [createRedisClient(options)]
      redisListener(redisClients)

      const stringifiedData = JSON.stringify(cacheData)
      await Promise.all(
        redisClients.map((client) =>
          client.set(cacheKey, stringifiedData, "EX", expired)
        )
      )
      console.log("------redis set success------")
    } catch (err) {
      console.error("Error in setRedisKey:", err.message)
      throw err
    }
  },

  deleteRedisKey: async (cacheKey) => {
    try {
      const redisClients = [createRedisClient(options)]
      redisListener(redisClients)

      await Promise.all(redisClients.map((client) => client.del(cacheKey)))
      console.log(`------redis delete success: Key: ${cacheKey} ------`)
    } catch (err) {
      console.error("Error in deleteRedisKey:", err.message)
      throw err
    }
  },

  getRedisKey: async (cacheKey) => {
    try {
      const redisClients = [createRedisClient(options)]
      redisListener(redisClients)

      const promises = redisClients.map((client) => client.get(cacheKey))
      let value = await Promise.any(promises)

      if (value) {
        // Removed logging for successful cache retrieval
        if (typeof value === "string" && value.startsWith("{")) {
          try {
            return JSONbig.parse(value)
          } catch (err) {
            // Only log errors, which are critical for debugging
            console.error("Error parsing JSON:", err.message)
            throw err
          }
        } else {
          // Only log errors, which are critical for debugging
          console.error("Unexpected value type:", typeof value)
          throw new Error("Unexpected value type")
        }
      } else {
        // Removed logging for cache miss
        return null
      }
    } catch (err) {
      // Only log errors, which are critical for debugging
      console.error("Error in getRedisKey:", err.message)
      throw err
    }
  },
}
