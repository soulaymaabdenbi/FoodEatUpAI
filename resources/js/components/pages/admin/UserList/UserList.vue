<template>
  <sidebar />
  <main class="main-content position-relative max-height-vh-100 h-100 border-radius-lg">
    <navbar />
    <div class="container-fluid py-4">
      <div class="row">
        <div class="col-12">
          <div class="card my-4" style="margin-top: 105px !important;">
            <!-- Header Section -->
            <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div class="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3 d-flex justify-content-between align-items-center">
                <h6 class="text-white text-capitalize ps-3">User Management</h6>
                <button @click="showAddUserForm" class="btn btn-sm btn-light me-3">
                  <i class="fas fa-plus me-2"></i> Add User
                </button>
              </div>
            </div>

            <!-- Card Body -->
            <div class="card-body px-0 pb-2">
              <!-- Search and Filter Section -->
              <div class="d-flex justify-content-between align-items-center px-3 mb-3">
                <div class="input-group input-group-outline" style="max-width: 250px;">
                  <input type="text" v-model="searchQuery" class="form-control" placeholder="Search users...">
                </div>
                <div class="d-flex gap-2">
                  <select v-model="statusFilter" class="form-select form-select-sm">
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <select v-model="roleFilter" class="form-select form-select-sm">
                    <option value="">All Roles</option>
                    <option v-for="role in availableRoles" :key="role" :value="role">
                      {{ role }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Table Section -->
              <div class="table-responsive p-0">
                <table class="table align-items-center mb-0">
                  <thead>
                  <tr>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">User</th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Role</th>
                    <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Status</th>
                    <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Last Login</th>
                    <th class="text-secondary opacity-7">Actions</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="user in filteredUsers" :key="user.id">
                    <td>
                      <div class="d-flex px-2 py-1">
                        <div class="avatar avatar-sm me-3">
                          <img :src="user.avatar || '/default-avatar.png'" class="rounded-circle">
                        </div>
                        <div class="d-flex flex-column justify-content-center">
                          <h6 class="mb-0 text-sm">{{ user.name }}</h6>
                          <p class="text-xs text-secondary mb-0">{{ user.email }}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div class="d-flex flex-wrap gap-1">
                          <span v-for="role in user.roles" :key="role.id"
                                class="badge bg-gradient-info">{{ role.name }}</span>
                      </div>
                    </td>
                    <td class="align-middle text-center text-sm">
                        <span :class="user.active ? 'badge badge-sm bg-gradient-success' : 'badge badge-sm bg-gradient-secondary'">
                          {{ user.active ? 'Active' : 'Inactive' }}
                        </span>
                    </td>
                    <td class="align-middle text-center">
                        <span class="text-secondary text-xs font-weight-bold">
                          {{ formatDate(user.lastLogin) }}
                        </span>
                    </td>
                    <td class="align-middle">
                      <div class="d-flex gap-2">
                        <button @click="editUser(user)" class="btn btn-link text-secondary mb-0">
                          <i class="fas fa-pencil-alt text-xs"></i>
                        </button>
                        <button @click="toggleStatus(user)" class="btn btn-link text-secondary mb-0">
                          <i :class="user.active ? 'fas fa-toggle-on text-success' : 'fas fa-toggle-off text-secondary'"></i>
                        </button>
                        <button @click="confirmDelete(user)" class="btn btn-link text-danger mb-0">
                          <i class="fas fa-trash text-xs"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>

              <!-- Pagination -->
              <div class="d-flex justify-content-center mt-3">
                <nav aria-label="Page navigation">
                  <ul class="pagination">
                    <li class="page-item" :class="{ disabled: currentPage === 1 }">
                      <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">
                        Previous
                      </a>
                    </li>
                    <li v-for="page in totalPages" :key="page"
                        class="page-item" :class="{ active: page === currentPage }">
                      <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
                    </li>
                    <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                      <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">
                        Next
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- User Form Modal -->
    <UserForm
        v-if="showForm"
        :user="selectedUser"
        @close="closeForm"
        @save="handleSave"
    />

    <!-- Delete Confirmation Modal -->
    <div class="modal fade" id="deleteModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirm Delete</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            Are you sure you want to delete this user?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-danger" @click="deleteUser">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';
import sidebar from '../partials/sidebar.vue';
import navbar from '../partials/navbar.vue';
import UserForm from './UserForm.vue';

export default {
  components: {
    sidebar,
    navbar,
    UserForm
  },

  setup() {
    const store = useStore();
    const users = ref([]);
    const searchQuery = ref('');
    const statusFilter = ref('');
    const roleFilter = ref('');
    const currentPage = ref(1);
    const itemsPerPage = 10;
    const showForm = ref(false);
    const selectedUser = ref(null);

    const filteredUsers = computed(() => {
      return users.value
          .filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.value.toLowerCase());
            const matchesStatus = !statusFilter.value ||
                (statusFilter.value === 'active' ? user.active : !user.active);
            const matchesRole = !roleFilter.value ||
                user.roles.some(role => role.name === roleFilter.value);
            return matchesSearch && matchesStatus && matchesRole;
          })
          .slice((currentPage.value - 1) * itemsPerPage, currentPage.value * itemsPerPage);
    });

    const totalPages = computed(() => {
      return Math.ceil(users.value.length / itemsPerPage);
    });

    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users');
        users.value = response.data;
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    // ... rest of your methods ...

    onMounted(() => {
      fetchUsers();
    });

    return {
      users,
      searchQuery,
      statusFilter,
      roleFilter,
      currentPage,
      showForm,
      selectedUser,
      filteredUsers,
      totalPages,
      // ... expose other methods and computed properties
    };
  }
};
</script>

<style scoped>
/* Add your existing styles and any new ones */
.avatar {
  width: 40px;
  height: 40px;
  overflow: hidden;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.badge {
  font-size: 0.65rem;
  padding: 0.35em 0.65em;
}

.table th {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 1rem;
}

.table td {
  padding: 0.75rem 1rem;
}

.pagination {
  margin-bottom: 0;
}

.form-select {
  padding: 0.25rem 2rem 0.25rem 0.5rem;
  font-size: 0.875rem;
}
</style>