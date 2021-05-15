function setCookie(name: string, value: string, exDate: Date) {
  document.cookie = `${name}=${value}; samesite=strict; expires=${exDate}; path=/`;
}

function getCookie(name: string) {
  let value = '; ' + document.cookie;
  let parts = value.split('; ' + name + '=');
  if (parts.length == 2) {
    return parts.pop().split(';').shift();
  }
}

function removeCookie(name:string) {
  document.cookie = `${name}=; path=/; expires=-1; max-age=-1`
}

export {setCookie, getCookie, removeCookie}