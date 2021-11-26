/* eslint-disable */
const { Plugin } = require('powercord/entities');
const { getModule, channels } = require('powercord/webpack');

const { createBotMessage } = getModule(['createBotMessage'], false);
const { receiveMessage } = getModule(['receiveMessage'], false);

class DogPlugin extends Plugin {
	async startPlugin() {
		const { BOT_AVATARS } = await getModule(['BOT_AVATARS']);
		BOT_AVATARS.powercord =
			'https://staging.powercord.dev/images/powercord.png';

		powercord.api.commands.registerCommand({
			command: 'dog',
			aliases: ['doggo', 'doggy'],
			description: 'Provides random dog images.',
			executor: async () => {
				try {
					const data = await this.getData();

					if (data.status !== 'success')
						return this.sendMessage({
							content:
								'Failed to obtain a dog image, please try again later.',
						});
					return this.sendMessage({
						embeds: [
							{
								title: 'Click Here to View',
								url: data.message,
								image: {
									url: data.message,
									width: 1920,
									height: 1080,
								},
								footer: {
									text: 'Powered by https://dog.ceo/dog-api/',
								},
							},
						],
					});
				} catch (e) {
					return this.sendMessage({
						content: `Request to API failed with error: ${e.message}. Please try again later.`,
					});
				}
			},
		});
	}

	async getData() {
		const data = await fetch('https://dog.ceo/api/breeds/image/random', {
			cache: 'no-cache',
		});
		return data.json();
	}

	sendMessage(options) {
		const received = createBotMessage(channels.getChannelId(), '');
		received.author = {
			...received.author,
			username: 'Powercord',
			avatar: 'powercord',
		};
		return receiveMessage(received.channel_id, { ...received, ...options });
	}

	pluginWillUnload() {
		powercord.api.commands.unregisterCommand('dog');
	}
}

module.exports = DogPlugin;
