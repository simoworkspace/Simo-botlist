import type { ApplicationCommandStructure, BotStructure } from "../../types";
import { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } from "discord.js";
import { botSchema } from "../../schemas/Bot";

export default {
	name: "queue",
	async run(client, interaction) {

		let botsall: Array<{ label: string; value: string; description: string }> = [];

		const bots = await botSchema.find({});
		const botsverificar = bots.filter((a: BotStructure) => !a.approved);

		const embed = new EmbedBuilder()
			.setTitle("Queue")
			.setColor(0x00ff00)
			.setDescription(botsverificar.map((a: any, index: number) => `**[${index}]** [${a.name}](https://discord.com/api/oauth2/authorize?client_id=${a._id}&permissions=2147483639&scope=bot%20applications.commands)`).join("\n"))

		botsverificar.map((a: BotStructure) => {
			botsall.push(
				{
					label: a.name,
					description: a.short_description.slice(0, 50) + "...",
					value: a._id
				}
			)
		});

		const actionRow: any = new ActionRowBuilder()
			.addComponents(
				new StringSelectMenuBuilder()
					.setCustomId("selecaobot")
					.setPlaceholder('Selecione um bot')
					.setMinValues(1)
					.setMaxValues(1)
					.addOptions(botsall)
			);

		interaction.reply({ embeds: [embed], components: [actionRow] });
	},
} as ApplicationCommandStructure;