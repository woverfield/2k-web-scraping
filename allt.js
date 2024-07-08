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
        type: "allt",
      });
    }
  });
};

scrapeSite()
  .then((alltPlayersArray) => {
    const alltPlayersJSON = JSON.stringify(alltPlayersArray, null, 2);
    console.log(alltPlayersJSON);
  })
  .catch((error) => {
    console.error("Error scraping site:", error);
  });
