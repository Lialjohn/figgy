import { populateCategories, addCatListeners } from "./categories.js"
import { addEntryListeners } from "./entries.js"
import { addPlaylistListeners, populatePlaylists } from "./playlists.js"

const homePage = () => {
    //making home page from template
    const template = document.getElementById('home-page-template')
    const clone = template.content.cloneNode(true)
    const tab = clone.querySelector('.template').dataset.tab
    document.getElementById(tab).appendChild(clone)
}

export default function homeInit() {
    // setting up the homepage woo
    // todo: reorganize listeners so I don't have to call a function for each set
    homePage()
    populatePlaylists()
    populateCategories()
    addCatListeners()
    addEntryListeners()
    addPlaylistListeners()
}