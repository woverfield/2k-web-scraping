const axios = require("axios");
const cheerio = require("cheerio");

const scrapeSite = async () => {
  const url = "https://www.nba2klab.com/nba2k-player-ratings";
  const { data } = await axios.get(url);

  const $ = cheerio.load(data);

  const scriptContents = $("script#__NEXT_DATA__").html();

  const jsonData = JSON.parse(scriptContents);

  const players = jsonData.props.pageProps.data;

  const results = players.map((player) => ({
    name: player.Player,
    team: player.Team,
    overall: player.Overall,
    type: "curr",
  }));

  return results;
};

scrapeSite()
  .then((currPlayersArray) => {
    const currPlayersJSON = JSON.stringify(currPlayersArray, null, 2);
    console.log(currPlayersJSON);
  })
  .catch((error) => {
    console.error("Error scraping site:", error);
  });
