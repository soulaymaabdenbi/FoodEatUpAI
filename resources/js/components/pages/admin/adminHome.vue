<template>
  <div class="dashboard-container">
    <Navbar />
    <router-view></router-view>
  </div>
</template>

<script>
import Navbar from '@/components/pages/admin/partials/navbar.vue';

export default {
  components: {
    Navbar,
  },
};
</script>

<style scoped>
@import '/resources/css/dashboard.css';
</style>
