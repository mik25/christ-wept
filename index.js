// Importing required modules
const addonBuilder = require('stremio-addon-sdk').addonBuilder;
const http = require('http');
const fetch = require('node-fetch');

// Creating a new addonBuilder instance
const builder = new addonBuilder({
    id: 'org.himymaddon',
    version: '1.0.0',
    name: 'HIMYM',
    catalogs: [],
    resources: ['stream'],
    types: ['series'],
    idPrefixes: ['tt']
});

// Defining the stream handler
builder.defineStreamHandler(({ type, id }) => {
    if (type === 'series' && id === 'tt0460649') {
        return fetch('https://raw.githubusercontent.com/mik25/christ-wept/main/shite.m3u')
            .then(response => response.text())
            .then(data => {
                const streams = data.split('\n')
                    .filter(line => line.startsWith('http'))
                    .map(url => ({ url }));
                return { streams };
            });
    } else {
        return Promise.resolve({ streams: [] });
    }
});

// Creating the http server
const server = http.createServer((req, res) => {
    // Serving the addon interface
    if (req.url === '/') {
        res.setHeader('content-type', 'text/html');
        res.end(builder.getInterface());
    }
});

// Starting the server
const port = process.env.PORT || 7000;
server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});


