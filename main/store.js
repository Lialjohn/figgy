// import Store from 'electron-store'
const Store = require('electron-store')

const store = new Store({
    schema: {
        entry: {
            description: "data used to start an active session",
            type: "object",
            properties: {
                slides: { type: "number" },
                imgTime: { type: "number" },
                timeUnit: { type: "number" },
                cats: {
                    type: "array",
                    uniqueItems: true,
                    items: { 
                        type: "string",
                    }
                }
            }
        },
        activePlaylist: {
            description: "current list of entries that will be used if a session starts",
            type: "array",
            default: []
        },
        savedPlaylists: {
            type: 'object',
            default: {}
        },
        selectedCats: {
            type: 'array',
            items: { type: 'string' },
            default: []
        }
    }
})

module.exports = store