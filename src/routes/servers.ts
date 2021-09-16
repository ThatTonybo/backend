import { Request, Response, Router } from 'express'
import Server from '../structs/Server'
import ServerSchema from '../schemas/server'

import { authMiddleware } from '../util/auth'
import { getServers, getServer, createServer } from '../util/servers'

export default Router()
    .get('/', async (req: Request, res: Response) => {
        const filter = {}

        if (req.query.name) filter['name'] = req.query.name as string
        if (req.query.vanity) filter['vanity'] = req.query.vanity as string
        if (req.query.tags) filter['tags'] = (req.query.tags as string).split(',').map(i => i.trim()).filter(i => i !== '')
        
        const servers = await getServers(filter)

        return res.json(servers)
    })
    .post('/', authMiddleware, async (req: Request, res: Response) => {
        if (!req.body) return res.status(400).json({ error: 'Request body missing' }).end()

        try {
            await ServerSchema.validate(req.body)

            const server = await createServer(req.body)

            return res.status(201).json({ id: server!.id }).end()
        } catch(err) {
            return res.json({ error: err })
        }
    })
    .get('/:server', async (req: Request, res: Response) => {
        const raw = await getServer(req.params.server)
        if (!raw) return res.status(404).json({ error: 'Server not found' }).end()

        const server = new Server(raw as any)

        return res.json(server.toJSON())
    })
    .patch('/:server', authMiddleware, async (req: Request, res: Response) => {
        const raw = await getServer(req.params.server)
        if (!raw) return res.status(404).json({ error: 'Server not found' }).end()

        if (!req.body) return res.status(400).json({ error: 'Request body missing' }).end()

        try {
            await ServerSchema.validate(req.body)

            if (req.body['users']) return res.status(400).json({ error: 'Unable to direcly set statistics' }).end()

            const server = new Server(raw as any)

            await server.edit(req.body)

            return res.status(204).end()
        } catch(err) {
            return res.json({ error: err })
        }
    })
    .delete('/:server', authMiddleware, async (req: Request, res: Response) => {
        const raw = await getServer(req.params.bot)
        if (!raw) return res.status(404).json({ error: 'Server not found' }).end()

        const server = new Server(raw as any)

        await server.delete()

        return res.status(204).end()
    })