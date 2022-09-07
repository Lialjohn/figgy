import { startBtn } from './selectors.js'
import { displayCategories } from './startup/index.js'
import startSession from './session/session.js'


displayCategories()
startBtn.addEventListener('click', startSession)