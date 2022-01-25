const axios = require("axios");
const cheerio = require("cheerio");

exports.search = async function (query) {
	const options = {
		headers: {
			Authorization: "Bearer tLZ9rcX6AEV7zXakeywW7D0lIrFO3ARYnfO_Yyw6daM72AGL80QYeeZO5xwb8rdQ",
		},
	};

	const response = await axios.get(`https://api.genius.com/search?q=${query}`, options);

	const [song] = response.data.response.hits;

	if (!song) return null;

	const { url, full_title } = song.result;
	const { data } = await axios.get(url);
	const $ = cheerio.load(data);

	let lyrics = "";
	$('[class^="Lyrics__Container"]').each((_, elem) => {
		const chunk = $(elem).html().replace(/<br>/g, "\n");
		lyrics += cheerio.load(chunk, { decodeEntities: false }).text();
	});

	return {
		title: full_title,
		lyrics,
	};
};
