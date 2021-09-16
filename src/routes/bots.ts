import { Request, Response, Router } from 'express'
import Bot from '../structs/Bot'
import BotSchema from '../schemas/bot'

import { authMiddleware } from '../util/auth'
import { getBots, getBot, createBot } from '../util/bots'

export default Router()
    .get('/', async (req: Request, res: Response) => {
        const filter = {}

        if (req.query.name) filter['name'] = req.query.name as string
        if (req.query.vanity) filter['vanity'] = req.query.vanity as string
        if (req.query.tags) filter['tags'] = (req.query.tags as string).split(',').map(i => i.trim()).filter(i => i !== '')
        
        const bots = await getBots(filter)

        return res.json(bots)
    })
    .post('/', authMiddleware, async (req: Request, res: Response) => {
        if (!req.body) return res.status(400).json({ error: 'Request body missing' }).end()
        
        try {
            await BotSchema.validate(req.body)

            const bot = await createBot(req.body)

            return res.status(201).json({ id: bot!.id }).end()
        } catch(err) {
            return res.json({ error: err })
        }
    })
    .get('/:bot', async (req: Request, res: Response) => {
        const raw = await getBot(req.params.bot)
        if (!raw) return res.status(404).json({ error: 'Bot not found' }).end()

        const bot = new Bot(raw as any)

        return res.json(bot.toJSON())
    })
    .patch('/:bot', authMiddleware, async (req: Request, res: Response) => {
        const raw = await getBot(req.params.bot)
        if (!raw) return res.status(404).json({ error: 'Bot not found' }).end()

        if (!req.body) return res.status(400).json({ error: 'Request body missing' }).end()

        try {
            await BotSchema.validate(req.body)

            if (req.body['servers']) return res.status(400).json({ error: 'Unable to direcly set statistics' }).end()

            const bot = new Bot(raw as any)

            await bot.edit(req.body)

            return res.status(204).end()
        } catch(err) {
            return res.json({ error: err })
        }
    })
    .delete('/:bot', authMiddleware, async (req: Request, res: Response) => {
        const raw = await getBot(req.params.bot)
        if (!raw) return res.status(404).json({ error: 'Bot not found' }).end()

        const bot = new Bot(raw as any)

        await bot.delete()

        return res.status(204).end()
    })