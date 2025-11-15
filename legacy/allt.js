const { chromium } = require('playwright');

async function scrapeSite() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  try {
    await page.goto('https://www.2kratings.com/all-time-teams', { waitUntil: 'domcontentloaded' });
    const links = await page.$$eval('td:first-child a', links =>
      links.map(link => ({
        link: link.getAttribute('href'),
        teamName: link.textContent.trim(),
        teamImg: link.querySelector('img') ? link.querySelector('img').src : ''
      }))
    );
    const players = [];
    for (const team of links) {
      const teamUrl = team.link.startsWith('http') ? team.link : `https://www.2kratings.com${team.link}`;
      try {
        await page.goto(teamUrl, { waitUntil: 'domcontentloaded' });
        const teamPlayers = await page.$$eval(
          'tr',
          (rows, args) => {
            const { teamName, teamImg } = args;
            return Array.from(rows).map(row => {
              const playerName = row.querySelector('.entry-font')?.textContent.trim();
              const playerOvr = row.querySelector('.rating-updated')?.textContent.trim();
              const playerMisc = Array.from(row.querySelectorAll('.entry-subtext-font.crop-subtext-font a')).map(a => a.textContent.trim()).filter(Boolean);
              if (playerName && playerOvr && playerMisc.length > 0) {
                return {
                  name: playerName,
                  team: teamName,
                  overall: parseInt(playerOvr),
                  type: 'allt',
                  teamImg: teamImg,
                  playerMisc: playerMisc,
                };
              }
              return null;
            }).filter(Boolean);
          },
          { teamName: team.teamName, teamImg: team.teamImg }
        );
        players.push(...teamPlayers);
      } catch (err) {}
    }
    await browser.close();
    return players;
  } catch (err) {
    await browser.close();
    throw err;
  }
}

scrapeSite()
  .then(players => {
    console.log(JSON.stringify(players, null, 2));
  })
  .catch(() => {
    process.exit(1);
  });
