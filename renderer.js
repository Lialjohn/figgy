const minutesContainer = document.querySelectorAll('.minutes')
const secondsContainer = document.querySelectorAll('.seconds')
const msContainer = document.querySelectorAll('.ms')
const timer = document.querySelector('.timer-container')
const test = document.querySelector('p')
const startBtn = document.getElementById('start-btn');
const overlay = document.querySelector('.overlay');
const figControls = document.querySelector('.control-bar-cont')
const pauseBtn = document.querySelector('.pause')
const stopBtn = document.querySelector('.stop')
const forwardBtn = document.querySelector('.forward')
const backBtn = document.querySelector('.backward')
const imgContainer = document.getElementById('figure-area')

const shuffle = array => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}

async function createImgArray(userChoices) {
    let includes = [];
    for (let elem of userChoices) includes.push(elem.value);
    let imgPaths = []
    for (let choice of includes) {
        let data = await window.figgy.getImages(choice)
        data = data.map(v => `./images/${choice}/${v}`)
        imgPaths = [...imgPaths, ...data]
    }
    return shuffle(imgPaths)
}

async function startSession() {
    let imgTime = document.querySelector('input[name="time-per-figure-radio"]:checked').value * 1000;
    let sessionTime = document.querySelector('input[name="session-time-radio"]:checked').value * 1000;
    let userChoices = document.querySelectorAll('input[name="include-checkbox"]:checked');

    imgTime = 5000 // short img slider for testing purposes
    sessionTime = 20000

    let imgs = await createImgArray(userChoices)
    let totalSlides = Math.floor(sessionTime/imgTime)
    let isPaused = false
    let i = 0
    let fadeTimer = null
    let timer = null
    
    const t = {
        startTime: Date.now(),
        pauseTime: 0,
        imgTime,
        count: totalSlides,
        get remainingTime() { return (this.pauseTime || this.imgTime) - (Date.now() - this.startTime) },
        get minsLeft() { return Math.floor((this.remainingTime/1000)/60) },
        get secsLeft() { return Math.floor((this.remainingTime/1000) % 60) },
        get msLeft() { return this.remainingTime % 1000 },
        getClockNumbers: (n) => {
            let hunds = Math.floor(n / 100)
            let tens = Math.floor((n - (hunds * 100)) / 10)
            let ones = Math.floor(n - (hunds * 100) - (tens * 10))
            return [ones, tens, hunds]
        },
    }

    const setImage = () => {
        imgContainer.style.visibility = 'visible'
        imgContainer.style.background = `no-repeat center url(${imgs[i]})`
        imgContainer.style.backgroundSize = 'contain'
        i++
        if (i > imgs.length - 1) i = 0
    }

    const startTimer = () => {
        let [minsOnes, minsTens, minsHunds] = t.getClockNumbers(t.minsLeft)
        let [secsOnes, secsTens, secsHunds] = t.getClockNumbers(t.secsLeft)
        let [msOnes, msTens, msHunds] = t.getClockNumbers(t.msLeft)

        minutesContainer[0].innerHTML = minsTens > 0 ? minsTens : 0
        minutesContainer[1].innerHTML = minsOnes > 0 ? minsOnes : 0
        secondsContainer[0].innerHTML = secsTens > 0 ? secsTens : 0
        secondsContainer[1].innerHTML = secsOnes > 0 ? secsOnes : 0
        msContainer[0].innerHTML = msHunds > 0 ? msHunds : 0
        msContainer[1].innerHTML = msTens > 0 ? msTens : 0
        msContainer[2].innerHTML = msOnes > 0 ? msOnes : 0

        if (t.remainingTime <= 0) {
            t.count--
            nextImage()
        }
        if (t.count) {
            timer = setTimeout(startTimer, 50)
        } else quit()
    }

    const quit = () => {
        clearTimeout(timer)
        imgContainer.style.visibility = 'hidden'
        overlay.classList.remove('on')
        overlay.removeEventListener('mousemove', fadeControls)
        stopBtn.removeEventListener('click', quit)
        pauseBtn.removeEventListener('click', pause)
        forwardBtn.removeEventListener('click', nextImage)
        window.removeEventListener('keydown', pause)
        fadeTimer = null
    }    

    // are the controls active or not y or n
    const opaque = () => {
        return figControls.style.opacity !== '0';
    }
    
    const pause = e => {
        if (e.type === 'keydown' && e.which !== 32) return
        if (isPaused) {
            pauseBtn.classList.remove('on')
            t.startTime = Date.now()
            startTimer()
        } else {
            clearTimeout(timer)
            t.pauseTime = t.remainingTime
            pauseBtn.classList.add('on')
        }
        isPaused = !isPaused
    }
    
    const nextImage = () => {
        // skip to next image, time for slide is reset
        t.startTime = Date.now()
        t.pauseTime = 0
        setImage()

    }

    const fadeControls = () => {
        figControls.style.opacity = 1
        if (fadeTimer) clearTimeout(fadeTimer)
        fadeTimer = setTimeout(() => {
            figControls.style.opacity = 0
            fadeTimer = null
        }, 1500)
    }

    //// now do the things ////

    overlay.classList.add('on')
    overlay.addEventListener('mousemove', fadeControls)
    stopBtn.addEventListener('click', quit)
    pauseBtn.addEventListener('click', pause)
    window.addEventListener('keydown', pause)
    forwardBtn.addEventListener('click', nextImage)
    fadeControls()
    startTimer()
    setImage()
}

startBtn.addEventListener('click', startSession)