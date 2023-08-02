import { sync } from "glob";
import { connect } from 'mongoose';
import { ExtendedClient } from './src/Client';
import { JSONStructure } from './src/commands/raw-app-commands';
import { ApplicationCommandStructure, CommandStructure } from './src/typings';
import env from "dotenv";

const { CLIENT_TOKEN, MONGOOSE_URL } = process.env

env.config();

export const client: ExtendedClient = new ExtendedClient({ intents: [34311] });

sync('./src/commands/prefixed/*.ts').forEach(async (path: string): Promise<void> => {
    const { default: command }: { default: CommandStructure; } = await import(`./${path}`);

    client.commands.set(command.name, command);
});

sync('./src/commands/application-commands/**/*.ts', { ignore: './src/commands/**/raw-app-commands.ts' }).forEach((f: string): void => {
    const { default: command }: { default: ApplicationCommandStructure; } = require(`./${f}`);

    client.applicationCommands.set(command.name, command);
});

client.on('ready', async (): Promise<void> => {
    await client.application?.commands.set(JSONStructure);
    await connect(MONGOOSE_URL as string);

    console.log(`Ligado como ${client.user!.username}`);
});

sync('./src/events/*.ts').forEach((e: string): void => {
    const event = require(`./${e}`);

    event.default;
});

process.on('unhandRejection', console.error);
process.on('uncaughtException', console.error);

client.login(CLIENT_TOKEN as string).catch(console.error);