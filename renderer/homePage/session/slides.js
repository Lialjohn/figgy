
const shuffle = array => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}

export default class Slides {
    // do not use 'new' to make Slides instance. Use Slides.create(args)
    constructor(imgs, count, container, id) {
        this.imgs = imgs
        this.i = 0
        this.id = id
        this.count = count
        this.container = container
    }
    static async create(categories, count, container, id) {
        let imgPaths = []
        for (let elem of categories) {
            let files = await window.figgy.getFiles(elem)
            files.forEach(file => imgPaths.push(file.path))
        }
        return new Slides(shuffle(imgPaths), count, container, id)
    }
    get done() { return this.count <= 0 }
    reshuffle() {
        this.imgs = shuffle(this.imgs)
    }
    next(countingDown = false) {
        if (countingDown) this.count--
        this.setSlide()
        this.i++
        if (this.i > this.imgs.length - 1) this.i = 0
    }
    prev() {
        this.i -= 2
        if (this.i === -1) this.i = this.imgs.length - 1
        else if (this.i === -2) this.i = this.imgs.length - 2
        else if (this.i < -2) {
            this.i = 0
            console.log("something weird happening with the slides index, check it")
        }
        this.next()
    }
    setSlide(container = this.container) {
        container.style.visibility = 'visible'
        container.style.backgroundImage = `url(${this.imgs[this.i]})`
    }
}