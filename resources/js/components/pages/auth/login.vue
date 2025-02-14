<template>
  <div class="auth-container">
    <!-- Mobile menu button - only visible on mobile -->
    <div class="mobile-nav">
      <router-link to="/login" class="logo">FOOdEatUp</router-link>
      <div class="nav-buttons">
        <router-link :to="{name: 'Register'}" custom v-slot="{ navigate }">
          <button
              class="btn-secondary"
              @click="navigate"
          >
            Inscription
          </button>
        </router-link>
        <router-link :to="{name: 'login'}" custom v-slot="{ navigate }">
          <button
              class="btn-primary"
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
                class="btn-secondary"
                @click="navigate"
            >
              Inscription
            </button>
          </router-link>
          <router-link :to="{name: 'login'}" custom v-slot="{ navigate }">
            <button
                class="btn-primary"
                @click="navigate"
            >
              Connexion
            </button>
          </router-link>
        </div>

        <!-- Login form -->
        <div class="auth-form">
          <div class="g-icon">
            <span>G</span>
          </div>

          <h2>Connectez-vous à votre compte</h2>

          <Form @submit="loginUser" :validation-schema="schema" @invalid-submit="removeErrors">
            <div class="form-group">
              <label>Adresse email</label>
              <Field
                  name="email"
                  type="email"
                  placeholder="test@gmail.com"
                  @blur="removeEmailError"
              />
              <ErrorMessage name="email" class="error-message" />
            </div>

            <div class="form-group">
              <label>Mot de Passe</label>
              <div class="password-field">
                <Field
                    name="password"
                    :type="showPasswordField ? 'text' : 'password'"
                    placeholder="********"
                    @blur="showPasswordError"
                />
                <button
                    type="button"
                    @click="togglePassword"
                    class="toggle-password"
                >
                  <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.98766 3.54017C8.6198 3.37311 9.2911 3.27778 10 3.27778C15.7273 3.27778 19 9.5 19 9.5C19 9.5 18.2539 10.9185 16.8508 12.4009M3.1142 6.6362C1.73368 8.1051 1 9.5 1 9.5C1 9.5 4.27273 15.7222 10 15.7222C10.7219 15.7222 11.4047 15.6234 12.047 15.4506M9.55 12.1298C8.57424 11.9681 7.77595 11.2895 7.45364 10.3889M10.45 6.8702C11.5806 7.05755 12.473 7.93889 12.6627 9.05556M1.9 1.5L18.1 17.5"
                          stroke="#C4BEB8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
              <ErrorMessage name="password" class="error-message" />
            </div>

            <div class="forgot-password">
              <router-link :to="{name: 'emailPassword'}">Mot de passe oublié?</router-link>
            </div>

            <button
                type="submit"
                class="btn-submit"
                :disabled="isLoading"
                :class="{ 'loading': isLoading }"
            >
              {{ isLoading ? 'Connexion...' : 'Se Connecter' }}
            </button>
          </Form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import auth from '@/composables/auth';

export default {
  name: 'Login',
  components: {
    Form,
    Field,
    ErrorMessage
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const { login } = auth();
    const showPasswordField = ref(false);
    const isLoading = ref(false);

    const schema = yup.object({
      email: yup.string()
          .required('L\'email est requis.')
          .email('L\'email doit être une adresse email valide.')
          .max(255, 'L\'email ne doit pas dépasser 255 caractères.'),
      password: yup.string()
          .required('Le mot de passe est requis.')
          .min(8, 'Le mot de passe doit contenir au moins 8 caractères.')
    });

    const togglePassword = () => {
      showPasswordField.value = !showPasswordField.value;
    };

    const redirectAfterLogin = (userType) => {
      const redirectPath = localStorage.getItem('redirectAfterLogin');

      if (redirectPath) {
        localStorage.removeItem('redirectAfterLogin');
        router.push(redirectPath);
        return;
      }

      const dashboardMap = {
        'Admin': 'adminDashboard',
        'User': 'userDashboard',
        'Pro': 'proDashboard'
      };

      router.push({
        name: dashboardMap[userType] || 'userDashboard'
      });
    };

    const loginUser = async (values, { resetForm }) => {
      try {
        isLoading.value = true;

        // Ensure remember is a boolean
        values.remember = values.remember === 'true' || values.remember === true;

        await login(values, { resetForm });

        const userType = store.getters.getType;
        redirectAfterLogin(userType);
      } catch (error) {
        console.error('Login error:', error);
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
      loginUser,
      removeEmailError,
      removePasswordError,
      removeErrors
    };
  }
};
</script>

<style>
@import '/resources/css/auth.css';
</style>