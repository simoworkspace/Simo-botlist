import type { ApplicationCommandStructure } from "../../types";

export default {
    name: 'ping',
    async run(client, interaction) {
        const targetShard: number = interaction.options.getInteger('shard') ?? 0;
        const shard = client.ws.shards.get(targetShard);

        if (!shard) return interaction.reply({
            content: `Shard ${targetShard} não foi encontrado`,
            ephemeral: true
        });

        return interaction.reply({
            content: `Ping: **${shard.ping}**`
        });
    }
} as ApplicationCommandStructure;