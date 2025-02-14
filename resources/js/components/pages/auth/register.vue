<template>
  <div class="auth-container">
    <!-- Mobile menu button - only visible on mobile -->
    <div class="mobile-nav">
      <router-link to="/" class="logo">FOOdEatUp</router-link>
      <div class="nav-buttons">
        <router-link :to="{name: 'Register'}" custom v-slot="{ navigate }">
          <button
              class="btn-primary"
              :class="{ 'active': $route.name === 'Register' }"
              @click="navigate"
          >
            Inscription
          </button>
        </router-link>
        <router-link :to="{name: 'login'}" custom v-slot="{ navigate }">
          <button
              class="btn-secondary"
              :class="{ 'active': $route.name === 'login' }"
              @click="navigate"
          >
            Connexion
          </button>
        </router-link>
      </div>
    </div>

    <!-- Main content -->
    <div class="main-content">
      <!-- Left side -->
      <div class="left-side">
        <router-link to="/" class="logo desktop-only">FOOdEatUp</router-link>

        <div class="hero-content">
          <h1>Lorem ipsum dolor sit amet,</h1>
          <p>consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          <button class="btn-action">Voir plus</button>
        </div>
      </div>

      <!-- Right side -->
      <div class="right-side">
        <!-- Top navigation - desktop only -->
        <div class="nav-buttons desktop-only">
          <router-link :to="{name: 'Register'}" custom v-slot="{ navigate }">
            <button
                class="btn-primary"
                :class="{ 'active': $route.name === 'Register' }"
                @click="navigate"
            >
              Inscription
            </button>
          </router-link>
          <router-link :to="{name: 'login'}" custom v-slot="{ navigate }">
            <button
                class="btn-secondary"
                :class="{ 'active': $route.name === 'login' }"
                @click="navigate"
            >
              Connexion
            </button>
          </router-link>
        </div>

        <!-- Registration form -->
        <div class="auth-form">
          <div class="g-icon">
            <span>G</span>
          </div>

          <h2>Créer un nouveau compte</h2>

          <Form @submit="registerUser" :validation-schema="schema" @invalid-submit="removeErrors">
            <div class="name-fields">
              <div class="form-group">
                <label>Nom</label>
                <Field
                    name="Name"
                    type="text"
                    placeholder="Nom"
                    @blur="showNameError"
                />
                <ErrorMessage name="Name" class="error-message" />
              </div>

            </div>

            <div class="form-group">
              <label>Adresse email</label>
              <Field
                  name="email"
                  type="email"
                  placeholder="Adresse email"
                  @blur="removeEmailError"
              />
              <ErrorMessage name="email" class="error-message" />
              <span v-if="$store.getters.getEmailError" class="error-message">
                {{$store.getters.getEmailError}}
              </span>
            </div>

            <div class="form-group">
              <label>Mot de Passe</label>
              <div class="password-field">
                <Field
                    name="password"
                    :type="showPasswordField ? 'text' : 'password'"
                    placeholder="**********"
                    @blur="removePasswordError"
                />
                <button
                    type="button"
                    @click="togglePassword"
                    class="toggle-password"
                    aria-label="Toggle password visibility"
                >
                  <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.98766 3.54017C8.6198 3.37311 9.2911 3.27778 10 3.27778C15.7273 3.27778 19 9.5 19 9.5C19 9.5 18.2539 10.9185 16.8508 12.4009M3.1142 6.6362C1.73368 8.1051 1 9.5 1 9.5C1 9.5 4.27273 15.7222 10 15.7222C10.7219 15.7222 11.4047 15.6234 12.047 15.4506M9.55 12.1298C8.57424 11.9681 7.77595 11.2895 7.45364 10.3889M10.45 6.8702C11.5806 7.05755 12.473 7.93889 12.6627 9.05556M1.9 1.5L18.1 17.5"
                          stroke="#C4BEB8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
              <ErrorMessage name="password" class="error-message" />
            </div>

            <div class="form-group">
              <label>Confirmer le mot de passe</label>
              <div class="password-field">
                <Field
                    name="password_confirmation"
                    :type="showPasswordField ? 'text' : 'password'"
                    placeholder="**********"
                />
                <button
                    type="button"
                    @click="togglePassword"
                    class="toggle-password"
                    aria-label="Toggle password visibility"
                >
                  <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.98766 3.54017C8.6198 3.37311 9.2911 3.27778 10 3.27778C15.7273 3.27778 19 9.5 19 9.5C19 9.5 18.2539 10.9185 16.8508 12.4009M3.1142 6.6362C1.73368 8.1051 1 9.5 1 9.5C1 9.5 4.27273 15.7222 10 15.7222C10.7219 15.7222 11.4047 15.6234 12.047 15.4506M9.55 12.1298C8.57424 11.9681 7.77595 11.2895 7.45364 10.3889M10.45 6.8702C11.5806 7.05755 12.473 7.93889 12.6627 9.05556M1.9 1.5L18.1 17.5"
                          stroke="#C4BEB8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>

            <div class="terms">
              <p>En vous inscrivant, vous acceptez les conditions d'utilisation et la politique de confidentialité de FoodEatUp</p>
            </div>

            <button
                type="submit"
                class="btn-submit"
                :disabled="isLoading"
                :class="{ 'loading': isLoading }"
            >
              {{ isLoading ? 'Inscription...' : 'S\'inscrire' }}
            </button>
          </Form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onUnmounted } from 'vue';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { useStore } from 'vuex';
import {useRoute, useRouter} from 'vue-router';

import auth from '@/composables/auth';


export default {
  name: 'Register',
  components: {
    Form,
    Field,
    ErrorMessage
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const { register } = auth();
    const showPasswordField = ref(false);
    const isLoading = ref(false);
    console.log('Component Route:', route);
    console.log('Router:', router);
    console.log('Available Routes:', router.getRoutes().map(r => r.name));
    const schema = yup.object({
      firstName: yup.string()
          .required('Le prénom est requis.')
          .max(255, 'Le prénom ne doit pas dépasser 255 caractères.'),
      lastName: yup.string()
          .required('Le nom est requis.')
          .max(255, 'Le nom ne doit pas dépasser 255 caractères.'),
      email: yup.string()
          .required('L\'email est requis.')
          .email('L\'email doit être une adresse email valide.')
          .max(255, 'L\'email ne doit pas dépasser 255 caractères.'),
      password: yup.string()
          .required('Le mot de passe est requis.')
          .min(8, 'Le mot de passe doit contenir au moins 8 caractères.'),
      password_confirmation: yup.string()
          .oneOf([yup.ref('password')], 'Les mots de passe doivent correspondre.')
    });

    const togglePassword = () => {
      showPasswordField.value = !showPasswordField.value;
    };

    const registerUser = async (values, { resetForm }) => {
      try {
        isLoading.value = true;

        // Prepare form data for multipart/form-data
        const formData = new FormData();
        formData.append('Name', values.name);
        formData.append('email', values.email);
        formData.append('password', values.password);
        formData.append('password_confirmation', values.password_confirmation);

        // Optional: Add image upload if you have file input
        const imageInput = document.getElementById('image');
        if (imageInput && imageInput.files.length > 0) {
          formData.append('image', imageInput.files[0]);
        }

        const response = await axios.post('/api/register', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        // Show success message
        toastr.success('Inscription réussie. Veuillez vous connecter.');

        // Reset form and navigate to login
        resetForm();
        router.push({ name: 'login' });

      } catch (error) {
        // Handle specific error scenarios
        if (error.response && error.response.status === 422) {
          const errors = error.response.data.errors;

          // Handle validation errors
          if (errors.email) {
            store.dispatch('setEmailError', errors.email[0]);
          }
          if (errors.password) {
            store.dispatch('setPasswordError', errors.password[0]);
          }

          // You can add more specific error handling for other fields
          toastr.error('Erreur d\'inscription. Veuillez vérifier vos informations.');
        } else {
          toastr.error('Une erreur est survenue. Veuillez réessayer.');
        }

        console.error('Registration error:', error);
      } finally {
        isLoading.value = false;
      }
    };
    const removeEmailError = () => {
      store.dispatch('removeEmailError');
    };

    const removePasswordError = () => {
      store.dispatch('removePasswordError');
    };

    const removeErrors = () => {
      store.dispatch('removeEmailError');
      store.dispatch('removePasswordError');
    };

    onUnmounted(() => {
      store.dispatch('removeEmailError');
      store.dispatch('removePasswordError');
    });

    return {
      schema,
      showPasswordField,
      isLoading,
      togglePassword,
      registerUser,
      removeEmailError,
      removePasswordError,
      removeErrors
    };
  }
};
</script>

<style>
@import '/resources/css/auth.css';

/* Additional styles specific to register form */
.name-fields {
  display: flex;
  gap: 28px;
  margin-bottom: 28px;
}

.name-fields .form-group {
  flex: 1;
}

.terms {
  margin-bottom: 28px;
}

.terms p {
  color: #7F7F7F;
  font-size: 14px;
  line-height: 16px;
}

@media (max-width: 768px) {
  .name-fields {
    flex-direction: column;
    gap: 16px;
  }

  .terms p {
    font-size: 12px;
  }
}
</style>