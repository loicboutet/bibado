import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="meal-calendar"
export default class extends Controller {
  static targets = ["mealSlot", "swapModal", "previewModal", "previewContent"]
  
  draggedItem = null
  touchStartData = null

  connect() {
    console.log("Meal calendar controller connected")
    this.setupDragAndDrop()
    this.setupTouchInteractions()
  }

  setupDragAndDrop() {
    // Add drag events to all meal slots
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

  setupTouchInteractions() {
    // Long-press to drag on mobile
    this.mealSlotTargets.forEach(slot => {
      let longPressTimer = null
      let touchMoved = false

      slot.addEventListener('touchstart', (e) => {
        touchMoved = false
        this.touchStartData = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
          slot: slot
        }
        
        longPressTimer = setTimeout(() => {
          if (!touchMoved) {
            this.startTouchDrag(slot)
          }
        }, 500)
      })

      slot.addEventListener('touchmove', (e) => {
        const threshold = 10
        const dx = Math.abs(e.touches[0].clientX - this.touchStartData.x)
        const dy = Math.abs(e.touches[0].clientY - this.touchStartData.y)
        
        if (dx > threshold || dy > threshold) {
          touchMoved = true
          if (this.draggedItem) {
            e.preventDefault()
            this.handleTouchMove(e)
          }
        }
        
        if (!this.draggedItem) {
          clearTimeout(longPressTimer)
        }
      })

      slot.addEventListener('touchend', (e) => {
        clearTimeout(longPressTimer)
        if (this.draggedItem) {
          this.handleTouchEnd(e)
        }
      })
    })
  }

  handleDragStart(e, slot) {
    if (!slot.dataset.hasMeal) return
    
    this.draggedItem = slot
    slot.classList.add('opacity-50', 'scale-95')
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', slot.dataset.mealId)
    
    // Add visual feedback
    setTimeout(() => {
      slot.classList.add('dragging')
    }, 0)
  }

  handleDragEnd(e, slot) {
    slot.classList.remove('opacity-50', 'scale-95', 'dragging')
    this.draggedItem = null
    
    // Remove all drop target indicators
    this.mealSlotTargets.forEach(s => {
      s.classList.remove('drop-target', 'ring-2', 'ring-[#4ECDC4]', 'bg-[#4ECDC4]/20')
    })
  }

  handleDragOver(e) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  handleDragEnter(e, slot) {
    e.preventDefault()
    if (slot !== this.draggedItem) {
      slot.classList.add('drop-target', 'ring-2', 'ring-[#4ECDC4]', 'bg-[#4ECDC4]/20')
    }
  }

  handleDragLeave(e, slot) {
    slot.classList.remove('drop-target', 'ring-2', 'ring-[#4ECDC4]', 'bg-[#4ECDC4]/20')
  }

  handleDrop(e, targetSlot) {
    e.preventDefault()
    
    if (this.draggedItem && targetSlot !== this.draggedItem) {
      this.swapMeals(this.draggedItem, targetSlot)
    }
    
    targetSlot.classList.remove('drop-target', 'ring-2', 'ring-[#4ECDC4]', 'bg-[#4ECDC4]/20')
  }

  // Touch drag handling for mobile
  startTouchDrag(slot) {
    if (!slot.dataset.hasMeal) return
    
    this.draggedItem = slot
    slot.classList.add('scale-110', 'z-50', 'shadow-2xl', 'touch-dragging')
    
    // Haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }
  }

  handleTouchMove(e) {
    if (!this.draggedItem) return
    
    const touch = e.touches[0]
    const rect = this.draggedItem.getBoundingClientRect()
    
    // Position the dragged element under finger
    this.draggedItem.style.position = 'fixed'
    this.draggedItem.style.left = `${touch.clientX - rect.width / 2}px`
    this.draggedItem.style.top = `${touch.clientY - rect.height / 2}px`
    
    // Highlight drop targets
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY)
    const dropTarget = elementBelow?.closest('[data-meal-calendar-target="mealSlot"]')
    
    this.mealSlotTargets.forEach(s => {
      if (s === dropTarget && s !== this.draggedItem) {
        s.classList.add('ring-2', 'ring-[#4ECDC4]', 'bg-[#4ECDC4]/20')
      } else {
        s.classList.remove('ring-2', 'ring-[#4ECDC4]', 'bg-[#4ECDC4]/20')
      }
    })
  }

  handleTouchEnd(e) {
    if (!this.draggedItem) return
    
    // Find drop target
    const touch = e.changedTouches[0]
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY)
    const dropTarget = elementBelow?.closest('[data-meal-calendar-target="mealSlot"]')
    
    if (dropTarget && dropTarget !== this.draggedItem) {
      this.swapMeals(this.draggedItem, dropTarget)
    }
    
    // Reset dragged item
    this.draggedItem.classList.remove('scale-110', 'z-50', 'shadow-2xl', 'touch-dragging')
    this.draggedItem.style.position = ''
    this.draggedItem.style.left = ''
    this.draggedItem.style.top = ''
    this.draggedItem = null
    
    // Clear all highlights
    this.mealSlotTargets.forEach(s => {
      s.classList.remove('ring-2', 'ring-[#4ECDC4]', 'bg-[#4ECDC4]/20')
    })
  }

  swapMeals(sourceSlot, targetSlot) {
    // Animate the swap
    sourceSlot.classList.add('transition-all', 'duration-300')
    targetSlot.classList.add('transition-all', 'duration-300')
    
    // Get content
    const sourceContent = sourceSlot.innerHTML
    const targetContent = targetSlot.innerHTML
    const sourceMealId = sourceSlot.dataset.mealId
    const targetMealId = targetSlot.dataset.mealId
    const sourceHasMeal = sourceSlot.dataset.hasMeal
    const targetHasMeal = targetSlot.dataset.hasMeal
    
    // Apply swap animation
    sourceSlot.classList.add('scale-90')
    targetSlot.classList.add('scale-90')
    
    setTimeout(() => {
      // Swap content
      sourceSlot.innerHTML = targetContent
      targetSlot.innerHTML = sourceContent
      sourceSlot.dataset.mealId = targetMealId || ''
      targetSlot.dataset.mealId = sourceMealId || ''
      sourceSlot.dataset.hasMeal = targetHasMeal || ''
      targetSlot.dataset.hasMeal = sourceHasMeal || ''
      
      // Remove animation
      sourceSlot.classList.remove('scale-90')
      targetSlot.classList.remove('scale-90')
      
      // Show success feedback
      this.showSwapSuccess()
    }, 150)
    
    setTimeout(() => {
      sourceSlot.classList.remove('transition-all', 'duration-300')
      targetSlot.classList.remove('transition-all', 'duration-300')
    }, 500)
  }

  showSwapSuccess() {
    // Create toast notification
    const toast = document.createElement('div')
    toast.className = 'fixed bottom-32 left-1/2 -translate-x-1/2 bg-[#4ECDC4] text-white px-4 py-2 rounded-full shadow-lg z-50 flex items-center gap-2 animate-bounce-in'
    toast.innerHTML = `
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
      </svg>
      <span class="text-sm font-medium">Meals swapped!</span>
    `
    document.body.appendChild(toast)
    
    setTimeout(() => {
      toast.classList.add('opacity-0')
      setTimeout(() => toast.remove(), 300)
    }, 1500)
  }

  // Show meal preview on tap/hover
  showPreview(e) {
    const slot = e.currentTarget
    if (!slot.dataset.hasMeal) return
    
    const mealData = {
      id: slot.dataset.mealId,
      name: slot.dataset.mealName,
      emoji: slot.dataset.mealEmoji,
      ironRich: slot.dataset.ironRich === 'true',
      allergen: slot.dataset.allergen === 'true'
    }
    
    if (this.hasPreviewModalTarget) {
      this.previewContentTarget.innerHTML = this.buildPreviewContent(mealData)
      this.previewModalTarget.classList.remove('hidden')
    }
  }

  hidePreview() {
    if (this.hasPreviewModalTarget) {
      this.previewModalTarget.classList.add('hidden')
    }
  }

  buildPreviewContent(meal) {
    return `
      <div class="text-center">
        <div class="w-20 h-20 mx-auto bg-gray-100 rounded-xl flex items-center justify-center mb-3">
          <span class="text-4xl">${meal.emoji || '🍽️'}</span>
        </div>
        <h3 class="font-bold text-[#2C3E50]">${meal.name || 'Untitled Meal'}</h3>
        <div class="flex justify-center gap-2 mt-2">
          ${meal.ironRich ? '<span class="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">🩸 Iron Rich</span>' : ''}
          ${meal.allergen ? '<span class="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs">⚠️ Allergen</span>' : ''}
        </div>
        <div class="mt-4 flex gap-2 justify-center">
          <button class="px-4 py-2 bg-[#FF6B6B] text-white rounded-lg text-sm font-medium">View Recipe</button>
          <button class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium" data-action="click->meal-calendar#openSwapModal">Swap</button>
        </div>
      </div>
    `
  }

  // Swap modal functionality
  openSwapModal(e) {
    const slot = e.currentTarget.closest('[data-meal-calendar-target="mealSlot"]') || this.currentSlot
    this.currentSlot = slot
    
    if (this.hasSwapModalTarget) {
      this.swapModalTarget.classList.remove('hidden')
      this.swapModalTarget.classList.add('flex')
    }
  }

  closeSwapModal() {
    if (this.hasSwapModalTarget) {
      this.swapModalTarget.classList.add('hidden')
      this.swapModalTarget.classList.remove('flex')
    }
    this.hidePreview()
  }

  selectSwapOption(e) {
    const option = e.currentTarget
    const newMealId = option.dataset.mealId
    const newMealName = option.dataset.mealName
    const newMealEmoji = option.dataset.mealEmoji
    
    if (this.currentSlot) {
      // Update the slot with new meal
      this.currentSlot.dataset.mealId = newMealId
      this.currentSlot.dataset.mealName = newMealName
      this.currentSlot.dataset.mealEmoji = newMealEmoji
      this.currentSlot.dataset.hasMeal = 'true'
      
      // Update visual
      const emojiEl = this.currentSlot.querySelector('.meal-emoji')
      const nameEl = this.currentSlot.querySelector('.meal-name')
      if (emojiEl) emojiEl.textContent = newMealEmoji
      if (nameEl) nameEl.textContent = newMealName.split(' ')[0]
    }
    
    this.closeSwapModal()
    this.showSwapSuccess()
  }
}
