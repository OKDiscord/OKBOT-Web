<template>
  <div class="notification" :class="`is-${flash.type}`">
    <strong>{{ flash.title }}</strong>
    <br />
    {{ flash.message }}
  </div>
</template>

<script lang="ts">
import { FlashMessage } from "@/store"
import Vue, { PropType } from "vue"
export default Vue.extend({
  props: {
    flash: Object as PropType<() => FlashMessage>,
  },
})
</script>
