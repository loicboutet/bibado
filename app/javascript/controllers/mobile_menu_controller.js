import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="mobile-menu"
export default class extends Controller {
  static targets = ["menu", "overlay"]

  connect() {
    console.log("Mobile menu controller connected")
  }

  toggle() {
    if (this.hasMenuTarget) {
      this.menuTarget.classList.toggle('hidden')
    }
  }

  open() {
    if (this.hasMenuTarget) {
      this.menuTarget.classList.remove('hidden')
    }
  }

  close() {
    if (this.hasMenuTarget) {
      this.menuTarget.classList.add('hidden')
    }
  }

  // Close when clicking overlay
  closeOnOverlay(event) {
    if (event.target === this.overlayTarget) {
      this.close()
    }
  }
}
