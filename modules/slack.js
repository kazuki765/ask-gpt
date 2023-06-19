const { WebClient } = require("@slack/web-api");
const web = new WebClient(process.env.SLACK_BOT_TOKEN);

module.exports = {
  postMessage: web.chat.postMessage,
};
