
export default class Camera {
  constructor () {
    this.eventListeners = []
  }

  addEventListener (e) {
    if (this.containsEventListener(e)) {
      return this
    }
    this.eventListeners.push(e)
    return this
  }

  containsEventListener (lis) {
    for (var i in this.eventListeners) {
      if (this.eventListeners[i] === lis) {
        return true
      }
    }
    return false
  }

  notifyProjectionMatrixChanged () {
    for (var i in this.eventListeners) {
      if (this.eventListeners[i].onProjectionMatrixChanged) {
        this.eventListeners[i].onProjectionMatrixChanged()
      }
    }
  }

  notifyViewMatrixChanged () {
    for (var i in this.eventListeners) {
      if (this.eventListeners[i].onViewMatrixChanged) {
        this.eventListeners[i].onViewMatrixChanged()
      }
    }
  }
}
