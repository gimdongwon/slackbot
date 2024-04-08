// services > notion.js를 추가하여 입력합니다.

const dotenv = require("dotenv").config();
const { Client } = require("@notionhq/client");

//기존 Postman에서 Authorization의 Bearer Token 설정한 것과 동일한 의미입니다.
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});
const database_id = process.env.NOTION_DATABASE_ID;

module.exports.getCalendarList = async function getCalendarList() {
  const { results } = await notion.databases.query({
    database_id: database_id,
  });
  const calendar = results.map((page) => {
    return {
      id: page?.id,
      title: page?.properties?.Name?.title[0]?.text?.content,
      gender: page?.properties?.Gender?.multi_select[0]?.name,
      age: page?.properties?.Age?.number,
    };
  });
  return calendar;
};

module.exports.postCalendar = async function postCalendar(text) {
  try {
    const response = await notion.pages.create({
      parent: { database_id },
      properties: {
        title: {
          rich_text: [
            {
              text: {
                content: "yeonwoo",
              },
            },
          ],
        },
      },
    });
    console.log(response);
    console.log("Success! Entry added.");
  } catch (error) {
    console.error(error.body);
  }
};
