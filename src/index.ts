import './index.scss'

class DraggableItem extends HTMLElement {
  // todo: add a draggable = false wrapper
}

class DraggableWrapper extends HTMLElement {

  draggingItem: DraggableItem
  oldPositionIndex: number

  constructor() {
    super()

    // Setup a drag related listeners on <draggable-wrapper> itself.
    this.addEventListener('dragstart', ({ target, dataTransfer }): void => {
      if (!(target instanceof DraggableItem)) return

      // todo
      dataTransfer.effectAllowed = "move"

      this.draggingItem = target
      this.oldPositionIndex = this.getItemIndexInList(target)

      this.draggingItem.style.cssText = 'opacity: 0.5; cursor: move'

    }, false)

    this.addEventListener('dragenter', ({ target }): void => {
      if (!(target instanceof DraggableItem)) return

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

    this.addEventListener('dragleave', ({ target }): void => {
    }, false)

    this.addEventListener('dragend', (e): void => {
      this.draggingItem.style.cssText = ''
    }, false)

  }
  
  getItemIndexInList (item: DraggableItem): number {
    return Array.from(this.querySelectorAll('draggable-item'))
      .findIndex(v => v === item)
  }
}

customElements.define('draggable-item', DraggableItem)
customElements.define('draggable-wrapper', DraggableWrapper)
