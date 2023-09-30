import type { ApplicationCommandStructure } from "../../types";
import Discord from "discord.js";

export default {
    name: 'addbot',
    async run(client, interaction) {
        const modal = new Discord.ModalBuilder().setCustomId('addbotmodal').setTitle('Addbot');

        const botId: any = new Discord.ActionRowBuilder().addComponents(new Discord.TextInputBuilder().setCustomId("botid-addbot").setLabel("ID do seu bot").setValue("oi").setStyle(Discord.TextInputStyle.Short).setRequired(true));

        const botPrefix: any = new Discord.ActionRowBuilder().addComponents(new Discord.TextInputBuilder().setCustomId("botprefix-addbot").setLabel("Prefixo do seu bot").setStyle(Discord.TextInputStyle.Short).setRequired(true));

        modal.addComponents(botId, botPrefix);

        return interaction.showModal(modal);
    }
} as ApplicationCommandStructure;