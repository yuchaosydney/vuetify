<template>
  <div>
    <v-icon @click.stop="foo" :size="currentSize" :disabled="disabled" :dense="dense" :icon="icon" />
    <div class="box">
      <button @click="icon = 'home'">material icons</button>
      <button @click="icon = 'mdi-close'">mdi</button>
      <button @click="icon = 'M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z'">mdi-svg</button>
      <button @click="icon = 'fas fa-times'">fa5</button>
      <button @click="icon = '$custom'">custom</button>
    </div>
    <input type="checkbox" :checked="disabled === true" @change="disabled = !disabled" /><label>disabled</label>
    <input :value="icon" @change="e => icon = e.target.value">

    <div class="box">
      <div v-for="size in sizes" :key="size">
        <input type="radio" :checked="currentSize === size" @change="currentSize = size" /><label>{{ size }}</label>
      </div>
    </div>
  </div>
</template>

<script>
  import { ref } from 'vue'

  export default {
    name: 'Playground',
    setup () {
      const currentSize = ref('default')
      const disabled = ref(false)
      const dense = ref(false)
      const icon = ref('$close')

      return {
        icon,
        dense,
        foo: () => console.log('click'),
        currentSize,
        sizes: ['x-small', 'small', 'default', 'large', 'x-large', '120px'],
        disabled,
      }
    },
  }
</script>

<style>
  .box {
    width: 150px;
    height: 150px;
    display: inline-block;
  }

  .alpha {
    color: rgba(var(--v-theme-primary),0.5)
  }
</style>

<style>
.box {
  border: 2px solid black;
  margin: 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;
}
</style>
