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

    // Setup a drag related listeners on <draggable-wrapper> itself.
    this.addEventListener('drag', ({ target, clientX, clientY }): void => {
      // console.log('dragstart', target)
      if (!(target instanceof DraggableItem) || this.draggingCopyItem) return

      // init
      this.draggingItem = target
      this.draggingItem.style.cssText = 'opacity: 0.5'
      this.oldPositionIndex = this.getItemIndexInList(target)

      // setup a dragging copy item
      this.draggingCopyItem = this.generateCopyItem({item: target, clientX, clientY})
    }, false)

    this.addEventListener('dragover', (e): void => {
      // console.log('dragover', e.target)
      if (!(e.target instanceof DraggableItem) || !e.target.draggable) return

      // As a draggable item might have several blocks inside.
      // when it go in-out these blocks,
      // the draggable item's related events invoked.
      // So if is the same id, it still in itself.
      this.draggingCopyItem.style.transform = `translate(${e.clientX - e.offsetX}px, ${e.clientY}px)`

      const newDragIndex = this.getItemIndexInList(e.target)
      if (newDragIndex === this.oldPositionIndex) return

      if (newDragIndex < this.oldPositionIndex) {
        this.insertBefore(this.draggingItem, e.target)
      } else if (newDragIndex > this.oldPositionIndex) {
        e.target.nextElementSibling
          ? this.insertBefore(this.draggingItem, e.target.nextElementSibling)
          : this.appendChild(this.draggingItem)
      }
      this.oldPositionIndex = newDragIndex
    }, false)

    this.addEventListener('dragend', (e): void => {
      // console.log('dragend', e.target)
      this.draggingItem.style.cssText = ''
      this.removeChild(this.draggingCopyItem)
      this.draggingCopyItem = null
    }, false)

    // this.addEventListener('dragover', e => {
    //   // console.log('dragover', e.target)
    //   // default action: reset the current drag operation to "none".
    //   // so prevent default to allow drop
    //   e.preventDefault()

    //   if (!(e.target instanceof DraggableItem)) return

    //   let { width, height } = this.MousePositionToCopyItemBorder
    //   this.draggingCopyItem.style.transform = `translate(${e.clientX - width}px, ${e.clientY - height}px)`
    // }, false)
  }

  getItemIndexInList(item: DraggableItem): number {
    return Array.from(this.querySelectorAll('draggable-item'))
      .findIndex(v => v === item)
  }

  generateCopyItem({ item, clientX, clientY }): DraggableItem {
    let { left, top, width, height } = item.getBoundingClientRect()
    let copyItem = item.cloneNode(true)

    this.MousePositionToCopyItemBorder = {
      width: clientX - left,
      height: clientY - top
    }

    copyItem.dataset.dragId = 'COPY_1'
    copyItem.draggable = false
    copyItem.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      z-index: 2;
      width: ${width}px;
      height: ${height}px;
      padding: 0;
      transform: translate(${left}px, ${top}px);
      background-color: #f00;
    `

    this.appendChild(copyItem)

    return copyItem
  }
}

customElements.define('draggable-item', DraggableItem)
customElements.define('draggable-wrapper', DraggableWrapper)
