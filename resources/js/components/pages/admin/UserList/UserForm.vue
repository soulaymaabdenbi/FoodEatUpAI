<template>
  <div class="modal fade" id="userFormModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <div class="modal-content bg-white shadow-lg border-radius-lg">
        <!-- Modal Header with Gradient -->
        <div class="modal-header p-0 position-relative mt-n4 mx-3 z-index-2">
          <div class="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3 px-3 w-100 d-flex justify-content-between align-items-center">
            <h6 class="text-white text-capitalize ps-3 mb-0">
              {{ user ? 'Edit User Profile' : 'Create New User' }}
            </h6>
            <button type="button" class="btn-close btn-close-white me-2" data-bs-dismiss="modal" @click="closeModal"></button>
          </div>
        </div>

        <form @submit.prevent="handleSubmit" class="p-4">
          <div class="modal-body">
            <div class="row">
              <!-- Left Column -->
              <div class="col-md-6">
                <!-- Updated Name Input -->
                <div class="input-group input-group-static mb-4">
                  <label>Full Name</label>
                  <input
                      type="text"
                      class="form-control"
                      v-model="formData.name"
                      required
                  >
                </div>

                <!-- Updated Email Input -->
                <div class="input-group input-group-static mb-4">
                  <label>Email Address</label>
                  <input
                      type="email"
                      class="form-control"
                      v-model="formData.email"
                      required
                  >
                </div>

                <!-- Updated Phone Input -->
                <div class="input-group input-group-static mb-4">
                  <label>Phone Number</label>
                  <input
                      type="tel"
                      class="form-control"
                      v-model="formData.phone"
                  >
                </div>
              </div>

              <!-- Right Column -->
              <div class="col-md-6">
                <!-- User Type Selection -->
                <div class="input-group input-group-static mb-4">
                  <label>User Type</label>
                  <select class="form-select border-radius-lg" v-model="formData.type" required>
                    <option value="">Select User Type</option>
                    <option value="User">Regular User</option>
                    <option value="Admin">Administrator</option>
                    <option value="Pro">Professional User</option>
                  </select>
                </div>

                <!-- Updated Password Input -->
                <div class="input-group input-group-static mb-4">
                  <label>Password</label>
                  <input
                      type="password"
                      class="form-control"
                      v-model="formData.password"
                      :required="!user"
                  >
                </div>

                <!-- Updated Password Confirmation Input -->
                <div class="input-group input-group-static mb-4">
                  <label>Confirm Password</label>
                  <input
                      type="password"
                      class="form-control"
                      v-model="formData.password_confirmation"
                      :required="!user"
                  >
                </div>
              </div>
            </div>

            <!-- User Type Description -->
            <div class="mt-3">
              <div class="alert alert-info text-white font-weight-bold" role="alert">
                <i class="fas fa-info-circle me-2"></i>
                <span v-if="formData.type === 'Admin'">
                  Administrator accounts have full access to all system features and management capabilities.
                </span>
                <span v-else-if="formData.type === 'Pro'">
                  Professional accounts have access to advanced features and analytics.
                </span>
                <span v-else>
                  Regular user accounts have standard access to basic features.
                </span>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="modal-footer border-0 pt-0">
            <button
                type="button"
                class="btn bg-gradient-light mb-0"
                data-bs-dismiss="modal"
                @click="closeModal"
            >
              Cancel
            </button>
            <button
                type="submit"
                class="btn bg-gradient-primary mb-0"
            >
              {{ user ? 'Update User' : 'Create User' }}
              <i class="fas fa-save ms-2"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { Modal } from 'bootstrap';

export default {
  props: {
    user: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'save'],
  setup(props, { emit }) {
    const formData = ref({
      name: '',
      email: '',
      phone: '',
      type: '', // Initialize with empty string
      password: '',
      password_confirmation: ''
    });

    let modal = null;

    onMounted(() => {
      modal = new Modal(document.getElementById('userFormModal'));
      modal.show();
    });

    watch(() => props.user, (newUser) => {
      if (newUser) {
        formData.value = {
          ...newUser,
          password: '',
          password_confirmation: ''
        };
      } else {
        // Reset form when creating new user
        formData.value = {
          name: '',
          email: '',
          phone: '',
          type: 'User', // Set default type for new users
          password: '',
          password_confirmation: ''
        };
      }
    }, { immediate: true });

    const closeModal = () => {
      modal.hide();
      emit('close');
    };

    const handleSubmit = async () => {
      // Validate form data
      if (!formData.value.type) {
        alert('Please select a user type');
        return;
      }

      // Create the data object to be sent
      const userData = {
        ...formData.value,
        type: formData.value.type // Ensure type is included
      };

      emit('save', userData);
      closeModal();
    };

    return {
      formData,
      closeModal,
      handleSubmit
    };
  }
};
</script>

<style scoped>
/* Previous styles remain the same, but update input group styles */
.input-group-static {
  position: relative;
  margin-bottom: 1rem;
}

.input-group-static label {
  font-size: 0.875rem;
  color: #7b809a;
  margin-bottom: 0.5rem;
  display: block;
}

.input-group-static .form-control {
  border: 1px solid #d2d6da;
  border-radius: 0.375rem;
  padding: 0.75rem 1rem;
  background-color: #fff;
  transition: all 0.15s ease-in-out;
}

.input-group-static .form-control:focus {
  border-color: #e91e63;
  box-shadow: 0 0 0 0.2rem rgba(233, 30, 99, 0.25);
}

.form-select {
  height: auto;
  padding: 0.75rem 1rem;
  background-color: #fff;
  border: 1px solid #d2d6da;
}

/* Add validation styles */
.form-control.is-invalid,
.form-select.is-invalid {
  border-color: #dc3545;
  background-image: none;
}

.invalid-feedback {
  display: block;
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
</style>