const { WebClient, LogLevel } = require("@slack/web-api");
const { getMenuList } = require("./notion");
// An access token (from your Slack app or custom integration - xoxp, xoxb)
const token = process.env.SLACK_BOT_TOKEN;

const web = new WebClient(token, {
  logLevel: LogLevel.DEBUG,
});

// This argument can be a channel ID, a DM ID, a MPDM ID, or a group ID
const conversationId = process.env.CONVERSATION_ID;

module.exports.sendSlackMessage = async (menu) => {
  try {
    const { title, type, link, address, michelin, mainMenu, comment } = menu;
    const res = await web.chat.postMessage({
      channel: conversationId,
      text: `점심메뉴로 대분류${type}인 ${title} 추천드립니다.\n메인메뉴는 ${mainMenu}이고 주소는 ${address}이고 해당![링크](${link}) 참고해주세요.\n미쉘린여부는 ${michelin}입니다.\nps:${comment}`,
    });

    // `res` contains information about the posted message
    // console.log("Message sent: ", res.message.text);
    return res.message.text;
  } catch (error) {
    console.error(error);
  }
};

module.exports.getRecommendFoods = async () => {
  try {
    const result = await getMenuList();
    const menu = result[Math.floor(Math.random() * result.length)];
    this.sendSlackMessage(menu);
  } catch (error) {
    console.error(error);
  }
};
