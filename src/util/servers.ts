import Server, { ServerObject } from '../structs/Server'
import { servers, sanitize } from './database'

import { v4 as uuidv4 } from 'uuid'

export const getServers = async (filter?: any): Promise<Server[]> => {
    const sanitizedFilter = sanitize(filter || {})

    const raw = await servers.find(sanitizedFilter).toArray()

    if (!raw.length) return []

    const data = raw.map(i => new Server(i as any))

    return data
}

export const getServer = async (id: string): Promise<Server | undefined> => {
    const raw = await servers.findOne({ id })
    if (!raw) return undefined

    const server = new Server(raw as any)

    return server
}

export const createServer = async (data: ServerObject): Promise<Server | undefined> => {
    const sanitizedData = sanitize(data)

    const raw = await getServers()

    if (raw.some(i => i.server.id === sanitizedData.server_id)) throw 'Name already exists'
    if (raw.some(i => i.vanity === sanitizedData.vanity)) throw 'Vanity already in use'

    sanitizedData.id = uuidv4()

    await servers.insertOne({
        ...sanitizedData
    })

    const server = new Server(sanitizedData)

    return server
}

export const editServer = async (id: string, data: Partial<ServerObject>): Promise<Server | undefined> => {
    const sanitizedData = sanitize(data)
    
    const raw = await getServers()

    if (raw.some(i => i.server.id === sanitizedData.server_id)) throw 'Name already exists'
    if (raw.some(i => i.vanity === sanitizedData.vanity)) throw 'Vanity already in use'

    await servers.updateOne({ id }, {
        $set: sanitizedData
    })

    const server = new Server(sanitizedData as any)

    return server
}

export const deleteServer = async (id: string): Promise<void> => {
    const server = await servers.findOne({ id })
    if (!server) return undefined

    await servers.deleteOne({ id })

    return
}