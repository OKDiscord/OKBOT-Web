<template>
  <form @submit.prevent="submit">
    <div class="field">
      <label class="label is-size-4">Nadpis</label>
      <input type="text" v-model="title" class="input is-medium" />
    </div>

    <div class="field">
        <label class="label is-size-4">Channel</label>
        <ChannelPicker/>
    </div>

    <div class="field has-text-right" style="margin-top: 30px !important">
      <button class="button is-info" @click.prevent="createField">+ Přidat field</button>
    </div>

    <div ref="fieldsContainer"></div>

    <div class="field has-text-right" style="margin-top: 60px !important">
      <button
        class="button is-medium"
        :class="{
          'is-primary': !formLoading,
          'is-dark is-loading': formLoading
        }"
        type="submit"
      >Odeslat</button>
    </div>
  </form>
</template>

<script lang="ts">
import Vue from "vue"
import AnnounceField from "./AnnounceField.vue"
import ChannelPicker from '../ChannelPicker.vue'

export default Vue.extend({
  components: {
    AnnounceField,
    ChannelPicker
  },
  data() {
    return {
      title: "",
      fields: [] as {
        title: string
        value: string
      }[],
      formLoading: false,
    }
  },
  mounted() {
    this.createField()
  },
  methods: {
    async submit() {
      this.formLoading = true

      try {
        const response = await this.$axios.request({
          method: "POST",
          url: "/announce",
          data: {
            title: this.title,
            fields: this.fields,
          },
        })
      } catch (e) {
        console.log("bitch")
        console.log(e)
      }
    },
    createField() {
      const newFieldId = this.fields.length

      this.fields.push({
        title: "",
        value: "",
      })

      const AnnounceFieldInstance = Vue.extend(AnnounceField)

      const field = new AnnounceFieldInstance({
        propsData: {
          setTitle: (newTitle: any) =>
            (this.fields[newFieldId].title = newTitle.target.value),
          setValue: (newValue: any) =>
            (this.fields[newFieldId].value = newValue.target.value),
        },
      })
      field.$mount()

      // @ts-ignore
      this.$refs.fieldsContainer.appendChild(field.$el)
    },
  },
})
</script>
