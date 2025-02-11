<template>
  <aside class="sidenav navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 fixed-start ms-3 bg-gradient-primary" id="sidenav-main">
    <div class="sidenav-header">
      <i class="fa fa-times p-3 cursor-pointer text-white opacity-5 position-absolute end-0 top-0 d-none d-xl-none"
         style="padding: 0.5rem !important; margin-right: 8px;"
         aria-hidden="true"
         id="iconSidenav"></i>
      <router-link class="navbar-brand m-0"
                   style="padding: 1.5rem 0.7rem 1.5rem 0.7rem;"
                   :to="{name: 'Home'}">
        <img :src="'/assets/img/foodlogo.png'"
             style="display: inline; width: 180px; height: 50px; margin-right: 2.5px; font-weight: 600; font-size: 1rem; margin-left: 2.5px;">
      </router-link>
    </div>

    <hr class="horizontal light mt-0 mb-2">

    <div class="collapse navbar-collapse w-auto"
         style="height: unset; margin-bottom: 10px;"
         id="sidenav-collapse-main">
      <ul class="navbar-nav">
        <li class="nav-item">
          <router-link class="nav-link text-white" :to="{name: 'userDashboard'}">
            <div class="text-white text-center me-2 d-flex align-items-center justify-content-center">
              <i class="material-icons opacity-10">dashboard</i>
            </div>
            <span class="nav-link-text ms-1">Dashboard</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link text-white" :to="{name: 'userProfile'}">
            <div class="text-white text-center me-2 d-flex align-items-center justify-content-center">
              <i class="material-icons opacity-10">person</i>
            </div>
            <span class="nav-link-text ms-1">Profile</span>
          </router-link>
        </li>
      </ul>
    </div>
  </aside>
</template>

<style scoped>
.bg-gradient-primary {
  background-image: linear-gradient(310deg, #7928CA, #FF0080);
}

.sidenav {
  z-index: 1000;
}

.horizontal.light {
  background-color: rgba(255, 255, 255, 0.2);
}

.nav-link {
  color: rgba(255, 255, 255, 0.9) !important;
}

.nav-link:hover {
  color: #ffffff !important;
}

.router-link-active {
  border-right-width: 0;
  border-bottom-width: 0;
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff !important;
  font-weight: 400 !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border-radius: 0.375rem !important;
  margin-top: 1.5px !important;
  margin-bottom: 1.5px !important;
  background-image: linear-gradient(195deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
}

.material-icons {
  color: rgba(255, 255, 255, 0.9) !important;
}

.router-link-active .material-icons,
.router-link-active .nav-link-text {
  color: #ffffff !important;
}
</style>

<script>
export default {
  name: 'Sidebar'
}
</script>