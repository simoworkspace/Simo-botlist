	import type { ApplicationCommandStructure } from "../../typings";
import axios from "axios";
import { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } from "discord.js";

export default {
    name: 'queue',
    async run(client, interaction) {
//if (interaction.member?.roles.includes("991400149307887696")) return interaction.reply("nao pode");
			let botsall: Array<{label: string; value: string; description: string}> = [];
			const req = await axios.get("https://botlist-api.spyei.repl.co/api/bots");
			const bots = await req.data;
			const botsverificar = bots.filter((a:any) => !a.approved);
      const embed = new EmbedBuilder();
			embed.setTitle("Queue");
			embed.setColor(0x00ff00);
			embed.setDescription(botsverificar.map((a:any, index: number) => `**[${index}]** [${a.name}](https://discord.com/api/oauth2/authorize?client_id=${a._id}&permissions=2147483639&scope=bot%20applications.commands)`).join("\n"))
			botsverificar.map((a:any) => {
				botsall.push(
					{
						label: a.name,
						description: "oi",
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
			interaction.reply({ embeds: [embed], components: [actionRow]});
    },
} as ApplicationCommandStructure;