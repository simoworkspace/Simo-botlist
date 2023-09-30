import type { ApplicationCommandStructure, BotStructure } from "../../types";
import { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuInteraction, ButtonBuilder, ButtonStyle, ButtonInteraction } from "discord.js";
import { botSchema } from "../../schemas/Bot";

export default {
	name: "queue",
	async run(client, interaction) {
		let botsall: Array<{ label: string; value: string; description: string }> = [];

		const bots: BotStructure[] = await botSchema.find({ approved: false });

		if (bots.length === 0) return interaction.reply({ content: "Não há bots para serem verificados." });

		const embed: EmbedBuilder = new EmbedBuilder()
			.setTitle("Queue")
			.setColor(0x00ff00)
			.setDescription(bots.map((a: any, index: number) => `**[${index}]** [${a.name}](https://discord.com/api/oauth2/authorize?client_id=${a._id}&permissions=2147483639&scope=bot%20applications.commands)`).join("\n"))

		bots.map((a: BotStructure) => {
			botsall.push(
				{
					label: a.name,
					description: a.short_description.slice(0, 50) + "...",
					value: a._id
				}
			)
		});

		const actionRow: ActionRowBuilder<any> = new ActionRowBuilder()
			.addComponents(
				new StringSelectMenuBuilder()
					.setCustomId("selecaobot")
					.setPlaceholder("Selecione um bot")
					.setMinValues(1)
					.setMaxValues(1)
					.addOptions(botsall)
			);

		const int = await interaction.reply({ embeds: [embed], components: [actionRow] });

		const colector = int.createMessageComponentCollector({ filter: (i) => i.user.id === interaction.user.id, time: 30000 });

		colector.on("collect", async (interaction: StringSelectMenuInteraction) => {
			const selbot: BotStructure | null = await botSchema.findById(interaction.values[0])

			const embed: EmbedBuilder = new EmbedBuilder()
				.setTitle("Ações - " + selbot?.name)
				.setColor(0x00ff00)
				.setDescription(`Você deseja aprovar o bot **${selbot?.name}**, ou recusar? Escolha uma das alternativas abaixo.`);

			const actionRow: ActionRowBuilder<any> = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setCustomId("aprovado_" + selbot?._id)
						.setLabel("Aprovar")
						.setStyle(ButtonStyle.Success)
						.setEmoji("✅"),
					new ButtonBuilder()
						.setCustomId("recusado_" + selbot?._id)
						.setLabel("Recusar")
						.setStyle(ButtonStyle.Danger)
						.setEmoji("✖️")
				);

			const int = await interaction.update({ embeds: [embed], components: [actionRow] });

			const colector = int.createMessageComponentCollector({ filter: (i) => i.user.id === interaction.user.id, time: 30000 });

			colector.on("collect", async (interaction: ButtonInteraction) => {
				if (interaction.customId === "aprovado") {
					await botSchema.findById(selbot?._id).updateOne({
						approved: true
					})
					await fetch(process.env.WEBHOOK as string, {
						method: "POST",
						body: JSON.stringify({
							content: selbot?.owners.length === 0 ? `<@${selbot?.owners[0]}>` : selbot?.owners.map(a => `<@${a}>`),
							embeds: [{
								thumbnail: {
									url: `https://cdn.discordapp.com/avatars/${selbot?._id}/${selbot?.avatar}.png`
								},
								title: "✅ | Análise",
								color: 0x008000,
								description: `O seu bot: **${selbot?.name}** (\`${selbot?._id}\`) foi aprovado!!`
							}]

						})
					})
					interaction.update({ content: `Bot **${selbot?.name}** foi aprovado com sucesso!`, embeds: [], components: [] })
				} else {
					await botSchema.findByIdAndDelete(selbot?._id)
					await fetch(process.env.WEBHOOK as string, {
						body: JSON.stringify({
							method: "POST",
							content: selbot?.owners.length === 0 ? `<@${selbot?.owners[0]}>` : selbot?.owners.map(a => `<@${a}>`),
							embeds: [{
								thumbnail: {
									url: `https://cdn.discordapp.com/avatars/${selbot?._id}/${selbot?.avatar}.png`
								},
								title: "✅ | Análise",
								color: 0xff0000,
								description: `O seu bot: **${selbot?.name}** (\`${selbot?._id}\`) foi recusado.`
							}]

						})
					})

					interaction.update({ content: `Bot **${selbot?.name}** foi recusado com sucesso!`, embeds: [], components: [] })
				}
			});
		});
	},
} as ApplicationCommandStructure;