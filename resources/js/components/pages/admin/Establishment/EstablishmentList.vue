<template>
  <div class="establishment-container">
    <Navbar />
    <div class="content">
      <h1 class="title">🏬 Gestion des Établissements</h1>
      <button @click="addEstablishment" class="add-btn">Ajouter Boutique</button>

      <div class="establishment-grid">
        <div
            v-for="establishment in establishments"
            :key="establishment.id"
            class="establishment-card"
            @click="viewDetails(establishment.id)"
        >
          <div class="card-header">
            <img :src="establishment.image_url || defaultImage" alt="Logo" class="establishment-logo" />
          </div>
          <div class="card-content">
            <h3>{{ establishment.name }}</h3>
            <p>{{ establishment.address_line_one }}, {{ establishment.city }}</p>
          </div>
          <div class="card-footer">
            <span class="view-details">Voir Détails</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Navbar from '@/components/pages/admin/partials/navbar.vue';

export default {
  components: { Navbar },
  data() {
    return {
      establishments: [],
      defaultImage: 'https://via.placeholder.com/150', // Placeholder if no image
    };
  },
  mounted() {
    axios.get('/api/establishments').then(response => {
      this.establishments = response.data;
    });
  },
  methods: {
    addEstablishment() {
      this.$router.push('/admin/establishments/create');
    },
    viewDetails(id) {
      this.$router.push(`/admin/establishments/${id}`);
    }
  }
};
</script>

<style scoped>
.establishment-container {
  background: #f9f9f9;
  min-height: 100vh;
  padding: 30px;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
}

.title {
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 20px;
}

.add-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 12px 18px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  float: right;
}

.add-btn:hover {
  background: #007bff;
}

.establishment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

.establishment-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  padding: 20px;
  transition: transform 0.3s ease;
  cursor: pointer;
}

.establishment-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

.card-header {
  text-align: center;
}

.establishment-logo {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

.card-content {
  text-align: center;
  margin-top: 10px;
}

.card-content h3 {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.card-content p {
  font-size: 14px;
  color: #666;
}

.card-footer {
  margin-top: 10px;
  text-align: center;
}

.view-details {
  font-size: 14px;
  color: #007bff;
  font-weight: bold;
  cursor: pointer;
}

.view-details:hover {
  text-decoration: underline;
}
</style>
