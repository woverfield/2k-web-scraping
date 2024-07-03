const axios = require("axios");
const cheerio = require("cheerio");

const scrapeSite = async () => {
  const url = "https://www.2kratings.com/all-time-teams";
  const { data } = await axios.get(url);

  const $ = cheerio.load(data);

  const links = $("td:first-child a");

  const result = [];

  links.each((index, element) => {
    const link = $(element).attr("href");
    result.push(link);
  });


  result.forEach((team, index) => {
    scrapeTeam(team);
  })

  return result;
};

const scrapeTeam = async (url) => {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  const playerNames = [];

  $("tr").each((index, element) => {
    const playerName = $(element).find(".entry-font").text().trim();
    const playerOvr = $(element).find(".rating-updated").text().trim();

    if (playerName && playerOvr) {
      playerNames.push({playerName, playerOvr});
    }
  });

  console.log(playerNames);
  return playerNames;
};

scrapeSite();
