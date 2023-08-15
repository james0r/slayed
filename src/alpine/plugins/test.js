export default function (Alpine) {
  Alpine.directive('test', (
    el,
    { value, modifiers, expression },
    { Alpine, effect, cleanup }
  ) => {
    console.log()
  })
}