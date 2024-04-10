// services > notion.js를 추가하여 입력합니다.

const dotenv = require("dotenv").config();
const { Client } = require("@notionhq/client");

//기존 Postman에서 Authorization의 Bearer Token 설정한 것과 동일한 의미입니다.
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});
const database_id = process.env.NOTION_DATABASE_ID;

Date.prototype.toYYYYMMDD = function () {
  const date = new Date(this.valueOf());
  let YYYY = date.getFullYear();
  let MM = date.getMonth() + 1;
  let DD = date.getDate();
  let _MM = MM >= 10 ? `${MM}` : `0${MM}`;
  let _DD = DD >= 10 ? `${DD}` : `0${DD}`;
  return `${YYYY}-${_MM}-${_DD}`;
};

module.exports.getCalendarList = async function getCalendarList() {
  const { results } = await notion.databases.query({
    database_id,
  });
  const calendar = results.map((page) => {
    return {
      id: page?.id,
      title: page?.properties?.Name?.title[0]?.text?.content,
      gender: page?.properties?.Gender?.multi_select?.[0]?.name,
      age: page?.properties?.Age?.number,
    };
  });
  return calendar;
};

module.exports.postCalendar = async function postCalendar(req) {
  const today = new Date().toYYYYMMDD();
  try {
    const properties = {
      title: {
        title: [
          {
            type: "text",
            text: {
              content: req.text,
            },
          },
        ],
      },
      Gender: {
        rich_text: [
          {
            text: {
              content: req.gender,
            },
          },
        ],
      },
      Age: {
        number: req.age,
      },
    };
    const result = await notion.pages.create({
      parent: { database_id },
      properties,
      created_time: {
        on_or_after: today,
      },
    });
    console.log("Success! Entry added.");
    return res.status(200).json(result);
  } catch (error) {
    console.error(error, "error");
  }
};
