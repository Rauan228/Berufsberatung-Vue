<template>
  <div class="landing">

    <!-- ===== Hero ===== -->
    <header class="hero">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1 class="hero-title">
          Найди своё будущее<br>с <span class="accent-gold">Torap</span>
        </h1>
        <p class="hero-subtitle">
          Профориентационный тест, каталог университетов и колледжей,
          специальности, гранты, мероприятия и подача заявок — всё для
          осознанного выбора профессии на одной платформе.
        </p>
        <div class="hero-actions">
          <button class="btn-hero-primary" @click="$router.push('/Test')">
            Пройти тест
          </button>
          <button class="btn-hero-secondary" @click="$router.push('/Universities')">
            Смотреть вузы
          </button>
        </div>
        <div class="hero-stats">
          <div class="stat">
            <span class="stat-value" :class="{ 'is-counting': !statsLoaded }">{{ displayStats.universities }}</span>
            <span class="stat-label">университетов</span>
          </div>
          <div class="stat">
            <span class="stat-value" :class="{ 'is-counting': !statsLoaded }">{{ displayStats.colleges }}</span>
            <span class="stat-label">колледжей</span>
          </div>
          <div class="stat">
            <span class="stat-value" :class="{ 'is-counting': !statsLoaded }">{{ displayStats.directions }}+</span>
            <span class="stat-label">направлений</span>
          </div>
        </div>
      </div>
    </header>

    <!-- ===== Возможности платформы ===== -->
    <section class="section fade-in">
      <div class="section-head">
        <span class="section-eyebrow">Возможности</span>
        <h2>Что умеет Torap</h2>
        <p>Полный путь абитуриента — от «кем я хочу стать» до поданной заявки</p>
      </div>
      <div class="features-grid">
        <div class="feature-card" v-for="f in features" :key="f.title" @click="$router.push(f.route)">
          <div class="feature-icon"><i :class="f.icon"></i></div>
          <h3>{{ f.title }}</h3>
          <p>{{ f.text }}</p>
          <span class="feature-link">Перейти <i class="bi bi-arrow-right"></i></span>
        </div>
      </div>
    </section>

    <!-- ===== Как это работает + футер — один блок, одна анимация ===== -->
    <div class="bottom-block fade-in">
      <section class="section section-dark">
        <div class="section-head">
          <span class="section-eyebrow">Процесс</span>
          <h2>Как это работает</h2>
          <p>Четыре шага к правильному выбору</p>
        </div>
        <div class="steps-grid">
          <div class="step" v-for="(s, i) in steps" :key="s.title">
            <div class="step-num">{{ i + 1 }}</div>
            <h3>{{ s.title }}</h3>
            <p>{{ s.text }}</p>
          </div>
        </div>
      </section>

      <footer class="footer">
        <div class="footer-inner">
          <div class="footer-brand">
            <img src="/torap-logo.png" alt="Torap" class="footer-logo">
            <p>Платформа профориентации и поступления</p>
          </div>
          <nav class="footer-nav">
            <a @click.prevent="$router.push('/Test')" href="/Test">Тест</a>
            <a @click.prevent="$router.push('/Universities')" href="/Universities">Университеты</a>
            <a @click.prevent="$router.push('/Colleges')" href="/Colleges">Колледжи</a>
            <a @click.prevent="$router.push('/Map')" href="/Map">Карта</a>
            <a @click.prevent="$router.push('/Events')" href="/Events">Мероприятия</a>
          </nav>
        </div>
        <div class="footer-bottom">© {{ new Date().getFullYear() }} Torap</div>
      </footer>
    </div>

  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'MainPage',
  data() {
    return {
      observer: null,
      statsLoaded: false,
      displayStats: {
        universities: 0,
        colleges: 0,
        directions: 0,
      },
      stats: {
        institutions: 0,
        universities: 0,
        colleges: 0,
        directions: 0,
      },
      _idleTimer: null,
      _animFrames: {},
      features: [
        {
          icon: 'bi bi-clipboard-check',
          title: 'Профориентационный тест',
          text: 'Ответь на вопросы и получи рекомендации по профессиям, основанные на твоих интересах и сильных сторонах.',
          route: '/Test',
        },
        {
          icon: 'bi bi-mortarboard',
          title: 'Университеты',
          text: 'Каталог вузов Казахстана: программы, стоимость, гранты, отзывы студентов и рейтинги.',
          route: '/Universities',
        },
        {
          icon: 'bi bi-building',
          title: 'Колледжи',
          text: 'Колледжи и их квалификации — если хочешь получить профессию быстрее.',
          route: '/Colleges',
        },
        {
          icon: 'bi bi-journal-bookmark',
          title: 'Специальности',
          text: 'Подробно о каждом направлении: чем занимаются, какие предметы сдавать, где учиться.',
          route: '/Specialties/Universities/GlobalSpecialties',
        },
        {
          icon: 'bi bi-geo-alt',
          title: 'Карта заведений',
          text: 'Все университеты и колледжи на интерактивной карте — ищи рядом с домом.',
          route: '/Map',
        },
        {
          icon: 'bi bi-calendar-event',
          title: 'Мероприятия',
          text: 'Дни открытых дверей, олимпиады и ярмарки — записывайся и получай билет онлайн.',
          route: '/Events',
        },
      ],
      steps: [
        {
          title: 'Пройди тест',
          text: 'Узнай, какие профессии подходят именно тебе.',
        },
        {
          title: 'Изучи направления',
          text: 'Посмотри специальности, предметы и перспективы.',
        },
        {
          title: 'Сравни заведения',
          text: 'Отзывы, гранты, стоимость и расположение на карте.',
        },
        {
          title: 'Подай заявку',
          text: 'Отправь заявку в выбранный вуз или колледж онлайн.',
        },
      ],
    };
  },
  mounted() {
    // если lock сайдбара залип — снять, иначе страница не скроллится
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('padding-right');
    this.initObserver();
    this.startIdleCount();
    this.fetchStats();
  },
  beforeUnmount() {
    if (this.observer) this.observer.disconnect();
    if (this._fadeFallback) clearTimeout(this._fadeFallback);
    this.stopIdleCount();
    Object.values(this._animFrames).forEach((id) => {
      if (id) cancelAnimationFrame(id);
    });
  },
  methods: {
    initObserver() {
      const els = this.$el?.querySelectorAll?.('.fade-in');
      if (!els?.length) return;

      // fallback: если IO не сработает — всё равно показать секции
      const revealAll = () => {
        els.forEach((el) => el.classList.add('visible'));
      };

      if (typeof IntersectionObserver === 'undefined') {
        revealAll();
        return;
      }

      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              this.observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
      );
      els.forEach((el) => this.observer.observe(el));

      // страховка через 1.2с — контент не «пропадает» навсегда
      this._fadeFallback = setTimeout(revealAll, 1200);
    },
    /** Пока ждём API — цифры «набираются» с 0 вверх */
    startIdleCount() {
      this.stopIdleCount();
      const tick = () => {
        if (this.statsLoaded) return;
        this.displayStats.universities = Math.min(this.displayStats.universities + 1, 99);
        this.displayStats.colleges = Math.min(this.displayStats.colleges + 1, 99);
        this.displayStats.directions = Math.min(this.displayStats.directions + 1, 120);
        this._idleTimer = setTimeout(tick, 55);
      };
      this._idleTimer = setTimeout(tick, 40);
    },
    stopIdleCount() {
      if (this._idleTimer) {
        clearTimeout(this._idleTimer);
        this._idleTimer = null;
      }
    },
    /** Плавный ease-out к точной цифре с API */
    animateTo(key, target, duration = 1100) {
      const start = Number(this.displayStats[key]) || 0;
      const end = Number(target) || 0;
      if (this._animFrames[key]) cancelAnimationFrame(this._animFrames[key]);
      if (start === end) {
        this.displayStats[key] = end;
        return;
      }
      const startTime = performance.now();
      const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
      const step = (now) => {
        const t = Math.min(1, (now - startTime) / duration);
        this.displayStats[key] = Math.round(start + (end - start) * easeOutCubic(t));
        if (t < 1) {
          this._animFrames[key] = requestAnimationFrame(step);
        } else {
          this.displayStats[key] = end;
          this._animFrames[key] = null;
        }
      };
      this._animFrames[key] = requestAnimationFrame(step);
    },
    settleStats() {
      this.stopIdleCount();
      this.statsLoaded = true;
      // небольшая задержка по ключам — «волна» приземления
      this.animateTo('universities', this.stats.universities, 1000);
      setTimeout(() => this.animateTo('colleges', this.stats.colleges, 1000), 80);
      setTimeout(() => this.animateTo('directions', this.stats.directions, 1100), 160);
    },
    async fetchStats() {
      try {
        const [inst, uniSpec, colSpec] = await Promise.all([
          axios.get('http://localhost:8000/api/institutions'),
          axios.get('http://localhost:8000/api/specialties', { params: { type: 'university' } }),
          axios.get('http://localhost:8000/api/specialties', { params: { type: 'college' } }),
        ]);
        const list = inst.data.data || inst.data || [];
        this.stats.institutions = list.length;
        this.stats.universities = list.filter((i) => i.type === 'university').length;
        this.stats.colleges = list.filter((i) => i.type === 'college').length;
        const us = (uniSpec.data.data || uniSpec.data || []).length;
        const cs = (colSpec.data.data || colSpec.data || []).length;
        this.stats.directions = us + cs;
        this.settleStats();
      } catch (e) {
        // API недоступен — останавливаем «крутилку» и показываем нули плавно
        this.stats.universities = 0;
        this.stats.colleges = 0;
        this.stats.directions = 0;
        this.settleStats();
      }
    },
  },
};
</script>

<style scoped>
.landing {
  --blue: var(--torap-blue, #1795c0);
  --blue-dark: var(--torap-blue-dark, #12799c);
  --gold: var(--torap-gold, #b08d4f);
  --navy: #0b1f2a;
  width: 100%;
  /* без overflow: hidden — иначе браузер может сделать локальный скролл и «отрезать» секции */
  overflow: visible;
}

/* ===== Hero ===== */
.hero {
  position: relative;
  min-height: 100vh;
  width: 100%;
  background: url('@/components/img/HeadImgFon.png') center / cover no-repeat;
  display: flex;
  align-items: center;
  /* hero не скроллится сам по себе — скролл только у страницы */
  overflow: visible;
  height: auto;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(105deg, rgba(4, 22, 32, 0.92) 0%, rgba(4, 22, 32, 0.75) 45%, rgba(4, 22, 32, 0.45) 100%);
}

.hero-content {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1140px;
  margin: 0 auto;
  padding: 110px 24px 60px;
}

.hero-title {
  color: #fff;
  font-weight: 800;
  font-size: clamp(2.2rem, 6vw, 4.4rem);
  line-height: 1.12;
  margin-bottom: 20px;
  text-align: left;
}

.accent-gold {
  color: var(--gold);
}

.hero-subtitle {
  color: rgba(255, 255, 255, 0.85);
  font-size: clamp(1rem, 2.2vw, 1.25rem);
  line-height: 1.6;
  max-width: 640px;
  margin-bottom: 32px;
  text-align: left;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 48px;
}

.btn-hero-primary {
  background: linear-gradient(135deg, var(--blue), var(--blue-dark));
  color: #fff;
  border: none;
  border-radius: 14px;
  padding: 15px 36px;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 10px 26px rgba(23, 149, 192, 0.38);
  transition: box-shadow 0.2s ease, transform 0.2s ease, filter 0.2s ease;
}

.btn-hero-primary:hover {
  filter: brightness(1.08);
  box-shadow: 0 14px 34px rgba(23, 149, 192, 0.5);
  transform: translateY(-2px);
}

.btn-hero-secondary {
  background: transparent;
  color: #fff;
  border: 2px solid rgba(255, 255, 255, 0.55);
  border-radius: 12px;
  padding: 14px 34px;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

.btn-hero-secondary:hover {
  border-color: var(--gold);
  color: var(--gold);
  transform: translateY(-2px);
}

.hero-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

/* Стеклянные карточки статистики */
.stat {
  display: flex;
  flex-direction: column;
  padding: 16px 26px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(10px);
  min-width: 150px;
}

.stat-value {
  color: var(--gold);
  font-size: clamp(1.7rem, 4vw, 2.4rem);
  font-weight: 800;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  font-feature-settings: 'tnum';
  min-width: 2.2ch;
  display: inline-block;
  transition: opacity 0.25s ease, filter 0.25s ease;
}

/* Пока ждём БД — лёгкий «живой» пульс цифр */
.stat-value.is-counting {
  animation: statPulse 0.7s ease-in-out infinite;
}

@keyframes statPulse {
  0%, 100% { opacity: 0.72; filter: blur(0); }
  50% { opacity: 1; filter: blur(0.2px); }
}

.stat-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
  margin-top: 6px;
}

/* ===== Секции ===== */
.section {
  padding: clamp(48px, 8vw, 96px) 24px;
  max-width: 1240px;
  margin: 0 auto;
}

/* Общий тёмный блок: шаги + футер */
.bottom-block {
  background: var(--navy);
}

.section-dark {
  max-width: none;
  background: transparent;
}

.section-head {
  text-align: center;
  max-width: 640px;
  margin: 0 auto clamp(32px, 5vw, 56px);
}

/* Золотой надзаголовок секции */
.section-eyebrow {
  display: inline-block;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 10px;
  position: relative;
}

.section-eyebrow::after {
  content: '';
  display: block;
  width: 36px;
  height: 2px;
  border-radius: 2px;
  background: linear-gradient(90deg, var(--gold), transparent);
  margin: 6px auto 0;
}

.section-head h2 {
  font-size: clamp(1.6rem, 4vw, 2.4rem);
  font-weight: 800;
  color: #10222e;
  margin-bottom: 12px;
}

.section-dark .section-head h2 {
  color: #fff;
}

.section-head p {
  color: #64748b;
  font-size: clamp(0.95rem, 2vw, 1.1rem);
  margin: 0;
}

.section-dark .section-head p {
  color: rgba(255, 255, 255, 0.65);
}

/* ===== Фичи ===== */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}

.feature-card {
  position: relative;
  background: #fff;
  border: 1px solid #e6edf2;
  border-radius: 18px;
  padding: 30px 26px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Тонкая градиентная полоска сверху — проявляется на ховере */
.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--blue), var(--gold));
  opacity: 0;
  transition: opacity 0.25s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 18px 40px rgba(16, 34, 46, 0.12);
  border-color: rgba(23, 149, 192, 0.45);
}

.feature-card:hover::before {
  opacity: 1;
}

.feature-icon {
  width: 56px;
  height: 56px;
  border-radius: 15px;
  background: linear-gradient(135deg, rgba(23, 149, 192, 0.14), rgba(23, 149, 192, 0.05));
  box-shadow: inset 0 0 0 1px rgba(23, 149, 192, 0.12);
  color: var(--blue);
  font-size: 1.55rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
  transition: background 0.25s ease, color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
}

.feature-card:hover .feature-icon {
  background: linear-gradient(135deg, var(--blue), var(--blue-dark));
  box-shadow: 0 8px 20px rgba(23, 149, 192, 0.35);
  color: #fff;
  transform: scale(1.06);
}

.feature-card h3 {
  font-size: 1.15rem;
  font-weight: 700;
  color: #10222e;
  margin-bottom: 8px;
}

.feature-card p {
  color: #64748b;
  font-size: 0.95rem;
  line-height: 1.55;
  margin-bottom: 16px;
  flex-grow: 1;
}

.feature-link {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--blue);
  font-weight: 700;
  font-size: 0.95rem;
}

.feature-link i {
  transition: transform 0.2s ease;
}

.feature-card:hover .feature-link {
  color: var(--blue-dark);
}

.feature-card:hover .feature-link i {
  transform: translateX(4px);
}

/* ===== Шаги ===== */
.section-dark .steps-grid {
  max-width: 1240px;
  margin: 0 auto;
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
}

.step {
  position: relative;
  text-align: left;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 18px;
  padding: 28px 24px;
  backdrop-filter: blur(4px);
  transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}

.step:hover {
  transform: translateY(-4px);
  border-color: rgba(212, 175, 55, 0.4);
  background: rgba(255, 255, 255, 0.07);
}

.step-num {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: linear-gradient(135deg, #d4af37, var(--gold));
  box-shadow: 0 6px 16px rgba(176, 141, 79, 0.4);
  color: #0b1f2a;
  font-weight: 800;
  font-size: 1.15rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

/* Пунктирная связка между шагами (desktop) */
.step::after {
  content: '';
  position: absolute;
  top: 51px;
  left: calc(24px + 46px + 10px);
  right: 18px;
  border-top: 2px dashed rgba(212, 175, 55, 0.28);
}

.step:last-child::after {
  display: none;
}

@media (max-width: 991px) {
  .step::after {
    display: none;
  }
}

.step h3 {
  color: #fff;
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.step p {
  color: rgba(255, 255, 255, 0.65);
  font-size: 0.95rem;
  line-height: 1.55;
  margin: 0;
}

/* ===== Футер (в общем тёмном блоке) ===== */
.footer {
  padding: 8px 24px 0 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.footer-inner {
  max-width: 1240px;
  margin: 0 auto;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 28px;
  flex-wrap: wrap;
  padding: 32px 0 28px;
}

.footer-logo {
  width: 120px;
  filter: brightness(0) invert(1);
  opacity: 0.95;
  margin-bottom: 10px;
}

.footer-brand p {
  color: rgba(255, 255, 255, 0.55);
  font-size: 0.9rem;
  margin: 0;
}

.footer-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 24px;
}

.footer-nav a {
  color: rgba(255, 255, 255, 0.75);
  text-decoration: none;
  font-size: 0.95rem;
  cursor: pointer;
  padding: 4px 0;
  transition: color 0.25s ease;
}

.footer-nav a:hover {
  color: var(--gold);
  background: none;
  transform: none;
}

.footer-bottom {
  max-width: 1240px;
  margin: 0 auto;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding: 18px 0;
  color: rgba(255, 255, 255, 0.45);
  font-size: 0.85rem;
}

/* ===== Появление секций ===== */
.fade-in {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}

/* ===== Планшеты ===== */
@media (max-width: 991px) {
  .hero-content {
    padding: 96px 20px 48px;
  }

  .hero-stats {
    gap: 28px;
  }
}

/* ===== Телефоны ===== */
@media (max-width: 575px) {
  .hero {
    min-height: 92vh;
  }

  .hero-content {
    padding: 88px 16px 40px;
  }

  .hero-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .btn-hero-primary,
  .btn-hero-secondary {
    width: 100%;
    text-align: center;
  }

  .hero-stats {
    gap: 20px;
    justify-content: space-between;
  }

  .section {
    padding-left: 16px;
    padding-right: 16px;
  }

  .footer-inner {
    flex-direction: column;
  }
}
</style>
