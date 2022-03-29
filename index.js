/**
 * @typedef {{ url: string }} State
 * @typedef {Record<String, any>} Exports
 */

const w = /** @type {Window & { module?: { exports?: Exports }, exports?: Exports }} */ (window)

/**
 * @type {State[]}
 */
const RELATIVE_URLS = []

/**
 * @param {string} moduleString
 */
function require(moduleString) {
  forceCommonJSEnvironment()
  const url = resolveModuleUrl(moduleString)
  const isRelativeModule = isRelativeURL(url)
  /**
   * @type {State}
   */
  const state = {
    url: ''
  }
  if (isRelativeModule) {
    state.url = moduleString
    RELATIVE_URLS.push(state)
  }
  const response = syncAJAX(url)

  appendCode(response)

  if (isRelativeModule) {
    const ONE_ITEM = 1
    RELATIVE_URLS.splice(RELATIVE_URLS.indexOf(state), ONE_ITEM)
  }

  // return exports
  return w.exports
}

/**
 * @param {string} url
 * @return {string}
 */
function syncAJAX(url) {
  const xhr = new window.XMLHttpRequest()
  xhr.open('GET', url, false)
  xhr.send()

  return xhr.responseText
}

/**
 * @param {string} code
 */
function appendCode(code) {
  const script = document.createElement('script')
  script.innerHTML = code
  window.document.head.appendChild(script)
  // Assumes sync load so already loaded here.
}

/**
 * @param {string} moduleString
 * @return {string}
 */
function resolveModuleUrl(moduleString) {
  if (isURL(moduleString)) {
    return moduleString// TODO: This is not good enough. Nesting means requires should always be relative to the file being checked. Also there is the possibility of absolute urls and other(check require url resolution. library exists?)?.
  } else {
    // Assume is node_modules
    // TODO: What about other resolving? local file? bower, etc.?
    return getNodeModulesEntryPoint(moduleString)
  }
}

/**
 * @param {string} moduleString
 * @return {string}
 */
function getNodeModulesEntryPoint(moduleString) {
  const moduleDir = `./node_modules/${moduleString}`// TODO: This SHOULD be relative to home. Should use home and include option for home.
  const packageJSON = syncAJAX(`${moduleDir}/package.json`)// TODO: If this fails should include warning info about using home option.
  const main = window.JSON.parse(packageJSON).main
  return `${moduleDir}/${main}`
}

/**
 * @param {string} string
 * @return {boolean}
 */
function isURL(string) {
  try {
    isRelativeURL(string) ||
      new window.URL(string)
    return true
  } catch (_) {
    return false
  }
}

/**
 * @param {string} string
 * @return {boolean}
 */
function isRelativeURL(string) {
  const FIRST_CHAR_INDEX = 0
  const startsAtCurrentDirectory = string.substr(FIRST_CHAR_INDEX, './'.length) === './'
  const startsAtPreviousDirectory = string.substr(FIRST_CHAR_INDEX, '../'.length) === '../'
  return startsAtCurrentDirectory || startsAtPreviousDirectory
}

function forceCommonJSEnvironment() {
  w.exports = {} // Force reset.
  if (typeof w.module !== 'object') {
    w.module = {}
  }
  w.module.exports = w.exports
}

/**
 * Should only be used when both relative/absolute paths.
 * For example, not modules in format "module".
 * @param {string} fileURL
 * @param {string} inFileURL
 * @return {string}
 */
/*
function resolveInFileURL(fileURL = '', inFileURL = '') { // TODO: Not used.
  const fileDirectory = getURLDirectory(fileURL)
  return urljoin(fileDirectory, inFileURL) // TODO: urlJoin does not exist.
}
*/

/**
 * @param {string} fileURL
 * @return {string}
 */
function getURLDirectory(fileURL) {
  const DELIMITER = '/'
  const parts = fileURL.split(DELIMITER)
  parts.pop()
  return parts.join(DELIMITER)
}

// Comment out below to use as normal script
export default require
