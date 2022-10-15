import { startBtn } from './selectors.js'
import { displayCategories } from './startup/index.js'
import startSession from './session/session.js'
const newFolderBtn = document.querySelector('.add-folder')


displayCategories()

startBtn.addEventListener('click', startSession)

newFolderBtn.addEventListener('click', async () => {
    // get file path
    const dirPath = await window.figgy.copyDir()
    // ask user for name. need input

    // then create new dir with input name and copy files from dirPath directory into it
})