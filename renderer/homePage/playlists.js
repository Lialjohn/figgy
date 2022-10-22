import { resetEntries } from "./entries.js"

export const addPlaylistListeners = () => {
    const addPlaylistBtn = document.querySelector('#save-pl-btn')
    const playlistSelect = document.getElementById('playlist-select')
    playlistSelect.addEventListener('change', setActivePlaylist)
    addPlaylistBtn.addEventListener('click', saveNewPlaylist)
}

/**
 * playlist functions
 *  These functions 1) call api functions to manage store data, and 2) manage playlist elements in the DOM.
 * 
 * setActive: removes current active playlist and sets chosen saved playlist as active
 * saveNew: adds current playlist to saved playlists
 * remove: removes chosen playlist from saved playlists
 * create: creates DOM option for playlist select
 * populate: populates the playlist select with saved playlist names.
 */

const setActivePlaylist = async e => {
    // callback for the 'onchange' event
    let playlist = await figgy.setActivePlaylist(e.target.value)
    resetEntries(playlist)
}

 const saveNewPlaylist = async () => {
    // saves whatever is in activePlaylist to the store with a name
    try {
        const name = await figgy.savePlaylist()
        if (typeof name === 'string') createPlaylist(name, true)
    } catch(e) {
        console.error("couldn't save playlist", e)
    }
}

const removeSavedPlaylist = (name) => {
    // removes a saved playlist from the store
    // WIP!
}

const createPlaylist = (name, isSelected = false) => {
    // creates playlist option to display in the DOM
    const playlistSelect = document.getElementById('playlist-select')

    const newOption = document.createElement('option')
    newOption.innerHTML = name
    newOption.value = name

    playlistSelect.appendChild(newOption)
    // set select to show that this new playlist is the current one
    if (isSelected) playlistSelect.value = name
}

export const populatePlaylists = async () => {
    // startup function
    const playlistSelect = document.getElementById('playlist-select')
    // remove child nodes before populating, but leave the default option alone
    let lastEl = playlistSelect.lastElementChild
    while (playlistSelect.firstElementChild.nextElementSibling) {
        playlistSelect.removeChild(lastEl)
        lastEl = playlistSelect.lastElementChild
    }

    const playlists = await figgy.getStoreItem('savedPlaylists')
    for (let name in playlists) {
        createPlaylist(name)
    }
}