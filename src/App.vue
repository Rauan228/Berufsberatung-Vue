<template>
  <div>
    <router-view></router-view>
    <ToastNotifications />
  </div>
  <nav v-if="!isInstitutionPage" :class="['tp-navbar', { scrolled: isScrolled, 'menu-open': menuOpen }]">
    <div class="tp-nav-inner">
      <a class="tp-logo" @click="go('/')">
        <img src="/torap-logo.png" alt="Torap">
      </a>
    </div>

    <button
      class="tp-burger"
      :class="{ active: menuOpen }"
      type="button"
      :aria-label="menuOpen ? 'Закрыть меню' : 'Открыть меню'"
      :aria-expanded="menuOpen ? 'true' : 'false'"
      @click="toggleMenu"
    >
      <span class="tp-burger-box">
        <span class="tp-burger-line"></span>
        <span class="tp-burger-line"></span>
        <span class="tp-burger-line"></span>
      </span>
    </button>

    <!-- Затемнение фона -->
    <transition name="tp-fade">
      <div v-if="menuOpen" class="tp-backdrop" @click="closeMenu"></div>
    </transition>

    <!-- Выезжающая панель -->
    <transition name="tp-slide">
      <aside v-if="menuOpen" class="tp-panel">
        <div class="tp-panel-head">
          <img src="/torap-logo.png" alt="Torap" class="tp-panel-logo">
        </div>

        <div class="tp-panel-body">
          <a class="tp-account" @click="checkAuth">
            <span class="tp-account-ico"><i class="bi bi-person-fill"></i></span>
            <span class="tp-account-label">Личный кабинет</span>
            <i class="bi bi-chevron-right tp-chevron"></i>
          </a>

          <div class="tp-group">
            <span class="tp-group-title">Специальности</span>
            <a class="tp-link" @click="go('/Specialties/Universities/GlobalSpecialties')">
              <span class="tp-ico"><i class="bi bi-mortarboard-fill"></i></span>
              Университетов
            </a>
            <a class="tp-link" @click="go('/Specialties/Colleges')">
              <span class="tp-ico"><i class="bi bi-journal-bookmark-fill"></i></span>
              Колледжей
            </a>
          </div>

          <div class="tp-group">
            <span class="tp-group-title">Студентам</span>
            <a class="tp-link" @click="go('/Universities')">
              <span class="tp-ico"><i class="bi bi-buildings-fill"></i></span>
              Университеты
            </a>
            <a class="tp-link" @click="go('/Colleges')">
              <span class="tp-ico"><i class="bi bi-bank2"></i></span>
              Колледжи
            </a>
            <a class="tp-link" @click="go('/Map')">
              <span class="tp-ico"><i class="bi bi-geo-alt-fill"></i></span>
              Карта учебных заведений
            </a>
            <a class="tp-link" @click="go('/Events')">
              <span class="tp-ico"><i class="bi bi-calendar2-event-fill"></i></span>
              Мероприятия
            </a>
            <a class="tp-link" @click="go('/Test')">
              <span class="tp-ico"><i class="bi bi-clipboard2-check-fill"></i></span>
              Профориентационный тест
            </a>
          </div>
        </div>
      </aside>
    </transition>
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
import axios from 'axios';
import ToastNotifications from '@/components/ToastNotifications.vue';
import { notificationsStore } from '@/store/notificationsStore';

export default {
  components: { ToastNotifications },
  data() {
    return {
      isScrolled: false,
      menuOpen: false,
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
  watch: {
    menuOpen(open) {
      this.setScrollLock(open);
    },
    // Закрываем меню при смене маршрута
    $route() {
      this.closeMenu();
    },
  },
  methods: {
    /**
     * Блокирует фон при открытом меню.
     * Компенсируем ширину scrollbar, чтобы страница не дёргалась.
     * Важно: всегда полностью снимаем стили при unlock — иначе скролл «залипает».
     */
    setScrollLock(lock) {
      const body = document.body;
      const html = document.documentElement;
      if (lock) {
        const sbw = Math.max(0, window.innerWidth - html.clientWidth);
        this._lockScrollY = window.scrollY || 0;
        html.style.setProperty('--tp-sbw', `${sbw}px`);
        body.style.overflow = 'hidden';
        body.style.paddingRight = sbw ? `${sbw}px` : '';
      } else {
        body.style.removeProperty('overflow');
        body.style.removeProperty('padding-right');
        html.style.setProperty('--tp-sbw', '0px');
        // на всякий: если overflow остался inline — снести
        if (body.style.overflow === 'hidden') body.style.overflow = '';
      }
    },
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
    closeMenu() {
      this.menuOpen = false;
      // сразу снимаем lock (не только через watcher)
      this.setScrollLock(false);
    },
    // Навигация с закрытием меню
    go(path) {
      this.closeMenu();
      if (this.$route.path !== path) this.$router.push(path);
    },
    // Проверка авторизации пользователя
    checkAuth() {
      this.closeMenu();
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
    closeModal() {
      this.showAuthModal = false;
    },
    // Обработчик скролла для изменения стиля навигации
    handleScroll() {
      this.isScrolled = window.scrollY > 50;
    },
    // Закрытие меню по Escape
    handleKeydown(e) {
      if (e.key === 'Escape') this.closeMenu();
    },
    hasValidToken() {
      const token = localStorage.getItem('token');
      if (!token || token === 'null' || token === 'undefined' || token.length < 8) {
        localStorage.removeItem('token');
        return false;
      }
      return true;
    },
    stopNotifPolling() {
      if (this.notifTimer) {
        clearInterval(this.notifTimer);
        this.notifTimer = null;
      }
    },
    async fetchNotifications() {
      if (!this.hasValidToken()) {
        this.stopNotifPolling();
        return;
      }
      try {
        const { data } = await axios.get('http://localhost:8000/api/notifications', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          validateStatus: (s) => s >= 200 && s < 300,
        });
        notificationsStore.addNotifications(Array.isArray(data) ? data : data.data || []);
      } catch (e) {
        const status = e?.response?.status;
        // 401/403 — гость или просроченный токен: тихо выходим, без console.warn
        if (status === 401 || status === 403) {
          localStorage.removeItem('token');
          this.stopNotifPolling();
        }
      }
    },
  },
  mounted() {
    // сбрасываем возможный «залипший» overflow после HMR / прошлого lock
    this.setScrollLock(false);
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('keydown', this.handleKeydown);
    // уведомления только для реально авторизованных
    if (this.hasValidToken()) {
      this.fetchNotifications();
      this.notifTimer = setInterval(this.fetchNotifications, 30000);
    }
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('keydown', this.handleKeydown);
    this.setScrollLock(false);
    if (this.notifTimer) clearInterval(this.notifTimer);
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
  background-color: #1795c0;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.btn-check:hover {
  background-color: #12799c;
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
  background-color: #1795c0;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 0;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.btn-login:hover {
  background-color: #12799c;
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

/* ==================== Навбар Torap ==================== */
.tp-navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  /* при lock скролла компенсируем исчезнувший scrollbar, чтобы fixed-хедер не прыгал */
  padding-right: var(--tp-sbw, 0px);
  box-sizing: border-box;
  z-index: 1050;
  transition: background-color 0.3s ease, box-shadow 0.3s ease, backdrop-filter 0.3s ease;
}

/* Убираем глобальные стили ссылок внутри навбара/панели */
.tp-navbar a,
.tp-panel a {
  text-decoration: none;
  padding: initial;
  transition: inherit;
}
/* Не трогаем .tp-account — у него свой hover (золотой контур) */
.tp-navbar a:not(.tp-account):hover,
.tp-panel a:not(.tp-account):hover {
  background: none;
  transform: none;
}

.tp-nav-inner {
  max-width: 1240px;
  margin: 0 auto;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Прозрачный поверх hero + лёгкое затемнение для читаемости бургера */
.tp-navbar:not(.scrolled) {
  background: linear-gradient(to bottom, rgba(4, 22, 32, 0.55), rgba(4, 22, 32, 0));
}

/* После скролла — светлая плашка */
.tp-navbar.scrolled {
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 20px rgba(16, 34, 46, 0.08);
}

/* Когда меню открыто — фон навбара нейтральный (панель поверх) */
.tp-navbar.menu-open:not(.scrolled) {
  background: transparent;
}

.tp-logo {
  display: flex;
  align-items: center;
  cursor: pointer;
  line-height: 0;
}

.tp-logo img {
  width: 118px;
  height: auto;
  transition: filter 0.3s ease;
}

/* На прозрачном тёмном хедере логотип светлый */
.tp-navbar:not(.scrolled) .tp-logo img {
  filter: brightness(0) invert(1);
}

/* ===== Анимированный бургер → крестик ===== */
/* Фиксирован к правому краю окна, поэтому в открытом виде крестик
   попадает ровно в угол выезжающей панели, а не на текст «Меню». */
.tp-burger {
  --burger-color: #10222e;
  position: fixed;
  top: 14px;
  /* + scrollbar, иначе бургер/крестик прыгает влево при open */
  right: calc(24px + var(--tp-sbw, 0px));
  background: transparent;
  border: none;
  padding: 8px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  transition: background-color 0.2s ease;
  z-index: 1300; /* выше панели (1200) — крестик всегда сверху и кликабелен */
}

.tp-burger:hover {
  background: rgba(23, 149, 192, 0.12);
}

/* На прозрачном хедере полоски белые */
.tp-navbar:not(.scrolled):not(.menu-open) .tp-burger {
  --burger-color: #ffffff;
}

.tp-burger-box {
  position: relative;
  width: 28px;
  height: 20px;
  display: block;
}

.tp-burger-line {
  position: absolute;
  left: 0;
  width: 100%;
  height: 2.5px;
  border-radius: 3px;
  background: var(--burger-color);
  transition: transform 0.35s cubic-bezier(0.68, -0.3, 0.32, 1.3),
    opacity 0.2s ease, background-color 0.3s ease, width 0.35s ease;
}

.tp-burger-line:nth-child(1) { top: 0; }
.tp-burger-line:nth-child(2) { top: 50%; transform: translateY(-50%); }
.tp-burger-line:nth-child(3) { bottom: 0; }

/* Активное состояние: верхняя и нижняя сходятся в X, средняя исчезает */
.tp-burger.active {
  --burger-color: #10222e;
}

.tp-burger.active .tp-burger-line:nth-child(1) {
  top: 50%;
  transform: translateY(-50%) rotate(45deg);
}

.tp-burger.active .tp-burger-line:nth-child(2) {
  opacity: 0;
  transform: translateY(-50%) scaleX(0);
}

.tp-burger.active .tp-burger-line:nth-child(3) {
  bottom: auto;
  top: 50%;
  transform: translateY(-50%) rotate(-45deg);
}

/* ===== Затемнение фона ===== */
.tp-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(4, 22, 32, 0.5);
  z-index: 1100;
}

/* ===== Выезжающая панель ===== */
.tp-panel {
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  height: 100dvh;
  width: 340px;
  max-width: 86vw;
  background: #ffffff;
  z-index: 1200;
  display: flex;
  flex-direction: column;
  box-shadow: -12px 0 40px rgba(16, 34, 46, 0.18);
}

.tp-panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 22px;
  border-bottom: 1px solid #eef2f5;
}

.tp-panel-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: #10222e;
}

.tp-panel-logo {
  width: 96px;
  height: auto;
  display: block;
}

.tp-panel-close {
  background: transparent;
  border: none;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  color: #10222e;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.tp-panel-close:hover {
  background: rgba(23, 149, 192, 0.12);
  color: var(--torap-blue, #1795c0);
}

.tp-panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 14px 28px;
}

/* Личный кабинет — акцентный блок */
.tp-account {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  margin-bottom: 18px;
  border-radius: 14px;
  background: linear-gradient(120deg, #10222e, #14384a);
  color: #fff;
  cursor: pointer;
  will-change: transform;
  transition:
    transform 0.4s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

.tp-account:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 22px rgba(16, 34, 46, 0.22);
}

.tp-account-ico {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  flex: 0 0 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--torap-gold-bright, #d4af37), var(--torap-gold, #b08d4f));
  box-shadow: 0 4px 12px rgba(176, 141, 79, 0.35);
}

.tp-account-ico i {
  font-size: 1.45rem;
  color: #fff;
}

.tp-account-label {
  font-weight: 600;
  flex: 1;
  font-size: 1.02rem;
}

.tp-chevron {
  font-size: 0.85rem;
  opacity: 0.7;
}

/* Группы ссылок */
.tp-group {
  margin-bottom: 20px;
}

.tp-group-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--torap-gold, #b08d4f);
  padding: 0 12px;
  margin-bottom: 8px;
}

/* Тонкая золотая линия после заголовка группы */
.tp-group-title::after {
  content: '';
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, rgba(176, 141, 79, 0.3), transparent);
}

.tp-link {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 12px;
  margin-bottom: 4px;
  border-radius: 14px;
  color: #2b3d47;
  font-size: 1.04rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease, transform 0.15s ease;
}

/* Иконка в цветной плитке */
.tp-ico {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  flex: 0 0 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(23, 149, 192, 0.14), rgba(23, 149, 192, 0.07));
  box-shadow: inset 0 0 0 1px rgba(23, 149, 192, 0.12);
  transition: background 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.tp-ico i {
  font-size: 1.3rem;
  line-height: 1;
  color: var(--torap-blue, #1795c0);
  transition: color 0.2s ease;
}

.tp-link:hover {
  background: rgba(23, 149, 192, 0.08);
  color: var(--torap-blue-dark, #12799c);
  transform: translateX(3px);
}

.tp-link:hover .tp-ico {
  background: linear-gradient(135deg, var(--torap-blue, #1795c0), var(--torap-blue-dark, #12799c));
  box-shadow: 0 6px 14px rgba(23, 149, 192, 0.35);
  transform: scale(1.05);
}

.tp-link:hover .tp-ico i {
  color: #fff;
}

/* ===== Переходы ===== */
.tp-fade-enter-active,
.tp-fade-leave-active {
  transition: opacity 0.3s ease;
}
.tp-fade-enter-from,
.tp-fade-leave-to {
  opacity: 0;
}

.tp-slide-enter-active,
.tp-slide-leave-active {
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.tp-slide-enter-from,
.tp-slide-leave-to {
  transform: translateX(100%);
}

/* ===== Адаптив ===== */
@media (max-width: 575px) {
  .tp-nav-inner {
    padding: 10px 16px;
  }
  .tp-logo img {
    width: 100px;
  }
  .tp-burger {
    top: 12px;
    right: 14px;
  }
  .tp-panel {
    width: 320px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .tp-burger-line,
  .tp-slide-enter-active,
  .tp-slide-leave-active,
  .tp-fade-enter-active,
  .tp-fade-leave-active {
    transition-duration: 0.01ms;
  }
}
</style>
