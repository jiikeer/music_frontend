<template>
  <div>
    <header class="musicHeader">
      <MusicHeader />
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>


<script setup>
import MusicHeader from "./MusicHeader.vue";

</script>