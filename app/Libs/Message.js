class Message {
  static normalizeMessages(msg) {
    let str = []
    for (const st of msg) {
      str.push(`${st.field} ${st.validation}`)
    }

    return str
  }
}

module.exports = Message