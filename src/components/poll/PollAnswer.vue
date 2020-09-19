<template>
  <div class="field">
    <label class="label">Odpověď</label>
    <input type="text" @keydown="setAnswer" class="input is-small" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    props: ['setAnswer']
})
</script>
