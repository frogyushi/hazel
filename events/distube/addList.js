module.exports = {
	name: "addList",

	async execute(client, queue, playlist) {
		queue.shuffle();
		queue.textChannel.send(`Added \`${playlist.songs.length}\` songs to queue`);
	},
};
