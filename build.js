const loadServer = require('./server')
const fs = require('fs')
const path = require('path')
const staticFolder = path.join(__dirname, 'static')
const rimraf = require('rimraf')

const needle = require('needle')

const addonUrl = 'http://127.0.0.1:7020/'

const streamLinks = []

async function build() {
try {
fs.mkdirSync(staticFolder)
fs.copyFileSync(path.join(__dirname, 'CORS'), path.join(staticFolder, 'CORS'))
fs.copyFileSync(path.join(__dirname, 'CNAME'), path.join(staticFolder, 'CNAME'))
fs.copyFileSync(path.join(__dirname, 'logo.png'), path.join(staticFolder, 'logo.png'))
fs.mkdirSync(path.join(staticFolder, 'catalog'))
fs.mkdirSync(path.join(staticFolder, 'catalog', 'tv'))
fs.mkdirSync(path.join(staticFolder, 'meta'))
fs.mkdirSync(path.join(staticFolder, 'meta', 'channel'))
fs.mkdirSync(path.join(staticFolder, 'stream'))
fs.mkdirSync(path.join(staticFolder, 'stream', 'channel'))
const { body: manifest } = await needle('get', addonUrl + 'manifest.json', { json: true })
fs.writeFileSync(path.join(staticFolder, 'manifest.json'), JSON.stringify(manifest))
await Promise.all(manifest.catalogs.map(async el => {
const { body: cat } = await needle('get', addonUrl + 'catalog/' + el.type + '/' + el.id + '.json', { json: true })
fs.writeFileSync(path.join(staticFolder, 'catalog', el.type, el.id + '.json'), JSON.stringify(cat))
await Promise.all(cat.metas.map(async el => {
const { body: meta } = await needle('get', addonUrl + 'meta/' + el.type + '/' + el.id + '.json', { json: true })
fs.writeFileSync(path.join(staticFolder, 'meta', el.type, el.id + '.json'), JSON.stringify(meta))
await Promise.all(meta.meta.videos.map(async el => {
const { body: vid } = await needle('get', addonUrl + 'stream/' + meta.meta.type + '/' + el.id + '.json', { json: true })
fs.writeFileSync(path.join(staticFolder, 'stream', meta.meta.type, el.id + '.json'), JSON.stringify(vid))
console.log('got stream ' + Date.now())
}))
}))
}))
} catch (error) {
console.log(error)
}
}

if (fs.existsSync(staticFolder)) {
rimraf(staticFolder, build)
} else {
build()
}