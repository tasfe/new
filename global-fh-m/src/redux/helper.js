class Helper {
  with (state) {
    return this.state = state, this
  }

  set (key, data) {
    _.isUndefined(data) ? _.extend(this.state, key) : (this.state[key] = data)
  }

  get (key) {
    return this.state[key]
  }
}
export default Helper