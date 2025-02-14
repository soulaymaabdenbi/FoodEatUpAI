<template>
  <div class="auth-container">
    <div class="mobile-nav">
      <router-link to="/" class="logo">FOOdEatUp</router-link>
    </div>

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
        <div class="auth-form">
          <!-- G Icon -->
          <div class="g-icon">
            <span>G</span>
          </div>

          <!-- Title and Description -->
          <div class="reset-header">
            <h2>Réinitialiser le mot de passe</h2>
            <p class="reset-description">
              Vous êtes presque prêt ! Il ne vous reste plus<br>
              qu'à créer un nouveau mot de passe
            </p>
          </div>

          <!-- Form -->
          <Form @submit="resetPassword" :validation-schema="schema" @invalid-submit="removeErrors">
            <Field type="hidden" name="token" :value="token" />
            <Field type="hidden" name="email" :value="email" />

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
                >
                  <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.98766 3.54017C8.6198 3.37311 9.2911 3.27778 10 3.27778C15.7273 3.27778 19 9.5 19 9.5C19 9.5 18.2539 10.9185 16.8508 12.4009M3.1142 6.6362C1.73368 8.1051 1 9.5 1 9.5C1 9.5 4.27273 15.7222 10 15.7222C10.7219 15.7222 11.4047 15.6234 12.047 15.4506M9.55 12.1298C8.57424 11.9681 7.77595 11.2895 7.45364 10.3889M10.45 6.8702C11.5806 7.05755 12.473 7.93889 12.6627 9.05556M1.9 1.5L18.1 17.5"
                          stroke="#C4BEB8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
              <ErrorMessage name="password_confirmation" class="error-message" />
            </div>

            <button
                type="submit"
                class="btn-submit"
                :disabled="isLoading"
                :class="{ 'loading': isLoading }"
            >
              {{ isLoading ? 'Validation...' : 'Valider le nouveau mot de passe' }}
            </button>
          </Form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onBeforeMount, onUnmounted } from 'vue';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import toastr from 'toastr';
import auth from '@/composables/auth';

export default {
  name: 'ResetPasswordView',
  components: {
    Form,
    Field,
    ErrorMessage
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const { reset } = auth();

    const showPasswordField = ref(false);
    const isLoading = ref(false);
    const token = ref(route.params.token);
    const email = ref(route.query.email);

    const schema = yup.object({
      token: yup.string().required(),
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

    onBeforeMount(async () => {
      const { checkAuthenticationOnResetPassword, setValue } = auth();
      await checkAuthenticationOnResetPassword();
      await setValue({ token: token.value, email: email.value });
    });

    const resetPassword = async (values, { resetForm }) => {
      try {
        isLoading.value = true;
        console.log("🟢 Sending request with values:", values);

        // Make direct API call to your backend
        const response = await axios.post('/api/reset-password-with-token', {
          token: values.token,
          email: values.email,
          password: values.password,
          password_confirmation: values.password_confirmation
        });

        console.log("🟢 Response received:", response);

        if (response.data.success) {
          store.dispatch('setMessage', 'Mot de passe réinitialisé avec succès');

          // Clear any stored auth data
          localStorage.removeItem('auth_token');
          localStorage.removeItem('resetEmail');

          // Show success message using toastr
          toastr.success('Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter.');

          // Redirect to login page
          setTimeout(() => {
            router.push({ name: 'Login' });
          }, 1500); // Small delay to show the message
        }
      } catch (error) {
        console.error("❌ Reset password error:", error.response?.data || error);
        const errorMessage = error.response?.data?.error ||
            'Une erreur est survenue lors de la réinitialisation du mot de passe';
        store.dispatch('setPasswordError', errorMessage);
        toastr.error(errorMessage);
      } finally {
        isLoading.value = false;
      }
    };
    const togglePassword = () => {
      showPasswordField.value = !showPasswordField.value;
    };

    const removePasswordError = () => {
      store.dispatch('removePasswordError');
    };

    const removeErrors = () => {
      store.dispatch('removePasswordError');
    };

    onUnmounted(() => {
      store.dispatch('removeResetToken');
      store.dispatch('removePasswordError');
    });

    return {
      schema,
      token,
      email,
      showPasswordField,
      isLoading,
      resetPassword,
      togglePassword,
      removePasswordError,
      removeErrors
    };
  }
};
</script>

<style scoped>
@import '/resources/css/auth.css';
.reset-header {
  margin-bottom: 2rem;
}

.reset-header h2 {
  font-size: 2rem;
  color: #2D2D2D;
  margin-bottom: 1.5rem;
  font-weight: 500;
  line-height: 1.3;
}

.reset-description {
  color: #7E7E7E;
  font-size: 1.25rem;
  font-weight: 500;
  line-height: 1.4;
  margin-bottom: 2rem;
}

/* Mobile styles */
@media (max-width: 768px) {
  .reset-header h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  .reset-description {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }
}

/* Button specific styles */
.btn-submit {
  margin-top: 2rem;
  font-weight: 600;
}
</style>