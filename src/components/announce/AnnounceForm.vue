<template>
  <form @submit.prevent="submit">
    <div class="field" v-if="formErrors.processing !== null">
      <div class="notification is-danger">
        {{ formErrors.processing }}    
      </div>
    </div>

    <div class="field" :class="{ 'is-danger': formErrors.title !== null }">
      <label class="label is-size-4">Nadpis</label>
      <input
        type="text"
        v-model="title"
        class="input is-medium"
        @keydown="validateTitle"
        @click="validateTitle"
      />
      <p class="hint" v-if="formErrors.title !== null">
        {{ formErrors.title }}
      </p>
    </div>

    <div class="field" :class="{ 'is-danger': formErrors.channel !== null }">
      <label class="label is-size-4">Channel</label>
      <ChannelPicker :setChannel="setChannel" :change="validateChannel" />
      <p class="hint" v-if="formErrors.channel !== null">
        {{ formErrors.channel }}
      </p>
    </div>

    <div class="field has-text-right" style="margin-top: 30px !important">
      <button class="button is-info" @click.prevent="createField">
        + Přidat field
      </button>
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
      >
        Odeslat
      </button>
    </div>
  </form>
</template>

<script lang="ts">
import Vue from "vue"
import AnnounceField from "./AnnounceField.vue"
import ChannelPicker, { Channel } from "../ChannelPicker.vue"

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
      channel: null as Channel | null,
      formLoading: false,
      formErrors: {
        title: null,
        channel: null,
        processing: null
      } as { [key: string]: string | null }
    }
  },
  mounted() {
    this.createField()
  },
  methods: {
    async submit() {
      const validate = this.validate()
      if (!validate) return

      this.formLoading = true
      this.fields.filter(el => el.title !== "" && el.value !== "") // filter out empty fields

      try {
        const response = await this.$axios.request({
          method: "POST",
          url: "/announce",
          data: {
            title: this.title,
            fields: this.fields,
            channel: this.channel!.id
          }
        })
      } catch (e) {
        console.log(e)
        this.formErrors.processing = `Nastalo k chybě při zpracovávání požadavku. Chyba: ${e.message}`
      }
      this.formLoading = false
    },
    createField() {
      const newFieldId = this.fields.length

      this.fields.push({
        title: "",
        value: ""
      })

      const AnnounceFieldInstance = Vue.extend(AnnounceField)

      const field = new AnnounceFieldInstance({
        propsData: {
          setTitle: (newTitle: any) =>
            (this.fields[newFieldId].title = newTitle.target.value),
          setValue: (newValue: any) =>
            (this.fields[newFieldId].value = newValue.target.value)
        }
      })
      field.$mount()

      // @ts-ignore
      this.$refs.fieldsContainer.appendChild(field.$el)
    },
    setChannel(c: Channel | null) {
      this.formErrors.channel = c === null ? "Nebyl vybrán channel." : null
      this.channel = c
    },
    validate() {
      const isChannel = this.validateChannel()
      const isTitle = this.validateTitle()

      return isChannel && isTitle
    },
    validateChannel() {
      this.formErrors.channel = this.channel ? null : "Nebyl vybrán channel."
      return Boolean(this.channel)
    },
    validateTitle() {
      let isTitle = !this.title || this.title === ""

      this.formErrors.title = isTitle ? "Nebyl zadán nadpis." : null
      return !isTitle
    }
  }
})
</script>
