export default {
  name: 'prodify',
  callback: (el, { value, modifiers, expression }, { Alpine, effect, cleanup }) => {

    el.addEventListener('click', function() {
      console.log(`Element tag ${el.tagName} clicked with expression ${expression}`)
    })
  }
}