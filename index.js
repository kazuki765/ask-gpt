require("dotenv").config();

const logger = require("./modules/logger");
const chatgpt = require("./modules/gpt");
const slack = require("./modules/slack");

exports.handler = async (req, res) => {
  const body = req.body;
  const headers = req.headers;
  const event = req.body.event;

  if (body.type === "url_verification") {
    return res.status(200).send(body.challenge);
  }
  if (headers["x-slack-retry-num"]) {
    return res.status(200).send();
  }
  if (!event) {
    return res.status(400).send();
  }
  if (event?.type !== "app_mention") {
    return res.status(200).send();
  }

  const text = event.text;

  try {
    const answer = await chatgpt.ask(convertToQuestion(text));
    logger.info("answer: " + answer);

    await slack.postMessage({
      channel: event.channel,
      text: `<@${event.user}> ${answer}`,
    });

    res.status(200).send();
  } catch (error) {
    logger.error(error);
    res.status(500).send();
  }
};

function convertToQuestion(text) {
  if (!text) return "";

  const mentionFirstIndex = rowText.indexOf("<@");
  const mentionLastIndex = rowText.indexOf(">") + 1;
  const mention = text.substring(mentionFirstIndex, mentionLastIndex);
  const question = text.replace(mention, "").trim();

  logger.debug("mention: " + mention);

  return question;
}
