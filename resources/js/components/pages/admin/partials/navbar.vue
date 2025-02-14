<template>
  <nav class="navbar">
    <div class="logo">FOODEATUP</div>
    <ul class="nav-links">
      <li>
        <router-link to="/admin/dashboard" :class="{ active: isActive('/admin/dashboard') }">
          Dashboard
        </router-link>
      </li>
      <li>
        <router-link to="/admin/accueil" :class="{ active: isActive('/admin/accueil') }">
          Accueil
        </router-link>
      </li>
      <li class="dropdown">
        <button class="dropbtn" @click="toggleDropdown">
          Configuration <span>▼</span>
        </button>
        <div class="dropdown-content" v-if="dropdownOpen">
          <router-link to="/admin/users">User</router-link>
          <router-link to="/admin/roles">Roles</router-link>
          <router-link to="/admin/permissions" class="highlighted">Permissions</router-link>
        </div>
      </li>
    </ul>

    <div class="nav-icons">
      <i class="fa fa-bell notif-icon"></i>
      <div class="profile-dropdown">
        <img :src="userImage" alt="Profile" class="profile-pic" @click="toggleProfileMenu" />
        <div class="dropdown-content" v-if="profileMenuOpen">
          <router-link to="/admin/profile">Profile</router-link>
          <button @click="logoutUser">Logout</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      dropdownOpen: false,
      profileMenuOpen: false,
      userImage: '/public/assets/img/default-avatar.png',
    };
  },
  methods: {
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen;
    },
    toggleProfileMenu() {
      this.profileMenuOpen = !this.profileMenuOpen;
    },
    isActive(route) {
      return this.$route.path === route;
    },
    async logoutUser() {
      try {
        localStorage.clear();
        sessionStorage.clear();
        store.commit('setToken', null);
        store.commit('setVerified', null);
        store.commit('setType', null);

        await fetch('/sanctum/csrf-cookie', { method: 'GET', credentials: 'include' });

        await fetch('/api/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.cookie.split('=')[1]
          },
          credentials: 'include',
        });

        this.$router.push('/login');
        location.reload();
      } catch (error) {
        console.error('Error during logout:', error);
        this.$router.push('/login');
        location.reload();
      }
    }
    },
};
</script>

<style scoped>
@import '/resources/css/dashboard.css';

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 15px 30px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  width: 95%;
  margin: 10px auto;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: #007bff;
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 20px;
}

.nav-links a {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  padding: 10px 15px;
  border-radius: 6px;
  transition: all 0.3s;
}

.nav-links a.router-link-active,
.nav-links a:hover {
  background: #007bff;
  color: white;
}

.dropdown {
  position: relative;
}

.dropbtn {
  background: transparent;
  border: none;
  font-size: 16px;
  cursor: pointer;
  font-weight: 500;
}

.dropdown-content {
  position: absolute;
  top: 45px;
  left: 0;
  background: white;
  min-width: 180px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 10px;
  display: flex;
  flex-direction: column;
}

.dropdown-content a,
.dropdown-content button {
  display: block;
  padding: 10px;
  color: #333;
  border-radius: 6px;
  transition: all 0.3s;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
}

.dropdown-content a:hover,
.dropdown-content button:hover {
  background: #007bff;
  color: white;
}

.nav-icons {
  display: flex;
  align-items: center;
  gap: 15px;
}

.notif-icon {
  font-size: 20px;
  cursor: pointer;
}

.profile-dropdown {
  position: relative;
}

.profile-pic {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #007bff;
  cursor: pointer;
}

.profile-dropdown .dropdown-content {
  right: 0;
  left: auto;
}
</style>
