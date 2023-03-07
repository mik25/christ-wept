const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");
const axios = require("axios");

// Define your addon manifest
const manifest = {
    id: "com.how-i-met-your-mother.addon",
    version: "1.0.0",
    name: "How I Met Your Mother Addon",
    description: "This addon provides streams for How I Met Your Mother",
    resources: ["stream"],
    types: ["series"],
    idPrefixes: ["tt"],
    catalogs: [{ id: "how-i-met-your-mother", type: "series", name: "How I Met Your Mother" }],
};

// Define a function that handles stream requests
async function getStreams(args) {
    // Check if the request is for a series with IMDb ID tt0460649 (the IMDb ID for How I Met Your Mother)
    if (args.type === "series" && args.id === "tt0460649") {
        const url = "http://23.147.64.113/tv/Other/HowIMetYourMother/";
        const response = await axios.get(url);
        const regex = /<a href="(.*?\.(?:mp4|mkv))"/gm;

        let match;
        const streams = [];
        while ((match = regex.exec(response.data)) !== null) {
            const stream = {
                url: match[1],
                title: "Episode " + streams.length,
                availability: 1,
                isFree: true,
            };
            streams.push(stream);
        }
        return { streams };
    }
}

// Define a function that handles catalog requests
async function getCatalogs({ type, id, extra }) {
    // Check if the request is for the How I Met Your Mother catalog
    if (type === "series" && id === "how-i-met-your-mother") {
        const catalogs = [];
        const catalog = {
            id: "how-i-met-your-mother",
            name: "How I Met Your Mother",
            type: "series",
            extra: [
                {
                    name: "search",
                    isRequired: false,
                },
            ],
        };
        catalogs.push(catalog);
        return { metas: catalogs };
    }
}

// Create a new addon builder using the manifest and the getStreams and getCatalogs functions
const builder = new addonBuilder(manifest);

// Define the streams and catalog endpoints of the addon
builder.defineStreamHandler(getStreams);
builder.defineCatalogHandler(getCatalogs);

// Build and serve the addon
const interface = addon.getInterface();

serveHTTP(interface, { port: process.env.PORT || 7777, hostname: '0.0.0.0' });

console.log(`Addon running at: http://0.0.0.0:${process.env.PORT || 7777}/stremioget/stremio/v1`);
