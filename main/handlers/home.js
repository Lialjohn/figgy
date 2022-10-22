const store = require('../store.js')
const prompt = require('electron-prompt')
const { dialog } = require('electron')

const setCats = (_, cat) => {
    try {
        let text = store.get('selectedCats', [])
        if (Array.isArray(cat)) text = [...text, ...cat]
        else if (cat === 'clear') text = []
        else {
            let i = text.indexOf(cat)
            if (i === -1) text.push(cat)
            else text.splice(i, 1)
        }
        store.set('selectedCats', text)
        return text
    } catch(e) { console.log(e) }
}

const getStoreItem = (_, key) => {
    // retrieves any store item with given key
    try {
        const item = store.get(key)
        if (!item) throw new Error(`${key} couldn't be retrieved from the store`)
        else return item
    } catch(e) {
        console.log(e.message)
    }
}

const savePlaylist = async () => {
    // saves given playlist. returns a bool to indicate whether save was successful or not
    try {
        const activePlaylist = store.get('activePlaylist')
        if (!activePlaylist || !activePlaylist.length) throw new Error("No playlist to save")
        const name = await prompt({
            title: 'Prompt example',
            label: 'name new playlist:',
            inputAttrs: {type: 'text', required: true},
            type: 'input'
        })
        //todo: set up default naming system
        if (name) {
            // ideally I'd have a regex pattern or something here to exclude a bunch of things, but for now only the default 'no playlist selected'
            if (name !== 'none') {
                const playlists = store.get('savedPlaylists')
                store.set(`savedPlaylists.${name}`, activePlaylist)
                return name
            }
            dialog.showMessageBoxSync({ message: "invalid name, playlist not saved"})
        }
        return false
    } catch(e) {
        console.log(e)
    }
}

const addEntry = (_, entry) => {
    try {
        const activePlaylist = store.get('activePlaylist', [])
        activePlaylist.push(entry)
        store.set('activePlaylist', activePlaylist)
        return true
    } catch(e) {
        console.log("couldn't add entry", e)
        return false
    }
}

const removeEntry = (_, i) => {
    try {
        const activePlaylist = store.get('activePlaylist', [])
        activePlaylist.splice(i - 1, 1)
        store.set('activePlaylist', activePlaylist)
    } catch(e) {
        console.log(e)
    }
}

const setActivePlaylist = (_, name) => {
    try {
        if (name === 'none') return []
        const playlist = store.get(`savedPlaylists.${name}`)
        store.set('activePlaylist', playlist)
        return playlist
    } catch (e) { console.log(e) }

}

const clearActivePlaylist = () => {
    store.delete('activePlaylist')
}

module.exports = {
    setActivePlaylist,
    clearActivePlaylist,
    addEntry,
    removeEntry,
    getStoreItem,
    savePlaylist,
    setCats,
}