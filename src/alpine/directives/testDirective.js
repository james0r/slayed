export default {
  name: 'test-directive',
  callback: (el, { value, modifiers, expression }, { Alpine, effect, cleanup }) => {

    el.addEventListener('click', function() {
      console.log(`Element tag ${el.tagName} clicked with expression ${expression}`)
    })
  }
}
