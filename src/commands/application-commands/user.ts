import type { ApplicationCommandStructure, Team } from "../../types";
import { userSchema } from "../../schemas/User";
import { botSchema } from "../../schemas/Bot";
import { EmbedBuilder } from "discord.js";

export default {
    name: "user-info",
    async run(client, interaction) {
      const user = interaction.options.getUser("user") || interaction.user;
			if(!user) return;
			const userDb = await userSchema.findById(user.id);
      const userBots = await botSchema.find({
				owner_id: user.id
			});
			const userTeams = (await userSchema.find({})).filter((usero) => usero.team.members?.some((member) => member.id === user.id));
			const embed = new EmbedBuilder()
			.setColor(0x0000ff)
			.setTitle(":middle_finger: Informações do usuário")
			.setThumbnail(user.displayAvatarURL())
			.addFields({
				name: "Usuário",
				value: `**${user.username}** (\`${user.id}\`)`,
			}, {
				name: "Biografia",
				value: userDb?.bio ? userDb.bio : "Nenhuma biografia definida",
			}, {
				name: "Bots",
				value: userBots.length ? userBots.map((bot) => `[${bot.name}](https://bombadeagua.life/bot/${bot._id})`).join(", ") : "Nenhum bot adicionado",
			}, {
			  name: "Times",
				value: userTeams ? userTeams.map((team: any) => `[${team.team.name}](https://bombadeagua.life/time/${team.team_id}), ${team.team.members?.length} Membros`).join("\n") : `${user.username} não possuí times.`,
			});
			return interaction.reply({
				embeds: [embed]
			})
    }
} as ApplicationCommandStructure;