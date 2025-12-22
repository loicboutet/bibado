import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="meal-calendar"
export default class extends Controller {
  static targets = ["mealSlot", "swapModal", "previewModal", "previewContent", "addMealModal"]
  
  draggedItem = null
  currentSlot = null
  dragClone = null
  longPressTimer = null
  touchStartX = 0
  touchStartY = 0
  hasMoved = false

  connect() {
    console.log("Meal calendar controller connected")
    this.setupDesktopDrag()
    this.setupMobileTouchEvents()
  }

  setupMobileTouchEvents() {
    // Add non-passive touchmove listener to allow preventDefault during drag
    this.mealSlotTargets.forEach(slot => {
      slot.addEventListener('touchmove', (e) => {
        if (this.draggedItem && this.dragClone) {
          e.preventDefault()
          const touch = e.touches[0]
          this.moveDragClone(touch.clientX, touch.clientY)
        }
      }, { passive: false })
    })
  }

  disconnect() {
    this.cancelMobileDrag()
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer)
    }
  }

  setupDesktopDrag() {
    // Desktop drag events (HTML5 drag API)
    this.mealSlotTargets.forEach(slot => {
      slot.setAttribute('draggable', 'true')
      slot.addEventListener('dragstart', (e) => this.handleDragStart(e, slot))
      slot.addEventListener('dragend', (e) => this.handleDragEnd(e, slot))
      slot.addEventListener('dragover', (e) => this.handleDragOver(e))
      slot.addEventListener('drop', (e) => this.handleDrop(e, slot))
      slot.addEventListener('dragenter', (e) => this.handleDragEnter(e, slot))
      slot.addEventListener('dragleave', (e) => this.handleDragLeave(e, slot))
    })
  }

  // Mobile touch handlers (called via data-action in HTML)
  handleTouchStart(event) {
    const slot = event.currentTarget
    if (!slot.dataset.hasMeal) return
    
    this.hasMoved = false
    this.touchStartX = event.touches[0].clientX
    this.touchStartY = event.touches[0].clientY
    
    // Long press to initiate drag
    this.longPressTimer = setTimeout(() => {
      if (!this.hasMoved) {
        this.startMobileDrag(slot, this.touchStartX, this.touchStartY)
      }
    }, 400)
  }

  handleTouchMove(event) {
    const touch = event.touches[0]
    const dx = Math.abs(touch.clientX - this.touchStartX)
    const dy = Math.abs(touch.clientY - this.touchStartY)
    
    // If moved a bit, cancel long press
    if (dx > 5 || dy > 5) {
      this.hasMoved = true
      if (!this.draggedItem && this.longPressTimer) {
        clearTimeout(this.longPressTimer)
      }
    }
    
    // Handle drag move
    if (this.draggedItem && this.dragClone) {
      event.preventDefault()
      this.moveDragClone(touch.clientX, touch.clientY)
    }
  }

  handleTouchEnd(event) {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer)
    }
    
    if (this.draggedItem) {
      const touch = event.changedTouches[0]
      this.finishMobileDrag(touch.clientX, touch.clientY)
    }
  }

  handleTouchCancel() {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer)
    }
    this.cancelMobileDrag()
  }

  // Desktop drag handlers
  handleDragStart(e, slot) {
    if (!slot.dataset.hasMeal) {
      e.preventDefault()
      return
    }
    
    this.draggedItem = slot
    slot.classList.add('opacity-50', 'scale-95')
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', slot.dataset.mealId)
  }

  handleDragEnd(e, slot) {
    slot.classList.remove('opacity-50', 'scale-95')
    this.draggedItem = null
    this.clearDropTargets()
  }

  handleDragOver(e) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  handleDragEnter(e, slot) {
    e.preventDefault()
    if (slot !== this.draggedItem) {
      slot.classList.add('ring-2', 'ring-[#4ECDC4]', 'bg-[#4ECDC4]/20')
    }
  }

  handleDragLeave(e, slot) {
    slot.classList.remove('ring-2', 'ring-[#4ECDC4]', 'bg-[#4ECDC4]/20')
  }

  handleDrop(e, targetSlot) {
    e.preventDefault()
    
    if (this.draggedItem && targetSlot !== this.draggedItem) {
      this.swapSlots(this.draggedItem, targetSlot)
    }
    
    this.clearDropTargets()
  }

  // Mobile drag functions
  startMobileDrag(slot, x, y) {
    this.draggedItem = slot
    
    // Vibrate for feedback
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }
    
    // Create floating clone
    this.dragClone = document.createElement('div')
    this.dragClone.className = 'fixed z-[100] bg-white shadow-2xl rounded-lg p-2 pointer-events-none flex flex-col items-center justify-center'
    this.dragClone.style.width = `${slot.offsetWidth + 10}px`
    this.dragClone.style.height = `${slot.offsetHeight + 10}px`
    this.dragClone.style.left = `${x - (slot.offsetWidth + 10) / 2}px`
    this.dragClone.style.top = `${y - (slot.offsetHeight + 10) / 2}px`
    this.dragClone.style.transform = 'scale(1.15)'
    this.dragClone.style.transition = 'none'
    this.dragClone.innerHTML = `
      <span class="text-2xl">${slot.dataset.mealEmoji || '🍽️'}</span>
      <span class="text-xs text-gray-600 mt-1">${(slot.dataset.mealName || '').split(' ')[0]}</span>
    `
    document.body.appendChild(this.dragClone)
    
    // Dim the original
    slot.classList.add('opacity-30', 'scale-95')
    
    // Show drag instruction
    this.showDragInstruction()
  }

  moveDragClone(x, y) {
    if (!this.dragClone) return
    
    this.dragClone.style.left = `${x - this.dragClone.offsetWidth / 2}px`
    this.dragClone.style.top = `${y - this.dragClone.offsetHeight / 2}px`
    
    // Find element under finger
    this.dragClone.style.display = 'none'
    const elementBelow = document.elementFromPoint(x, y)
    this.dragClone.style.display = ''
    
    // Highlight drop targets
    const dropTarget = elementBelow?.closest('[data-meal-calendar-target="mealSlot"]')
    
    this.mealSlotTargets.forEach(s => {
      if (s === dropTarget && s !== this.draggedItem) {
        s.classList.add('ring-2', 'ring-[#4ECDC4]', 'bg-[#4ECDC4]/20', 'scale-105')
      } else if (s !== this.draggedItem) {
        s.classList.remove('ring-2', 'ring-[#4ECDC4]', 'bg-[#4ECDC4]/20', 'scale-105')
      }
    })
  }

  finishMobileDrag(x, y) {
    if (!this.draggedItem) return
    
    // Find drop target
    if (this.dragClone) {
      this.dragClone.style.display = 'none'
    }
    const elementBelow = document.elementFromPoint(x, y)
    const dropTarget = elementBelow?.closest('[data-meal-calendar-target="mealSlot"]')
    
    if (dropTarget && dropTarget !== this.draggedItem) {
      this.swapSlots(this.draggedItem, dropTarget)
    }
    
    this.cancelMobileDrag()
  }

  cancelMobileDrag() {
    // Remove clone
    if (this.dragClone) {
      this.dragClone.remove()
      this.dragClone = null
    }
    
    // Reset original
    if (this.draggedItem) {
      this.draggedItem.classList.remove('opacity-30', 'scale-95')
    }
    
    this.draggedItem = null
    this.clearDropTargets()
    this.hideDragInstruction()
  }

  clearDropTargets() {
    this.mealSlotTargets.forEach(s => {
      s.classList.remove('ring-2', 'ring-[#4ECDC4]', 'bg-[#4ECDC4]/20', 'scale-105')
    })
  }

  showDragInstruction() {
    const existing = document.getElementById('drag-instruction')
    if (existing) return
    
    const instruction = document.createElement('div')
    instruction.id = 'drag-instruction'
    instruction.className = 'fixed top-20 left-1/2 -translate-x-1/2 bg-[#2C3E50] text-white px-4 py-2 rounded-full shadow-lg z-[101] text-sm font-medium animate-pulse'
    instruction.textContent = '👆 Drag to swap meals'
    document.body.appendChild(instruction)
  }

  hideDragInstruction() {
    const instruction = document.getElementById('drag-instruction')
    if (instruction) instruction.remove()
  }

  // Swap two meal slots
  swapSlots(sourceSlot, targetSlot) {
    const sourceData = {
      innerHTML: sourceSlot.innerHTML,
      mealId: sourceSlot.dataset.mealId,
      mealName: sourceSlot.dataset.mealName,
      mealEmoji: sourceSlot.dataset.mealEmoji,
      hasMeal: sourceSlot.dataset.hasMeal,
      ironRich: sourceSlot.dataset.ironRich,
      allergen: sourceSlot.dataset.allergen
    }
    
    const targetData = {
      innerHTML: targetSlot.innerHTML,
      mealId: targetSlot.dataset.mealId,
      mealName: targetSlot.dataset.mealName,
      mealEmoji: targetSlot.dataset.mealEmoji,
      hasMeal: targetSlot.dataset.hasMeal,
      ironRich: targetSlot.dataset.ironRich,
      allergen: targetSlot.dataset.allergen
    }
    
    // Animate
    sourceSlot.classList.add('transition-transform', 'duration-200', 'scale-90')
    targetSlot.classList.add('transition-transform', 'duration-200', 'scale-90')
    
    setTimeout(() => {
      // Swap visual and data
      sourceSlot.innerHTML = targetData.innerHTML
      sourceSlot.dataset.mealId = targetData.mealId || ''
      sourceSlot.dataset.mealName = targetData.mealName || ''
      sourceSlot.dataset.mealEmoji = targetData.mealEmoji || ''
      sourceSlot.dataset.hasMeal = targetData.hasMeal || ''
      sourceSlot.dataset.ironRich = targetData.ironRich || ''
      sourceSlot.dataset.allergen = targetData.allergen || ''
      
      targetSlot.innerHTML = sourceData.innerHTML
      targetSlot.dataset.mealId = sourceData.mealId || ''
      targetSlot.dataset.mealName = sourceData.mealName || ''
      targetSlot.dataset.mealEmoji = sourceData.mealEmoji || ''
      targetSlot.dataset.hasMeal = sourceData.hasMeal || ''
      targetSlot.dataset.ironRich = sourceData.ironRich || ''
      targetSlot.dataset.allergen = sourceData.allergen || ''
      
      sourceSlot.classList.remove('scale-90')
      targetSlot.classList.remove('scale-90')
      
      this.showToast('Meals swapped!', '✅')
    }, 100)
    
    setTimeout(() => {
      sourceSlot.classList.remove('transition-transform', 'duration-200')
      targetSlot.classList.remove('transition-transform', 'duration-200')
    }, 400)
  }

  // Show meal preview modal
  showPreview(e) {
    const slot = e.currentTarget
    if (!slot.dataset.hasMeal) return
    if (this.draggedItem) return
    
    this.currentSlot = slot
    
    const meal = {
      name: slot.dataset.mealName || 'Unknown Meal',
      emoji: slot.dataset.mealEmoji || '🍽️',
      ironRich: slot.dataset.ironRich === 'true',
      allergen: slot.dataset.allergen === 'true'
    }
    
    if (this.hasPreviewModalTarget && this.hasPreviewContentTarget) {
      this.previewContentTarget.innerHTML = this.buildPreviewHTML(meal)
      this.previewModalTarget.classList.remove('hidden')
      this.previewModalTarget.classList.add('flex')
    }
  }

  buildPreviewHTML(meal) {
    const badges = []
    if (meal.ironRich) badges.push('<span class="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs">🩸 Iron Rich</span>')
    if (meal.allergen) badges.push('<span class="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs">⚠️ Allergen</span>')
    
    return `
      <div class="text-center">
        <div class="w-20 h-20 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center mb-3">
          <span class="text-4xl">${meal.emoji}</span>
        </div>
        <h3 class="font-bold text-lg text-[#2C3E50]">${meal.name}</h3>
        ${badges.length ? `<div class="flex justify-center gap-2 mt-2">${badges.join('')}</div>` : ''}
        <div class="mt-5 flex gap-3 justify-center">
          <button class="px-5 py-2.5 bg-[#FF6B6B] text-white rounded-xl text-sm font-semibold hover:bg-[#E85555] transition-colors">
            View Recipe
          </button>
          <button 
            class="px-5 py-2.5 bg-gray-100 text-[#2C3E50] rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
            data-action="click->meal-calendar#openSwapModal"
          >
            Swap
          </button>
        </div>
      </div>
    `
  }

  hidePreview(e) {
    if (e && e.target !== this.previewModalTarget) return
    
    if (this.hasPreviewModalTarget) {
      this.previewModalTarget.classList.add('hidden')
      this.previewModalTarget.classList.remove('flex')
    }
  }

  openSwapModal() {
    this.hidePreview({ target: this.previewModalTarget })
    
    if (this.hasSwapModalTarget) {
      this.swapModalTarget.classList.remove('hidden')
      this.swapModalTarget.classList.add('flex')
    }
  }

  closeSwapModal(e) {
    if (e && e.target !== this.swapModalTarget && !e.target.closest('[data-close-modal]')) return
    
    if (this.hasSwapModalTarget) {
      this.swapModalTarget.classList.add('hidden')
      this.swapModalTarget.classList.remove('flex')
    }
  }

  forceCloseSwapModal() {
    if (this.hasSwapModalTarget) {
      this.swapModalTarget.classList.add('hidden')
      this.swapModalTarget.classList.remove('flex')
    }
  }

  // Add meal modal
  showAddMeal(e) {
    if (this.hasAddMealModalTarget) {
      this.addMealModalTarget.classList.remove('hidden')
      this.addMealModalTarget.classList.add('flex')
    }
  }

  closeAddMealModal(e) {
    if (e && e.target !== this.addMealModalTarget && !e.target.closest('[data-close-modal]')) return
    
    if (this.hasAddMealModalTarget) {
      this.addMealModalTarget.classList.add('hidden')
      this.addMealModalTarget.classList.remove('flex')
    }
  }

  stopPropagation(e) {
    e.stopPropagation()
  }

  showSwapModal() {
    if (this.hasPreviewModalTarget) {
      this.previewModalTarget.classList.add('hidden')
      this.previewModalTarget.classList.remove('flex')
    }
    if (this.hasSwapModalTarget) {
      this.swapModalTarget.classList.remove('hidden')
      this.swapModalTarget.classList.add('flex')
    }
  }

  selectSwapOption(e) {
    const option = e.currentTarget
    const newMealId = option.dataset.mealId
    const newMealName = option.dataset.mealName
    const newMealEmoji = option.dataset.mealEmoji
    
    if (this.currentSlot) {
      this.currentSlot.dataset.mealId = newMealId
      this.currentSlot.dataset.mealName = newMealName
      this.currentSlot.dataset.mealEmoji = newMealEmoji
      
      const ironRich = this.currentSlot.dataset.ironRich === 'true'
      const allergen = this.currentSlot.dataset.allergen === 'true'
      
      this.currentSlot.innerHTML = `
        <div class="absolute top-0.5 right-0.5 flex gap-0.5">
          ${ironRich ? '<span class="w-2 h-2 rounded-full bg-red-500" title="Iron Rich"></span>' : ''}
          ${allergen ? '<span class="w-2 h-2 rounded-full bg-amber-400" title="Allergen"></span>' : ''}
        </div>
        <span class="meal-emoji text-xl mb-0.5">${newMealEmoji}</span>
        <span class="meal-name text-[10px] text-gray-600 text-center leading-tight line-clamp-2">${newMealName.split(' ')[0]}</span>
      `
      
      this.currentSlot.classList.add('scale-110', 'bg-green-50')
      setTimeout(() => {
        this.currentSlot.classList.remove('scale-110', 'bg-green-50')
      }, 300)
      
      this.showToast(`Swapped to ${newMealName}!`, newMealEmoji)
    }
    
    this.forceCloseSwapModal()
    this.currentSlot = null
  }

  showToast(message, icon = '✅') {
    const existing = document.getElementById('meal-toast')
    if (existing) existing.remove()
    
    const toast = document.createElement('div')
    toast.id = 'meal-toast'
    toast.className = 'fixed bottom-32 left-1/2 -translate-x-1/2 bg-[#4ECDC4] text-white pl-3 pr-4 py-2.5 rounded-full shadow-lg z-[100] flex items-center gap-2'
    toast.innerHTML = `<span class="text-lg">${icon}</span><span class="text-sm font-medium">${message}</span>`
    document.body.appendChild(toast)
    
    toast.style.transform = 'translate(-50%, 20px)'
    toast.style.opacity = '0'
    requestAnimationFrame(() => {
      toast.style.transition = 'all 0.3s ease-out'
      toast.style.transform = 'translate(-50%, 0)'
      toast.style.opacity = '1'
    })
    
    setTimeout(() => {
      toast.style.transform = 'translate(-50%, 20px)'
      toast.style.opacity = '0'
      setTimeout(() => toast.remove(), 300)
    }, 2000)
  }
}
