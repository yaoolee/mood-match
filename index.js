import express from 'express';
import path from 'path';
import fetch from 'node-fetch';

const _dirname= import.meta.dirname;

const app = express();
const port = process.env.PORT || "8888";

app.set("view engine", "pug");
app.set("views", path.join(_dirname, "views"));
app.use(express.static(path.join(_dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

const moodToType = {
  happy: "electric",
  sad: "ghost",
  sleepy: "psychic",
  excited: "fire"
};

app.get("/", (req, res) => {
  res.render("index", { pokemon: null, song: null });
});

app.post("/match", async (req, res) => {
  const mood = req.body.mood;
  const type = moodToType[mood];

  try {
    // Fetch a Pokémon by type
    const pokeResponse = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
    const pokeData = await pokeResponse.json();
    const randomPokemon =
      pokeData.pokemon[Math.floor(Math.random() * pokeData.pokemon.length)].pokemon;

    // for image
    const detailResponse = await fetch(randomPokemon.url);
    const detailData = await detailResponse.json();
    const pokemon = {
      name: detailData.name,
      image: detailData.sprites.front_default
    };

    // song from iTunes API
    const songResponse = await fetch(
      `https://itunes.apple.com/search?term=${mood}&limit=1&media=music`
    );
    const songData = await songResponse.json();
    const song = {
      title: songData.results[0]?.trackName || "Unknown",
      artist: songData.results[0]?.artistName || "Unknown",
      preview: songData.results[0]?.previewUrl || null
    };

    // res.render("index", { pokemon, song, mood });
    res.render('result', { music: song, pokemon, mood });
  } catch (error) {
    console.error("ERROR:", error.message);
    res.send("Something went wrong while fetching data.");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});