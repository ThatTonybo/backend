export interface ServerObject {
    name: string,
    id: string,
    short: string,
    long: string,
    tags: string[],
    owner_name: string,
    owner_id: string,
    server_id: string,
    invite: string,
    users: number,
    avatar: string | null
    vanity: string | null
}

export interface ServerInfo {
    name: string,
    id: string,
    avatar: string | null
}

export interface ServerDescription {
    short: string,
    long: string
}

export interface ServerOwner {
    name: string,
    id: string
}

export interface ServerStatistics {
    users: number
}

import { editServer, deleteServer } from '../util/servers'

/**
 * Represents a server listed on revolt.social
 */
export default class Server {
    server: ServerInfo
    id: string
    description: ServerDescription
    tags: string[]
    owner: ServerOwner
    invite: string
    statistics: ServerStatistics
    vanity: string | null

    /**
     * Create a new server representation
     * @param data The {@Link ServerObject} belonging to the server
     */
    constructor(data: ServerObject) {
        this.server = {
            name: data.name,
            id: data.server_id,
            avatar: data.avatar || null
        }
        this.id = data.id
        this.description = {
            short: data.short,
            long: data.long
        }
        this.tags = data.tags
        this.owner = {
            name: data.owner_name,
            id: data.owner_id
        }
        this.invite = data.invite
        this.statistics = {
            users: data.users || 0
        }
        this.vanity = data.vanity || null
    }

    /**
     * Update the server's statistics
     * @param data A partial {@Link ServerStatistics} object containing the new values
     */
         async updateStatistics(data: Partial<ServerStatistics>): Promise<void> {
            if (data.users && data.users <= this.statistics.users) throw 'New user count is equal to or lower than existing user count'
            
            await editServer(this.id, data)
    
            return
        }
    
        /**
         * Edit one or more properties of the server
         * @param data A partial {@Link ServerObject} containing the new properties
         */
        async edit(data: Partial<ServerObject>): Promise<void> {
            await editServer(this.id, data)
    
            return
        }
    
        /**
         * Delete the server
         */
        async delete(): Promise<void> {
            await deleteServer(this.id)
    
            return
        }
    
        /**
         * Converts the server representation into a JSON object
         */
        toJSON(): object {
            return Object.getOwnPropertyNames(this).reduce((a, b) => {
                a[b] = this[b]
                return a
            }, {})
        }
}