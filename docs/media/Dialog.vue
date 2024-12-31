<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div v-if="open" class="dialog-wrapper">
        <div class="dialog-overlay" @click="closeable ? $emit('update:open', false) : undefined"></div>

        <div class="dialog-content">
          <div class="dialog-header" v-if="$slots.header">
            <slot name="header" />
          </div>

          <div class="dialog-body">
            <slot />
          </div>

          <div class="dialog-footer" v-if="$slots.footer">
            <slot name="footer" />
          </div>

          <button v-if="closeable" class="dialog-close" @click="$emit('update:open', false)">
            <span class="sr-only">Close</span>
            <XIcon class="h-4 w-4" />
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { XIcon } from 'lucide-vue-next';

/**
 * Props for the Dialog component.
 * 
 * @interface DialogProps
 * @property {boolean} open - Indicates if the dialog is open.
 * @property {boolean} [closeable] - Indicates if the dialog can be closed by clicking the overlay or the close button.
 */
defineProps<{
  open: boolean;
  closeable?: boolean;
}>();

/**
 * Emits events for the Dialog component.
 * 
 * @interface DialogEmits
 * @property {Function} update:open - Event emitted when the dialog's open state is updated.
 */
defineEmits<{
  (e: 'update:open', value: boolean): void;
}>();
</script>

<style scoped>
/* Styles for the Dialog component */

/* Wrapper for the dialog, fixed position to cover the entire viewport */
.dialog-wrapper {
  @apply fixed inset-0 z-50 flex items-center justify-center;
}

/* Overlay for the dialog, semi-transparent black background */
.dialog-overlay {
  @apply fixed inset-0 bg-black/50 transition-opacity;
}

/* Content area of the dialog, white background with padding and shadow */
.dialog-content {
  @apply relative w-full max-w-md overflow-hidden rounded-lg bg-white p-6 shadow-lg transition-all sm:max-w-lg;
}

/* Header area of the dialog */
.dialog-header {
  @apply mb-4;
}

/* Body area of the dialog */
.dialog-body {
  @apply relative;
}

/* Footer area of the dialog */
.dialog-footer {
  @apply mt-4;
}

/* Close button for the dialog */
.dialog-close {
  @apply absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2;
}

/* Transitions for the dialog */
.dialog-enter-active,
.dialog-leave-active {
  @apply transition-all duration-300;
}

.dialog-enter-from,
.dialog-leave-to {
  @apply opacity-0 scale-95;
}

.dialog-enter-active .dialog-overlay,
.dialog-leave-active .dialog-overlay {
  @apply transition-opacity duration-300;
}

.dialog-enter-from .dialog-overlay,
.dialog-leave-to .dialog-overlay {
  @apply opacity-0;
}

.dialog-enter-from .dialog-content,
.dialog-leave-to .dialog-content {
  @apply opacity-0 scale-95;
}
</style>