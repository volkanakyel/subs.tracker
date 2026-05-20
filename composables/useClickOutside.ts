import { onBeforeUnmount, onMounted, type Ref } from 'vue'

export const useClickOutside = (target: Ref<HTMLElement | null>, handler: (e: MouseEvent) => void) => {
  const onDown = (e: MouseEvent) => {
    const el = target.value
    if (!el) return
    if (e.target instanceof Node && el.contains(e.target)) return
    handler(e)
  }

  onMounted(() => document.addEventListener('mousedown', onDown))
  onBeforeUnmount(() => document.removeEventListener('mousedown', onDown))
}
