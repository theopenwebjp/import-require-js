const RELATIVE_URLS = []

/**
 * @param {string} moduleString
 * @return {*} TODO
 */
function require (moduleString) {
  forceCommonJSEnvironment()
  const url = resolveModuleUrl(moduleString)
  const isRelativeModule = isRelativeURL(url)
  let state
  if(isRelativeModule){
    state = {
      url: moduleString
    }
    RELATIVE_URLS.push(state)
  }
  const response = syncAJAX(url)

  appendCode(response)

  if(isRelativeModule){
    const ONE_ITEM = 1
    RELATIVE_URLS.splice(RELATIVE_URLS.indexOf(state), ONE_ITEM)
  }

  return exports
}

/**
 * @param {string} url
 * @return {string}
 */
function syncAJAX (url) {
  const xhr = new window.XMLHttpRequest()
  xhr.open('GET', url, false)
  xhr.send()

  return xhr.responseText
}

/**
 * @param {string} code
 */
function appendCode (code) {
  const script = document.createElement('script')
  script.innerHTML = code
  window.document.head.appendChild(script)
  //Assumes sync load so already loaded here.
}

/**
 * @param {string} moduleString
 * @return {string}
 */
function resolveModuleUrl (moduleString) {
  if (isURL(moduleString)) {
    return moduleString//??This is not good enough. Nesting means requires should always be relative to the file being checked.Also there is the possibility of absolute urls and other(check require url resolution. library exists?)?.
  } else {
    // Assume is node_modules
    return getNodeModulesEntryPoint(moduleString)
  }
}

/**
 * @param {string} moduleString
 * @return {string}
 */
function getNodeModulesEntryPoint (moduleString) {
  const moduleDir = `./node_modules/${moduleString}`//??This SHOULD be relative to home. Should use home and include option for home.
  const packageJSON = syncAJAX(`${moduleDir}/package.json`)//??If this fails should include warning info about using home option.
  const main = window.JSON.parse(packageJSON).main
  return `${moduleDir}/${main}`
}

/**
 * @param {string} string
 * @return {boolean}
 */
function isURL (string) {
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
function isRelativeURL (string) {
  const FIRST_CHAR_INDEX = 0
  const startsAtCurrentDirectory = string.substr(FIRST_CHAR_INDEX, './'.length) === './'
  const startsAtPreviousDirectory = string.substr(FIRST_CHAR_INDEX, '../'.length) === '../'
  return startsAtCurrentDirectory || startsAtPreviousDirectory
}

function forceCommonJSEnvironment () {
  window.exports = {} // Force reset.
  if(typeof window.module !== 'object'){
    window.module = {}
  }
  window.module.exports = window.exports
}

/**
 * Should only be used when both relative/absolute paths.
 * For example, not modules in format "module".
 * @param {String} fileURL
 * @param {String} inFileURL
 * @return {String}
 */
function resolveInFileURL(fileURL = '', inFileURL = ''){//??
  const fileDirectory = getURLDirectory(fileURL)
  return urljoin(fileDirectory, inFileURL)//??
}

/**
 * @param {string}
 * @return {string}
 */
function getURLDirectory(fileURL){
  const DELIMITER = '/'
  const parts = fileURL.split(DELIMITER)
  parts.pop()
  return parts.join(DELIMITER)
}

// Comment out below to use as normal script
export default require
