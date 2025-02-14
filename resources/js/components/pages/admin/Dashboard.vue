<template>
  <div class="dashboard-content">
    <h1 class="dashboard-title">Tableau de bord</h1>
    <p class="dashboard-subtitle">Analyse et statistiques en temps réel.</p>

    <!-- AI-Powered Statistics -->
    <div class="stats-grid">
      <div class="stats-card" v-for="stat in stats" :key="stat.id">
        <div class="card-icon">
          <i :class="stat.icon"></i>
        </div>
        <h3>{{ stat.title }}</h3>
        <p>{{ stat.value }}</p>
      </div>
    </div>

    <!-- AI Analytics Chart -->
    <div class="ai-analytics">
      <h2>Analyse Prédictive avec IA</h2>
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default {
  data() {
    return {
      stats: [
        { id: 1, title: 'Utilisateurs Actifs', value: '150', icon: 'fa fa-users' },
        { id: 2, title: 'Commandes Passées', value: '320', icon: 'fa fa-shopping-cart' },
        { id: 3, title: 'Produits en Stock', value: '780', icon: 'fa fa-box-open' },
      ],
    };
  },
  mounted() {
    this.renderChart();
  },
  methods: {
    renderChart() {
      const ctx = this.$refs.chartCanvas.getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
          datasets: [
            {
              label: 'Tendance des Ventes',
              data: [10, 20, 15, 30, 25, 40],
              borderColor: 'blue',
              backgroundColor: 'rgba(0, 0, 255, 0.2)',
              fill: true,
            },
          ],
        },
      });
    },
  },
};
</script>

<style scoped>
@import '/resources/css/dashboard.css';
</style>
