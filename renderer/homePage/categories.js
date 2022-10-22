
export const addCatListeners = async () => {
    const includeAllBtn = document.getElementById("include-all-btn")
    const clearBtn = document.getElementById("clear-choices-btn")
    includeAllBtn.addEventListener('click', async e => {
        const inputs = document.querySelectorAll(".category-input")
        let newItems = []
        inputs.forEach(input => {
            if (!input.checked) newItems.push(input.value)
            input.checked = true
        })
        await figgy.setCats(newItems)
    })
    
    clearBtn.addEventListener('click', async e => {
        const inputs = document.querySelectorAll('input[name="include"]:checked');  
        inputs.forEach(input => {
            input.checked = false
        })
        await figgy.setCats('clear')
    })
}

/**
 * category functions:
 * 
 * These functions 1) call api functions to manage store data, and 2) manage slideshow category elements in the DOM.
 * 
 * create: makes and creates div to be displayed in DOM
 * populate: retrieves data from store and uses it to create and append category divs to category list container
 * that window listener: retrieves categories that were previously selected by user upon  window load, changes state in DOM to reflect data
 */



const createCategory = cat => {
    /***
     * Todo: need to ensure that no two categories/directories have the same name.
     */
    const div = document.createElement('div')
    const title = cat.split('-').join(' ')
    div.classList.add(`category`, cat)
    div.innerHTML = `
        <input 
        type="checkbox" 
        name="include" 
        id="include-${cat}" 
        class="category-input" 
        value="${cat}">
        <label for="include-${cat}" class="cat-lab">
            <img class="cat-folder" src="./public/icons/folder-open-regular.svg" />
            <span class="t-span">${title}</span>
            <svg width="50" height="50" viewbox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="23" fill="white" stroke="#ccbbcc" stroke-width="5"/>
            <g>
                <path id="path4146" d="M 20,40
                L 45,65 90,15
                " fill="none" stroke="#77cc00" stroke-width="9" class="path1" />
            </g>
            </svg>
        </label>
  `
  return div
}

export const populateCategories = async () => {
    const catContainer = document.getElementById("choose-category-container")
    const cats = await figgy.getFiles()
    cats.forEach(cat => {
        const newCat = createCategory(cat.name)
        catContainer.appendChild(newCat)
        newCat.querySelector('input[name="include"]').addEventListener('change', async e => await figgy.setCats(e.target.value))
    })
}

window.addEventListener('load', async() => {
    /**
     * to be fixed and or thought about:
     * respond to edge case: if a category is removed while it's in store, it will still appear in text. Check that each category exists before it's rendered.
     */
    let text = await figgy.getStoreItem("selectedCats")
    const inputs = document.querySelectorAll('input[name="include"]')
    inputs.forEach(input => {
        if (text.includes(input.value)) input.checked = true
    })
})



