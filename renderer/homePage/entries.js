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

const getSummaryTotal = () => {
    const [hoursEl, minutesEl, secondsEl] = document.querySelectorAll('.sum-unit')
    let seconds = Number(secondsEl.innerText)
    let minutes = Number(minutesEl.innerText)
    let hours = Number(hoursEl.innerText)
    return seconds + (minutes * 60) + (hours * 60 * 60)
}

const addToSummary= (n) => {
    changeSummary(getSummaryTotal() + n)
}

const subtractFromSummary = (n) => {
    changeSummary(getSummaryTotal() - n)
}

const changeSummary = (n) => {
    // sums up image time for display each time an entry is added. takes total seconds, as arg
    const [hoursEl, minutesEl, secondsEl] = document.querySelectorAll('.sum-unit')
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
    
    if (!entry.cats,length) {
        // display dialog to warn user... should make an api function for that.
        return
    }

    // also, clear active cats after an entry is added? that might be something that could be toggled in settings.
    const res = await figgy.addEntry(entry)
    const activePlaylist = await figgy.getStoreItem('activePlaylist')
    console.log('active: ', activePlaylist)
    if (res === true) {
        createEntry(activePlaylist.length, entry)
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
    // add to summary
    addToSummary(entry.slides * (entry.imgTime * entry.timeUnit))
}

const removeEntry = async e => {
    //removes a playlist entry
    if (e.target.classList.contains('svg-icon')) {

        let i = e.currentTarget.querySelector('.entry-num').innerText
        let [removed] = await figgy.removeEntry(i - 1)
        subtractFromSummary(removed.slides * (removed.imgTime * removed.timeUnit))

        const entryContainer = document.getElementById('entries')
        const idContainer = document.getElementById('entry-ids')
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

    changeSummary(0)

    for (let i = 0; i < playlist.length; i++) {
        createEntry(i + 1, playlist[i])
    }
}