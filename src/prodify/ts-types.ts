type Variant = {
  available: boolean
  barcode: string
  compare_at_price: number | null
  featured_image: string | null
  id: number
  inventory_management: string
  name: string
  option1: string
  option2: string
  option3: string | null
  options: [string, string]
  price: number
  public_title: string
  quantity_rule: {
    min: number
    max: number | null
    increment: number
  }
  requires_selling_plan: boolean
  requires_shipping: boolean
  selling_plan_allocations: any[] // Adjust the type as per your actual data structure
  sku: string
  taxable: boolean
  title: string
  weight: number
}

declare global {
  interface Window {
    prodify: {
      el: HTMLElement
      pickerType: 'radio' | 'select'
      options?: string[]
      optionContainers?: HTMLElement[]
      variantData?: Variant[]
      currentVariant?: Variant
      quantityIncrementButton?: HTMLElement
      quantityDecrementButton?: HTMLElement
      quantityPresentationInput?: HTMLInputElement
      quantityHiddenInput?: HTMLInputElement
    }
    variantStrings: {
      addToCart: string,
      unavailable_with_option: string,
      soldout_with_option: string,
      unavailable: string
    }
  }
}

export { }