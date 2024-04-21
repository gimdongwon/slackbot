const express = require("express");
const { getMenuList, postMenu } = require("./services/notion");
const { sendSlackMessage, getRecommendFoods } = require("./services/slack");
const PORT = process.env.PORT || 5001;

const app = express();

app.use(express.json());

/**
 * 노션 캘린더 데이터 가져오기
 */

app.get("/getMenuList", async (req, res) => {
  const calendars = await getMenuList();
  res.json(calendars);
});

app.post("/createMenu", async (req, res) => {
  const result = await postMenu(req.body);
  res.status(200).json(result);
});

app.post("/sendSlackMessage", async (req, res) => {
  const result = await sendSlackMessage();
  res.json(result);
});

app.get("/getRecommendFood", async (req, res) => {
  const result = await getRecommendFoods();
  res.json(result);
});

app.listen(PORT, console.log(`Server started on port ${PORT}`));
