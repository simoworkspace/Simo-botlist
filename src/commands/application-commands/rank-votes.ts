import type { ApplicationCommandStructure, BotStructure } from "../../types";
import { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuInteraction, ButtonBuilder, ButtonStyle, ButtonInteraction, IntegrationApplication } from "discord.js";
import { botSchema } from "../../schemas/Bot";

export default {
    name: "rank-votes",
    async run(client, interaction) {
		   const bots = await botSchema.find({}).sort({ total_votes: -1 });
			const botmap = bots.map((bot: any, index: number) => {
				return `**${index + 1}.** ${bot.name} - ${bot.total_votes} votos`
			});
			await interaction.reply({
				content: botmap.splice(0, 10).join("\n")
			})
		}
} as ApplicationCommandStructure;