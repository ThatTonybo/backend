import Bot, { BotObject } from '../structs/Bot'
import { bots } from './database'

import { v4 as uuidv4 } from 'uuid'

export const getBots = async (filter?: any): Promise<Bot[]> => {
    const raw = await bots.find(filter || {}).toArray()

    if (!raw.length) return []

    const data = raw.map(i => new Bot(i as any))

    return data
}

export const getBot = async (id: string): Promise<Bot | undefined> => {
    const raw = await bots.findOne({ id })
    if (!raw) return undefined

    const bot = new Bot(raw as any)

    return bot
}

export const createBot = async (data: BotObject): Promise<Bot | undefined> => {
    const raw = await getBots()

    if (raw.some(i => i.bot.id === data.bot_id)) throw 'Name already exists'
    if (raw.some(i => i.vanity === data.vanity)) throw 'Vanity already in use'

    data.id = uuidv4()

    await bots.insertOne({
        ...data
    })

    const bot = new Bot(data)

    return bot
}

export const editBot = async (id: string, data: Partial<BotObject>): Promise<Bot | undefined> => {
    const raw = await getBots()

    if (raw.some(i => i.bot.id === data.bot_id)) throw 'Name already exists'
    if (raw.some(i => i.vanity === data.vanity)) throw 'Vanity already in use'

    await bots.updateOne({ id }, {
        $set: data
    })

    const bot = new Bot(data as any)

    return bot
}

export const deleteBot = async (id: string): Promise<void> => {
    const bot = await bots.findOne({ id })
    if (!bot) return undefined

    await bots.deleteOne({ id })

    return
}