import { CommandStructure } from "../../types";
import { OWNERS_ID } from '../../../.config.json';

export default {
    name: 'eval',
    aliases: ['ev', 'e'],
    async run(client, message, args) {
        if (!OWNERS_ID.includes(message.author.id)) return;
        if (!args[0]) return message.channel.send('Nenhum código foi fornecido');

        try {
            const evaluated: unknown = eval(args.join(' ').slice(0, 1900));

            if (evaluated instanceof Promise) await evaluated;

            message.channel.send(`Resultado: ${evaluated}`);
        } catch (unknownError: unknown) {
            const error: Error = unknownError as Error;

            message.channel.send(`${error.name}: ${error.message}`);
        };
    }
} as CommandStructure;