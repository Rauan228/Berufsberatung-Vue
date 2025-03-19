<template>
  <header class="header fixed-top"></header>

  <div class="events-container">
    <div class="main-content" style="padding: 100px 0 50px 0;">
      <div v-if="loading" class="loader-container">
        <div class="spinner"></div>
      </div>
      <p v-else-if="!filteredEvents || filteredEvents.length === 0">Нет событий для отображения</p>
      <div v-else class="events-list">
        <div v-for="event in filteredEvents" :key="event.id" class="event-card">
          <div class="event-logo">
            <img
              :src="event.institution && event.institution.logo_url ? event.institution.logo_url : require('@/components/img/UnLogo.png')"
              class="event-logo-img"
              :alt="event.institution ? event.institution.name + ' Логотип' : 'Логотип Университета'"
            />
          </div>
          <div class="event-view">
            <h3 class="event-view-text">Университет</h3>
            <p class="event-view-text">{{ getDaysAgo(event.created_at) }}</p>
          </div>
          <div class="event-info">
            <h3 class="event-info-text">{{ event.institution ? event.institution.name : 'Неизвестное учреждение' }}</h3>
            <hr class="event-line" />
            <h3 class="event-info-text">{{ event.event_name }}</h3>
          </div>
          <div class="event-terms">
            <p class="terms-text">{{ formatEventDate(event.event_date) }}</p>
            <div class="event-buttons">
              <button class="more-button" data-bs-toggle="modal" :data-bs-target="'#eventModal' + event.id">Подробнее</button>
              <span v-if="event.isApplied" class="applied-text">Подана</span>
              <button v-else class="apply-button" @click="applyToEvent(event.id)">Записаться</button>
            </div>
          </div>

          <!-- Модальное окно для события -->
          <div class="modal fade" :id="'eventModal' + event.id" tabindex="-1" aria-labelledby="eventModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="eventModalLabel">{{ event.event_name }}</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
                </div>
                <div class="modal-body">
                  <p><strong>Университет:</strong> {{ event.institution ? event.institution.name : 'Неизвестное учреждение' }}</p>
                  <p><strong>Дата:</strong> {{ formatEventDate(event.event_date) }}</p>
                  <p><strong>Описание:</strong> {{ event.description || 'Нет описания' }}</p>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Фильтры в боковой панели справа -->
    <div class="filter-container">
      <button class="sidebar-toggle-button" :class="{ 'sidebar-open': isSidebarOpen }" @click="toggleSidebar">
        <img v-if="isSidebarOpen" src="@/components/img/backArrow.png" alt="Назад" />
        <img v-else src="@/components/img/ForwardArrow.png" alt="Вперед" />
      </button>

      <aside id="sidebar" ref="sidebar" class="sidebar sidebar-default" :class="{ open: isSidebarOpen, scrolled: isScrolled }">
        <div class="sidebar-header">
          <h2>Фильтр событий</h2>
        </div>
        <ul class="nav sidebar-nav">
          <div class="sidebar-nav-filtration">
            <p>Поиск по названию события</p>
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Введите название события..."
              @input="filterEvents"
              class="search-input"
            />

            <p>Университет</p>
            <select v-model="universityFilter" @change="filterEvents">
              <option value="">Все университеты</option>
              <option v-for="institution in filteredInstitutions" :key="institution.id" :value="institution.id">
                {{ institution.name }}
              </option>
            </select>

            <p>Сортировка по дате</p>
            <select v-model="dateSort" @change="sortEvents">
              <option value="">Без сортировки</option>
              <option value="newest">Сначала новые</option>
              <option value="oldest">Сначала старые</option>
            </select>
          </div>
        </ul>
      </aside>
    </div>

    <!-- Модальное окно успешной подачи заявки -->
    <div v-if="showSuccessModal" class="success-modal-overlay">
      <div class="success-modal">
        <h3>Успех!</h3>
        <p>Ваша заявка успешно подана.</p>
        <button class="success-modal-close" @click="closeSuccessModal">ОК</button>
      </div>
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
</template>

<script>
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8000';

export default {
  name: 'EventsPage',
  data() {
    return {
      currentPage: this.$route.name,
      indicatorPosition: 0,
      events: [],
      filteredEvents: [],
      institutions: [],
      filteredInstitutions: [],
      searchQuery: '',
      universityFilter: '',
      dateSort: '',
      isSidebarOpen: false,
      isScrolled: false,
      loading: false,
      showSuccessModal: false,
      currentUser: null,
      showAuthModal: false,
    };
  },
  watch: {
    $route(to) {
      this.currentPage = to.name;
      this.updateIndicator();
    },
  },
  mounted() {
    this.fetchEvents();
    window.addEventListener('scroll', this.handleScroll);
    this.updateIndicator();
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    async fetchEvents() {
      this.loading = true;
      try {
        // Проверяем текущего пользователя, но не прерываем загрузку событий
        await this.fetchCurrentUser();

        // Загружаем события независимо от авторизации
        const eventsResponse = await axios.get('/api/events');
        const eventsData = Array.isArray(eventsResponse.data.data) ? eventsResponse.data.data : eventsResponse.data;

        let appliedEventIds = [];
        if (this.currentUser) {
          try {
            const token = localStorage.getItem('token');
            const applicationsResponse = await axios.get('/api/user-applications', {
              headers: { Authorization: `Bearer ${token}` },
            });
            const applicationsData = applicationsResponse.data.data || applicationsResponse.data || [];
            appliedEventIds = Array.isArray(applicationsData) ? applicationsData.map(app => app.event_id) : [];
          } catch (appError) {
            console.warn('Не удалось загрузить заявки:', appError.response || appError);
          }
        }

        this.events = Array.isArray(eventsData)
          ? eventsData.map(event => ({
              ...event,
              isApplied: appliedEventIds.includes(event.id),
            }))
          : [];
        this.filteredEvents = [...this.events];

        const institutionIds = [...new Set(this.events.map(event => event.institution?.id).filter(id => id))];
        const response = await axios.get('/api/institutions');
        this.institutions = response.data.data || [];
        this.filteredInstitutions = this.institutions.filter(institution =>
          institutionIds.includes(institution.id)
        );

        this.filterEvents();
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error.response || error);
        this.events = [];
        this.filteredEvents = [];
        this.filteredInstitutions = [];
      } finally {
        this.loading = false;
      }
    },

    async applyToEvent(eventId) {
      // Проверяем авторизацию перед записью
      if (!this.currentUser) {
        this.showAuthModal = true;
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          '/api/user-applications',
          { event_id: eventId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        this.showSuccessModal = true;
        this.events = this.events.map(event =>
          event.id === eventId ? { ...event, isApplied: true } : event
        );
        this.filteredEvents = this.filteredEvents.map(event =>
          event.id === eventId ? { ...event, isApplied: true } : event
        );
      } catch (error) {
        console.error('Ошибка при подаче заявки:', error.response || error);
        if (error.response?.status === 500) {
          alert('Ошибка на сервере. Пожалуйста, попробуйте позже.');
        } else {
          alert('Ошибка при подаче заявки. Возможно, вы уже подали заявку на это событие.');
        }
      }
    },

    async fetchCurrentUser() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.currentUser = null;
          return;
        }
        const response = await axios.get('/api/current-user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.currentUser = response.data;
      } catch (error) {
        console.error('Ошибка авторизации:', error);
        this.currentUser = null;
      }
    },

    redirectToLogin() {
      this.$router.push('/login');
      this.showAuthModal = false;
    },

    closeSuccessModal() {
      this.showSuccessModal = false;
    },

    getDaysAgo(createdAt) {
      const eventDate = new Date(createdAt);
      const currentDate = new Date();
      const diffTime = Math.abs(currentDate - eventDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `Добавлено ${diffDays} дней назад`;
    },

    formatEventDate(eventDate) {
      const date = new Date(eventDate);
      const day = date.getDate();
      const monthNames = [
        'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
        'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
      ];
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    },

    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },

    handleScroll() {
      this.isScrolled = window.scrollY > 50;
    },

    filterEvents() {
      let result = [...this.events];

      if (this.searchQuery) {
        result = result.filter(event =>
          event.event_name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }

      if (this.universityFilter) {
        result = result.filter(event =>
          event.institution && event.institution.id === parseInt(this.universityFilter)
        );
      }

      this.filteredEvents = result;
      this.sortEvents();
    },

    sortEvents() {
      if (this.dateSort) {
        this.filteredEvents.sort((a, b) => {
          const dateA = new Date(a.event_date);
          const dateB = new Date(b.event_date);
          return this.dateSort === 'newest' ? dateB - dateA : dateA - dateB;
        });
      }
    },

    updateIndicator() {
      this.indicatorPosition = this.currentPage === 'Events' ? 130 : 263;
    },
  },
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
  display: flex !important; 
  justify-content: space-between !important;
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
/* Лоадер */
.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 999;
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
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

/* Базовые стили */
* {
  box-sizing: border-box;
}

html,
body {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

.events-container {
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
}

/* Основной контент */
.main-content {
  flex-grow: 1;
  background-color: #d4e5ed;
  padding: 2rem 5%;
  overflow-y: auto;
  min-height: 100vh;
}

.events-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.event-card {
  width: 330px;
  height: 400px;
  background-color: #536274;
  padding: 20px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.event-logo-img {
  width: 50px;
  height: 50px;
  background-color: white;
  border-radius: 12px;
  padding: 5px;
  object-fit: contain;
}

.event-view {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
}

.event-view-text {
  color: #cdcccc;
  margin: 0;
  font-size: 14px;
}

.event-info {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.event-info-text {
  color: white;
  margin: 0;
  font-size: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.event-line {
  border: 1px solid #10222e;
  margin: 10px 0;
}

.event-terms {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}

.terms-text {
  color: #cdcccc;
  margin: 0;
  font-size: 14px;
}

.event-buttons {
  display: flex;
  gap: 10px;
}

.more-button,
.apply-button {
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  transition: transform 0.2s ease;
}

.more-button {
  background-color: #10222e;
  color: white;
}

.apply-button {
  background-color: #4fa300;
  color: white;
}

.more-button:hover,
.apply-button:hover {
  transform: scale(1.05);
}

.applied-text {
  color: red;
  font-weight: bold;
  font-size: 14px;
  padding: 8px 16px;
}

/* Правая боковая панель с фильтрами */
.filter-container {
  position: relative;
}

.sidebar {
  position: fixed;
  right: 0;
  top: 4rem;
  width: 300px;
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

.sidebar.scrolled {
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
}

.sidebar-header h2 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}

.sidebar-nav-filtration {
  margin-top: 20px;
}

.sidebar-nav-filtration p {
  font-size: 1rem;
  color: #424242;
  margin-bottom: 10px;
}

.sidebar-nav-filtration input.search-input {
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
  width: 100%;
  max-width: 260px;
  margin-bottom: 15px;
}

.sidebar-nav-filtration select {
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
  width: 100%;
  max-width: 260px;
  margin-bottom: 15px;
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
  right: 0;
}

.sidebar-toggle-button.sidebar-open {
  right: 300px;
  /* Ширина sidebar */
}

.sidebar-toggle-button img {
  width: 20px;
  height: 20px;
}

/* Модальное окно события */
.modal-dialog-centered {
  display: flex;
  align-items: center;
  min-height: calc(100% - 1rem);
}

.modal-content {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.modal-header {
  background-color: #536274;
  color: white;
  border-bottom: none;
}

.modal-title {
  font-size: 1.5rem;
}

.modal-body {
  padding: 20px;
}

.modal-body p {
  margin: 10px 0;
  font-size: 1rem;
}

.modal-footer {
  border-top: none;
  justify-content: center;
}

/* .btn-secondary {
  background-color: #577c8e;
  border: none;
}

.btn-secondary:hover {
  background-color: #466b7a;
} */

/* Модальное окно успеха */
.success-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.success-modal {
  background-color: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
  width: 300px;
}

.success-modal h3 {
  color: #4fa300;
  margin-bottom: 15px;
  font-size: 1.5rem;
}

.success-modal p {
  color: #333;
  margin-bottom: 20px;
  font-size: 1rem;
}

.success-modal-close {
  padding: 8px 20px;
  background-color: #577c8e;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.success-modal-close:hover {
  background-color: #466b7a;
}

/* Медиа-запросы */
@media (max-width: 1024px) {
  .event-card {
    width: 300px;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 1rem 2%;
  }

  .event-card {
    width: 100%;
    max-width: 330px;
  }

  .sidebar {
    width: 250px;
  }

  .sidebar-toggle-button.sidebar-open {
    right: 250px;
    /* Соответствует ширине sidebar */
  }
}

@media (max-width: 480px) {
  .event-card {
    height: auto;
    padding: 15px;
  }

  .event-info-text {
    font-size: 16px;
  }

  .more-button,
  .apply-button {
    padding: 6px 12px;
    font-size: 12px;
  }
}
</style>