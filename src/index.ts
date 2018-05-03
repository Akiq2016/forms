import './index.scss'

class DraggableItem extends HTMLElement {
  // todo: add a draggable = false wrapper
}

class DraggableWrapper extends HTMLElement {

  draggingItem: DraggableItem
  draggingCopyItem: DraggableItem
  oldPositionIndex: number
  MousePositionToCopyItemBorder: { width, height }

  constructor() {
    super()

    this.addEventListener('dragstart', (e): void => {
      e.preventDefault()
    })

    // Setup a drag related listeners on <draggable-wrapper> itself.
    this.addEventListener('mousedown', ({ target, clientX, clientY }): void => {
      if (!(target instanceof DraggableItem)) return

      let { left, top, width, height } = target.getBoundingClientRect()

      this.oldPositionIndex = this.getItemIndexInList(target)
      this.MousePositionToCopyItemBorder = {
        width: clientX - left,
        height: clientY - top
      }
  
      this.draggingItem = target
      this.draggingItem.style.cssText = `
        position: relative;
        top: 0;
        left: 0;
        z-index: 2;
        transform: translate(${left}px, ${top}px);
      `
  
      console.log('mousedown', target)
    }, false)

    this.addEventListener('mouseover', ({ target, clientX, clientY }): void => {
      if (!(target instanceof DraggableItem) || !this.draggingItem) return

      let { width, height } = this.MousePositionToCopyItemBorder
      this.draggingItem.style.transform = `translate(${clientX - width}px, ${clientY - height}px)`
      console.log(this.draggingItem.style.transform)

      // As a draggable item might have several blocks inside.
      // when it go in-out these blocks,
      // the draggable item's related events invoked.
      // So if is the same id, it still in itself.
      const newDragIndex = this.getItemIndexInList(target)
      if (newDragIndex === this.oldPositionIndex) return

      if (newDragIndex < this.oldPositionIndex) {
        this.insertBefore(this.draggingItem, target)
      } else if (newDragIndex > this.oldPositionIndex) {
        target.nextElementSibling
          ? this.insertBefore(this.draggingItem, target.nextElementSibling)
          : this.appendChild(this.draggingItem)
      }
      this.oldPositionIndex = newDragIndex
    }, false)

    this.addEventListener('mouseup', (e): void => {
      this.draggingItem.style.cssText = ''
      this.draggingItem = null
      console.log('mouseup', e.target)
    }, false)
  }

  getItemIndexInList(item: DraggableItem): number {
    return Array.from(this.querySelectorAll('draggable-item'))
      .findIndex(v => v === item)
  }
}

customElements.define('draggable-item', DraggableItem)
customElements.define('draggable-wrapper', DraggableWrapper)
