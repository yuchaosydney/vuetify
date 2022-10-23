<template>
  <div>
    <v-btn
      color="primary"
      @click.stop="drawer = !drawer"
    >
      Toggle
    </v-btn>

    <v-navigation-drawer
      v-model="drawer"
      location="end"
      :width="400"
      temporary
    >
      <VCard flat>
        <v-list-item
          prepend-avatar="https://randomuser.me/api/portraits/men/78.jpg"
          title="John Leider"
        ></v-list-item>

        <v-divider></v-divider>

        <v-list density="compact" nav>
          <v-list-item title="Home" value="home"></v-list-item>
          <v-list-item title="About" value="about"></v-list-item>
        </v-list>
      </VCard>
    </v-navigation-drawer>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
  
const drawer = ref(false)
</script>