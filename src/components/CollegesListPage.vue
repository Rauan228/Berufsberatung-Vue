<template>
  <header class="header fixed-top"></header>

  <body>
    <div class="list-container">
      <div class="sidebar-left-minor"></div>
      <div class="sidebar-left fixed-sidebar">
        <h class="sidebar-text">Тип образовательного учреждения</h>
        <router-link ref="universityLink" to="/Universities" class="sidebar-choice" :class="{ active: currentPage === 'Universities' }">Университет</router-link>
        <router-link ref="collegeLink" to="/Colleges" class="sidebar-active-choice" :class="{ active: currentPage === 'Colleges' }">Колледж</router-link>
        <div class="active-indicator" :class="{ 'colleges': currentPage === 'Colleges', 'universities': currentPage === 'Universities' }"></div>
      </div>

      <div class="main-content" style="padding: 100px 0 0 0;">
        <div v-if="loading" class="loader-container">
          <div class="spinner"></div>
        </div>
        <div v-else-if="error">{{ error }}</div>
        <div v-else-if="filteredInstitutions.length === 0" style="margin: 0 0 0 200px;">Результатов не найдено</div>
        <div v-else class="cards-container">
          <div v-for="institution in filteredInstitutions" :key="institution.id" class="list-card">
            <div class="card-img">
              <div v-if="!imageLoaded[institution.id]" class="image-loader">
                <div class="spinner"></div>
              </div>
              <img 
                :src="getImageUrl(institution.photo_url, ColCardImage)" 
                class="card-img" 
                @load="imageLoaded[institution.id] = true"
                :style="{ display: imageLoaded[institution.id] ? 'block' : 'none' }"
              />
            </div>
            <div class="card-info">
              <div class="heart-container">
                <span class="heart-icon" :class="{ liked: institution.isLiked, 'is-animating': institution.isAnimating }" @click="toggleLike(institution)">
                  <img :src="institution.isLiked ? HeartFill : HeartLine" alt="">
                </span>
              </div>

              <div class="card-info-up">
                <h>{{ institution.name }} 
                  <span class="likes-count">
                    <i class="bi bi-heart-fill"></i> {{ institution.likes_count || 0 }}
                  </span><br>
                  <span v-for="star in 5" :key="star" class="fa fa-star" :class="{ checked: star <= Math.round(institution.reviews_avg_rating) }"></span>
                </h>
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
                <button type="button" class="university-button" @click="$router.push(`/CollegeAbout/${institution.id}`)">Подробнее</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="filter-container">
        <div>
          <button class="sidebar-toggle-button" :class="{ 'sidebar-open': isSidebarOpen }" @click="toggleSidebar">
            <img v-if="isSidebarOpen" src="@/components/img/backArrow.png" alt="Назад" />
            <img v-else src="@/components/img/ForwardArrow.png" alt="Вперед" />
          </button>
        </div>

        <aside id="sidebar" class="sidebar sidebar-default" :class="{ 'open': isSidebarOpen }">
          <div class="sidebar-header">
            <h>Фильтр учреждений</h>
            <div class="search-container">
              <input type="text" v-model="searchQuery" placeholder="Поиск по названию..." @input="filterInstitutions" />
            </div>
          </div>

          <div class="sidebar-nav-filtration">
            <p>Гранты</p>
            <button v-for="(item, index) in grantOptions" :key="'grant-' + index" @click="selectGrant(item)" :class="{ selected: grantFilter === item.toLowerCase() }">
              {{ item }}
            </button>

            <p>Общежитие</p>
            <button v-for="(item, index) in dormitoryOptions" :key="'dormitory-' + index" @click="selectDormitory(item)" :class="{ selected: dormitoryFilter === item.toLowerCase() }">
              {{ item }}
            </button>

            <p>Фильтр по рейтингу</p>
            <button v-for="(item, index) in ratingFilterOptions" :key="'rating-' + index" @click="selectRatingFilter(item.value)" :class="{ selected: ratingFilter === item.value }">
              {{ item.label }}
            </button>

            <p>Сортировка по рейтингу</p>
            <button v-for="(item, index) in ratingSortOptions" :key="'sort-' + index" @click="selectRatingSort(item.value)" :class="{ selected: ratingSort === item.value }">
              {{ item.label }}
            </button>
          </div>
        </aside>
      </div>

      <!-- Модальное окно для неавторизованных пользователей -->
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
  </body>
</template>

<script>
import axios from "axios";
import ColCardImage from "@/components/img/CollegeCard.png";
import HeartFill from "@/components/icons/heart-fill.png";
import HeartLine from "@/components/icons/heart-line.png";

export default {
  data() {
    return {
      currentPage: this.$route.name,
      ColCardImage,
      HeartFill,
      HeartLine,
      institutions: [],
      filteredInstitutions: [],
      loading: false,
      error: null,
      searchQuery: '',
      grantFilter: '',
      dormitoryFilter: '',
      ratingSort: '',
      ratingFilter: '',
      currentUser: null,
      isSidebarOpen: false,
      showAuthModal: false,
      grantOptions: ['Все', 'Да', 'Нет'],
      dormitoryOptions: ['Все', 'Да', 'Нет'],
      ratingFilterOptions: [
        { label: 'Все рейтинги', value: '' },
        { label: '5 звезд', value: '5' },
        { label: '4+ звезд', value: '4' },
        { label: '3+ звезд', value: '3' },
        { label: '2+ звезд', value: '2' },
        { label: '1+ звезд', value: '1' }
      ],
      ratingSortOptions: [
        { label: 'Сортировка по умолчанию', value: '' },
        { label: 'Сначала высокий', value: 'desc' },
        { label: 'Сначала низкий', value: 'asc' }
      ],
      imageLoaded: {}
    };
  },
  watch: {
    $route(to) {
      this.currentPage = to.name;
    }
  },
  mounted() {
    this.fetchCurrentUser();
    this.fetchInstitutions();
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    selectGrant(value) {
      this.grantFilter = value.toLowerCase() === 'все' ? '' : value.toLowerCase();
      this.filterInstitutions();
    },
    selectDormitory(value) {
      this.dormitoryFilter = value.toLowerCase() === 'все' ? '' : value.toLowerCase();
      this.filterInstitutions();
    },
    selectRatingFilter(value) {
      this.ratingFilter = value;
      this.filterInstitutions();
    },
    selectRatingSort(value) {
      this.ratingSort = value;
      this.sortInstitutions();
    },
    async fetchInstitutions() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get("http://localhost:8000/api/institutions");
        const institutions = response.data.data;
        const likedInstitutions = await this.fetchLikedInstitutions();
        
        this.institutions = institutions.map(inst => ({
          ...inst,
          isLiked: likedInstitutions.some(likedInst => likedInst.id === inst.id) || false,
          isAnimating: false
        }));
        this.filterInstitutions();
      } catch (error) {
        console.error("Ошибка при загрузке учреждений:", error);
        this.error = "Ошибка загрузки данных";
      } finally {
        this.loading = false;
      }
    },
    filterInstitutions() {
      let result = [...this.institutions];
      
      // Filter only colleges
      result = result.filter(inst => inst.type === 'college');
      
      if (this.searchQuery) {
        result = result.filter(inst => inst.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
      }
      if (this.grantFilter) {
        result = result.filter(inst => this.grantFilter === 'да' ? inst.grants : !inst.grants);
      }
      if (this.dormitoryFilter) {
        result = result.filter(inst => this.dormitoryFilter === 'да' ? inst.dormitory : !inst.dormitory);
      }
      if (this.ratingFilter) {
        result = result.filter(inst => Math.round(inst.reviews_avg_rating || 0) >= parseInt(this.ratingFilter));
      }
      this.filteredInstitutions = result;
      this.sortInstitutions();
    },
    sortInstitutions() {
      if (this.ratingSort) {
        this.filteredInstitutions.sort((a, b) => {
          const ratingA = Math.round(a.reviews_avg_rating || 0);
          const ratingB = Math.round(b.reviews_avg_rating || 0);
          return this.ratingSort === 'desc' ? ratingB - ratingA : ratingA - ratingB;
        });
      }
    },
    async fetchLikedInstitutions() {
      try {
        const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
        const response = await axios.get("http://localhost:8000/api/liked-institutions", { headers });
        return response.data;
      } catch (error) {
        console.error("Ошибка при загрузке избранных учреждений:", error);
        return [];
      }
    },
    async toggleLike(institution) {
      if (!localStorage.getItem("token")) {
        this.showAuthModal = true;
        return;
      }

      try {
        const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
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
        console.error("Ошибка при изменении лайка:", error);
      }
    },
    redirectToLogin() {
      this.showAuthModal = false;
      this.$router.push('/login');
    },
    handleScroll() {
      this.isScrolled = window.scrollY > 50;
    },
    async fetchCurrentUser() {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.get("http://localhost:8000/api/current-user", {
            headers: { Authorization: `Bearer ${token}` }
          });
          this.currentUser = response.data;
        } catch (error) {
          console.error("Ошибка при получении данных пользователя:", error);
          this.currentUser = null;
        }
      }
    },
    getImageUrl(url, fallback) {
      if (!url) return fallback;

      if (/^https?:\/\//.test(url)) {
        return url.includes('://localhost/') && !url.includes('://localhost:')
          ? url.replace('://localhost/', '://localhost:8000/')
          : url;
      }

      const base = 'http://localhost:8000';
      const normalised = url.startsWith('/') ? url : `/${url}`;
      return `${base}${normalised}`;
    }
  }
};
</script>

<style scoped>
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

.filter-container {
  position: relative;
}

.sidebar {
  position: fixed;
  right: 0;
  top: 4rem;
  width: 380px;
  background: #fff;
  z-index: 1000;
  transition: transform 0.4s cubic-bezier(0.55, 0, 0.1, 1);
  transform: translateX(100%);
  height: calc(100vh - 4rem);
  border-radius: 12px 0 0 12px;
  box-shadow: -4px 0 10px rgba(0, 0, 0, 0.15);
  padding: 20px;
}

.sidebar.open {
  transform: translateX(0);
}

.sidebar-header h {
  font-size: 1.6rem;
  font-weight: bold;
  margin-bottom: 20px;
}

.sidebar-toggle-button {
  position: fixed;
  top: 50%;
  width: 40px;
  height: 40px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 50% 0 0 50%;
  cursor: pointer;
  z-index: 1001;
  transition: right 0.4s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
}
.sidebar-toggle-button {
  right: 0px;
}

.sidebar-toggle-button.sidebar-open {
  right: 380px;
}

.sidebar-toggle-button img {
  width: 20px;
  height: 20px;
}

.sidebar-nav-filtration {
  margin-top: 20px;
}

.sidebar-nav-filtration p {
  font-size: 1.1rem;
  margin: 15px 0 10px;
  color: #577c8e;
}

.sidebar-nav-filtration button {
  padding: 8px 15px;
  margin: 0 10px 10px 0;
  border: 1px solid #ccc;
  border-radius: 12px;
  background-color: #f0f0f0;
  color: #424242;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sidebar-nav-filtration button.selected {
  background-color: #577c8e;
  color: white;
  font-weight: bold;
}

* {
  box-sizing: border-box;
}

html, body {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

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

.sidebar-active-choice, .sidebar-choice {
  font-size: 1.8rem;
  margin: 0.5rem 0;
  padding: 0.5rem 1rem;
  transition: transform 0.3s, color 0.3s;
  text-decoration: none;
  position: relative;
}

.sidebar-active-choice {
  color: #577c8e;
}

.sidebar-choice {
  color: #919191;
}

.sidebar-choice:hover {
  transform: scale(1.1);
  color: #577c8e;
}

.sidebar-choice.active {
  font-weight: bold;
  color: #577c8e;
}

.active-indicator {
  position: relative;
  left: 225px;
  width: 5px;
  bottom: 46px;
  height: 1.8rem;
  background-color: #577c8e;
  transition: top 0.3s ease-in-out;
  border-radius: 3px;
}

.active-indicator.universities {
  top: 140px;
}

.active-indicator.colleges {
  top: 190px;
}

@media (max-width: 1440px) {
  .active-indicator {
    left: 220px;
    top: 300px;
  }
}

@media (max-width: 1024px) {
  .active-indicator {
    left: 190px;
    top: 300px;
  }
}

@media (max-width: 768px) {
  .active-indicator {
    left: 170px;
    top: 280px;
  }
  
  .active-indicator.universities {
    top: 120px;
  }
  
  .active-indicator.colleges {
    top: 170px;
  }
}

@media (max-width: 480px) {
  .active-indicator {
    left: 150px;
    top: 260px;
  }
  
  .active-indicator.universities {
    top: 100px;
  }
  
  .active-indicator.colleges {
    top: 150px;
  }
}

.main-content {
  flex-grow: 1;
  background-color: #d4e5ed;
  padding: 2rem 5%;
  overflow-y: auto;
  min-height: 100vh;
}

.search-container {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  gap: 0.5rem;
  margin: 2rem 0;
  justify-content: center;
}

.search-container input {
  padding: 0.5rem;
  width: 100%;
  height: 100%;
  max-width: 20rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
}

.search-container button {
  padding: 0.5rem 1rem;
  background-color: #577C8E;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: transform 0.3s ease;
  height: 100%;
  font-size: 1rem;
}

.search-container button:hover {
  transform: scale(1.05);
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  width: 100%;
}

.filters select {
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
  width: 100%;
  max-width: 12rem;
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

.card-info-up h {
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

.hours {
  margin-top: 0 !important;
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

  .sidebar-active-choice, .sidebar-choice {
    font-size: 1.4rem;
    margin: 0.5rem 0;
  }

  .main-content {
    padding: 1rem 2%;
  }

  .search-container {
    margin: 1rem 0;
    flex-direction: column;
    align-items: stretch;
  }

  .search-container input, .filters select {
    max-width: none;
    width: 100%;
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
  .card-info-up h {
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

.image-loader {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #f3f3f3;
}

.spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>