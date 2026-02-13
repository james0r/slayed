import './types'

const A = 'data-prodify'
const attr = (s: string) => `[${A}-${s}]`
const SEL = {
  root: `[${A}]`, form: attr('product-form'), price: attr('price-container'),
  media: attr('media-container'), variants: attr('variants-json'),
  option: attr('option-container'), qtyInc: attr('quantity-increment'),
  qtyDec: attr('quantity-decrement'), qtyDisplay: attr('quantity-presentation'),
  qtyHidden: attr('quantity-hidden-input'),
} as const

const $ = <T extends Element>(s: string, r: Element | Document = document) => r.querySelector<T>(s)
const $$ = <T extends Element>(s: string, r: Element | Document = document) => Array.from(r.querySelectorAll<T>(s))
const fetchDoc = (url: string) =>
  fetch(url).then(r => r.text()).then(t => new DOMParser().parseFromString(t, 'text/html'))
const state = () => window.prodify

function getVariantData() {
  const s = state()
  s.variantData ??= JSON.parse($(SEL.variants, s.el)?.textContent ?? '[]')
  return s.variantData!
}

function readOptions() {
  const s = state()
  if (s.pickerType === 'select') {
    s.options = $$<HTMLSelectElement>('select', s.el).map(x => x.value)
  } else {
    s.options = $$(SEL.option, s.el).map(c => $<HTMLInputElement>('input:checked', c)!.value)
  }
}

function matchVariant() {
  const variants = getVariantData()
  state().currentVariant = variants.length === 1
    ? variants[0]
    : variants.find(v => v.options.every((o, i) => state().options?.[i] === o))
}

function setAddButton(disable: boolean, text?: string, modifyClass = true) {
  const form = $(SEL.form)
  if (!form) return
  const btn = $('[name="add"]', form)
  const span = $('[name="add"] > span', form)
  if (!btn) return

  if (disable) {
    btn.setAttribute('disabled', 'disabled')
    if (text && span) span.textContent = text
  } else {
    btn.removeAttribute('disabled')
    if (span) span.textContent = window.variantStrings.addToCart
  }
  if (modifyClass) btn.classList.toggle('disabled', disable)
}

function syncVariantInputs() {
  $$(SEL.form).forEach(form => {
    const input = $<HTMLInputElement>('input[name="id"]', form)
    if (input) input.value = String(state().currentVariant!.id)
  })
}

function setInputAvailability(inputs: Element[], available: string[], existing: string[]) {
  const isSelect = state().pickerType === 'select'
  const { soldout_with_option, unavailable_with_option } = window.variantStrings

  for (const input of inputs) {
    const val = input.getAttribute('value')!
    if (available.includes(val)) {
      isSelect ? ((input as HTMLOptionElement).innerText = val) : input.classList.remove('disabled')
    } else {
      if (isSelect) {
        const tmpl = existing.includes(val) ? soldout_with_option : unavailable_with_option
        ;(input as HTMLOptionElement).innerText = tmpl.replace('[value]', val)
      } else {
        input.classList.add('disabled')
      }
    }
  }
}

function compareInputValues() {
  const { variantData, el } = state()
  if (!variantData || variantData.length <= 1) return
  const first = $<HTMLInputElement>(':checked', el)
  if (!first) return

  const matching = variantData.filter(v => v.options[0] === first.value)
  const containers = $$(SEL.option, el)

  containers.forEach((container, i) => {
    if (i === 0) return
    const inputs = $$('input[type="radio"], option', container)
    const prevVal = $<HTMLInputElement>(':checked', containers[i - 1])?.value
    const forPrev = matching.filter(v => v.options[i - 1] === prevVal)

    setInputAvailability(
      inputs,
      forPrev.filter(v => v.available).map(v => v.options[i]),
      forPrev.map(v => v.options[i])
    )
  })
}

function updateURL() {
  const { currentVariant, el } = state()
  if (!currentVariant || el.dataset.updateUrl === 'false') return
  history.replaceState({}, '', `${el.dataset.url}?variant=${currentVariant.id}`)
}

function swapProductInfo() {
  const { currentVariant, el } = state()
  if (!currentVariant) return

  fetchDoc(`${el.dataset.url}?variant=${currentVariant.id}&section_id=${el.dataset.section}`)
    .then(doc => {
      for (const q of [SEL.price, SEL.media, `${SEL.form} [name="add"]`]) {
        const src = $(q, doc), tgt = $(q, el)
        if (src && tgt) tgt.replaceWith(src)
      }
    })
    .catch(console.error)
}

function updateQuantity(dir: 'up' | 'down') {
  const display = $<HTMLInputElement>(SEL.qtyDisplay, state().el)
  const hidden = $<HTMLInputElement>(SEL.qtyHidden, state().el)
  if (!display || !hidden) return
  const n = parseInt(display.value)
  display.value = hidden.value = String(dir === 'up' ? n + 1 : Math.max(1, n - 1))
}

function onVariantChange(e: Event) {
  readOptions()
  matchVariant()
  setAddButton(true, '', false)
  compareInputValues()
  if (e.target instanceof HTMLSelectElement) {
    const select = e.target
    $$<HTMLOptionElement>('option', select).forEach(o =>
      o.toggleAttribute('selected', o.value === select.value)
    )
  }

  if (!state().currentVariant) {
    setAddButton(true, window.variantStrings.unavailable, true)
  } else {
    updateURL()
    syncVariantInputs()
    swapProductInfo()
  }
}

// Init
const el = $<HTMLElement>(SEL.root)
if (el && !window.prodify) {
  window.prodify = { el, pickerType: (el.dataset.prodify as 'select' | 'radio') || 'radio' }

  readOptions()
  matchVariant()
  compareInputValues()
  if (!state().currentVariant) setAddButton(true, window.variantStrings.unavailable, true)

  el.addEventListener('change', onVariantChange)

  const qtyInc = $(SEL.qtyInc, el), qtyDec = $(SEL.qtyDec, el)
  if (qtyInc && qtyDec) {
    qtyInc.addEventListener('click', () => updateQuantity('up'))
    qtyDec.addEventListener('click', () => updateQuantity('down'))
  }
}
