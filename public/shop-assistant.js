// assets/shop-assistant.js
class ShopAssistant extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.state = {
      loading: false,
      cartId: null,
      messages: []
    }
  }

  connectedCallback() {
    // Config passed via attributes (optional) OR dataset on the mount div
    const mount = this.closest('#shop-assistant-mount') || document.getElementById('shop-assistant-mount')

    const endpoint =
      this.getAttribute('endpoint') ||
      mount?.dataset?.assistantEndpoint ||
      ''

    const apiKey =
      this.getAttribute('api-key') ||
      mount?.dataset?.assistantApiKey ||
      ''

    const greeting =
      this.getAttribute('greeting') ||
      mount?.dataset?.assistantGreeting ||
      "Hi! How can I help?"

    this.endpoint = endpoint
    this.apiKey = apiKey
    this.greeting = greeting

    // Required key enforcement (front-end side)
    if (!this.endpoint) {
      this.renderError("Missing assistant endpoint.")
      return
    }
    if (!this.apiKey) {
      this.renderError("Missing API key. Configure it in the Agent Drawer section settings.")
      return
    }

    this.state.cartId = localStorage.getItem('shop_assistant_cart_id')

    // Initialize with greeting if first load
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

  focusInputSoon() {
    setTimeout(() => {
      const input = this.shadowRoot.querySelector('input')
      input?.focus()
    }, 0)
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

      if (!res.ok) {
        // If backend returns JSON error
        let errText = `Request failed (${res.status})`
        try {
          const j = await res.json()
          if (j?.error) errText = j.error
        } catch { }
        throw new Error(errText)
      }

      const data = await res.json()

      if (data.cartId && data.cartId !== this.state.cartId) {
        this.state.cartId = data.cartId
        localStorage.setItem('shop_assistant_cart_id', data.cartId)
      }

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
      this.focusInputSoon()
    }
  }

  clearChat() {
    this.state.messages = [{ role: 'assistant', content: this.greeting }]
    this.render()
    this.scrollToBottom()
    this.focusInputSoon()
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host { all: initial; display: block; }
        .wrap {
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
          color: #111;
        }
        .toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 10px;
        }
        .title { font-size: 13px; font-weight: 600; }
        .ghost {
          all: unset;
          cursor: pointer;
          font-size: 12px;
          padding: 6px 10px;
          border-radius: 10px;
          border: 1px solid rgba(0,0,0,.12);
          background: #fff;
        }
        .ghost:hover { background: rgba(0,0,0,.04); }

        .panel {
          border: 1px solid rgba(0,0,0,.12);
          border-radius: 14px;
          overflow: hidden;
          background: #fff;
        }
        .msgs {
          height: 360px;
          max-height: 50vh;
          overflow: auto;
          padding: 12px;
          background: #fafafa;
        }
        .msg {
          max-width: 88%;
          padding: 8px 10px;
          border-radius: 12px;
          margin: 6px 0;
          font-size: 13px;
          line-height: 1.35;
          white-space: pre-wrap;
          word-break: break-word;
        }
        .user { margin-left: auto; background: #111; color: #fff; }
        .assistant { margin-right: auto; background: #fff; border: 1px solid rgba(0,0,0,.10); }
        .typing { opacity: .7; }

        .composer {
          display: flex;
          gap: 8px;
          padding: 10px;
          border-top: 1px solid rgba(0,0,0,.12);
        }
        input {
          all: unset;
          flex: 1;
          border: 1px solid rgba(0,0,0,.14);
          border-radius: 12px;
          padding: 10px 10px;
          font-size: 13px;
          background: #fff;
        }
        .send {
          all: unset;
          cursor: pointer;
          background: #111;
          color: #fff;
          border-radius: 12px;
          padding: 10px 12px;
          font-size: 13px;
        }
        .send[aria-disabled="true"] {
          opacity: .55;
          cursor: not-allowed;
        }
      </style>

      <div class="wrap">
        <div class="toolbar">
          <div class="title">Assistant</div>
          <button class="ghost" type="button" data-clear>Clear</button>
        </div>

        <div class="panel">
          <div class="msgs" data-msg-list>
            ${this.state.messages.map(m => `
              <div class="msg ${m.role === 'user' ? 'user' : 'assistant'}">${escapeHtml(m.content)}</div>
            `).join('')}
            ${this.state.loading ? `<div class="msg assistant typing">Typing…</div>` : ``}
          </div>

          <form class="composer">
            <input type="text" placeholder="Ask about fit, sizing, or styles…" autocomplete="off" />
            <button class="send" type="submit" aria-disabled="${this.state.loading ? 'true' : 'false'}">Send</button>
          </form>
        </div>
      </div>
    `

    const form = this.shadowRoot.querySelector('form')
    const input = this.shadowRoot.querySelector('input')
    const clear = this.shadowRoot.querySelector('[data-clear]')

    clear?.addEventListener('click', () => this.clearChat())

    form?.addEventListener('submit', (e) => {
      e.preventDefault()
      const value = input.value
      input.value = ''
      this.sendMessage(value)
    })

    // send on Enter even if form gets weird
    input?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        const value = input.value
        input.value = ''
        this.sendMessage(value)
      }
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

customElements.define('shop-assistant', ShopAssistant)

  // Boot: mount into #shop-assistant-mount
  ; (function boot() {
    const mount = document.getElementById('shop-assistant-mount')
    if (!mount) return

    // Prevent double-mount
    if (mount.querySelector('shop-assistant')) return

    const el = document.createElement('shop-assistant')
    // (optional) pass config as attributes too
    if (mount.dataset.assistantEndpoint) el.setAttribute('endpoint', mount.dataset.assistantEndpoint)
    if (mount.dataset.assistantApiKey) el.setAttribute('api-key', mount.dataset.assistantApiKey)
    if (mount.dataset.assistantGreeting) el.setAttribute('greeting', mount.dataset.assistantGreeting)

    mount.appendChild(el)
  })()
