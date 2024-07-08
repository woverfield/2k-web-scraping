const axios = require("axios");
const cheerio = require("cheerio");

const scrapeSite = async () => {
  const url = "https://www.2kratings.com/classic-teams";
  const { data } = await axios.get(url);

  const $ = cheerio.load(data);

  const links = $("td:first-child a");

  const result = [];

  links.each((index, element) => {
    const link = $(element).attr("href");
    const teamName = $(element).text().trim();
    result.push({ link, teamName });
  });

  const players = [];
  const scrapePromises = result.map((team) =>
    scrapeTeam(team.link, team.teamName, players)
  );
  await Promise.all(scrapePromises);

  return players;
};

const scrapeTeam = async (url, teamName, players) => {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  $("tr").each((index, element) => {
    const playerName = $(element).find(".entry-font").text().trim();
    const playerOvr = $(element).find(".rating-updated").text().trim();

    if (playerName && playerOvr) {
      players.push({
        name: playerName,
        team: teamName,
        overall: parseInt(playerOvr),
        type: "class",
      });
    }
  });
};

scrapeSite()
  .then((classPlayersArray) => {
    const classPlayersJSON = JSON.stringify(classPlayersArray, null, 2);
    console.log(classPlayersJSON);
  })
  .catch((error) => {
    console.error("Error scraping site:", error);
  });
