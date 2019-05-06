
export default class {
  constructor () {
    this.image = new Image()
  }

  sleep (millis) {
    return new Promise(resolve => {
      setTimeout(() => {
        alert('wait enede')
        resolve()
      }, millis)
    })
  }

  getPromise (src) {
    return new Promise(resolve => {
      this.image.onload = async () => {
        resolve()
      }
      this.image.src = src
    })
  }

  async load (src) {
    await this.getPromise(src)
    return this
  }
}
