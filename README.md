# hacktrace [![build status](https://secure.travis-ci.org/agnoster/hacktrace.png?branch=master)](http://travis-ci.org/agnoster/hacktrace)

NPM package to hack stack traces. I wrote this to easily make custom backtraces
for [literapi][] — since I parse markdown documents for tests, it's more useful
to output the line from markdown that started the error than just showing a
reference to some internal line of code.

To use hacktrace, simply wrap each level of "stack" in a call to `hacktrace`.

```js
hacktrace = require('hacktrace')

try {
  hacktrace({ file: 'foo.js', line: 8, column: 4, label: 'barf' }, function() {
    hacktrace({ line_offset: 5 }, function() {
      throw new Error("ONOZ")
    })
  })
} catch (e) {
  e.stack = e.hacktrace
  throw e
}
```

The output from this will be:

```
Error: ONOZ
    at foo.js:13
    at barf (foo.js:8:4)
```

[literapi]: https://github.com/agnoster/literapi
