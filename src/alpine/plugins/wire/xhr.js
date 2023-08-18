const fetchHTML = async (endpoint) => {
  return await fetch(endpoint)
    .then((response) => response.text())
    .then((responseText) => {
      return new DOMParser().parseFromString(responseText, 'text/html')
    })
}

export { fetchHTML }