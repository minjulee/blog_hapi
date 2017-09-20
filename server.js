'use strict'

const Hapi = require('hapi')
const Good = require('good')
const Hoek = require('hoek')
const Path = require('path')
const server = new Hapi.Server();

server.connection({ port: 3000, host: 'localhost' });


server.register([{
    register: Good,
    options: {
        reporters: {
            console: [{
                module: 'good-squeeze',
                name: 'Squeeze',
                args: [{
                    response: '*',
                    log: '*'
                }]
            }, {
                module: 'good-console'
            }, 'stdout']
        }
    }
}, {
    register: require('vision')
}, {
    register: require('inert'),
    options: {}
}], err => {
    if (err) {
        throw err;
    }

    const defaultContext = {
        title: 'My personal site'
    }

    server.views({
        engines: {
            html: require('handlebars')
        },
        relativeTo: __dirname,
        path: './templates',
        layout: true,
        layoutPath: Path.join(__dirname, 'templates/layout'),
        helpersPath: './templates/helpers',
        context: defaultContext
    })

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, reply) => {
            reply.view('index', { title: 'My home page' })
        }
    })

    server.route({
        method: 'GET',
        path: '/hello',
        handler: (req, reply) => {
            reply.file('./public/hello.html')
        }
    })

    server.start((err) => {
        if (err) {
            throw err;
        }

        server.log('info', 'Server running at: ' + server.info.uri);
    })
})