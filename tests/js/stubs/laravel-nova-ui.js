import { h } from 'vue'

export const Button = {
  props: ['label', 'loading'],
  setup(props, { attrs }) {
    return () => h('button', { ...attrs, disabled: props.loading }, props.label)
  },
}
