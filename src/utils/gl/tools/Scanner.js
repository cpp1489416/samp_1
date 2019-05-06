
export default class Scanner {
  constructor (src) {
    this.src = src
    this.location = 0
  }

  hasNext () {
    this.skipBackspace()
    if (this.location >= this.src.length) {
      return false
    }
    return true
  }

  hasNextExpectCommont () {
    this.skipComment()
    return this.hasNext()
  }

  next () {
    this.skipBackspace()
    var ans = ''
    while (this.location < this.src.length) {
      var c = this.src.charAt(this.location)
      if (this.isBackspace(c)) {
        break
      }
      ans += c
      this.location++
    }
    return ans
  }

  nextExpectCommont () {
    this.skipComment()
    return this.next()
  }

  skipBackspace () {
    while (this.location < this.src.length) {
      var c = this.src.charAt(this.location)
      if (this.isBackspace(c)) {
        this.location++
      } else {
        return
      }
    }
  }

  skipComment () {
    while (this.location < this.src.length) {
      this.skipBackspace()
      const c = this.src.charAt(this.location)
      if (c === '#') {
        this.jumpToNextLine()
      } else {
        break
      }
    }
  }

  jumpToNextLine () {
    while (this.location < this.src.length) {
      var c = this.src.charAt(this.location)
      if (c !== '\n') {
        this.location++
      } else {
        this.location++
        return
      }
    }
  }

  nextNumber () {
    return Number(this.next())
  }

  numbersBetweenChar (c) {
    var numbers = this.next().split('/')
    for (var i in numbers) {
      var n = numbers[i]
      numbers[i] = Number(n)
    }
    return numbers
  }

  isBackspace (c) {
    return c === '\n' || c === ' ' || c === '\r' || c === '\t'
  }
}
