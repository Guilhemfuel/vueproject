function setCookie (name, value, expiration) {
  let d = new Date()
  d.setTime(d.getTime() + (expiration * 3600 * 1000))
  let expires = 'expires=' + d.toUTCString()
  document.cookie = name + '=' + value + ';' + expires + ';path=/'
}

function getCookie (cname) {
  let name = cname + '='
  let decodedCookie = decodeURIComponent(document.cookie)
  let ca = decodedCookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') {
      c = c.substring(1)
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length)
    }
  }
  return ''
}

function checkCookie (name, value) {
  let fingerprint = getCookie(name)
  if (fingerprint === '') {
    setCookie(name, value, 1)
    return false
  } else {
    return true
  }
}

export default {checkCookie, getCookie}
