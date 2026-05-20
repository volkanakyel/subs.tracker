import { onBeforeUnmount, onMounted, type Ref } from 'vue'

export const useClickOutside = (target: Ref<HTMLElement | null>, handler: (e: MouseEvent) => void) => {
  const onDown = (e: MouseEvent) => {
    const el = target.value
    if (!el) return
    if (!(e.target instanceof Element)) return
    if (el.contains(e.target)) return
    if (e.target.closest('[data-popover]')) return
    handler(e)
  }

  onMounted(() => document.addEventListener('mousedown', onDown))
  onBeforeUnmount(() => document.removeEventListener('mousedown', onDown))
}
