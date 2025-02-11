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
                <button
                    @click="showAddUserForm"
                    class="btn-add-user"
                >
    <span class="btn-content">
        <i class="fas fa-user-plus"></i>
        <span class="btn-text">Add New User</span>
                  </span>
                  <span class="btn-hover-content"><i class="fas fa-plus"></i>
                 <span class="ripple"></span>
                 </span>
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
                          <img
                              :src="user.image || '/img/default-avatar.png'"
                              :alt="user.name"
                              class="rounded-circle border-radius-lg shadow"
                              @error="handleImageError"
                          >
                        </div>
                        <div class="d-flex flex-column justify-content-center">
                          <h6 class="mb-0 text-sm">{{ user.name }}</h6>
                          <p class="text-xs text-secondary mb-0">{{ user.email }}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div class="d-flex flex-wrap gap-1">
      <span :class="[
        'badge',
        {
          'bg-gradient-primary': user.type === 'Admin',
          'bg-gradient-info': user.type === 'Pro',
          'bg-gradient-success': user.type === 'User'
        }
      ]">
        {{ user.type }}
      </span>
                      </div>
                    </td>
                    <td class="align-middle text-center text-sm">
                         <span :class="['badge badge-sm',user.active ? 'bg-gradient-success' : 'bg-gradient-secondary'
                               ]">
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
import { Modal } from 'bootstrap';
import toastr from 'toastr';
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

    // Available roles for the filter dropdown
    const availableRoles = ref(['Admin', 'User', 'Pro']);
    const handleImageError = (event) => {
      event.target.src = '/img/default-avatar.png'; // Fallback image
    };
    // Format date helper function
    const formatDate = (date) => {
      if (!date) return 'Never';
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    // Computed properties
    const filteredUsers = computed(() => {
      return users.value
          .filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.value.toLowerCase());
            const matchesStatus = !statusFilter.value ||
                (statusFilter.value === 'active' ? user.active : !user.active);
            const matchesRole = !roleFilter.value || user.type === roleFilter.value;
            return matchesSearch && matchesStatus && matchesRole;
          })
          .slice((currentPage.value - 1) * itemsPerPage, currentPage.value * itemsPerPage);
    });

    const totalPages = computed(() => {
      return Math.ceil(users.value.length / itemsPerPage);
    });

    // Methods for CRUD operations
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users');
        users.value = response.data;
      } catch (error) {
        console.error('Error fetching users:', error);
        toastr.error('Failed to fetch users');
      }
    };

    const showAddUserForm = () => {
      selectedUser.value = null;
      showForm.value = true;
    };

    const closeForm = () => {
      showForm.value = false;
      selectedUser.value = null;
    };

    const handleSave = async (userData) => {
      try {
        if (selectedUser.value) {
          // Update existing user
          await axios.put(`/api/users/${selectedUser.value.id}`, userData);
          toastr.success('User updated successfully');
        } else {
          // Create new user
          await axios.post('/api/users', userData);
          toastr.success('User created successfully');
        }
        await fetchUsers();
        closeForm();
      } catch (error) {
        console.error('Error saving user:', error);
        toastr.error(error.response?.data?.message || 'Error saving user');
      }
    };

    const editUser = (user) => {
      selectedUser.value = { ...user }; // Create a copy of the user object
      showForm.value = true;
    };

    const toggleStatus = async (user) => {
      try {
        const response = await axios.patch(`/api/users/${user.id}/toggle-status`);

        // Update the user's active status in the local data
        const updatedUser = users.value.find(u => u.id === user.id);
        if (updatedUser) {
          updatedUser.active = !updatedUser.active;
        }

        toastr.success(response.data.message || 'User status updated successfully');
      } catch (error) {
        console.error('Error toggling user status:', error);

        // Show specific error message if available
        const errorMessage = error.response?.data?.message || 'Error updating user status';
        toastr.error(errorMessage);

        // If the error was due to trying to toggle own status
        if (error.response?.status === 403) {
          toastr.warning("You cannot change your own status");
        }
      }
    };


    const confirmDelete = (user) => {
      selectedUser.value = user;
      const deleteModal = new Modal(document.getElementById('deleteModal'));
      deleteModal.show();
    };

    const deleteUser = async () => {
      try {
        await axios.delete(`/api/users/${selectedUser.value.id}`);
        await fetchUsers();
        const deleteModal = Modal.getInstance(document.getElementById('deleteModal'));
        deleteModal.hide();
        toastr.success('User deleted successfully');
      } catch (error) {
        console.error('Error deleting user:', error);
        toastr.error('Failed to delete user');
      }
    };

    const changePage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
      }
    };



    // Initialize component
    onMounted(() => {
      fetchUsers();
    });

    // Return all necessary methods and properties
    return {
      users,
      searchQuery,
      statusFilter,
      roleFilter,
      currentPage,
      showForm,
      selectedUser,
      availableRoles,
      filteredUsers,
      totalPages,
      formatDate,
      showAddUserForm,
      closeForm,
      handleSave,
      editUser,
      toggleStatus,
      confirmDelete,
      deleteUser,
      changePage,
      handleImageError,
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


.btn-add-user {
  position: relative;
  background: linear-gradient(310deg, #2152ff, #21d4fd);
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 3px 6px rgba(33, 82, 255, 0.1);
}

.btn-content {
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  z-index: 1;
}

.btn-text {
  margin-left: 4px;
}

.btn-hover-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(310deg, #1a44d8, #19bfe6);
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ripple {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: scale(0);
  animation: ripple 0.6s linear;
  pointer-events: none;
}

.btn-add-user:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(33, 82, 255, 0.2);
}

.btn-add-user:hover .btn-hover-content {
  opacity: 1;
}

.btn-add-user:active {
  transform: translateY(0);
  box-shadow: 0 3px 6px rgba(33, 82, 255, 0.1);
}

.btn-add-user i {
  font-size: 1rem;
  transition: transform 0.3s ease;
}

.btn-add-user:hover i {
  transform: rotate(90deg);
}

@keyframes ripple {
  0% {
    transform: scale(0);
    opacity: 0.5;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
}

/* Add responsive styles */
@media (max-width: 768px) {
  .btn-add-user {
    padding: 8px 16px;
    font-size: 0.75rem;
  }

  .btn-text {
    display: none;
  }

  .btn-content i {
    margin: 0;
  }
}

/* Add animation for icon */
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.btn-add-user:hover i {
  animation: pulse 1s infinite;
}
.avatar {
  width: 40px;
  height: 40px;
  overflow: hidden;
  position: relative;
  background-color: #f8f9fa;
  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
}

.avatar img:hover {
  transform: scale(1.1);
}

/* Role badge styles */
.badge {
  padding: 0.55em 0.9em;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  border-radius: 0.45rem;
  transition: all 0.15s ease;
}

.bg-gradient-primary {
  background-image: linear-gradient(310deg, #7928CA, #FF0080);
  color: white;
}

.bg-gradient-info {
  background-image: linear-gradient(310deg, #2152ff, #21d4fd);
  color: white;
}

.bg-gradient-success {
  background-image: linear-gradient(310deg, #17ad37, #98ec2d);
  color: white;
}
</style>
