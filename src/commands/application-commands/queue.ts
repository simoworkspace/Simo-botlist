import type { ApplicationCommandStructure, BotStructure } from "../../types";
import { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuInteraction, ButtonBuilder, ButtonStyle, ButtonInteraction } from "discord.js";
import { botSchema } from "../../schemas/Bot";
export default {
	name: "queue",
	async run(client, interaction: any) {
		if (!interaction.member?.roles.cache.has("991400149307887696")) return interaction.reply("Você precisa ser um verificador para usar o comando.");
		
		let botsall: Array<{ label: string; value: string; description: string }> = [];

		const bots: BotStructure[] = await botSchema.find({ approved: false });

		if (bots.length === 0) return interaction.reply({ content: "Não há bots para serem verificados." });

		const embed: EmbedBuilder = new EmbedBuilder()
			.setTitle("Queue")
			.setColor(0x00ff00)
			.setDescription(bots.map((a: any, index: number) => `**[${index + 1}]** [${a.name}](https://discord.com/api/oauth2/authorize?client_id=${a._id}&permissions=2147483639&scope=bot%20applications.commands)`).join("\n"))

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

		const colector = int.createMessageComponentCollector({ filter: (i: any) => i.user.id === interaction.user.id, time: 30000 });

		colector.on("collect", async (interaction: StringSelectMenuInteraction) => {
			if (!interaction.isStringSelectMenu()) return;
			if (interaction.customId !== "selecaobot") return;

			const selbot: BotStructure | undefined = bots.find((bot) => bot._id === interaction.values[0]);

			const embed: EmbedBuilder = new EmbedBuilder()
				.setTitle("Ações - " + selbot?.name)
				.setColor(0x00ff00)
				.setDescription(`Você deseja aprovar o bot **${selbot?.name}**, ou recusar? Escolha uma das alternativas abaixo.`);

			const actionRow: ActionRowBuilder<any> = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setCustomId("aprovado")
						.setLabel("Aprovar")
						.setStyle(ButtonStyle.Success)
						.setEmoji("✅"),
					new ButtonBuilder()
						.setCustomId("recusado")
						.setLabel("Recusar")
						.setStyle(ButtonStyle.Danger)
						.setEmoji("✖️")
				);

			const int = await interaction.update({ embeds: [embed], components: [actionRow] });

			const colector = int.createMessageComponentCollector({ filter: (i) => i.user.id === interaction.user.id, time: 30000 });

			colector.on("collect", async (interaction: ButtonInteraction) => {
				if (!interaction.isButton()) return;

				if (interaction.customId === "aprovado") {
					await botSchema.findById(selbot?._id).updateOne({
						approved: true
					})

					await fetch(process.env.WEBHOOK as string, {
						headers: {
							"Content-Type":  'application/json'
						},
						method: "POST",
						body: JSON.stringify({
							content: selbot?.owners.length === 0 ? `<@${selbot?.owners[0]}>` : selbot?.owners.map(a => `<@${a}>`).join(", "),
							embeds: [{
								thumbnail: {
									url: `https://cdn.discordapp.com/avatars/${selbot?._id}/${selbot?.avatar}.png`
								},
								title: "✅ | Análise",
								color: 0x008000,
								description: `O seu bot: **${selbot?.name}** (\`${selbot?._id}\`) foi aprovado!!`
							}]
						})
					});

					await interaction.update({ content: `Bot **${selbot?.name}** foi aprovado com sucesso!`, embeds: [], components: [] })
				} else {
					await botSchema.findByIdAndDelete(selbot?._id);

					await fetch(process.env.WEBHOOK as string, {
						headers: {
							"Content-Type":  'application/json'
						},
						method: "POST",
						body: JSON.stringify({
							content: selbot?.owners.length === 0 ? `<@${selbot?.owners[0]}>` : selbot?.owners.map(a => `<@${a}>`).join(", "),
							embeds: [{
								thumbnail: {
									url: `https://cdn.discordapp.com/avatars/${selbot?._id}/${selbot?.avatar}.png`
								},
								title: "✅ | Análise",
								color: 0xff0000,
								description: `O seu bot: **${selbot?.name}** (\`${selbot?._id}\`) foi recusado.`
							}]

						})
					});

					await interaction.update({ content: `Bot **${selbot?.name}** foi recusado com sucesso!`, embeds: [], components: [] })
				}
			});
		});
	},
} as ApplicationCommandStructure;