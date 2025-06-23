<template>
  <header class="header fixed-top"></header>

  <body>
    <div class="list-container">
      <div class="sidebar-left-minor"></div>
      <div class="sidebar-left fixed-sidebar">
        <h1 class="sidebar-text">О специальности</h1>
        <div class="tab-buttons">
          <button 
            :class="{ active: activeTab === 'about' }" 
            @click="activeTab = 'about'"
          >
            Описание
          </button>
          <button 
            :class="{ active: activeTab === 'institutions' }" 
            @click="activeTab = 'institutions'"
          >
            Где обучаться
          </button>
        </div>
      </div>

      <div class="main-content">
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item" @click="navigateTo(isCollege ? '/colleges' : '/universities')" style="cursor: pointer;">
              {{ isCollege ? 'Колледжи' : 'Университеты' }}
            </li>
            <li class="breadcrumb-item" @click="navigateTo(isCollege ? '/Specialties/Colleges' : '/Specialties/Universities/GlobalSpecialties')" style="cursor: pointer;">
              Специальности
            </li>
            <li class="breadcrumb-item active" aria-current="page">
              {{ specializationName }}
            </li>
          </ol>
        </nav>

        <div v-if="loading" class="loader-container">
          <div class="spinner"></div>
        </div>

        <div v-else-if="error" class="error-message">
          {{ error }}
        </div>

        <div v-else>
          <!-- About Tab -->
          <div v-if="activeTab === 'about'" class="about-section">
            <div class="about-card">
              <h2>{{ specializationName }}</h2>
              <h3 class="qualification-name">{{ qualificationName }}</h3>
              <div class="about-content">
                <div v-if="specialization.about1 || specialization.about2 || specialization.about3" class="about-content">
                  <div v-if="specialization.about1" class="about-item">
                    <p>{{ specialization.about1 }}</p>
                  </div>
                  <div v-if="specialization.about2" class="about-item">
                    <p>{{ specialization.about2 }}</p>
                  </div>
                  <div v-if="specialization.about3" class="about-item">
                    <p>{{ specialization.about3 }}</p>
                  </div>
                </div>
                <div v-else class="no-data-message">
                  <p>Описание для данной специальности пока не добавлено</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Institutions Tab -->
          <div v-if="activeTab === 'institutions'" class="institutions-tab">
            <div v-if="loadingInstitutions" class="loader-container">
              <div class="spinner"></div>
            </div>
            <div v-else-if="errorInstitutions">{{ errorInstitutions }}</div>
            <div v-else-if="filteredInstitutions.length === 0" style="margin: 0 0 0 200px;">Результатов не найдено</div>
            <div v-else class="cards-container">
              <div v-for="institution in filteredInstitutions" :key="institution.id" class="list-card">
                <div class="card-img">
                  <img :src="getImageUrl(institution.photo_url, defaultImage)" class="card-img" />
                </div>
                <div class="card-info">
                  <div class="heart-container">
                    <span class="heart-icon" :class="{ liked: institution.isLiked, 'is-animating': institution.isAnimating }" @click="toggleLike(institution)">
                      <img :src="institution.isLiked ? HeartFill : HeartLine" alt="">
                    </span>
                  </div>

                  <div class="card-info-up">
                    <h3>{{ institution.name }} 
                      <span class="likes-count">
                        <i class="bi bi-heart-fill"></i> {{ institution.likes_count || 0 }}
                      </span><br>
                      <span v-for="star in 5" :key="star" class="fa fa-star" :class="{ checked: star <= Math.round(institution.reviews_avg_rating) }"></span>
                    </h3>
                    <p>{{ institution.location }}</p>
                    <p>{{ institution.address }}</p>
                  </div>

                  <div class="card-info-down">
                    <div class="card-info-down-feature">
                      <p>Гранты</p>
                      <p class="feature">{{ institution.grants ? 'Да' : 'Нет' }}</p>
                    </div>
                    <div class="card-info-down-feature">
                      <p>Студенческое общежитие</p>
                      <p class="feature">{{ institution.dormitory ? 'Да' : 'Нет' }}</p>
                    </div>
                    <button type="button" class="university-button" @click="$router.push(`/${isCollege ? 'College' : 'University'}About/${institution.id}`)">Подробнее</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal for Unauthorized Users -->
        <div v-if="showAuthModal" class="modal-overlay">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Требуется авторизация</h5>
            </div>
            <div class="modal-body">
              Пожалуйста, войдите в аккаунт, чтобы поставить лайк.
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="showAuthModal = false">Отмена</button>
              <button type="button" class="btn btn-primary" @click="redirectToLogin">Войти</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </body>
</template>

<script>
import axios from 'axios';
import HeartFill from "@/components/icons/heart-fill.png";
import HeartLine from "@/components/icons/heart-line.png";
import UnCardImage from "@/components/img/UnCard.png";
import ColCardImage from "@/components/img/CollegeCard.png";

export default {
  name: 'SpecializationAboutPage',
  
  data() {
    return {
      activeTab: 'about',
      specialization: {},
      institutions: [],
      filteredInstitutions: [],
      loading: true,
      loadingInstitutions: false,
      error: null,
      errorInstitutions: null,
      specializationName: '',
      specialtyName: '',
      qualificationName: '',
      isCollege: false,
      HeartFill,
      HeartLine,
      defaultImage: null,
      currentUser: null,
      showAuthModal: false
    };
  },

  async created() {
    const savedData = JSON.parse(localStorage.getItem('selectedSpecialization') || '{}');
    console.log('Saved specialization data:', savedData);
    this.specializationName = savedData.name || '';
    this.specialtyName = savedData.specialty_name || '';
    this.qualificationName = savedData.qualification?.name || 'Неизвестная квалификация';
    this.isCollege = savedData.type === 'college';
    console.log('Is college type:', this.isCollege);
    this.defaultImage = this.isCollege ? ColCardImage : UnCardImage;
    
    await this.fetchCurrentUser();
    await this.fetchData();
  },

  watch: {
    activeTab(newTab) {
      if (newTab === 'institutions') {
        this.fetchInstitutions(this.$route.params.id);
      }
    }
  },

  methods: {
    async fetchCurrentUser() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.currentUser = null;
          return;
        }
        const response = await axios.get('http://localhost:8000/api/current-user', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        this.currentUser = response.data;
      } catch (error) {
        console.error('Error fetching current user:', error);
        this.currentUser = null;
      }
    },

    async fetchData() {
      this.loading = true;
      this.error = null;
      
      try {
        const savedData = JSON.parse(localStorage.getItem('selectedSpecialization') || '{}');
        const specializationId = savedData.id;
        const type = savedData.type || 'university';
        
        if (!specializationId) {
          throw new Error('ID специализации не найден');
        }

        const endpoint = type === 'college' 
          ? `http://localhost:8000/api/college-specializations/${specializationId}`
          : `http://localhost:8000/api/specializations/${specializationId}`;

        console.log('Using endpoint:', endpoint);
        const response = await axios.get(endpoint);

        if (response.data.success) {
          console.log('Specialization data:', response.data.data);
          this.specialization = response.data.data;
          this.specializationName = this.specialization.name;
          this.qualificationName = this.specialization.qualification?.qualification_name || 'Неизвестная квалификация';
          this.specialtyName = this.specialization.qualification?.global_specialty?.name || '';
        } else {
          this.error = "Не удалось загрузить данные о специальности";
        }
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
        this.error = "Произошла ошибка при загрузке данных";
      } finally {
        this.loading = false;
      }
    },

    async fetchInstitutions(specializationId) {
      this.loadingInstitutions = true;
      this.errorInstitutions = null;
      
      try {
        const savedData = JSON.parse(localStorage.getItem('selectedSpecialization') || '{}');
        const type = savedData.type || 'university';
        
        const endpoint = type === 'college'
          ? `http://localhost:8000/api/college-specializations/${specializationId}/institutions`
          : `http://localhost:8000/api/specializations/${specializationId}/institutions`;

        console.log('Using endpoint:', endpoint);
        const response = await axios.get(endpoint);

        if (response.data.success) {
          console.log('Institutions data:', response.data.data);
          this.institutions = response.data.data;
          this.filteredInstitutions = response.data.data;
        } else {
          this.errorInstitutions = "Не удалось загрузить список учебных заведений";
        }
      } catch (error) {
        console.error("Ошибка при загрузке учебных заведений:", error);
        this.errorInstitutions = "Произошла ошибка при загрузке данных";
      } finally {
        this.loadingInstitutions = false;
      }
    },

    async fetchLikedInstitutions() {
      try {
        const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
        const response = await axios.get('http://localhost:8000/api/liked-institutions', { headers });
        return response.data;
      } catch (error) {
        console.error('Error fetching liked institutions:', error);
        return [];
      }
    },

    async toggleLike(institution) {
      if (!this.currentUser) {
        this.showAuthModal = true;
        return;
      }

      try {
        const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
        institution.isAnimating = true;

        if (institution.isLiked) {
          await axios.delete(`http://localhost:8000/api/institutions/${institution.id}/unlike`, { headers });
          institution.isLiked = false;
          institution.likes_count = (institution.likes_count || 1) - 1;
        } else {
          await axios.post(`http://localhost:8000/api/institutions/${institution.id}/like`, {}, { headers });
          institution.isLiked = true;
          institution.likes_count = (institution.likes_count || 0) + 1;
        }

        this.institutions = this.institutions.map(inst => 
          inst.id === institution.id ? { ...inst, isLiked: institution.isLiked, likes_count: institution.likes_count, isAnimating: true } : inst
        );
        this.filteredInstitutions = this.filteredInstitutions.map(inst => 
          inst.id === institution.id ? { ...inst, isLiked: institution.isLiked, likes_count: institution.likes_count, isAnimating: true } : inst
        );

        setTimeout(() => {
          this.institutions = this.institutions.map(inst => 
            inst.id === institution.id ? { ...inst, isAnimating: false } : inst
          );
          this.filteredInstitutions = this.filteredInstitutions.map(inst => 
            inst.id === institution.id ? { ...inst, isAnimating: false } : inst
          );
        }, 300);
      } catch (error) {
        console.error('Error toggling like:', error);
      }
    },

    redirectToLogin() {
      this.showAuthModal = false;
      this.$router.push('/login');
    },

    navigateTo(path) {
      this.$router.push(path);
    },

    getImageUrl(url, fallback) {
      if (!url) return fallback;
      if (url.startsWith('http')) return url;
      const base = 'http://localhost:8000';
      if (url.startsWith('/')) return `${base}${url}`;
      return `${base}/storage/${url}`;
    }
  }
};
</script>

<style scoped>
.list-container {
  display: flex;
  width: 100%;
  min-height: 100vh;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 4rem;
  z-index: 1001;
  background-color: rgba(255, 255, 255, 0.9);
  transition: background-color 0.3s ease;
}

.sidebar-left-minor {
  width: 12%;
  flex-shrink: 0;
}

.sidebar-left {
  position: fixed;
  top: 4rem;
  left: 0;
  width: 15%;
  height: calc(100vh - 4rem);
  background-color: white;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.sidebar-text {
  font-size: 1.6rem;
  margin-bottom: 1rem;
  font-weight: bold;
  margin-top: 20%;
}

.tab-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tab-buttons button {
  padding: 10px 20px;
  border: none;
  background: none;
  font-size: 1.2rem;
  cursor: pointer;
  text-align: left;
  color: #666;
  transition: color 0.3s, transform 0.3s;
}

.tab-buttons button.active {
  color: #577C8E;
  font-weight: bold;
  transform: scale(1.1);
}

.tab-buttons button:hover {
  color: #577C8E;
}

.main-content {
  flex-grow: 1;
  background-color: #d4e5ed;
  padding: 2rem 5%;
  margin-top: 4rem;
  overflow-y: auto;
  min-height: 100vh;
}

.breadcrumb {
  margin-bottom: 20px;
  background-color: white;
  padding: 10px 15px;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  font-size: 1.5em;
}

.breadcrumb-item {
  color: #577C8E;
  transition: color 0.3s;
}

.breadcrumb-item:not(.active):hover {
  color: #466470;
}

.breadcrumb-item.active {
  color: #333;
}

.breadcrumb-item + .breadcrumb-item::before {
  content: ">";
  color: #577C8E;
}

.about-card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.about-card h2 {
  color: #333;
  margin-bottom: 20px;
}

.qualification-name {
  color: #577C8E;
  font-size: 1.2em;
  margin-bottom: 20px;
  font-weight: normal;
}

.about-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.about-item {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.about-item p {
  margin: 0;
  line-height: 1.6;
  color: #444;
}

.no-data-message {
  text-align: center;
  padding: 30px;
  background-color: #f8f9fa;
  border-radius: 8px;
  color: #666;
  width: 100%;
  margin: 20px 0;
}

.no-data-message p {
  margin: 0;
  font-size: 1.1em;
}

.cards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
}

.list-card {
  display: flex;
  width: 100%;
  max-width: 75rem;
  min-height: 15rem;
  padding: 1rem;
  background-color: white;
  border-radius: 12px;
  position: relative;
  box-sizing: border-box;
}

.card-img {
  width: 100%;
  max-width: 16rem;
  height: 100%;
  border-radius: 6px;
  margin-right: 1rem;
  flex-shrink: 0;
  object-fit: cover;
}

.card-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  min-width: 0;
}

.card-info-up {
  overflow: hidden;
  width: 95%;
}

.card-info-up h3 {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 0 0.5rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-info-up p {
  color: #919191;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0.25rem 0;
}

.card-info-down {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  width: 100%;
  margin-top: 1rem;
}

.card-info-down-feature {
  margin-right: 1rem;
  flex-shrink: 0;
}

.card-info-down-feature p:first-child {
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
}

.feature {
  color: black;
  font-size: 1rem;
  font-weight: bold;
  margin: 0;
}

.university-button {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  background-color: #577C8E;
  color: white;
  border: none;
  transition: transform 0.3s ease;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.university-button:hover {
  transform: scale(1.1);
}

.heart-container {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 1;
}

.heart-icon {
  cursor: pointer;
  display: inline-block;
}

.heart-icon img {
  width: 2rem;
  height: 2rem;
  transition: all 0.3s ease;
}

.heart-icon:hover img {
  transform: scale(1.1);
}

.heart-icon.liked img {
  transform: scale(1);
  filter: brightness(1);
}

.heart-icon.liked.is-animating img {
  animation: likeAnimation 0.3s ease;
}

.heart-icon:not(.liked).is-animating img {
  animation: unlikeAnimation 0.3s ease;
}

@keyframes likeAnimation {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

@keyframes unlikeAnimation {
  0% { transform: scale(1); }
  50% { transform: scale(0.9); }
  100% { transform: scale(1); }
}

.fa-star {
  color: #ccc;
  font-size: 1.8rem;
}

.fa-star.checked {
  color: #ffd700;
}

.likes-count {
  font-size: 0.9em;
  color: #577c8e;
  font-weight: normal;
  background-color: #f5f5f5;
  padding: 4px 8px;
  border-radius: 12px;
  margin-left: 8px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.likes-count i {
  font-size: 0.9em;
}

.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #577C8E;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  color: #dc3545;
  padding: 20px;
  text-align: center;
}

.filter-container,
.sidebar,
.sidebar-toggle-button,
.sidebar-header,
.sidebar-nav-filtration {
  display: none;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 100%;
  text-align: center;
  animation: slideIn 0.3s ease-out;
}

.modal-header {
  border-bottom: none;
  padding: 20px;
  background: #04202D;
  color: white;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: bold;
}

.modal-body {
  padding: 20px;
  font-size: 1.1rem;
  color: #333;
}

.modal-footer {
  border-top: none;
  padding: 15px 20px;
  background: #f8f9fa;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  display: flex;
  justify-content: space-between;
}

.btn-secondary {
  background-color: #e0e0e0;
  color: #333;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.btn-secondary:hover {
  background-color: #d0d0d0;
}

.btn-primary {
  background: #10222E;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background: #2e6386;
}

@keyframes slideIn {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@media (max-width: 1024px) {
  .sidebar-left, .sidebar-left-minor {
    width: 15%;
  }

  .list-card {
    max-width: 100%;
  }

  .card-img {
    width: 35%;
    max-width: 12rem;
  }
}

@media (max-width: 768px) {
  .sidebar-left {
    width: 100%;
    height: auto;
    position: static;
    padding: 1rem;
    box-shadow: none;
  }

  .sidebar-left-minor {
    display: none;
  }

  .sidebar-text {
    margin-top: 0;
    font-size: 1.4rem;
  }

  .tab-buttons button {
    font-size: 1rem;
  }

  .main-content {
    padding: 1rem 2%;
  }

  .list-card {
    flex-direction: column;
    min-height: auto;
    padding: 0.75rem;
  }

  .card-img {
    width: 100%;
    max-width: none;
    margin: 0 0 0.5rem 0;
  }

  .card-info-down {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .university-button {
    width: 100%;
    margin: 0.5rem 0 0 0;
  }

  .heart-icon img {
    width: 1.5rem;
    height: 1.5rem;
  }
}

@media (max-width: 480px) {
  .card-info-up h3 {
    font-size: 1.2rem;
  }

  .card-info-up p, .card-info-down-feature p:first-child {
    font-size: 0.8rem;
  }

  .feature {
    font-size: 0.9rem;
  }

  .university-button {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }
}
</style> 