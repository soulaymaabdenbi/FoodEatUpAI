<template>
  <div>
    <h2>{{ user ? 'Edit User' : 'Add User' }}</h2>
    <form @submit.prevent="saveUser">
      <div>
        <label for="name">Name</label>
        <input type="text" v-model="form.name" required />
      </div>
      <div>
        <label for="email">Email</label>
        <input type="email" v-model="form.email" required />
      </div>
      <div v-if="!user">
        <label for="password">Password</label>
        <input type="password" v-model="form.password" required />
      </div>
      <div v-if="!user">
        <label for="password_confirmation">Confirm Password</label>
        <input type="password" v-model="form.password_confirmation" required />
      </div>
      <div>
        <label for="roles">Roles</label>
        <div v-for="role in roles" :key="role.id">
          <input type="checkbox" :value="role.id" v-model="form.roles" /> {{ role.name }}
        </div>
      </div>
      <button type="submit">Save</button>
      <button type="button" @click="$emit('close')">Cancel</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: ['user'],
  data() {
    return {
      form: {
        name: this.user ? this.user.name : '',
        email: this.user ? this.user.email : '',
        password: '',
        password_confirmation: '',
        roles: this.user ? this.user.roles.map(role => role.id) : []
      },
      roles: []
    };
  },
  methods: {
    fetchRoles() {
      axios.get('/api/roles').then(response => {
        this.roles = response.data;
      });
    },
    saveUser() {
      if (this.user) {
        axios.put(`/api/users/${this.user.id}`, this.form).then(() => {
          this.$emit('save');
          this.$emit('close');
        });
      } else {
        axios.post('/api/users', this.form).then(() => {
          this.$emit('save');
          this.$emit('close');
        });
      }
    }
  },
  mounted() {
    this.fetchRoles();
  }
};
</script>