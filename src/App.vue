<template>
  <div>
    <router-view></router-view>
  </div>
  <nav :class="['navbar', isScrolled ? 'bg-body-tertiary' : 'transparent-header', 'fixed-top']">
    <div class="container-fluid">
      <a class="navbar-logo" @click="$router.push('/')">B|B</a>
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
                  <a class="nav-link" @click="$router.push('/Specialties/Universities/GlobalSpecialties')">For Universities</a>
                  <a class="nav-link" @click="$router.push('/Specialties/Colleges')">For Colleges</a>
                </li>
              </h>
            </li>
            <li class="nav-item">
              <h class="nav-link">Студентам
                <li class="nav-item">
                  <a class="nav-link" @click="$router.push('/Universities')">Universities</a>
                  <a class="nav-link" @click="$router.push('/Colleges')">Colleges</a>
                  <a class="nav-link" @click="$router.push('/Map')">Карта учебных заведений</a>
                  <a class="nav-link" @click="$router.push('/Events')">Мероприятия</a>
                  <a class="nav-link" @click="$router.push('/Test')">Профориентационный тест</a>
                </li>
              </h>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>

  <!-- Модальное окно для неавторизованных пользователей -->
  <div class="modal fade" id="authModal" tabindex="-1" aria-labelledby="authModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="authModalLabel">Требуется авторизация</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          Пожалуйста, войдите в аккаунт, чтобы продолжить.
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
          <button type="button" class="btn btn-primary" @click="redirectToLogin">Войти</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap'; // Импортируем Modal из Bootstrap для управления модальными окнами

export default {
  data() {
    return {
      isScrolled: false,
    };
  },
  methods: {
    // Проверка авторизации пользователя
    checkAuth() {
      if (localStorage.getItem('token')) {
        // Если пользователь авторизован, перенаправляем в личный кабинет
        this.$router.push('/User');
      } else {
        // Если не авторизован, показываем модальное окно
        const authModal = new Modal(document.getElementById('authModal'));
        authModal.show();
      }
    },
    // Перенаправление на страницу входа
    redirectToLogin() {
      this.$router.push('/login'); // Убедитесь, что у вас есть маршрут для страницы входа
      const authModal = Modal.getInstance(document.getElementById('authModal'));
      authModal.hide(); // Скрываем модальное окно после перенаправления
    },
    // Обработчик скролла для изменения стиля навигации
    handleScroll() {
      this.isScrolled = window.scrollY > 50;
    },
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
};
</script>

<style>

/* Стили для навигации */
.navbar {
  transition: background-color 0.3s ease;
}
.transparent-header {
  background-color: transparent !important;
}
.bg-body-tertiary {
  background-color: #f8f9fa !important;
}

/* Стили для модального окна */
.modal-content {
  border-radius: 15px;
  border: none;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  background: linear-gradient(145deg, #ffffff, #f0f0f0);
  animation: slideIn 0.3s ease-out;
}

.modal-header {
  border-bottom: none;
  padding: 20px;
  background: linear-gradient(145deg, #ff0202, #ff9900);
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
}

.btn-cancel {
  background-color: #e0e0e0;
  color: #333;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.btn-cancel:hover {
  background-color: #d0d0d0;
}

.btn-login {
  background: linear-gradient(145deg, #6a11cb, #2575fc);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.btn-login:hover {
  background: linear-gradient(145deg, #2575fc, #6a11cb);
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

/* Центрирование модального окна */
.modal-dialog-centered {
  display: flex;
  align-items: center;
  min-height: calc(100% - 1rem);
}

/* Затемнение фона */
.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}

.container-fluid {
  padding: 0 30px 0 30px
}


.nav-item {
  margin-left: 10px;
}

.navbar-logo {
  font-size: 2rem;
  font-weight: bolder;
  color: red;
}

.navbar.bg-body-tertiary {
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.transparent-header {
  background-color: transparent !important;
}

.background-image {
  position: relative;
  background: url('@/components/img/HeadImgFon.png') no-repeat  ;
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
