export const addEntryListeners = () => {
    const addNewEntryBtn = document.querySelector('.add-btn')
    addNewEntryBtn.addEventListener('click', addNewEntry)
}

/* Entry functions: 

    These functions 1) call api functions to manage store data, and 2) manage entry elements in the DOM.

    addNew: adds new entry to current playlist in the store
    remove: removes single entry from current playlist
    create: creates and appends an entry to the DOM
    reset: removes all active entries and optionally replaces with saved playlist

    summary functions: deals with and displays total session time, compiled from active entries. add, subtract, change.
*/

const addToSummary= (n) => {
    // get total seconds from store, add n to total, change summary
}

const subtractFromSummary = (n) => {
    // get total seconds from store, subtract n from total, change summary 
}

const changeSummary = (n) => {
    // sums up image time for display each time an entry is added. takes total seconds, as arg
    // this isn't yet hooked up to new UI.
    const summary = document.getElementById('summary')
    let [hoursEl, minutesEl, secondsEl] = summary.querySelectorAll('.sum-unit')
    let seconds = (n % 60)
    let minutes = Math.floor(n / 60)
    let hours = Math.floor(n / 60 / 60)

    const validate = (el, num) => {
        if (num > 0) {
            el.textContent = num
            el.nextElementSibling.style = "display: inline"
        } else {
            el.textContent = ''
            el.nextElementSibling.style = "display: none"
        }
    }
    validate(hoursEl, hours)
    validate(minutesEl, minutes)
    validate(secondsEl, seconds)
}

const addNewEntry = async (_, slides, imgTime, timeUnit) => {
    // Adds entry to current playlist object
    // function for add entry button, but I've added extra args in case I want to call it somewhere else, also.
    if (!slides) slides = document.getElementById('slide-number').value
    if (!imgTime) imgTime = document.getElementById('time-per-slide').value
    if (!timeUnit) timeUnit = document.getElementById('time-unit').value
    const entry = {
        slides,
        imgTime,
        timeUnit,
        cats: await figgy.getStoreItem('selectedCats')
    }
    const res = await figgy.addEntry(entry)
    const activePlaylist = await figgy.getStoreItem('activePlaylist')
    console.log('active: ', activePlaylist)
    if (res === true) {
        createEntry(activePlaylist.length, entry)
        changeSummary(slides * (imgTime * timeUnit))
    }
}

const createEntry = (n, entry) => {
    // Adds and appends an entry to DOM
    const cats = entry.cats.map(v => v.split('-').join(' ')).join(', ')
    const timeUnit = entry.timeUnit === '1' ? 'sec' : entry.timeUnit === '60' ? 'min' : 'hour'
    let entryText
    let entryIDText = `
        <button type="button" class="delete-playlist-entry">
            <img class="svg-icon" src="./public/icons/xmark-solid.svg">
        </button>
        <span class="entry-num">${n}</span>
        <span>)</span>
    `
    if (entry.slides === '0') entryText = `
        <strong style="color: hotpink">PAUSE</strong>
        <strong style="color: blue"> ${entry.imgTime} ${timeUnit}</strong>
    `
    else entryText = `
        <strong style="color: hotpink">${entry.slides}</strong>
        <strong style="color: blue"> ${entry.imgTime} ${timeUnit}</strong>
        <p style="color: hotpink">${cats}</p> 
    `
    const entryIDList = document.querySelector('#entry-ids')
    const entryList = document.querySelector('#entries')
    const newEntryID = document.createElement('div')
    const newEntry = document.createElement('div')
    // add new entry id and delete button
    newEntryID.classList.add('entry-id')
    newEntryID.innerHTML = entryIDText
    newEntryID.addEventListener('click', removeEntry)
    entryIDList.appendChild(newEntryID)
    // add entry information
    newEntry.classList.add('playlist-entry')
    newEntry.innerHTML = entryText
    entryList.appendChild(newEntry)
}

const removeEntry = async e => {
    //removes a playlist entry
    if (e.target.classList.contains('svg-icon')) {
        const entryContainer = document.getElementById('entries')
        const idContainer = document.getElementById('entry-ids')
        let i = e.currentTarget.querySelector('.entry-num').innerText
        await figgy.removeEntry(i - 1)
        entryContainer.removeChild(entryContainer.childNodes[i - 1])
        idContainer.removeChild(idContainer.lastChild)
    }
}

export const resetEntries = (playlist = []) => {
    // remove any entries that are currently attached, replace with new ones
    const entryContainer = document.getElementById('entries')
    const entryIDContainer = document.getElementById('entry-ids')
    let lastEntry = entryContainer.lastElementChild
    let lastID = entryIDContainer.lastElementChild
    while (lastEntry) {
        lastID.removeEventListener('click', removeEntry)
        entryIDContainer.removeChild(lastID)
        lastID = entryIDContainer.lastElementChild
        entryContainer.removeChild(lastEntry)
        lastEntry = entryContainer.lastElementChild
    }
    for (let i = 0; i < playlist.length; i++) {
        createEntry(i + 1, playlist[i])
    }
}