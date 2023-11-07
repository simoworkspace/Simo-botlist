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
	  total_votes: number;
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
	  bio: string;
	  team: Team;
    notifications: Map<string, NotificationBody>;
}

export interface ApiStatusStructure {
  total_mem: number;
  free_mem: number;
  users: number;
  bots: number;
  uptime: number;
  request_count: number;
}

export interface Team {
    members?: TeamMember[];
    id?: string;
    name: string;
    avatar_url: string;
    description: string;
    bot_id?: Snowflake;
}

export interface TeamMember {
    id: Snowflake;
    permission: TeamPermissions;
    owner?: boolean;
}

export enum TeamPermissions {
    Administrator,
    ReadOnly,
}