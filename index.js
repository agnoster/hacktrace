function hacktrace(line, fn) {
  try {
    return fn()
  } catch(e) {
    add_line(e, line)
    e.__defineGetter__('hacktrace', format_hacktrace)
    throw e
  }
}

function add_line(e, line) {
  e._hacktrace = e._hacktrace || [ e.name + ': ' + e.message ]
  e._hacktrace.push(line)
}

function format_line(e, line) {
  if ('string' === typeof line) return line

  var str = '', location
  location = line.file || line.filename || ''
  if (line.line) location += ':' + line.line
  if (line.column) location += ':' + line.column
  if (line.label) {
    if (location.length > 0) return line.label + ' (' + location + ')'
    else return line.label
  }
  return location
}

function format_hacktrace() {
  var string = ''
    , i

  for (i = 0; i < this._hacktrace.length; i++) {
    if (string.length > 0) string += '\n    '
    string += format_line(this, this._hacktrace[i])
  }
  return string
}

module.exports = hacktrace
