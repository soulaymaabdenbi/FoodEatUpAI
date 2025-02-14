<template>
  <div class="auth-container">
    <div class="mobile-nav">
      <router-link to="/" class="logo">FOOdEatUp</router-link>
    </div>

    <div class="main-content">
      <!-- Left side -->
      <div class="left-side">
        <router-link to="/" class="logo desktop-only">
          <svg width="196" height="26" viewBox="0 0 196 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.664 3.744H3.71204V10.8H14.08C15.088 10.8 15.916 11.556 15.916 12.672C15.916 13.644 15.088 14.508 14.08 14.508H3.71204V23.4C3.71204 24.444 2.81204 25.236 1.84004 25.236C0.796043 25.236 0.0040431 24.444 0.0040431 23.4V1.872C-0.0679569 0.828 0.832043 0 1.87604 0H15.664C16.744 0 17.608 0.828 17.608 1.872C17.608 2.88 16.744 3.744 15.664 3.744Z" fill="white"/>
          </svg>
        </router-link>

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
          <div class="verify-header">
            <h2>Vérifiez votre messagerie</h2>
            <p class="verify-description">
              Nous venons de vous envoyer un email à {{ userEmail }}<br>
              avec un lien pour réinitialiser votre mot de passe.<br>
              Cliquez sur le lien dans l'email pour accéder à la page<br>
              de création de votre nouveau mot de passe.
            </p>
          </div>

          <div class="verify-actions">
            <button
                class="btn-submit"
                :disabled="isLoading"
                :class="{ 'loading': isLoading }"
                @click="sendLink"
            >
              {{ isLoading ? 'Envoi en cours...' : 'Envoyer le lien' }}
            </button>

            <button
                class="btn-secondary mt-4"
                :disabled="isLoading"
                @click="resendLink"
            >
              Renvoyer le lien
            </button>
          </div>

          <div class="support-text">
            Besoin d'aide ? Contactez notre <strong>support</strong> à tout moment !
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onBeforeMount, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import auth from '@/composables/auth';

export default {
  name: 'VerifyEmailView',
  setup() {
    const store = useStore();
    const router = useRouter();
    const { resend } = auth();
    const isLoading = ref(false);


    const userEmail = computed(() => {
      return localStorage.getItem('resetEmail') || 'votre adresse email';
    });

    const sendLink = async () => {
      try {
        isLoading.value = true;
        await resend();
        store.dispatch('setMessage', 'Email de vérification envoyé avec succès.');
      } catch (error) {
        console.error('Send verification error:', error);
        store.dispatch('setMessage', 'Une erreur est survenue lors de l\'envoi de l\'email.');
      } finally {
        isLoading.value = false;
      }
    };

    const resendLink = async () => {
      try {
        isLoading.value = true;
        await resend();
        store.dispatch('setMessage', 'Nouvel email de vérification envoyé.');
      } catch (error) {
        console.error('Resend verification error:', error);
        store.dispatch('setMessage', 'Une erreur est survenue lors du renvoi de l\'email.');
      } finally {
        isLoading.value = false;
      }
    };

    return {
      userEmail,
      isLoading,
      sendLink,
      resendLink
    };
  }
};
</script>

<style scoped>
@import '/resources/css/auth.css';

.verify-header {
  margin-bottom: 2rem;
}

.verify-header h2 {
  font-size: 2rem;
  color: #2D2D2D;
  margin-bottom: 1.5rem;
  font-weight: 500;
  line-height: 1.3;
}

.verify-description {
  color: #7E7E7E;
  font-size: 1.25rem;
  font-weight: 500;
  line-height: 1.4;
  margin-bottom: 2rem;
}

.verify-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.btn-secondary {
  background: #F6F6F6;
  color: #007BFF;
  border: none;
  padding: 1rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
}

.btn-secondary:hover {
  background: #E5E7EB;
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
  .verify-header h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  .verify-description {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }

  .support-text {
    font-size: 0.875rem;
    margin-top: 1.5rem;
  }
}
</style>