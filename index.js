function hacktrace(frame, fn) {
  try {
    return fn()
  } catch(e) {
    add_frame(e, frame)
    e.hacktrace = format_hacktrace
    throw e
  }
}

function add_frame(e, frame) {
  e._hacktrace = e._hacktrace || []
  e._hacktrace.unshift(frame)
}

function format_frame(e, frame, prev) {
  if ('string' === typeof frame) return frame

  var str = '', location
  if (frame.line_offset) {
    if (!prev) prev = { line: 0 }

    frame.line = prev.line + frame.line_offset
    frame.file = frame.file || prev.file || prev.filename
  }

  location = frame.file || frame.filename || ''
  if (frame.line) {
    location += ':' + frame.line
    if (frame.column) location += ':' + frame.column
  }
  if (frame.label) {
    if (location.length > 0) return frame.label + ' (' + location + ')'
    else return frame.label
  }
  return location
}

function format_hacktrace() {
  var heading = this.name + ': ' + this.message
    , frames = [], i, prev

  for (i = 0; i < this._hacktrace.length; i++) {
    frames.unshift('\n    ' + format_frame(this, this._hacktrace[i], this._hacktrace[i - 1]))
  }
  return heading + frames.join('')
}

module.exports = hacktrace
