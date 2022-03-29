# Description

Synchronous require using es6 imports.

## Functionality

- Allows for "require" while being synchronous. This matches how common js works in Node.js.
- polyfilling module.exports and exports.
- Uses es6 imports so can be used in non-built modern and no combining of import and require allowed environments.
- Works on various URL formats: node_modules named, relative.

## Usage

```bash
npm install @theopenweb/import-require-js
```

module:

```javascript
// import require from "./index.js"
// import require from 'node_modules/@theopenweb/import-require-js/index.js'
import require from '@theopenweb/import-require-js'
```

script:

- Remove export line at end of javascript file.

```html
<script src="./index.js"></script>
```

## Example

```bash
npx http-server ./
# Go to http://localhost:8080
```

[Example](./index.html)

## Other libraries, etc

[Requirejs](https://requirejs.org/docs/api.html) is often used for implementing common js require functionality in browsers.
However, it is "async" only: [Requirejs is async. Synchronous handling only works on already loaded modules.](https://stackoverflow.com/a/14201304/1764521)

[Synchronous handling](https://stackoverflow.com/a/28010938/1764521) can be handled as shown in that link.
This is similar to how it is implemented in this library.

## Improvements

This library has only been made to support what is needed.
There are some features that should be added but has not been yet.
If you find something that should be added, please create a detailed issue.

Areas that could be impoved:

- Allowing for async handling, especially in nested libraries.
- Support for other library URL resolution(bower_component, etc.), local files, etc.
- Not include dependencies? Currently mustache(used for example) and require(might become needed).

Regards.
