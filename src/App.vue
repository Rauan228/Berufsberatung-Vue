<template>
  <div>
    <router-view></router-view>
    <ToastNotifications />
  </div>
  <nav v-if="!isInstitutionPage" :class="['navbar', isScrolled ? 'bg-body-tertiary' : 'transparent-header', 'fixed-top']">
    <div class="container-fluid">
      <a class="navbar-logo" @click="$router.push('/')"><img src="C:\Users\Рауан\coding\Berufsberatung-Vue-main\public\B_B.png" alt="" style="width: 50px;"></a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasNavbar"
        aria-controls="offcanvasNavbar"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div
        class="offcanvas offcanvas-end"
        tabindex="-1"
        id="offcanvasNavbar"
        aria-labelledby="offcanvasNavbarLabel"
        ref="offcanvasNavbar"
      >
        <div class="offcanvas-header">
          <h5 class="offcanvas-title" id="offcanvasNavbarLabel">Меню</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div class="offcanvas-body">
          <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
            <li class="nav-item">
              <a class="nav-link" @click="checkAuth">Личный кабинет</a>
            </li>
            <li class="nav-item">
              <h class="nav-link">Специальности
                <li class="nav-item">
                  <a class="nav-link" @click="$router.push('/Specialties/Universities/GlobalSpecialties')">Университетов</a>
                  <a class="nav-link" @click="$router.push('/Specialties/Colleges')">Колледжей</a>
                </li>
              </h>
            </li>
            <li class="nav-item">
              <h class="nav-link">Студентам
                <li class="nav-item">
                  <a class="nav-link" @click="$router.push('/Universities')">Университеты</a>
                  <a class="nav-link" @click="$router.push('/Colleges')">Колледжи</a>
                  <a class="nav-link" @click="$router.push('/Map')">Карта учебных заведений</a>
                  <a class="nav-link" @click="$router.push('/Events')">Мероприятия</a>
                  <a class="nav-link" @click="$router.push('/Test')">Профориентационный тест</a>
                  <a class="nav-link" @click="$router.push('/UniversityPortal')">Для Университетов</a>
                </li>
              </h>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>

  <!-- Модальное окно для неавторизованных пользователей -->
  <div v-if="showAuthModal" class="modal-overlay">
      <!-- Обёртка для клика по пустому пространству (закрывает) -->
      <div class="modal-wrapper" @click.self="closeModal">
        <div class="modal-container">
          <!-- Верхняя тёмная секция с изображением -->
          <div class="modal-header">
            <img
              src="@/components/img/auth-image.png"
              alt="Auth Illustration"
              class="header-img"
            />
          </div>

          <!-- Нижняя белая карточка -->
          <div class="modal-body">
            <h2>Требуется авторизация</h2>
            <p>Пожалуйста, войдите в аккаунт, чтобы продолжить.</p>
            <div class="buttons-row">
              <button class="btn-cancel" @click="showAuthModal">
                Отмена
              </button>
              <button class="btn-login" @click="redirectToLogin">
                Войти
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

</template>

<script>
import { Modal, Offcanvas } from 'bootstrap'; // Импортируем Offcanvas для управления сайдбаром
import axios from 'axios';
import ToastNotifications from '@/components/ToastNotifications.vue';
import { notificationsStore } from '@/store/notificationsStore';

export default {
  components: { ToastNotifications },
  data() {
    return {
      isScrolled: false,
      offcanvasInstance: null,
      showAuthModal: false,
      notifTimer: null,
    };
  },
  computed: {
    // Проверяем, находится ли пользователь на странице института
    isInstitutionPage() {
      return this.$route.path.startsWith('/InctitutionsMain');
    },
  },
  methods: {
    // Проверка авторизации пользователя
    checkAuth() {
      if (localStorage.getItem('token')) {
        this.$router.push('/User');
      } else {
        this.showAuthModal = true; // Показываем модальное окно
      }
    },
    // Перенаправление на страницу входа
    redirectToLogin() {
      this.$router.push('/login');
      this.showAuthModal = false; // Закрываем модальное окно
    },
    // Обработчик скролла для изменения стиля навигации
    handleScroll() {
      this.isScrolled = window.scrollY > 50;
    },
    // Закрытие сайдбара при клике вне его
    handleOutsideClick(event) {
      const offcanvasElement = this.$refs.offcanvasNavbar;
      if (this.offcanvasInstance && offcanvasElement && !offcanvasElement.contains(event.target)) {
        this.offcanvasInstance.hide(); // Закрываем сайдбар
      }
    },
    // Инициализация Offcanvas
    initializeOffcanvas() {
      const offcanvasElement = this.$refs.offcanvasNavbar;
      if (offcanvasElement) {
        this.offcanvasInstance = new Offcanvas(offcanvasElement);
        // Добавляем слушатель события открытия для управления кликами
        offcanvasElement.addEventListener('shown.bs.offcanvas', () => {
          document.addEventListener('click', this.handleOutsideClick);
        });
        // Удаляем слушатель при закрытии
        offcanvasElement.addEventListener('hidden.bs.offcanvas', () => {
          document.removeEventListener('click', this.handleOutsideClick);
        });
      }
    },
    async fetchNotifications(){
      const token = localStorage.getItem('token');
      if(!token) return;
      try{
        const { data } = await axios.get('http://localhost:8000/api/notifications',{
          headers:{ Authorization:`Bearer ${token}` }
        });
        notificationsStore.addNotifications(Array.isArray(data)?data:data.data||[]);
      }catch(e){ console.warn('notif fetch error'); }
    },
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
    this.initializeOffcanvas(); // Инициализируем Offcanvas при монтировании
    this.fetchNotifications();
    this.notifTimer = setInterval(this.fetchNotifications, 30000);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    document.removeEventListener('click', this.handleOutsideClick); // Очищаем слушатель кликов
    if(this.notifTimer) clearInterval(this.notifTimer);
  },
};
</script>

<style scoped>
.auth-check-container {
  padding: 40px;
  text-align: center;
}

.btn-check {
  padding: 10px 24px;
  font-size: 16px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.btn-check:hover {
  background-color: #3a78c2;
}


.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-wrapper {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-container {
  width: 510px;
  border-radius: 12px;
  animation: fadeIn 0.3s ease;
  display: flex;
  flex-direction: column;

  justify-content: center;
  align-items: center;
}

.modal-header {
  background-color: #333;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 160px;
  position: relative;
  width: 70%;
  border-radius: 12px;
}

.header-img {
  max-height: 120%;
  object-fit: cover;
}

.modal-body {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 56px 20px 20px;
  text-align: center;
  transform: translateY(-20px);
}

.modal-body h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #333333;
}

/* Параграф с текстом */
.modal-body p {
  margin: 8px 0 20px;
  font-size: 14px;
  color: #555555;
  line-height: 1.4;
}

/* Ряд с кнопками */
.buttons-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

/* Кнопка «Отмена» */
.btn-cancel {
  flex: 1;
  background-color: #eeeeee;
  color: #555555;
  border: none;
  border-radius: 8px;
  padding: 10px 0;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.btn-cancel:hover {
  background-color: #dddddd;
}

/* Кнопка «Войти» */
.btn-login {
  flex: 1;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 0;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.btn-login:hover {
  background-color: #3a78c2;
}

/* Анимация появления */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Остальные стили */
.navbar {
  transition: background-color 0.3s ease;
}
.transparent-header {
  background-color: transparent !important;
}
.bg-body-tertiary {
  background-color: #f8f9fa !important;
}

.container-fluid {
  padding: 0 30px;
}

.nav-item {
  margin-left: 10px;
}

.navbar-logo {
  font-size: 2rem;
  font-weight: bolder;
  color: red;
  cursor: pointer;
}

.navbar.bg-body-tertiary {
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.transparent-header {
  background-color: transparent !important;
}

.background-image {
  position: relative;
  background: url('@/components/img/HeadImgFon.png') no-repeat;
  background-size: cover;
  height: 95vh;
  width: 100%;
  margin-top: 4.5%;
}

.background-image-dark-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1;
}

.background-image-content {
  position: relative;
  z-index: 2;
  top: 10%;
  left: 7%;
  width: 90%;
}
</style>
