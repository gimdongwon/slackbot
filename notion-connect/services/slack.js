const { WebClient, LogLevel } = require("@slack/web-api");

// An access token (from your Slack app or custom integration - xoxp, xoxb)
const token = process.env.SLACK_BOT_TOKEN;

const web = new WebClient(token, {
  logLevel: LogLevel.DEBUG,
});

// This argument can be a channel ID, a DM ID, a MPDM ID, or a group ID
const conversationId = process.env.CONVERSATION_ID;

module.exports.sendSlackMessage = async () => {
  try {
    const res = await web.chat.postMessage({
      channel: conversationId,
      text: "success!!",
    });

    // `res` contains information about the posted message
    console.log("Message sent: ", res.ts);
    return res;
  } catch (error) {
    console.error(error);
  }
};
