class ShopAssistant extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.state = {
      loading: false,
      cartId: null,
      messages: [],
      cards: [],
      adding: {} // variantId -> boolean
    }
  }

  connectedCallback() {
    const mount = this.closest('#shop-assistant-mount') || document.getElementById('shop-assistant-mount')

    this.endpoint =
      this.getAttribute('endpoint') ||
      mount?.dataset?.assistantEndpoint ||
      ''

    this.apiKey =
      this.getAttribute('api-key') ||
      mount?.dataset?.assistantApiKey ||
      ''

    this.greeting =
      this.getAttribute('greeting') ||
      mount?.dataset?.assistantGreeting ||
      "Hi! How can I help?"

    if (!this.endpoint) return this.renderError("Missing assistant endpoint.")
    if (!this.apiKey) return this.renderError("Missing API key. Configure it in the section settings.")

    this.state.cartId = localStorage.getItem('shop_assistant_cart_id')

    if (this.state.messages.length === 0) {
      this.state.messages.push({ role: 'assistant', content: this.greeting })
    }

    this.render()
    this.scrollToBottom()
  }

  renderError(message) {
    this.shadowRoot.innerHTML = `
      <style>
        :host { all: initial; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; }
        .box { border: 1px solid rgba(0,0,0,.12); border-radius: 12px; padding: 12px; font-size: 13px; background: #fff; color: #111; }
        .muted { color: rgba(0,0,0,.6); margin-top: 6px; }
      </style>
      <div class="box">
        <div><strong>Assistant unavailable</strong></div>
        <div class="muted">${escapeHtml(message)}</div>
      </div>
    `
  }

  scrollToBottom() {
    const list = this.shadowRoot.querySelector('[data-msg-list]')
    if (list) list.scrollTop = list.scrollHeight
  }

  async sendMessage(text) {
    const content = (text || '').trim()
    if (!content || this.state.loading) return

    this.state.messages.push({ role: 'user', content })
    this.state.loading = true
    this.render()
    this.scrollToBottom()

    try {
      const res = await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: this.apiKey,
          cartId: this.state.cartId || undefined,
          messages: this.state.messages.map(m => ({ role: m.role, content: m.content })),
          url: location.href
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`)

      if (data.cartId && data.cartId !== this.state.cartId) {
        this.state.cartId = data.cartId
        localStorage.setItem('shop_assistant_cart_id', data.cartId)
      }

      // Update cards from server
      this.state.cards = Array.isArray(data.cards) ? data.cards : []

      // Add assistant reply
      const reply = typeof data.message === 'string' ? data.message : ''
      this.state.messages.push({
        role: 'assistant',
        content: reply || "I didn’t get a response back—try again?"
      })
    } catch (e) {
      this.state.messages.push({
        role: 'assistant',
        content: "I hit a snag talking to the server. Please try again."
      })
    } finally {
      this.state.loading = false
      this.render()
      this.scrollToBottom()
    }
  }

  async addVariantToCart(variantId) {
    if (!variantId) return

    // Guard: Liquid Ajax Cart loaded?
    const lac = window.liquidAjaxCart
    if (!lac || typeof lac.add !== 'function') {
      // Fallback: native Ajax cart
      await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: [{ id: Number(variantId), quantity: 1 }] }),
      })
      this.state.messages.push({ role: 'assistant', content: 'Added to cart.' })
      this.render()
      this.scrollToBottom()
      return
    }

    this.state.adding[variantId] = true
    this.render()

    try {
      await lac.add(
        { items: [{ id: Number(variantId), quantity: 1 }] },
        {
          lastCallback: (requestState) => {
            if (requestState?.responseData?.ok) {
              this.state.messages.push({ role: 'assistant', content: 'Added to cart.' })
            } else {
              this.state.messages.push({ role: 'assistant', content: 'Could not add to cart.' })
            }
            this.state.adding[variantId] = false
            this.render()
            this.scrollToBottom()
          },
        }
      )
    } catch (e) {
      this.state.adding[variantId] = false
      this.state.messages.push({ role: 'assistant', content: 'Could not add to cart.' })
      this.render()
      this.scrollToBottom()
    }
  }


  render() {
    const cardsHtml = (this.state.cards || []).length
      ? `
        <div class="cards">
          ${(this.state.cards || []).map((c) => {
        const disabled = !c.variantId || c.availableForSale === false
        const adding = c.variantId && this.state.adding[c.variantId]
        return `
              <div class="card">
                ${c.image ? `<img class="img" src="${escapeAttr(c.image)}" alt="">` : `<div class="img ph"></div>`}
                <div class="meta">
                  <div class="t">${escapeHtml(c.title || '')}</div>
                  <div class="sub">
                    ${c.price?.amount ? `${escapeHtml(c.price.amount)} ${escapeHtml(c.price.currencyCode || '')}` : ''}
                    ${c.variantLabel ? ` • ${escapeHtml(c.variantLabel)}` : ''}
                  </div>
                  <div class="row">
                    <a class="link" href="/products/${encodeURIComponent(c.handle)}" target="_blank" rel="noreferrer">View</a>
                    <button
                      class="btn"
                      type="button"
                      data-add="${escapeAttr(c.variantId || '')}"
                      ${disabled ? 'aria-disabled="true"' : ''}
                    >${adding ? 'Adding…' : (disabled ? 'Unavailable' : 'Add')}</button>
                  </div>
                </div>
              </div>
            `
      }).join('')}
        </div>
      `
      : ``

    this.shadowRoot.innerHTML = `
      <style>
        :host { all: initial; display: block; }
        .wrap { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; color: #111; }
        .toolbar { display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:10px; }
        .title { font-size: 13px; font-weight: 600; }

        .panel { border: 1px solid rgba(0,0,0,.12); border-radius: 14px; overflow: hidden; background: #fff; }
        .msgs { height: 320px; max-height: 45vh; overflow: auto; padding: 12px; background: #fafafa; }
        .msg { max-width: 88%; padding: 8px 10px; border-radius: 12px; margin: 6px 0; font-size: 13px; line-height: 1.35; white-space: pre-wrap; word-break: break-word; }
        .user { margin-left: auto; background: #111; color: #fff; }
        .assistant { margin-right: auto; background: #fff; border: 1px solid rgba(0,0,0,.10); }
        .typing { opacity: .7; }

        .cards { padding: 10px; border-top: 1px solid rgba(0,0,0,.10); background: #fff; display: grid; gap: 10px; }
        .card { display: grid; grid-template-columns: 64px 1fr; gap: 10px; border: 1px solid rgba(0,0,0,.10); border-radius: 12px; padding: 10px; }
        .img { width: 64px; height: 64px; border-radius: 10px; object-fit: cover; background: rgba(0,0,0,.06); }
        .img.ph { background: rgba(0,0,0,.06); }
        .t { font-size: 13px; font-weight: 600; margin-bottom: 4px; }
        .sub { font-size: 12px; color: rgba(0,0,0,.65); margin-bottom: 8px; }
        .row { display:flex; align-items:center; justify-content:space-between; gap: 8px; }
        .link { font-size: 12px; color: #111; text-decoration: underline; }
        .btn { all: unset; cursor: pointer; background: #111; color:#fff; border-radius: 10px; padding: 8px 10px; font-size: 12px; }
        .btn[aria-disabled="true"] { opacity: .55; cursor: not-allowed; }

        .composer { display:flex; gap: 8px; padding: 10px; border-top: 1px solid rgba(0,0,0,.12); background:#fff; }
        input { all: unset; flex:1; border: 1px solid rgba(0,0,0,.14); border-radius: 12px; padding: 10px; font-size: 13px; background: #fff; }
        .send { all: unset; cursor:pointer; background:#111; color:#fff; border-radius: 12px; padding: 10px 12px; font-size: 13px; }
        .send[aria-disabled="true"] { opacity: .55; cursor:not-allowed; }
      </style>

      <div class="wrap">
        <div class="toolbar">
          <div class="title">Assistant</div>
        </div>

        <div class="panel">
          <div class="msgs" data-msg-list>
            ${this.state.messages.map(m => `
              <div class="msg ${m.role === 'user' ? 'user' : 'assistant'}">${escapeHtml(m.content)}</div>
            `).join('')}
            ${this.state.loading ? `<div class="msg assistant typing">Typing…</div>` : ``}
          </div>

          ${cardsHtml}

          <form class="composer">
            <input type="text" placeholder="Ask about fit, sizing, or styles…" autocomplete="off" />
            <button class="send" type="submit" aria-disabled="${this.state.loading ? 'true' : 'false'}">Send</button>
          </form>
        </div>
      </div>
    `

    const form = this.shadowRoot.querySelector('form')
    const input = this.shadowRoot.querySelector('input')

    form?.addEventListener('submit', (e) => {
      e.preventDefault()
      const value = input.value
      input.value = ''
      this.sendMessage(value)
    })

    // Card buttons
    this.shadowRoot.querySelectorAll('[data-add]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-add')
        if (!id) return
        if (btn.getAttribute('aria-disabled') === 'true') return
        this.addVariantToCart(id)
      })
    })
  }
}

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}
function escapeAttr(str) {
  return escapeHtml(str).replaceAll('`', '&#096;')
}

customElements.define('shop-assistant', ShopAssistant);

// IMPORTANT: leading semicolon so Shopify/ASI doesn't break the IIFE
; (function boot() {
  const mount = document.getElementById('shop-assistant-mount')
  if (!mount) return
  if (mount.querySelector('shop-assistant')) return

  const el = document.createElement('shop-assistant')
  if (mount.dataset.assistantEndpoint) el.setAttribute('endpoint', mount.dataset.assistantEndpoint)
  if (mount.dataset.assistantApiKey) el.setAttribute('api-key', mount.dataset.assistantApiKey)
  if (mount.dataset.assistantGreeting) el.setAttribute('greeting', mount.dataset.assistantGreeting)

  mount.appendChild(el)
})();
