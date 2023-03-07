// index.js

import { addonBuilder, serveHTTP } from 'stremio-addon-sdk';
import fetch from 'node-fetch';

// rest of the code


const builder = new addonBuilder({
    id: 'org.himymaddon',
    version: '1.0.0',

    name: 'HIMYM',

    // Properties that determine when Stremio picks this addon
    // this means your addon will be used for streams of the type series
    catalogs: [],
    resources: ['stream'],
    types: ['series'],
    idPrefixes: ['tt']
})

// takes function(args)
builder.defineStreamHandler(function(args) {
    if (args.type === 'series' && args.id === 'tt0460649') {
        // serve streams for How I Met Your Mother
        return fetch('https://raw.githubusercontent.com/mik25/christ-wept/main/shite.m3u')
            .then(response => response.text())
            .then(data => {
                const streams = data.split('\n')
                    .filter(line => line.startsWith('http'))
                    .map(url => ({ url }))
                return { streams }
            })
    } else {
        // otherwise return no streams
        return Promise.resolve({ streams: [] })
    }
})

serveHTTP(builder.getInterface(), { port: process.env.PORT || 7000 })

