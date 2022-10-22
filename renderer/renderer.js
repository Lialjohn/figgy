import startSession from './homePage/session/session.js'
import homeInit from './homePage/index.js'

homeInit()

const startBtn = document.getElementById("start-btn")
startBtn.addEventListener('click', startSession)