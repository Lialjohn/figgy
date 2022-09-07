
export async function displayCategories() {
    const categoryContainer = document.getElementById('category-container')
    const folderList = await window.figgy.getFiles()
    folderList.forEach(folder => {
        const newLabel = document.createElement('label')
        const newInput = document.createElement('input')
        const newDiv = document.createElement('div')
        const newSpan = document.createElement('span')

        newLabel.htmlFor = `${folder.name}-option`
        newInput.type = "checkbox"
        newInput.classList.add('include-checkbox', 'btn')
        newInput.id = `${folder.name}-option`
        newInput.name = "include-checkbox"
        newInput.value = folder.name
        newDiv.classList.add('time-options-box')
        newSpan.innerText = folder.name

        newDiv.appendChild(newSpan)
        newLabel.appendChild(newInput)
        newLabel.appendChild(newDiv)
        categoryContainer.appendChild(newLabel)
    })
}