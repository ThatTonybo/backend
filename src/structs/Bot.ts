export interface BotObject {
    name: string,
    id: string,
    short: string,
    long: string,
    tags: string[],
    owner_name: string,
    owner_id: string,
    bot_id: string,
    invite: string,
    support: string | null,
    prefix: string,
    help: string,
    library: string,
    servers: number,
    avatar: string | null,
    vanity: string | null
}

export interface BotUser {
    name: string,
    id: string,
    avatar: string | null
}

export interface BotDescription {
    short: string,
    long: string
}

export interface BotOwner {
    name: string,
    id: string
}

export interface BotStatistics {
    servers: number
}

import { editBot, deleteBot } from '../util/bots'

/**
 * Represents a bot listed on revolt.social
 */
export default class Bot {
    bot: BotUser
    id: string
    description: BotDescription
    tags: string[]
    owner: BotOwner
    invite: string
    support: string | null
    prefix: string
    helpCommand: string
    library: string
    statistics: BotStatistics
    vanity: string | null

    /**
     * Create a new bot representation
     * @param data The {@Link BotObject} belonging to the bot
     */
    constructor(data: BotObject) {
        this.bot = {
            name: data.name,
            id: data.bot_id,
            avatar: data.avatar || null
        }
        this.id = data.id
        this.description = {
            short: data.short,
            long: data.long
        }
        this.tags = data.tags || []
        this.owner = {
            name: data.owner_name,
            id: data.owner_id
        }
        this.invite = data.invite
        this.support = data.support || null
        this.prefix = data.prefix
        this.helpCommand = data.help
        this.library = data.library
        this.statistics = {
            servers: data.servers || 0
        }
        this.vanity = data.vanity || null
    }

    /**
     * Update the bot's statistics
     * @param data A partial {@Link BotStatistics} object containing the new values
     */
    async updateStatistics(data: Partial<BotStatistics>): Promise<void> {
        if (data.servers && data.servers <= this.statistics.servers) throw 'New server count is equal to or lower than existing server count'
        
        await editBot(this.id, data)

        return
    }

    /**
     * Edit one or more properties of the bot
     * @param data A partial {@Link BotObject} containing the new properties
     */
    async edit(data: Partial<BotObject>): Promise<void> {
        await editBot(this.id, data)

        return
    }

    /**
     * Delete the bot
     */
    async delete(): Promise<void> {
        await deleteBot(this.id)

        return
    }

    /**
     * Converts the bot representation into a JSON object
     */
    toJSON(): object {
        return Object.getOwnPropertyNames(this).reduce((a, b) => {
            a[b] = this[b]
            return a
        }, {})
    }
}