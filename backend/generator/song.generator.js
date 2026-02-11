const { Faker, en, fr, be_BE, base } = require("@faker-js/faker");
const locales = require("../data/localization.json");

const fakerLocales = {
  "en-US": [en, base],
  "fr-FR": [fr, en, base],
  "be-BE": [be_BE, en, base],
};

exports.generateSongs = ({
  seed = "1",
  lang = "en-US",
  page = 1,
  pageSize = 20,
  avgLikes = 0
}) => {
  if (!locales[lang]) lang = "en-US";

  const faker = new Faker({ locale: fakerLocales[lang] || [en, base] });
  const locale = locales[lang];

  const safeLocale = {
    words: locale.words || locales["en-US"].words,
    artists: locale.artists || locales["en-US"].artists,
    genres: locale.genres || locales["en-US"].genres,
    reviews: locale.reviews || locales["en-US"].reviews,
    single: locale.single || "Single",
  };

  const songs = [];

  for (let i = 0; i < pageSize; i++) {
    const index = (page - 1) * pageSize + i;

    const title = pickCombo(seed, index, "title", safeLocale.words);
    const album = pickCombo(seed, index, "album", safeLocale.words);

    const artist = pickFromList(seed, index, "artist", safeLocale.artists);
    const genre = pickFromList(seed, index, "genre", safeLocale.genres);
    const review = pickFromList(seed, index, "review", safeLocale.reviews);

    const isSingle = seededChance(seed, index, "single", 0.3);

    songs.push({
      id: deterministicUUID(seed, index),
      index: index + 1,
      title: format(title),
      artist,
      genre,
      album: isSingle ? safeLocale.single : format(album),
      cover: `https://picsum.photos/seed/${seed}-${index}/300/300`,
      review,
      likes: seededLikes(seed, index, avgLikes),
      lyrics: generateLyrics(seed, index, safeLocale.words)
    });
  }

  return songs;
};

function generateLyrics(seed, index, words, avgWordsPerLine = 3, avgWordDuration = 0.5) {
  const linesCount = 4; 
  const lyrics = [];

  let currentTime = 0;

  for (let i = 0; i < linesCount; i++) {
    const lineWords = [];
    const wordsInLine = avgWordsPerLine; 

    for (let j = 0; j < wordsInLine; j++) {
      const word = pickFromList(seed, index, `lyric-${i}-${j}`, words);
      lineWords.push({
        text: word,
        time: currentTime
      });
      currentTime += avgWordDuration; 
    }

    lyrics.push({
      words: lineWords
    });
  }

  return lyrics;
}


function pickCombo(seed, index, tag, words) {
  const w1 = pickFromList(seed, index, `${tag}-1`, words);
  const w2 = pickFromList(seed, index, `${tag}-2`, words);
  return `${w1} ${w2}`;
}

function pickFromList(seed, index, tag, list) {
  if (!Array.isArray(list) || list.length === 0) return "Unknown";
  const rand = deterministicRandom(`${seed}-${index}-${tag}`);
  return list[Math.floor(rand * list.length)];
}

function seededChance(seed, index, tag, chance) {
  return deterministicRandom(`${seed}-${index}-${tag}`) < chance;
}


function seededLikes(seed, index, avgLikes) {
  if (avgLikes <= 0) return 0;

  const base = Math.floor(avgLikes);
  const fraction = avgLikes - base;

  const rand = deterministicRandom(`${seed}-${index}-likes`);

  const extra = rand < fraction ? 1 : 0;

  return base + extra;
}

function deterministicUUID(seed, index) {
  const hash = Math.floor(deterministicRandom(`${seed}-${index}-uuid`) * 1e8);
  return `song-${hash}`;
}

function deterministicRandom(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const rand = Math.abs(Math.sin(hash) * 10000);
  return rand - Math.floor(rand);
}

function format(text) {
  return text.replace(/\b\w/g, c => c.toUpperCase());
}
