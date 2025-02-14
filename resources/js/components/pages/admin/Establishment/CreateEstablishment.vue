<template>
  <div class="create-establishment">
    <Navbar />

    <div class="establishment-form-container">
      <div class="form-header">
        <h1>Créer une nouvelle boutique</h1>
        <p class="subtitle">Remplissez les informations pour ajouter votre boutique</p>
      </div>

      <div class="form-content">
        <!-- Upload Section -->
        <div class="image-upload-section">
          <div class="image-preview" @click="triggerFileInput">
            <img v-if="previewImage" :src="previewImage" alt="Preview" class="preview-img" />
            <div v-else class="upload-placeholder">
              <i class="fas fa-cloud-upload-alt"></i>
              <span>Cliquez pour ajouter une image</span>
              <input
                  type="file"
                  ref="fileInput"
                  @change="handleImageUpload"
                  accept="image/png,image/jpeg"
                  class="hidden-input"
              />
            </div>
          </div>
        </div>

        <form @submit.prevent="submitForm" class="establishment-form">
          <div class="form-grid">
            <div class="form-group">
              <label>Nom de la boutique*</label>
              <input v-model="form.name" required placeholder="ex: Ma Super Boutique" class="form-input" />
            </div>

            <div class="form-group">
              <label>Email*</label>
              <input v-model="form.email" required type="email" placeholder="contact@boutique.com" class="form-input" />
            </div>

            <!-- Country Selection -->
            <div class="form-group">
              <label>Pays*</label>
              <Multiselect
                  v-model="form.country"
                  :options="countryOptions"
                  :searchable="true"
                  :loading="loadingCountries"
                  :create-option="false"
                  placeholder="Sélectionnez un pays"
                  valueProp="code"
                  label="label"
                  track-by="code"
                  @select="handleCountryChange"
              >
                <template #option="{ option }">
                  <img :src="option.flag" class="country-flag" :alt="option.label" />
                  <span class="ml-2">{{ option.label }}</span>
                </template>
                <template #singleLabel="{ option }">
                  <img :src="option.flag" class="country-flag" :alt="option.label" />
                  <span class="ml-2">{{ option.label }}</span>
                </template>
              </Multiselect>
            </div>

            <!-- City Selection -->
            <div class="form-group">
              <label>Ville*</label>
              <Multiselect
                  v-model="form.city"
                  :options="cityOptions"
                  :searchable="true"
                  :loading="loadingCities"
                  :disabled="!form.country || loadingCities"
                  placeholder="Sélectionnez une ville"
                  valueProp="value"
                  label="label"
              />
            </div>

            <div class="form-group">
              <label>Code Postal*</label>
              <input v-model="form.zip_code" required placeholder="75000" class="form-input" />
            </div>
          </div>

          <button type="submit" class="btn-submit">🚀 Ajouter</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import Navbar from '@/components/pages/admin/partials/navbar.vue';
import Multiselect from '@vueform/multiselect';
import '@vueform/multiselect/themes/default.css';
import toastr from 'toastr';

export default {
  name: 'CreateEstablishment',
  components: {
    Navbar,
    Multiselect,
  },

  setup() {
    const router = useRouter();
    const fileInput = ref(null);
    const previewImage = ref(null);
    const isSubmitting = ref(false);
    const loadingCountries = ref(true);
    const loadingCities = ref(false);
    const countries = ref([]);
    const citiesByCountry = ref([]);
    const citiesData = ref({});

    const form = reactive({
      name: '',
      email: '',
      phone_number: '',
      address_line_one: '',
      city: '',
      country: '',
      zip_code: '',
      domain: '',
      logo: null
    });

    const countryOptions = computed(() => {
      return countries.value.map(country => ({
        label: country.name,
        code: country.code,
        flag: country.flag,
        value: country.code
      }));
    });

    const cityOptions = computed(() => {
      return citiesByCountry.value.map(city => ({
        label: city,
        value: city
      }));
    });

    const triggerFileInput = () => fileInput.value?.click();

    const handleImageUpload = (event) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (file.size > 2 * 1024 * 1024) {
        toastr.error('L\'image ne doit pas dépasser 2MB');
        return;
      }

      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        toastr.error('Seuls les formats PNG et JPG sont acceptés');
        return;
      }

      form.logo = file;
      previewImage.value = URL.createObjectURL(file);
    };

    const handleCountryChange = async (selectedOption) => {
      if (!selectedOption) {
        form.country = '';
        form.city = '';
        citiesByCountry.value = [];
        return;
      }

      form.country = selectedOption.code;
      form.city = '';
      loadingCities.value = true;

      try {
        citiesByCountry.value = citiesData.value[selectedOption.code] || [];
      } catch (error) {
        console.error('Error loading cities:', error);
        toastr.error('Erreur lors du chargement des villes');
      } finally {
        loadingCities.value = false;
      }
    };

    const submitForm = async () => {
      try {
        isSubmitting.value = true;
        const formData = new FormData();

        Object.entries(form).forEach(([key, value]) => {
          if (value != null && value !== '') {
            formData.append(key, value);
          }
        });

        const response = await axios.post('/api/establishments', formData, {
          headers: { 'Content-Type': 'multipart/form-data', 'Accept': 'application/json' }
        });

        if (response.data?.success) {
          toastr.success('Boutique créée avec succès!');
          router.push('/admin/establishments');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        toastr.error(error.response?.data?.message || 'Une erreur est survenue');
      } finally {
        isSubmitting.value = false;
      }
    };

    onMounted(async () => {
      const response = await axios.get('https://restcountries.com/v3.1/all');
      countries.value = response.data.map(country => ({
        code: country.cca2,
        name: country.translations.fra?.common || country.name.common,
        flag: country.flags.svg
      }));
      loadingCountries.value = false;

      // Load cities data from JSON file
      try {
        const citiesResponse = await fetch('/cities.json');
        citiesData.value = await citiesResponse.json();
      } catch (error) {
        console.error('Error loading cities data:', error);
        toastr.error('Erreur lors du chargement des données des villes');
      }
    });

    return { form, countryOptions, cityOptions, handleCountryChange, submitForm, triggerFileInput, handleImageUpload, previewImage, fileInput, isSubmitting, loadingCountries, loadingCities };
  }
};
</script>

<style scoped>
.create-establishment {
  min-height: 100vh;
  background: linear-gradient(135deg, #f6f8fd 0%, #f1f4f9 100%);
  padding: 2rem 0;
  position: relative;
  overflow: hidden;
}

/* Modern animated background */
.create-establishment::before {
  content: '';
  position: absolute;
  width: 200%;
  height: 200%;
  top: -50%;
  left: -50%;
  background: radial-gradient(
      circle at center,
      rgba(99, 102, 241, 0.05) 0%,
      rgba(99, 102, 241, 0) 70%
  );
  animation: rotate 60s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.establishment-form-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem;
  position: relative;
  z-index: 1;
}

.form-header {
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
}

.form-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #007bff 0%, #3890E6FF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
}

.form-header::after {
  content: '';
  position: absolute;
  bottom: -1rem;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, #007bff, #3890E6FF);
  border-radius: 2px;
}

.subtitle {
  color: #6b7280;
  font-size: 1.1rem;
}

.form-content {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 1.5rem;
  box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06),
      0 0 0 1px rgba(255, 255, 255, 0.5) inset;
  padding: 2.5rem;
  position: relative;
  overflow: hidden;
}

/* Modern glass effect border */
.form-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg,
  transparent,
  rgba(255, 255, 255, 0.8),
  transparent
  );
}

.image-upload-section {
  margin-bottom: 3rem;
}

.image-preview {
  width: 250px;
  height: 250px;
  margin: 0 auto;
  border: 2px dashed #007bff;
  border-radius: 1rem;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(5px);
  position: relative;
}

.image-preview:hover {
  transform: translateY(-2px);
  border-color: #007bff;
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.15);
}

.upload-placeholder {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: #6b7280;
  padding: 2rem;
}

.upload-placeholder i {
  font-size: 2.5rem;
  color: #007bff;
  background: linear-gradient(135deg, #3890e6, #007bff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.preview-img:hover {
  transform: scale(1.05);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.form-group {
  position: relative;
}

.form-group.full-width {
  grid-column: span 2;
}

label {
  display: block;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.form-input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.9);
}

.form-input:hover {
  border-color: #3890E6FF;
}

.form-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
  background: white;
}


.btn-submit {
  padding: 0.875rem 2.5rem;
  border: none;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, #3890E6FF 0%, #007bff 100%);
  color: white;
  font-weight: 500;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.btn-submit::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
      45deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
  );
  transform: rotate(45deg);
  animation: shine 3s infinite;
}

@keyframes shine {
  0% { transform: translateX(-100%) rotate(45deg); }
  100% { transform: translateX(100%) rotate(45deg); }
}

.btn-submit:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(56, 144, 230, 0.31);
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Responsive Design */
@media (max-width: 768px) {
  .establishment-form-container {
    padding: 1rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .form-group.full-width {
    grid-column: span 1;
  }

  .form-header h1 {
    font-size: 2rem;
  }

  .btn-submit, .btn-cancel {
    padding: 0.875rem 1.5rem;
  }
}

/* Small screen adjustments */
@media (max-width: 480px) {
  .image-preview {
    width: 200px;
    height: 200px;
  }

  .form-content {
    padding: 1.5rem;
  }


  .btn-submit, .btn-cancel {
    width: 100%;
  }
}

/* Add these styles to your existing <style> section */
.country-select-container {
  position: relative;
  width: 100%;
}


.country-flag {
  width: 24px;
  height: 18px;
  object-fit: cover;
  border-radius: 2px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}




.is-open .dropdown-arrow {
  transform: rotate(180deg);
}



.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  background: #f9fafb;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #007bff;
  background: white;
}






:deep(.multiselect) {
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.9);
}

:deep(.multiselect-input) {
  padding: 0.875rem 1rem;
  font-size: 1rem;
}

:deep(.multiselect-single-label) {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
}

:deep(.multiselect-option) {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
}

:deep(.multiselect-option.is-pointed) {
  background: #EFF6FF;
  color: #3B82F6;
}

:deep(.multiselect-option.is-selected) {
  background: #EFF6FF;
  color: #3B82F6;
}

.country-flag {
  width: 24px;
  height: 16px;
  object-fit: cover;
  border-radius: 2px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
</style>