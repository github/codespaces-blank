import axios from "axios";

const seasons = ['WINTER', 'SPRING', 'SUMMER', 'FALL'];

const fetchAnimeData = async (currentYear, seasonIndex) => {
  const response = await axios.post("https://graphql.anilist.co", { query: `
    query {
      Page(page: 1) {
        media(seasonYear: ${currentYear}, season: ${seasons[seasonIndex]}, type: ANIME, sort: POPULARITY_DESC) {
          id
          title {
            romaji
          }
        }
      }
    }
  ` });
  return response.data.data.Page.media;
};

(async () => {
  const animeEntries = [];
  const animeDataMap = {};
  const seasonCounters = {};
  const startYear = 2024;
  const startPage = 1;
  let currentYear = startYear;
  let seasonIndex = startPage;

  while (animeEntries.length < 25) {
    if (!animeDataMap[currentYear]) {
      animeDataMap[currentYear] = {};
      seasonCounters[currentYear] = {};
    }
    
    if (!animeDataMap[currentYear][seasonIndex]) {
      animeDataMap[currentYear][seasonIndex] = await fetchAnimeData(currentYear, seasonIndex);
      seasonCounters[currentYear][seasonIndex] = 0;
    }

    animeEntries.push(animeDataMap[currentYear][seasonIndex][seasonCounters[currentYear][seasonIndex]]);
    seasonCounters[currentYear][seasonIndex]++;

    if (seasonCounters[currentYear][seasonIndex] === 1) {
      currentYear = startYear;
      seasonIndex = startPage;
      continue;
    }

    seasonIndex--;

    if (seasonIndex === -1) {
      currentYear--;
      seasonIndex = seasons.length - 1;
    }
  }

  const formattedOutput = animeEntries.map(anime => anime.title.romaji).join('\n');
  console.log(formattedOutput)
})();
