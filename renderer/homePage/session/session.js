// import Timer and Slides
import Timer from './timer.js'
import Slides from './slides.js'

export default async function startSession() {
    // for each entry in the playlist, create a Slides obj.
    // start timer as usual, when the slides run out it'll check if there's another entry
    // if y, stay active and reset with new info. if n, quit()
    const playlist = await figgy.getStoreItem('activePlaylist')
    let entry = playlist[0]

    // if no entries in active playlist, display warning and abort operation
    if (!entry) {
        alert("no data to start session with")
        return
    }
    const imgCounterCont = document.getElementById('image-counter-display')
    let imgCounter = 1
    const imgContainer = document.getElementById('figure-area')
    const overlay = document.querySelector('.overlay')
    const pauseBtn = document.querySelector('.pause')
    const stopBtn = document.querySelector('.stop')
    const forwardBtn = document.querySelector('.forward')
    const figControls = document.querySelector('.control-bar-cont')

    let fadeTimer = null
    let slides = await Slides.create(entry.cats, entry.slides, imgContainer, 0)
    const timer = new Timer((entry.imgTime * entry.timeUnit) * 1000)
    
/////// the interval function on which all other functions related to the session depend D: //////////
    let interval
    const startInterval = () => {
        interval = setInterval(async () => {
            if (timer.remaining <= 0) {
                if (slides.done) {
                    const nextEntry = playlist[slides.id + 1]
                    if (nextEntry) {
                        let id = slides.id + 1
                        slides = await Slides.create(nextEntry.cats, nextEntry.slides, imgContainer, id)
                        timer.slideTime = (nextEntry.imgTime * nextEntry.timeUnit * 1000)
                        timer.reset()
                        slides.next(true)
                        imgCounterCont.innerText = imgCounter++
                    } else quit()
                } else {
                    timer.reset()
                    slides.next(true)
                    imgCounterCont.innerText = imgCounter++
                }
            }
            timer.setClock()
        }, 50)
    }

    //// handler functions for buttons /////

    const quit = () => {
        clearInterval(interval)
        imgContainer.style.visibility = 'hidden'
        overlay.classList.remove('on')
        overlay.removeEventListener('mousemove', fadeControls)
        stopBtn.removeEventListener('click', quit)
        pauseBtn.removeEventListener('click', pause)
        forwardBtn.removeEventListener('click', forward)
        window.removeEventListener('keydown', hotKeyRedirect)
    }    

    const pause = e => {
        if (timer.isPaused) {
            pauseBtn.classList.remove('on')
            timer.startTime = Date.now()
            startInterval()
        } else {
            clearInterval(interval)
            timer.pauseTime = timer.remaining
            pauseBtn.classList.add('on')
        }
        timer.pause()
    }

    const forward = () => {
        timer.reset()
        slides.next()
    }

    const backward = () => {
        // haven't hooked this up yet
        timer.reset()
        slides.prev()
    }

    /////////// misc control bar functions /////////

    const fadeControls = () => {
        figControls.style.opacity = 1
        clearTimeout(fadeTimer)
        fadeTimer = setTimeout(() => {
            figControls.style.opacity = 0
            fadeTimer = null
        }, 1500)
    }
    const hotKeyRedirect = e => {
        e.preventDefault()
        if (e.which === 39) forward()
        else if (e.which === 32) pause()
        else if (e.which === 27) quit()
        else return
    }

    //// add event listeners /////
    overlay.classList.add('on')
    pauseBtn.addEventListener('click', pause)
    stopBtn.addEventListener('click', quit)
    forwardBtn.addEventListener('click', forward)
    window.addEventListener('mousemove', fadeControls)
    window.addEventListener('keydown', hotKeyRedirect)


    //// now do the thing ////

    imgCounterCont.innerText = imgCounter++
    slides.next(true)
    startInterval()
}