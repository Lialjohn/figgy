import { minutesContainer, secondsContainer, msContainer, timerContainer, overlay, figControls, startBtn, pauseBtn, stopBtn, forwardBtn, backBtn, imgContainer } from '../selectors.js'
// can import the control bar functions, probably

export default class Timer {
    constructor(imgTime, count) {
        this.startTime = Date.now(),
        this.pauseTime = 0,
        this.imgTime = imgTime,
        this.count = count
        this.isPaused = false
    }
    get remaining() { return (this.pauseTime || this.imgTime) - (Date.now() - this.startTime) }
    get minsLeft() { return Math.floor((this.remaining/1000)/60) }
    get secsLeft() { return Math.floor((this.remaining/1000) % 60) }
    get msLeft() { return this.remaining % 1000 }
    getClockNumbers(n) {
        let hunds = Math.floor(n / 100)
        let tens = Math.floor((n - (hunds * 100)) / 10)
        let ones = Math.floor(n - (hunds * 100) - (tens * 10))
        return [ones, tens, hunds]
    }
    reset() { 
        this.startTime = Date.now()
        this.pauseTime = 0
    }
    setClock = () => {
        let [minsOnes, minsTens] = this.getClockNumbers(this.minsLeft)
        let [secsOnes, secsTens] = this.getClockNumbers(this.secsLeft)
        let [msOnes, msTens, msHunds] = this.getClockNumbers(this.msLeft)
    
        minutesContainer[0].innerHTML = minsTens > 0 ? minsTens : 0
        minutesContainer[1].innerHTML = minsOnes > 0 ? minsOnes : 0
        secondsContainer[0].innerHTML = secsTens > 0 ? secsTens : 0
        secondsContainer[1].innerHTML = secsOnes > 0 ? secsOnes : 0
        msContainer[0].innerHTML = msHunds > 0 ? msHunds : 0
        msContainer[1].innerHTML = msTens > 0 ? msTens : 0
        msContainer[2].innerHTML = msOnes > 0 ? msOnes : 0
    }
}