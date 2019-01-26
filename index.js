function require (moduleString) {
  forceCommonJSEnvironment()
  const url = resolveModuleUrl(moduleString)
  const response = syncAJAX(url)

  appendCode(response)
  return exports
}

function syncAJAX (url) {
  const xhr = new window.XMLHttpRequest()
  xhr.open('GET', url, false)
  xhr.send()

  return xhr.responseText
}

function appendCode (code) {
  const script = document.createElement('script')
  script.innerHTML = code
  window.document.head.appendChild(script)
}

function resolveModuleUrl (moduleString) {
  if (isURL(moduleString)) {
    return moduleString
  } else {
    // Assume is node_modules
    return getNodeModulesEntryPoint(moduleString)
  }
}

function getNodeModulesEntryPoint (moduleString) {
  const moduleDir = `./node_modules/${moduleString}`
  const packageJSON = syncAJAX(`${moduleDir}/package.json`)
  const main = window.JSON.parse(packageJSON).main
  return `${moduleDir}/${main}`
}

function isURL (string) {
  try {
    string.substr(0, './'.length) === './' ||
    string.substr(0, '../'.length) === '../' ||
    new window.URL(string)
    return true
  } catch (_) {
    return false
  }
}

function forceCommonJSEnvironment () {
  window.exports = {} // Force reset.
}

// Comment out below to use as normal script
export default require
