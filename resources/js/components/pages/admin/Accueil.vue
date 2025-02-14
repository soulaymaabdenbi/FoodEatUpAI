<template>
  <div class="accueil-container">
    <div class="accueil-grid">
      <div
          v-for="(item, index) in accueilItems"
          :key="index"
          class="accueil-card"
          @click="navigateTo(item.link)"
      >
        <div class="card-content">
          <div class="card-header">
            <i :class="item.icon" class="card-icon"></i>
            <span class="card-title">{{ item.title }}</span>
          </div>
          <p class="card-description">{{ item.description }}</p>
        </div>
        <div class="arrow-wrapper">
          <div class="arrow-container" @click.stop="navigateTo(item.link)">
            <i class="fas fa-arrow-right"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      accueilItems: [
        { title: 'Profil', description: 'Personnalisez votre profil.', icon: 'fas fa-user text-blue-500', link: '/admin/profile' },
        { title: 'Configuration', description: 'Accédez aux paramètres avancés.', icon: 'fas fa-cog text-blue-500', link: '/admin/configuration' },
        { title: 'HACCP', description: 'Gérez la conformité en sécurité alimentaire.', icon: 'fas fa-clipboard-check text-blue-500', link: '/admin/haccp' },
        { title: 'Statistique', description: 'Visualisez vos statistiques en temps réel.', icon: 'fas fa-chart-line text-blue-500', link: '/admin/stats' },
        { title: 'À propos', description: 'Découvrez plus sur notre plateforme.', icon: 'fas fa-info-circle text-blue-500', link: '/admin/about' },
        { title: 'Notifications', description: 'Gardez un œil sur vos alertes importantes.', icon: 'fas fa-bell text-blue-500', link: '/admin/notifications' },
        { title: 'Équipe', description: 'Gérez les membres et les rôles.', icon: 'fas fa-users text-blue-500', link: '/admin/team' },
        { title: 'Établissements', description: 'Gérez vos établissements.', icon: 'fas fa-store text-blue-500', link: '/admin/establishments' },
      ],
    };
  },
  methods: {
    navigateTo(link) {
      if (link) {
        this.$router.push(link);
      }
    }
  }
};
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

.accueil-container {
  padding: 20px;
  background-color: #f8f9fd;
  min-height: 100vh;
}

.accueil-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.accueil-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  position: relative;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
}

.card-content {
  flex-grow: 1;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.card-icon {
  font-size: 18px;
  color: #0d6efd;
}

.card-title {
  font-size: 16px;
  font-weight: 500;
  color: #0d6efd;
}

.card-description {
  font-size: 14px;
  color: #6c757d;
  line-height: 1.5;
  margin: 0;
  padding-right: 20px;
}

.arrow-wrapper {
  position: absolute;
  right: 15px;
  bottom: 15px;
  padding: 10px;
  border-radius: 50%;
  background-color: #f0f2f5;
  cursor: pointer;
  transition: background 0.3s ease;
}

.arrow-container i {
  color: #0d6efd;
  font-size: 14px;
  transition: transform 0.3s ease;
}

.accueil-card:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.05);
}

.accueil-card:hover .arrow-container i {
  transform: translateX(3px);
}

@media screen and (max-width: 768px) {
  .accueil-grid {
    grid-template-columns: 1fr;
  }

  .accueil-card {
    margin: 0;
  }
}
</style>
