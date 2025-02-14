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
            <h2>Mot de passe oublié</h2>
            <p class="reset-description">
              Nous vous enverrons un email de confirmation. Ouvrez-le<br>
              et cliquez sur le lien pour réinitialiser votre mot de passe
            </p>
          </div>

          <!-- Form -->
          <Form @submit="sendResetLink" :validation-schema="schema" @invalid-submit="removeErrors">
            <div class="form-group">
              <label>Adresse email</label>
              <Field
                  name="email"
                  type="email"
                  placeholder="Adresse email"
                  v-model="email"
                  @blur="removeEmailError"
              />
              <ErrorMessage name="email" class="error-message" />
              <span v-if="emailError" class="error-message">
                {{ emailError }}
              </span>
            </div>

            <button
                type="submit"
                class="btn-submit"
                :disabled="isLoading"
                :class="{ 'loading': isLoading }"
            >
              {{ isLoading ? 'Envoi en cours...' : 'Envoyer le lien' }}
            </button>

            <div class="support-text">
              Besoin d'aide ? Contactez notre <strong>support</strong> à tout moment !
            </div>
          </Form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onBeforeMount, onUnmounted } from 'vue';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import axios from 'axios';

export default {
  name: 'EmailPasswordView',
  components: {
    Form,
    Field,
    ErrorMessage
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const isLoading = ref(false);
    const email = ref('');
    const emailError = ref('');

    const schema = yup.object({
      email: yup.string()
          .required('L\'email est requis.')
          .email('L\'email doit être une adresse email valide.')
          .max(255, 'L\'email ne doit pas dépasser 255 caractères.')
    });
    const userEmail = computed(() => {
      return localStorage.getItem('resetEmail') || 'votre adresse email';
    });

    onBeforeMount(async () => {
      // Clear any existing errors
      emailError.value = '';
    });

    const sendResetLink = async (values) => {
      try {
        isLoading.value = true;
        emailError.value = '';

        // Appel API pour envoyer le lien de réinitialisation
        const response = await axios.post('/api/reset-password', {
          email: values.email
        });

        if (response.data.message) {
          // Stocker l'email dans localStorage
          localStorage.setItem('resetEmail', values.email);

          // Redirection vers la page de vérification sans paramètre
          router.push({ name: 'verifyEmail' });
        }
      } catch (error) {
        console.error('Reset password error:', error);
        emailError.value = error.response?.data?.errors?.email?.[0] ||
            'Une erreur est survenue lors de l\'envoi de l\'email.';
      } finally {
        isLoading.value = false;
      }
    };

    const removeEmailError = () => {
      emailError.value = '';
    };

    const removeErrors = () => {
      emailError.value = '';
    };

    onUnmounted(() => {
      emailError.value = '';
    });

    return {
      schema,
      userEmail,
      isLoading,
      email,
      emailError,
      sendResetLink,
      removeEmailError,
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

.support-text {
  text-align: center;
  margin-top: 1.75rem;
  color: #000;
  font-size: 1rem;
  line-height: 1.5;
}

.support-text strong {
  font-weight: 600;
}

@media (max-width: 768px) {
  .reset-header h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  .reset-description {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }

  .support-text {
    font-size: 0.875rem;
    margin-top: 1.5rem;
  }
}

.error-message {
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}

.btn-submit {
  margin-top: 1rem;
}

/* Input focus state */
.form-group input:focus {
  outline: none;
  border-color: #007BFF;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
}
</style>