const RedisConnect = () => {
  const redis = require("redis");
  const util = require("util");
  const redisUrl = "redis://127.0.0.1:6379";

  const client = redis
    .createClient("6379", "127.0.0.1")
    .on("error", (error) => console.log(error))
    .on("connect", () => console.log("connected to redis"));

  client.set = util.promisify(client.set).bind(client);
  client.get = util.promisify(client.get).bind(client);
  client.connect();
  return client;
};

module.exports = RedisConnect;
