import './index.scss'

class DraggableItem extends HTMLElement {
  // todo: add a draggable = false wrapper
}

class DraggableWrapper extends HTMLElement {

  computedStyle: any
  boundingClientRect: { left, top, width, height }

  draggingItem: DraggableItem
  oldPositionIndex: number
  mousePositionToItemBorder: { width, height }

  constructor() {
    super()

    this.computedStyle = getComputedStyle(this)
    this.boundingClientRect = this.getBoundingClientRect()

    // so there won't have a dragging cursor effect
    this.addEventListener('dragstart', (e): void => {
      e.preventDefault()
    })

    // Using mouse related events to simulate the dragging effect.
    this.addEventListener('mousedown', ({ target, clientX, clientY }): void => {
      if (!(target instanceof DraggableItem)) return

      let { left, top } = target.getBoundingClientRect()

      this.draggingItem = target
      this.oldPositionIndex = this.getItemIndexInList(target)
      this.draggingItem.style.cssText = this.generateItemStyle({target})
      this.mousePositionToItemBorder = { width: clientX - left, height: clientY - top }
    }, false)

    this.addEventListener('mouseover', ({ target, clientX, clientY }): void => {
      // mouseover event is triggered when going through the current target.
      // for simulating drag, we need to ensure now there has a dragging stuff,
      // then the mouseover is the same as dragover.
      if (!(target instanceof DraggableItem) || !this.draggingItem) return

      let x = clientX - this.mousePositionToItemBorder.width - this.boundingClientRect.left
      let y = clientY - this.mousePositionToItemBorder.height - this.boundingClientRect.top

      this.draggingItem.style.left = `${x}px`
      this.draggingItem.style.top = `${y}px`

      // As a draggable item might have several blocks inside.
      // when it go in-out these blocks, the draggable item's related events invoked.
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
    }, false)
  }

  getItemIndexInList(item: DraggableItem): number {
    return Array.from(this.querySelectorAll('draggable-item'))
      .findIndex(v => v === item)
  }

  generateItemStyle({ target }): string {
    let { left, top } = target.getBoundingClientRect()
    let { width, height } = getComputedStyle(target)
    let item = { left, top, width, height }
    let parent = {
      left: this.boundingClientRect.left,
      top: this.boundingClientRect.top
    }

    return `position: absolute;z-index: 1;
      left: ${item.left - parent.left}px;
      top: ${item.top - parent.top}px;
      width: ${item.width};
      height: ${item.height};`
  }
}

customElements.define('draggable-item', DraggableItem)
customElements.define('draggable-wrapper', DraggableWrapper)
