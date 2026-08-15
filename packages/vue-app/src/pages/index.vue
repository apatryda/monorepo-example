<template lang="pug">
v-container.fill-height.text-center
  div.mx-auto
    h1.text-h4.mb-6 Choose app variant:
    RouterLink(to="/a")
      v-btn.mr-4(elevation="3") A
    RouterLink(to="/b")
      v-btn(elevation="3") B
</template>

<script lang="ts" setup>
  //
</script>
