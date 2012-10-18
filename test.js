var expect = require('chai').expect
  , hacktrace = require('./')

function nohack(msg, fn) { return fn() }

function throw_error(message, hacktrace) {
  try {
    hacktrace("blabla", function() {
      throw new Error(message)
    })
  } catch (e) { return e }
}

function fake_stack(stack, message) {
  function next() {
    var l = stack.pop()
    if (!l) throw new Error(message)

    hacktrace(l, next)
  }
  try { next() }
  catch (e) { return e }
}

function compare_stacktraces(actual, expected) {
}

describe('hacktrace', function() {
  it("doesn't interrupt the regular flow of non-exceptional code", function() {
    expect(hacktrace("foobar", function(){
      return 2 + 2
    })).to.equal(4)
  })

  it('leaves regular stack traces intact', function(){
    var message = "ONOZ"
      , original = throw_error(message, nohack)
      , hacked = throw_error(message, hacktrace)

    var actual = hacked.stack.split("\n")
      , expected = original.stack.split("\n")

    // Skip the lines we hack to test
    actual.splice(2, 1)
    expected.splice(2, 1)
    actual.splice(3, 1)
    expected.splice(3, 1)

    expect(actual).to.deep.equal(expected)
  })

  it('lets us write new lines into the hacktrace', function(){
    var e = fake_stack(
      [ "hello (bar.js:5:2)"
      , "foo (bar.js:13)"
      ], "barf")

    expect(e.hacktrace).to.equal("Error: barf\n    hello (bar.js:5:2)\n    foo (bar.js:13)")
  })

  it('lets us format lines as objects', function(){
    var e = fake_stack(
      [ { label: "hello", file: "bar.js", line: 5, column: 2 }
      , { label: "foo", file: "bar.js", line: 13 }
      ], "barf")

    expect(e.hacktrace).to.equal("Error: barf\n    hello (bar.js:5:2)\n    foo (bar.js:13)")
  })
})
