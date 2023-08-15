class PredictiveSearch extends HTMLElement {
  constructor() {
    super();

    this.input = this.querySelector('input[type="search"]');
    this.predictiveSearchResults = this.querySelector('#predictive-search');

    this.input.addEventListener('input', this.debounce((event) => {
      this.onChange(event);
    }, 300).bind(this));
  }

  onChange() {
    const searchTerm = this.input.value.trim();

    if (!searchTerm.length) {
      this.close();
      return;
    }

    this.getSearchResults(searchTerm);
  }

  getSearchResults(searchTerm) {
    fetch(`/search/suggest?q=${searchTerm}&section_id=predictive-search-results`)
      .then((response) => {
        if (!response.ok) {
          var error = new Error(response.status);
          this.close();
          throw error;
        }

        return response.text();
      })
      .then((text) => {
        const resultsMarkup = new DOMParser().parseFromString(text, 'text/html').querySelector('#shopify-section-predictive-search-results').innerHTML;
        this.predictiveSearchResults.innerHTML = resultsMarkup;
        this.open();
      })
      .catch((error) => {
        this.close();
        throw error;
      });
  }

  open() {
    this.predictiveSearchResults.style.display = 'block';
    this.input.setAttribute('aria-expanded', 'true')
  }

  close() {
    this.predictiveSearchResults.style.display = 'none';
    this.input.setAttribute('aria-expanded', 'false')
  }

  debounce(fn, wait) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }
}

export default function (Alpine) {
  Alpine.directive('predictify', (
    el,
    { value, modifiers, expression },
    { Alpine, effect, cleanup, evaluate, evaluateLater }
  ) => {
    if (value) return

    const inputSelector = el.getAttribute('x-test:input') ? el.getAttribute('x-test:input') : 'input[type="search"]'
    const targetSelector = el.getAttribute('x-test:target') ? el.getAttribute('x-test:target') : '#predictive-search-target'

    console.log(inputSelector, targetSelector)

    const input = el.querySelector('input[type="search"]')
  })
}

