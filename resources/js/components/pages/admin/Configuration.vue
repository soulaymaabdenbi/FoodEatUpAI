<template>
  <div class="configuration-container">
    <Navbar />
    <div class="content">
      <h1>Gestion des utilisateurs et rôles</h1>
      <button @click="manageUsers" class="config-btn">Gérer les utilisateurs</button>
      <button @click="manageRoles" class="config-btn">Gérer les rôles</button>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/pages/admin/partials/navbar.vue';

export default {
  components: {
    Navbar,
  },
  methods: {
    manageUsers() {
      this.$router.push('/admin/users');
    },
    manageRoles() {
      this.$router.push('/admin/roles');
    },
  },
};
</script>

<style scoped>
@import '/resources/css/dashboard.css';
</style>
