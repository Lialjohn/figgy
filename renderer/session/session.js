// import Timer and Slides
import Timer from './timer.js'
import { getSlides, setSlide } from './slides.js'
import { imgContainer, overlay, pauseBtn, stopBtn, forwardBtn, figControls } from '../selectors.js';

export default async function startSession() {
    let fadeTimer = null
    let imgTime = document.querySelector('input[name="time-per-figure-radio"]:checked').value * 1000;
    let sessionTime = document.querySelector('input[name="session-time-radio"]:checked').value * 1000;
    imgTime = 5000
    sessionTime = 15000
    let totalSlides = Math.floor(sessionTime/imgTime)
    const userChoices = document.querySelectorAll('input[name="include-checkbox"]:checked');    
    
    imgTime = 5000
    sessionTime = 15000

    const slides = await getSlides(userChoices)
    setSlide(slides, imgContainer)
    const timer = new Timer(imgTime, totalSlides)
    totalSlides = 0
    let interval
    
/////// the interval function on which all other functions related to the session depend D: //////////

    const startInterval = () => {
        interval = setInterval(() => {
            if (timer.remaining <= 0) {
                timer.count--
                if (!timer.count) {
                    quit()
                } else {
                    forward()
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
        timer.isPaused = !timer.isPaused
    }

    const forward = () => {
        timer.reset()
        setSlide(slides, imgContainer)
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

    startInterval()
}