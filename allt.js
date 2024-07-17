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
    const teamImg = $(element).find("img").attr("src");

    result.push({ link, teamName, teamImg });
  });

  const players = [];
  const scrapePromises = result.map((team) =>
    scrapeTeam(team.link, team.teamName, team.teamImg, players)
  );
  await Promise.all(scrapePromises);

  return players;
};

const scrapeTeam = async (url, teamName, teamImg, players) => {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  $("tr").each((index, element) => {
    const playerName = $(element).find(".entry-font").text().trim();
    const playerOvr = $(element).find(".rating-updated").text().trim();
    const playerMiscElement = $(element).find(
      ".entry-subtext-font.crop-subtext-font a"
    );
    const playerMisc = [];

    playerMiscElement.each((idx, element) => {
      const miscData = $(element).text().trim();
      if (miscData.length > 0) {
        playerMisc.push(miscData);
      }
    });

    if (playerName && playerOvr && playerMisc.length > 0) {
      players.push({
        name: playerName,
        team: teamName,
        overall: parseInt(playerOvr),
        type: "allt",
        teamImg: teamImg,
        playerMisc: playerMisc,
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
