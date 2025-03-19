<template>
  <div>
    <router-view></router-view>
  </div>
  <nav :class="['navbar', isScrolled ? 'bg-body-tertiary' : 'transparent-header', 'fixed-top']">
    <div class="container-fluid">
      <a class="navbar-logo" @click="$router.push('/')"><img src="C:\Users\Рауан\coding\Berufsberatung-Vue-main\src\components\icons\B_B.png" alt="logo" style="width: 35px; height: 35px;"></a>
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
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Требуется авторизация</h5>
      </div>
      <div class="modal-body">
        Пожалуйста, войдите в аккаунт, чтобы продолжить.
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" @click="showAuthModal = false">Отмена</button>
        <button type="button" class="btn btn-primary" style="background-color: #10222E;" @click="redirectToLogin">Войти</button>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal, Offcanvas } from 'bootstrap'; // Импортируем Offcanvas для управления сайдбаром

export default {
  data() {
    return {
      isScrolled: false,
      offcanvasInstance: null, // Экземпляр Offcanvas
      showAuthModal: false, // Управление видимостью модального окна
    };
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
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
    this.initializeOffcanvas(); // Инициализируем Offcanvas при монтировании
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    document.removeEventListener('click', this.handleOutsideClick); // Очищаем слушатель кликов
  },
};
</script>

<style scoped>
/* Стили для модального окна */
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
  transition: 0.3s;
  background: #3977a1;
}

/* Анимация появления модального окна */
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
