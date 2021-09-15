import bots from '../routes/bots'
import servers from '../routes/servers'

export default (server) => {
    server.use('/bots', bots)
    server.use('/servers', servers)
}