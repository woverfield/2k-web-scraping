const axios = require("axios");
const cheerio = require("cheerio");

const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000; // 1 second

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

    const scrapePromises = result.map(team => scrapeTeam(team.link, team.teamName));

    try {
        const players = await Promise.all(scrapePromises);
        console.log(players);
    } catch (error) {
        console.error('Error scraping teams:', error);
    }
};

const scrapeTeam = async (url, teamName) => {
  let attempt = 0;
  while (attempt < MAX_RETRY_ATTEMPTS) {
      try {
          const { data } = await axios.get(url);
          // Process data
          return data;
      } catch (error) {
          if (error.code === 'ECONNRESET' && attempt < MAX_RETRY_ATTEMPTS - 1) {
              console.log(`Retrying ${url}...`);
              await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
              attempt++;
          } else {
              throw error;
          }
      }
  }
  throw new Error(`Failed after ${MAX_RETRY_ATTEMPTS} attempts`);
};

scrapeSite();
