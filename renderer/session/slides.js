
const shuffle = array => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}

export const getSlides = async userChoices => {
    let imgPaths = []
    for (let elem of userChoices) {
        let files = await window.figgy.getFiles(elem.value)
        files.forEach(file => imgPaths.push(file.path))
    }
    return { i: 0, imgs: shuffle(imgPaths) }
}

export const setSlide = (slides, container) => {
    container.style.visibility = 'visible'
    container.style.backgroundImage = `url(${slides.imgs[slides.i++]})`
    if (slides.i > slides.imgs.length - 1) slides.i = 0
}