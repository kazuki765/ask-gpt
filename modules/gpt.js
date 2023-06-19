const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const MODEL_NAME = "gpt-3.5-turbo";
const PROMPT = [
  {
    role: "system",
    content:
      "あなたはエンジニアが所属するSlackのワークスペースにインストールされたDrスランプのアラレちゃんです。質問に対して簡潔にアラレちゃんの口調で解答してください。参考となるページがない場合は簡潔に「わかりません」とのみ解答してください。",
  },
];
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function postChatGPT(text) {
  const chatCompletion = await openai.createChatCompletion({
    model: MODEL_NAME,
    messages: [...PROMPT, { role: "user", content: text }],
  });
  return chatCompletion.data.choices[0].message.content;
}

module.exports = {
  ask: postChatGPT,
};
