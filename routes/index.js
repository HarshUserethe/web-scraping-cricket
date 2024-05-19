var express = require('express');
var router = express.Router();
var cheerio = require('cheerio');
var axios = require('axios');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

async function scrapeRecentData() {
  const url = 'https://www.cricket.com/';

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const matches = [];
    $('.mx-1\\.5.min-w-\\[330px\\]').each((index, element) => {
      const match = {};
      const upcoming = $(element).find('.font-semibold.text-xs').text().trim();
      const league = $(element).find('.text-black.dark\\:text-white.font-mnr.text-sm.font-semibold.line-clamp-1').text().trim();
      const location = $(element).find('.text-gray-2').text().trim();
      const teams = [];
      $(element).find('.font-mnr.text-sm.font-semibold.lable-light').each((i, teamElement) => {
        const team = $(teamElement).text().trim();
        teams.push(team);
      });
      const date = $(element).find('.h-5.mb-2\\.5.mt-0\\.5').text().trim();
      const time = $(element).find('.h-5').text().trim();
      const countdown = $(element).find('.font-semibold.dark\\:text-gray-lgtext.dark\\:text-white.font-mnr.text-xs.text-center').text().trim();
      const probabilities = [];
      $(element).find('.h-1').each((i, probabilityElement) => {
        const probability = $(probabilityElement).next().text().trim();
        probabilities.push(probability);
      });

      match.upcoming = upcoming;
      match.league = league;
      match.location = location;
      match.teams = teams;
      match.date = date;
      match.time = time;
      match.countdown = countdown;
      match.probabilities = probabilities;

      matches.push(match);
    });

    console.log(matches);
    return matches;

  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function scrapePointsTable() {
  const url = 'https://www.cricket.com/';

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const teams = [];
    $('.flex.my-3').each((index, element) => {
      const team = {};
      const teamName = $(element).find('.px-1').text().trim();
      const matches = $(element).find('.w-1\\/12').eq(0).text().trim();
      const win = $(element).find('.w-1\\/12').eq(1).text().trim();
      const lose = $(element).find('.w-1\\/12').eq(2).text().trim();
      const tie = $(element).find('.w-1\\/12').eq(3).text().trim();
      const NRR = $(element).find('.w-1\\/12').eq(4).text().trim();
      const pointstable = $(element).find('.w-1\\/12').eq(5).text().trim();
      const NR = $(element).find('.w-2\\/12').text().trim();

      team.teamName = teamName;
      team.matches = matches;
      team.win = win;
      team.lose = lose;
      team.tie = tie;
      team.NRR = NRR;
      team.pointstable = pointstable;
      team.NR = NR;

      teams.push(team);
    });

    console.log(teams);
    return teams;

  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function scrapeODITeamRanking() {
  const url = 'https://www.cricket.com/ranking/men/teams-ranking';

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const teams = [];

    // Extracting the ODI ranking section
    const odiSection = $('.md\\:py-2.px-1').first();

    // Extracting ODI ranking data
    const odiRankingData = {
      format: odiSection.find('.text-start').text().trim(), // ODI
      ranking: []
    };

    // Extracting individual team rankings
    odiSection.find('table tbody tr').each((index, element) => {
      const rank = $(element).find('td').eq(0).text().trim();
      const teamName = $(element).find('td').eq(1).find('span').text().trim();
      const teamFlagUrl = $(element).find('td').eq(1).find('img').attr('src');
      const rating = $(element).find('td').eq(2).text().trim();

      const team = {
        rank: rank,
        teamName: teamName,
        teamFlagUrl: teamFlagUrl,
        rating: rating
      };

      odiRankingData.ranking.push(team);
    });

    // Extracting Rank 1 separately
    const rank1 = {
      rank: $('.font-bold.text-2xl').first().text().trim(),
      teamName: $('.font-normal.flex.items-center.justify-center.text-white.hover\\:underline.md\\:w-24 a h5').first().text().trim(),
      teamFlagUrl: $('.flex.flex-row.items-center.text-xs.text-inherit.dark\\:text-gray-2.font-medium.text-left.py-4.rounded-xl div.h-5.w-8 img').first().attr('src'),
      rating: $('.flex.w-full.justify-between.px-2.items-center .text-2xl').first().text().trim()
    };

    // Include Rank 1 data
    odiRankingData.ranking.unshift(rank1);

    console.log(odiRankingData);
    return odiRankingData;

  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function scrapeTeamRanking() {
  const url = 'https://www.cricket.com/ranking/men/teams-ranking'; // Update the URL to the actual page URL

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const testRankingData = {
      format: $('.text-start').text().trim(), // Test
      ranking: []
    };

    // Extracting Rank 1 separately
    const rank1 = {
      rank: $('.font-bold.text-2xl').first().text().trim(),
      teamName: $('.font-normal.flex.items-center.justify-center.text-white.hover\\:underline.md\\:w-24 a h5').first().text().trim(),
      teamFlagUrl: $('.h-5.w-8 img').first().attr('src'),
      rating: $('.flex.justify-end.items-center .text-2xl').first().text().trim()
    };

    // Include Rank 1 data
    testRankingData.ranking.push(rank1);

    // Extracting individual team rankings (excluding Rank 1)
    $('.md\\:min-w-full tbody tr').each((index, element) => {
      const rank = $(element).find('td').eq(0).text().trim();
      const teamName = $(element).find('td').eq(1).find('span').text().trim();
      const teamFlagUrl = $(element).find('td').eq(1).find('img').attr('src');
      const rating = $(element).find('td').eq(2).text().trim();

      const team = {
        rank: rank,
        teamName: teamName,
        teamFlagUrl: teamFlagUrl,
        rating: rating
      };

      testRankingData.ranking.push(team);
    });

    return testRankingData;

  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function scrapeTeamRankOne() {
  const url = 'https://www.cricket.com/ranking/men/teams-ranking'; // Update the URL to the actual page URL

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const allRankingData = [];

    // Extract Rank 1 for Test
    const testRank1Data = $('.md\\:w-full').first().find('.bg-red-6').first();
    const testRank1 = {
      format: 'Test',
      rank: 1, // Set the rank to 1 for the first entry
      teamName: testRank1Data.find('h5').text().trim(),
      teamFlagUrl: testRank1Data.find('img').attr('src'),
      rating: testRank1Data.find('.text-2xl.font-bold').text().trim().slice(-3) // Extract last three characters
    };
    allRankingData.push(testRank1);

    // Extract Rank 1 for ODI
    const odiRank1Data = $('.md\\:w-full').eq(1).find('.bg-red-6').first();
    const odiRank1 = {
      format: 'ODI',
      rank: 1, // Set the rank to 1 for the first entry
      teamName: odiRank1Data.find('h5').text().trim(),
      teamFlagUrl: odiRank1Data.find('img').attr('src'),
      rating: odiRank1Data.find('.text-2xl.font-bold').text().trim().slice(-3) // Extract last three characters
    };
    allRankingData.push(odiRank1);

    // Extract Rank 1 for T20
    const t20Rank1Data = $('.md\\:w-full').eq(2).find('.bg-red-6').first();
    const t20Rank1 = {
      format: 'T20',
      rank: 1, // Set the rank to 1 for the first entry
      teamName: t20Rank1Data.find('h5').text().trim(),
      teamFlagUrl: t20Rank1Data.find('img').attr('src'),
      rating: t20Rank1Data.find('.text-2xl.font-bold').text().trim().slice(-3) // Extract last three characters
    };
    allRankingData.push(t20Rank1);

    return allRankingData;

  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function fetchHTML(url) {
  try {
    const { data } = await axios.get(url);
    return data;
  } catch (error) {
    console.error('Error fetching the HTML:', error);
  }
}

// Function to scrape data
async function scrapeT20Players() {
  const url = 'https://www.cricket.com/ranking/men/players-ranking/t20';
  const html = await fetchHTML(url);

  const $ = cheerio.load(html);
  const rankings = [];
  $('tbody tr').each((index, element) => {
    const rank = $(element).find('td').first().text().trim();
    const playerName = $(element).find('a').text().trim();
    const team = $(element).find('img').attr('alt').split('Flag')[0].trim();
    const rating = $(element).find('td').last().text().trim();
    rankings.push({ rank, playerName, team, rating });
  });
  

  return rankings;
}

async function scrapePopularStadiums() {
    try {
        const response = await axios.get('https://www.cricket.com/stadiums');
        const html = response.data;
        const $ = cheerio.load(html);

        const stadiums = [];

        $('.swiper-slide').each((index, element) => {
            const name = $(element).find('.text-sm.font-semibold').text().trim();
            const location = $(element).find('.text-xs.font-normal').text().trim();
            const imageUrl = $(element).find('img').attr('src');
            const link = $(element).find('a').attr('href');

            const stadium = {
                name,
                location,
                imageUrl,
                link
            };

            stadiums.push(stadium);
        });

        return stadiums;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function scrapeIconicStadiums() {
  try {
      const response = await axios.get('https://www.cricket.com/stadiums');
      const html = response.data;
      const $ = cheerio.load(html);

      const stadiums = [];

      $('.swiper-slide').each((index, element) => {
          const name = $(element).find('.flex.flex-col.md\\:text-sm > p:nth-child(1)').text().trim();
          const location = $(element).find('.flex.flex-col.md\\:text-sm > p:nth-child(2)').text().trim();
          const imageUrl = $(element).find('img').attr('src');
          const link = $(element).find('a').attr('href');

          const stadium = {
              name,
              location,
              imageUrl,
              link: link
          };

          stadiums.push(stadium);
      });

      return stadiums;
  } catch (error) {
      console.error('Error:', error);
  }
}

async function scrapeCricketTeams() {
  try {
      const response = await axios.get('https://www.cricket.com/teams/international');
      const html = response.data;
      const $ = cheerio.load(html);

      const teams = [];

      $('.md\\:grid-cols-4 .max-w-sm').each((index, element) => {
          const teamName = $(element).find('h5').text().trim();
          const imageUrl = $(element).find('.object-cover').attr('src');
          const testRanking = $(element).find('.flex.flex-col p:contains("TEST") + p').text().trim();
          const odiRanking = $(element).find('.flex.flex-col p:contains("ODI") + p').text().trim();
          const t20Ranking = $(element).find('.flex.flex-col p:contains("T20") + p').text().trim();

          const team = {
              teamName,
              imageUrl,
              iccRankings: {
                  test: testRanking,
                  odi: odiRanking,
                  t20: t20Ranking
              }
          };

          teams.push(team);
      });

      return teams;
  } catch (error) {
      console.error('Error:', error);
  }
}

async function scrapeLeaugeTeams() {
  try {
      const response = await axios.get('https://www.cricket.com/teams/other-leagues');
      const html = response.data;
      const $ = cheerio.load(html);

      const teams = [];

      $('.md\\:grid-cols-4 .max-w-sm').each((index, element) => {
          const teamName = $(element).find('h5').text().trim();
          const imageUrl = $(element).find('.object-cover').attr('src');
          const winningYearsText = $(element).find('p.text-red-tab').text().trim();
          const winningYears = winningYearsText.split(',').map(year => year.trim());

          const team = {
              teamName,
              imageUrl,
              winningYears
          };

          teams.push(team);
      });

      return teams;
  } catch (error) {
      console.error('Error:', error);
  }
}

async function scrapeUpcomingWCCT20Matches() {
  try {
      const response = await axios.get('https://www.cricket.com/series/4670/icc-men-s-t20-world-cup-2024/matches');
      const html = response.data;
      const $ = cheerio.load(html);

      const upcomingMatches = [];

      $('section.border').each((index, element) => {
          const matchLink = $(element).find('a').attr('href');
          const matchDateTime = $(element).find('.flex.text-basered').text().trim();
          const matchLocation = $(element).find('.flex.flex-row.items-center.font-mnr.text-xs.font-semibold').text().trim();
          const teams = $(element).find('.lable-light').map((index, team) => $(team).text()).get();
          const matchNumber = $(element).find('.font-mnr').first().text().trim();

          const match = {
              matchNumber,
              matchDateTime,
              matchLocation,
              teams,
              matchLink
          };

          upcomingMatches.push(match);
      });

      return upcomingMatches;
  } catch (error) {
      console.error('Error:', error);
  }
}

async function wccT20PointsTable() {
  try {
      const response = await axios.get('https://www.cricket.com/series/4670/icc-men-s-t20-world-cup-2024/points-table');
      const $ = cheerio.load(response.data);

      const tableData = [];

      $('table tbody tr').each((index, element) => {
          const team = $(element).find('td:nth-child(1) span a p').text().trim();
          const matchesPlayed = $(element).find('td:nth-child(2)').text().trim();
          const won = $(element).find('td:nth-child(3)').text().trim();
          const lost = $(element).find('td:nth-child(4)').text().trim();
          const nR = $(element).find('td:nth-child(5)').text().trim();
          const points = $(element).find('td:nth-child(6)').text().trim();
          const nRR = $(element).find('td:nth-child(7)').text().trim();

          const rowData = {
              team,
              matchesPlayed,
              won,
              lost,
              nR,
              points,
              nRR
          };

          tableData.push(rowData);
      });

      return tableData;
  } catch (error) {
      console.error('Error:', error);
  }
}



module.exports = router;