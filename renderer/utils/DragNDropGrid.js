    /**
     * other things that might be cool to add in the future:
     * - ability to change direction of added items, like infinite cols instead of rows, items added from top to bottom
     * - maxRow, maxCol (have a max size for grid/row/col)
     * - header rows/cols, like a graph
     * - different values for row and col gap
     * - ability to dynamically add columns as well as rows
     * - implement grid gap in a way that doesn't suck
     * - detect whether cursor is over a gap in the grid, so that swaps only happen when moving over elements
    **/

    /**
     * todo:
     * - finish remove function
     * - make resize function less janky
     */


export default class DragNDropGrid {
    constructor(container, { containerClassNames = [], draggableClassNames = [], containerID = '', cols = 1, rowHeight, colWidth, gap = 0, numbered = false }) {
        // if no rows given, rows grow infinitely. if no cols, cols grow infinitely.
        // need to have one or the other, until I add functions to deal with that (nrn tho)
        this.container = container
        this.container.id = containerID
        this.container.classList.add(...containerClassNames)
        this.draggableClassNames = draggableClassNames
        this.body = document.querySelector('body')
        // references to all elements in the grid container
        this.draggables = []
        // grid info!
        this.cols = cols
        this.colInd = 0
        this.rows = 0
        this.rowInd = 0
        this.original = null
        this.clone = null
        this.cloneOffsetX = 0
        this.cloneOffsetY = 0
        this.rowHeight = rowHeight
        this.colWidth = colWidth || Math.floor(container.getBoundingClientRect().width/cols)
        this.gap = gap
        // have to separate height and 'true' height because of borders, margin, etc. that might affect placement and container size.
        this.fullDraggableHeight
        this.fullDraggableWidth
        // for potential numbered option
        this.numbered = numbered
        this.index = 0
        // bound methods for event listeners
        this.dragStartBound = this.dragStart.bind(this) 
        this.dragBound = this.drag.bind(this)
        this.dragEndBound = this.dragEnd.bind(this)
        this.resizeBound = this.resize.bind(this)
    }
    attachTo(parent) { parent.appendChild(this.container)}
    resize(e) {
        // auto-resizes columns to fit a container that changes width with window width. Height is static for now. If only 1 column this can be skipped, woo.
        this.colWidth = Math.floor(this.container.getBoundingClientRect().width/this.cols)
        this.draggables.forEach(draggable => {
            draggable.style.width = this.colWidth + 'px'
        })
        if (this.draggables.length) this.fullDraggableWidth = this.draggables[0].getBoundingClientRect().width
        this.setTransform(this.draggables)
    }
    add(draggable) {
        // add indices and other optional stuff, then add element to end of grid
        draggable.classList.add(...this.draggableClassNames, 'draggable', 'noselect')
        if (this.rowHeight) draggable.style.height = this.rowHeight + 'px'
        if (this.colWidth) draggable.style.width = this.colWidth + 'px'
        draggable.dataset.colInd = this.colInd++
        draggable.dataset.rowInd = this.rowInd
        draggable.dataset.index = this.index++
        this.container.append(draggable)
        this.fullDraggableHeight = draggable.getBoundingClientRect().height
        this.fullDraggableWidth = draggable.getBoundingClientRect().width
        // row index increases only when col resets to zero
        if (this.colInd >= this.cols) {
            this.colInd = 0
            this.rowInd++
            this.container.style.height = ((this.rowInd + 1) * this.fullDraggableHeight) + ((this.rowInd + 1) * this.gap) + 'px'
        }
        this.setTransform([draggable])
        draggable.addEventListener('mousedown', this.dragStartBound)
        this.draggables.push(draggable)
    }
    remove(i) {
        if (!this.draggables.length) return
        this.draggables.forEach(d => d.classList.add('moving'))
        // use index to remove element from grid
        //  (currrow) * (totalcol) + (currcol)
        // let i = (row * this.cols) + col
        // remove this element from draggables and then readjust all elements that come after it.
        // move i to i + 1 adjusting along the way, until I can pop it off. I'll have to adjust indices on everything that comes after it anyway.
        // in fact I can just swap with the last index and do it that way. 
        this.swapElementLinear(i, this.draggables.length - 1)
        const removed = this.draggables.pop()
        this.container.removeChild(removed)
        this.index--
        this.colInd--
        if (this.colInd < 0) {
            this.colInd = this.cols - 1
            this.rowInd--
            this.container.style.height = ((this.rowInd + 1) * this.fullDraggableHeight) + ((this.rowInd + 1) * this.gap) + 'px'
        }
        setTimeout(() => {
            this.draggables.forEach(d => d.classList.remove('moving'))
        }, 300)
    }
    dragStart(e) {
        e.stopImmediatePropagation()
        // enable drag functions/classes on click
        this.body = document.querySelector('#home-page-container')
        this.draggables.forEach(d => d.classList.add('moving'))
        this.original = e.target
        this.clone = this.original.cloneNode(true)
        this.original.classList.add('grabbed')
        this.clone.style.transform = ''
        // need these 2 vars to keep cursor in correct place during movement
        this.cloneOffsetX = e.offsetX
        this.cloneOffsetY = e.offsetY
        // for the image return trip, the top and left for the original place
        // spawn the clone on cursor, in the spot that the original was grabbed
        this.clone.style.left = `${e.pageX - this.cloneOffsetX}px`
        this.clone.style.top = `${e.pageY - this.cloneOffsetY}px`
        this.clone.id = 'clone'
        this.clone.classList.add('grab-active')
        this.body.append(this.clone)
        document.addEventListener('mouseup', this.dragEndBound)
        document.addEventListener('mousemove', this.dragBound)
        document.addEventListener('mouseleave', this.dragEndBound)
    }
    drag(e) {
        // check what the e.target is touching another draggable
        this.clone.style.left = `${e.pageX - this.cloneOffsetX}px`
        this.clone.style.top = `${e.pageY - this.cloneOffsetY}px`
        this.detectCollision(e)
    }
    detectCollision(cursorPos) {
        let containerRect = this.container.getBoundingClientRect()
        // if cursor falls within the container, do the things
        if (
            cursorPos.pageX < containerRect.left + containerRect.width  && cursorPos.pageX  > containerRect.left && 
            cursorPos.pageY < containerRect.top + containerRect.height && cursorPos.pageY > containerRect.top
            ) {
            // should fix the gap so that it's not being multiplied, really...
            // also the coords aren't quite right. the gap is making things screwy. fix!
            let cloneRect = this.clone.getBoundingClientRect()
            let rowInd = Math.floor((cursorPos.pageY - containerRect.top) / (cloneRect.height))
            let colInd = Math.floor((cursorPos.pageX - containerRect.left) / (cloneRect.width))
            let originRow = Number(this.original.dataset.rowInd)
            let originCol = Number(this.original.dataset.colInd)
            let originIndex = (originRow * this.cols) + originCol
            let destinationIndex = (rowInd * this.cols) + colInd
            // if an element exists there and it doesn't match the clone
            if (this.draggables[destinationIndex] && (originIndex !== destinationIndex)) {
                this.swapElementLinear(originIndex, destinationIndex)
            }
        }
    }
    dragEnd(e) {
        // scoped references in case this.clone/original is overwritten with fast clicking
        let currClone = this.clone
        let currOriginal = this.original
        document.removeEventListener('mousemove', this.dragBound)
        document.removeEventListener('mouseleave', this.dragEndBound)
        document.removeEventListener('mouseup', this.dragEndBound)
        currClone.classList.remove('grab-active')
        currClone.style.transition = '.3s cubic-bezier(0,0, 0.2, 1.0)'
        // clone snaps to position
        const rowInd = Number(currOriginal.dataset.rowInd)
        const colInd = Number(currOriginal.dataset.colInd)
        // specifically to new position within the container
        currClone.style.left = `${(colInd * this.fullDraggableWidth) + (colInd * this.gap) + this.container.getBoundingClientRect().left}px`
        currClone.style.top = `${(rowInd * this.fullDraggableHeight) + (rowInd * this.gap) + this.container.getBoundingClientRect().top}px`
        console.log(currClone.style.left, currClone.style.top)
        // clone is removed after snap transition
        setTimeout(() => {
            if (this.clone === currClone)this.draggables.forEach(d => d.classList.remove('moving'))
            currOriginal.classList.remove('grabbed')
            this.body.removeChild(currClone)
            currClone = null
            currOriginal = null
        }, 300)
    }
    swapElementLinear(originIndex, destinationIndex) {
        // it's linear because maybe will make more complex swap option in future
        let i = Math.max(originIndex, destinationIndex)
        let j = Math.min(originIndex, destinationIndex)
        // swap origin with the next element, continue until final destination is reached
        // if/else in case multiple elements are moved in the same swap. Moving down the list would need a different loop than moving up the list
        if ( i === originIndex ) {
            for(; i > j; i--) {
                // change indices
                this.draggables[i - 1].dataset.colInd++
                this.draggables[i - 1].dataset.index++
                if (this.draggables[i - 1].dataset.colInd >= this.cols) {
                    this.draggables[i - 1].dataset.colInd = 0
                    this.draggables[i - 1].dataset.rowInd++
                }
                this.draggables[i].dataset.colInd--
                this.draggables[i].dataset.index--
                if (this.draggables[i].dataset.colInd < 0) {
                    this.draggables[i].dataset.colInd = this.cols - 1
                    this.draggables[i].dataset.rowInd--
                }
                // swap
                [this.draggables[i], this.draggables[i - 1]] = [this.draggables[i - 1], this.draggables[i]]
                // reset transforms to reflect new order
                this.setTransform([this.draggables[i], this.draggables[i - 1]])
            }
    
        } else {
            for(; j < i; j++) {
                // change indices
                this.draggables[j + 1].dataset.colInd--
                this.draggables[j + 1].dataset.index--
                if (this.draggables[j + 1].dataset.colInd < 0) {
                    this.draggables[j + 1].dataset.colInd = this.cols - 1
                    this.draggables[j + 1].dataset.rowInd--
                }
                this.draggables[j].dataset.colInd++
                this.draggables[j].dataset.index++
                if (this.draggables[j].dataset.colInd >= this.cols) {
                    this.draggables[j].dataset.colInd = 0
                    this.draggables[j].dataset.rowInd++
                }
                // swap
                [this.draggables[j + 1], this.draggables[j]] = [this.draggables[j], this.draggables[j + 1]]
                // reset transforms to reflect new order
                this.setTransform([this.draggables[j], this.draggables[j + 1]])
            }
        }
        // I would also change the active playlist in the store to reflect new order, also.
    }
    setTransform(elements) {
        let colWidth = this.fullDraggableWidth
        let rowHeight = this.fullDraggableHeight
        let gap = this.gap
        elements.forEach(function(el) {
            let colInd = Number(el.dataset.colInd)
            let rowInd = Number(el.dataset.rowInd)
            el.style.transform = `translate(${(colInd * colWidth) + (colInd * gap)}px, ${(rowInd * rowHeight) + (rowInd * gap)}px)`
        })
    }
}