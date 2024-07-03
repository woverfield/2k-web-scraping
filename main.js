const axios = require('axios');
const cheerio = require('cheerio');

const scrapeSite = async () => {
    const url = 'https://www.nba2klab.com/nba2k-player-ratings';
    const { data } = await axios.get(url);

    const $ = cheerio.load(data);

    const scriptContents = $('script#__NEXT_DATA__').html();

    const jsonData = JSON.parse(scriptContents);

    const players = jsonData.props.pageProps.data;

    const results = players.map(player => ({
        Player: player.Player,
        Team: player.Team,
        Overall: player.Overall,
    }));

    return results;
}


scrapeSite().then((result) => {
    console.log(result);
})