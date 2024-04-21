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

module.exports.getMenuList = async function getMenuList() {
  const { results } = await notion.databases.query({
    database_id,
  });
  const MenuList = results.map((page) => {
    return {
      id: page?.id,
      title: page.properties.Title.title[0].plain_text,
      type: page.properties.Type.rich_text[0].plain_text,
      recommendTime: page.properties.RecommendTime.rich_text[0].plain_text,
      michelin: page.properties.Michelin.rich_text[0].plain_text,
      mainMenu: page.properties.MainMenu.rich_text[0].plain_text,
      address: page.properties.Address.rich_text[0].plain_text,
      link: page.properties.Link.rich_text[0].plain_text,
      comment: page.properties.Comment.rich_text[0].plain_text,
    };
  });
  return MenuList;
};

module.exports.postMenu = async function postMenu(req) {
  const today = new Date().toYYYYMMDD();
  try {
    const handlePropertiesObj = (target) => {
      return {
        rich_text: [
          {
            type: "text",
            text: {
              content: target,
            },
          },
        ],
      };
    };
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
      Type: handlePropertiesObj(req.type),
      RecommendTime: handlePropertiesObj(req.RecommendTime),
      Michelin: handlePropertiesObj(req.Michelin),
      MainMenu: handlePropertiesObj(req.MainMenu),
      Address: handlePropertiesObj(req.Address),
      Link: handlePropertiesObj(req.Link),
      Comment: handlePropertiesObj(req.Comment),
    };
    const result = await notion.pages.create({
      parent: { database_id },
      properties,
      created_time: {
        on_or_after: today,
      },
    });
    return result;
  } catch (error) {
    console.error(error, "error");
  }
};
