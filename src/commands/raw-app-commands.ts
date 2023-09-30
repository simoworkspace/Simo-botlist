import { ApplicationCommandData, ApplicationCommandType, ApplicationCommandOptionType } from "discord.js";

export const JSONStructure: ApplicationCommandData[] = [
    {
        name: "ping",
        type: ApplicationCommandType.ChatInput,
        description: "Veja como o Simo está operando",
        options: [
            {
                name: "shard",
                description: "Veja a latência de um fragmento específico",
                type: ApplicationCommandOptionType.Integer,
                min_value: 0,
                required: false
            }
        ]
    },
    {

        name: "addbot",
        type: ApplicationCommandType.ChatInput,
        description: "Adicione seu bot na botlist",
    },
    {
        name: "queue",
        type: ApplicationCommandType.ChatInput,
        description: "Veja os bots pendentes para serem analisados",
    },
    {
        name: "decode",
        type: ApplicationCommandType.ChatInput,
        description: "Descriptografique seu token recebido pelo site",
        options: [
            {
                name: "token",
                description: "Insira o jwt abaixo",
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    }
];