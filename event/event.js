const Event = require('events')
const net = require('net')

const channel = new Event.EventEmitter()

channel.clients = {}
channel.subscriptions = {}
channel.setMaxListeners(50)

channel.on('join', function (id, client) {
    const welcome = `
        welcome !
            Guest onlone: ${this.listeners('broadcast').length}
    `
    client.write(welcome)
    this.clients[id] = client;
    this.subscriptions[id] = (senderId, message) => {
        if (id !== senderId) {
            this.clients[id] && this.clients[id].write(message);
        }
    }
    this.on('broadcast', this.subscriptions[id]);
})
channel.on('leave', function (id) {
    channel.removeListener(
        'broadcat', this.subscriptions[id]
    )
    delete this.clients[id]
    channel.emit('broadcast', id, `${id} has left the chatroom. \n`);
})

channel.on('shutdown', () => {
    channel.emit('broadcast', '', 'The Server has shut down.\n')
    channel.removeAllListeners('broadcast')
})

// channel.emit('join')
const server = net.createServer(client => {
    const id = `${client.remoteAddress}:${client.remotePort}`
    channel.emit('join', id, client)
    client.on('data', data => {
        data = data.toString()
        if (data === 'shutdown\r\n') {
            channel.emit('shutdown')
        }
        channel.emit('broadcast', id, data)
    })
    client.on('close', () => {
        channel.emit('leave', id)
    })
})

server.listen(8888, () => {
    console.log('socket on prot: 8888')
})
