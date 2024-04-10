const { WebClient } = require("@slack/web-api");

// An access token (from your Slack app or custom integration - xoxp, xoxb)
const token = process.env.SLACK_TOKEN;

const web = new WebClient(token);

// This argument can be a channel ID, a DM ID, a MPDM ID, or a group ID
const conversationId = "C06U9GT0VH6";

module.exports.sendSlackMessage = async () => {
  try {
    const res = await web.chat.postMessage({
      channel: conversationId,
      text: "Hello there",
    });

    // `res` contains information about the posted message
    console.log("Message sent: ", res.ts);
  } catch (error) {
    console.error(error);
  }
};
