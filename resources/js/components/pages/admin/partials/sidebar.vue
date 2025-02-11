<template>
  <aside class="sidenav navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 fixed-start ms-3 bg-gradient-primary" id="sidenav-main">
    <!-- Header -->
    <div class="sidenav-header">
      <i class="fa fa-times p-3 cursor-pointer text-white opacity-5 position-absolute end-0 top-0 d-none d-xl-none"
         aria-hidden="true"
         id="iconSidenav"></i>
      <router-link class="navbar-brand m-0 p-3" :to="{name: 'Home'}">
        <img :src="'/assets/img/foodlogo.png'" class="brand-logo">
      </router-link>
    </div>

    <!-- User Info Section -->
    <div class="user-info px-3 py-2 mx-3 mb-3">
      <div class="d-flex align-items-center mb-2">
        <i class="fas fa-user-circle text-white me-2"></i>
        <span class="text-white font-weight-bold">{{ currentUser }}</span>
      </div>
      <div class="d-flex align-items-center">
        <i class="fas fa-clock text-white me-2"></i>
        <span class="text-white text-sm">{{ currentDateTime }}</span>
      </div>
    </div>

    <hr class="horizontal light mt-0 mb-2">

    <!-- Navigation -->
    <div class="collapse navbar-collapse w-auto" id="sidenav-collapse-main">
      <ul class="navbar-nav">
        <!-- Dashboard -->
        <li class="nav-item">
          <router-link class="nav-link" :to="{name: 'adminDashboard'}">
            <div class="icon-wrapper">
              <i class="material-icons">dashboard</i>
            </div>
            <span class="nav-link-text">Dashboard</span>
          </router-link>
        </li>

        <!-- Profile -->
        <li class="nav-item">
          <router-link class="nav-link" :to="{name: 'adminProfile'}">
            <div class="icon-wrapper">
              <i class="material-icons">person</i>
            </div>
            <span class="nav-link-text">Profile</span>
          </router-link>
        </li>

        <!-- Users -->
        <li class="nav-item">
          <router-link class="nav-link" :to="{name: 'adminUsers'}">
            <div class="icon-wrapper">
              <i class="material-icons">group</i>
            </div>
            <span class="nav-link-text">Users</span>
          </router-link>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'Sidebar',
  data() {
    return {
      currentUser: 'soulaymaabdenbi',
      currentDateTime: '',
      timer: null
    }
  },
  mounted() {
    this.updateDateTime();
    this.timer = setInterval(this.updateDateTime, 1000);
  },
  beforeDestroy() {
    if (this.timer) clearInterval(this.timer);
  },
  methods: {
    updateDateTime() {
      const now = new Date();
      const year = now.getUTCFullYear();
      const month = String(now.getUTCMonth() + 1).padStart(2, '0');
      const day = String(now.getUTCDate()).padStart(2, '0');
      const hours = String(now.getUTCHours()).padStart(2, '0');
      const minutes = String(now.getUTCMinutes()).padStart(2, '0');
      const seconds = String(now.getUTCSeconds()).padStart(2, '0');

      this.currentDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
  }
}
</script>

<style scoped>
.bg-gradient-primary {
  background-image: linear-gradient(310deg, #7928CA, #FF0080);
}

.brand-logo {
  width: 180px;
  height: 50px;
  object-fit: contain;
}

.user-info {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

.horizontal.light {
  background-color: rgba(255, 255, 255, 0.2);
  margin: 0 1rem;
}

.nav-item {
  margin: 0.5rem 1rem;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 0.8rem 1rem;
  color: rgba(255, 255, 255, 0.9) !important;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-right: 1rem;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
}

.material-icons {
  color: rgba(255, 255, 255, 0.9) !important;
  font-size: 1.2rem;
}

.nav-link-text {
  font-size: 0.875rem;
  font-weight: 500;
}

/* Active state */
.router-link-active {
  background-image: linear-gradient(195deg, #ec407a, #d81b60);
  color: #ffffff !important;
  font-weight: 400 !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border-radius: 0.375rem !important;
}

.router-link-active .material-icons,
.router-link-active .nav-link-text {
  color: #ffffff !important;
}

/* Hover effects */
.nav-link:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.1);
}

.nav-link:hover .icon-wrapper {
  background: rgba(255, 255, 255, 0.2);
}

/* Animations */
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.nav-link:hover .material-icons {
  animation: pulse 1s infinite;
}

/* User info styles */
.user-info .text-sm {
  font-size: 0.875rem;
}

.user-info i {
  font-size: 1rem;
}

.font-weight-bold {
  font-weight: 600;
}

/* Responsive */
@media (max-width: 768px) {
  .sidenav {
    margin: 0;
    border-radius: 0;
  }

  .brand-logo {
    width: 150px;
    height: 40px;
  }

  .user-info {
    margin: 0.5rem;
  }
}
</style>