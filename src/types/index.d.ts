import { ExtendedClient } from "../Client";
import { Message, AutocompleteInteraction, ChatInputCommandInteraction } from "discord.js";

export interface CommandStructure {
    name: string;
    aliases?: string[];
    run(client: ExtendedClient, message: Message<true>, args: string[]): Promise<unknown>;
};

export interface ApplicationCommandStructure {
    name: string;
    autocomplete?: (interaction: AutocompleteInteraction) => unknown;
    run?: (client: ExtendedClient, interaction: ChatInputCommandInteraction) => Promise<unknown>;
};

export interface BotStructure {
    _id: Snowflake;
    name: string;
    avatar: string;
    invite_url: string;
    website_url: string;
    support_server: string;
    source_code: string;
    short_description: string;
    long_description: string;
    prefixes: string[];
    owners: Snowflake[];
    created_at: string;
    verified: boolean;
    tags: string[];
    approved: boolean;
    votes: VoteStructure[];
}

export interface VoteStructure {
    votes: number;
    user: Snowflake;
    last_vote: string;
}

export interface UserStructure {
    _id: Snowflake;
    username: string;
    avatar: string;
    notifications: Map<string, NotificationBody>;
}