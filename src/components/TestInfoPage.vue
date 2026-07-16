<template>
  <div class="test-info-page">

    <!-- ===== Компактный тёмный hero ===== -->
    <header class="page-hero">
      <div class="hero-glow hero-glow-blue"></div>
      <div class="hero-glow hero-glow-gold"></div>
      <div class="page-hero-inner">
        <h1>Профориентационный <span class="hero-accent">тест</span></h1>
        <p class="page-sub">
          4 этапа — личностные качества, рабочие предпочтения, интересы и профильные
          направления. В конце Torap AI разберёт ответы и предложит специальности,
          которые подходят именно вам.
        </p>
        <div class="hero-facts">
          <div class="hero-fact">
            <span class="hero-fact-value">80</span>
            <span class="hero-fact-label">вопросов</span>
          </div>
          <span class="hero-fact-divider"></span>
          <div class="hero-fact">
            <span class="hero-fact-value">4</span>
            <span class="hero-fact-label">этапа</span>
          </div>
          <span class="hero-fact-divider"></span>
          <div class="hero-fact">
            <span class="hero-fact-value">~15</span>
            <span class="hero-fact-label">минут</span>
          </div>
        </div>
      </div>
    </header>

    <div class="info-layout">
      <!-- ===== Начать тест ===== -->
      <section class="panel start-panel">
        <h2>Начать тест</h2>
        <p class="panel-label">Куда планируете поступать?</p>

        <div class="type-options">
          <button
            type="button"
            class="type-option"
            :class="{ active: institutionType === 'university' }"
            @click="institutionType = 'university'"
          >
            <span class="type-icon"><i class="bi bi-mortarboard-fill"></i></span>
            <span class="type-name">Университет</span>
            <span class="type-desc">бакалавриат, 4+ года</span>
            <i class="bi bi-check-circle-fill type-check"></i>
          </button>

          <button
            type="button"
            class="type-option"
            :class="{ active: institutionType === 'college' }"
            @click="institutionType = 'college'"
          >
            <span class="type-icon"><i class="bi bi-bank2"></i></span>
            <span class="type-name">Колледж</span>
            <span class="type-desc">профессия быстрее</span>
            <i class="bi bi-check-circle-fill type-check"></i>
          </button>
        </div>

        <button class="btn-begin" :disabled="!institutionType" @click="beginTest">
          Приступить
          <i class="bi bi-arrow-right"></i>
        </button>

        <p class="start-hint">
          <i class="bi bi-stars"></i>
          Результат проанализирует нейросеть — разбор появится в личном кабинете
        </p>
      </section>

      <!-- ===== Мои результаты ===== -->
      <section class="panel results-panel">
        <h2>Мои результаты</h2>

        <div v-if="loading" class="loading-container">
          <div class="spinner"></div>
        </div>

        <template v-else>
          <!-- Не авторизован -->
          <div v-if="!isAuthenticated" class="unauth-box">
            <span class="unauth-icon"><i class="bi bi-person-lock"></i></span>
            <p>
              Войдите в аккаунт, чтобы результаты сохранялись и были доступны
              в любой момент.
            </p>
            <button class="btn-login" @click="goLogin">Войти / Регистрация</button>
          </div>

          <!-- Нет результатов -->
          <div v-else-if="!results.length" class="empty-box">
            <i class="bi bi-clipboard2-pulse"></i>
            <p>Пока нет пройденных тестов — самое время пройти первый!</p>
          </div>

          <!-- Список результатов -->
          <transition-group v-else name="fade-list" tag="div" class="results-list" appear>
            <div
              v-for="res in results"
              :key="res.id"
              class="result-card"
              @click="openResult(res.id)"
            >
              <div class="result-top">
                <span class="result-date">{{ formatDate(res.created_at) }}</span>
                <span class="result-type">
                  {{ res.institution_type === 'college' ? 'Колледж' : 'Университет' }}
                </span>
                <span class="result-status" :class="res.summary ? 'is-ready' : 'is-pending'">
                  <span class="status-dot"></span>
                  {{ res.summary ? 'Готов' : 'Анализируется' }}
                </span>
              </div>
              <p v-if="res.summary" class="result-snippet">{{ truncate(res.summary, 110) }}</p>
              <p v-else class="result-snippet muted">Torap AI ещё работает над разбором…</p>
              <i class="bi bi-arrow-right result-arrow"></i>
            </div>
          </transition-group>
        </template>
      </section>
    </div>

  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      results: [],
      isAuthenticated: false,
      institutionType: '',
      loading: true,
    };
  },
  created() {
    this.initialize();
  },
  methods: {
    async initialize() {
      await this.checkAuth();
      this.loading = false;
    },
    async checkAuth() {
      const token = localStorage.getItem('token');
      if (!token) {
        this.isAuthenticated = false;
        return;
      }
      try {
        await axios.get('http://localhost:8000/api/current-user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.isAuthenticated = true;
        await this.fetchResults();
      } catch (e) {
        this.isAuthenticated = false;
      }
    },
    async fetchResults() {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('http://localhost:8000/api/career-tests', {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.results = data;
      } catch (e) {
        console.error('Не удалось получить результаты', e);
      }
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    },
    truncate(str, len) {
      if (!str) return '';
      return str.length > len ? str.slice(0, len) + '…' : str;
    },
    beginTest() {
      this.$router.push({ name: 'TestQuestions', query: { type: this.institutionType } });
    },
    openResult(id) {
      this.$router.push({ name: 'TestResult', params: { id } });
    },
    goLogin() {
      this.$router.push('/login');
    },
  },
};
</script>

<style scoped>
.test-info-page {
  --blue: var(--torap-blue, #1795c0);
  --blue-dark: var(--torap-blue-dark, #12799c);
  --gold: var(--torap-gold, #b08d4f);
  --gold-bright: var(--torap-gold-bright, #d4af37);
  --text: #10222e;
  --muted: #64748b;
  --border: #e6edf2;
  min-height: 100vh;
  background: #f4f7f9;
  color: var(--text);
}

/* ===== Hero ===== */
.page-hero {
  position: relative;
  overflow: hidden;
  background: #0b1f2a;
  color: #fff;
  padding: 108px 24px 40px;
}

.page-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400' fill='none'%3E%3Cpath d='M0 60 Q150 10 300 60 T600 60' stroke='%231795c0' stroke-opacity='0.22' stroke-width='1.3'/%3E%3Cpath d='M0 120 Q150 66 300 120 T600 120' stroke='%231795c0' stroke-opacity='0.14' stroke-width='1.3'/%3E%3Cpath d='M0 180 Q150 122 300 180 T600 180' stroke='%23d4af37' stroke-opacity='0.16' stroke-width='1.3'/%3E%3Cpath d='M0 240 Q150 182 300 240 T600 240' stroke='%231795c0' stroke-opacity='0.11' stroke-width='1.3'/%3E%3Cpath d='M0 300 Q150 244 300 300 T600 300' stroke='%231795c0' stroke-opacity='0.17' stroke-width='1.3'/%3E%3Cpath d='M0 360 Q150 304 300 360 T600 360' stroke='%23d4af37' stroke-opacity='0.10' stroke-width='1.3'/%3E%3C/svg%3E") repeat;
  background-size: 600px 400px;
  -webkit-mask-image: linear-gradient(115deg, #000 30%, transparent 78%);
  mask-image: linear-gradient(115deg, #000 30%, transparent 78%);
  pointer-events: none;
}

.hero-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  pointer-events: none;
}

.hero-glow-blue {
  width: 560px;
  height: 560px;
  right: -140px;
  top: -300px;
  background: rgba(23, 149, 192, 0.42);
}

.hero-glow-gold {
  width: 460px;
  height: 460px;
  left: 30%;
  bottom: -340px;
  background: rgba(176, 141, 79, 0.22);
}

.page-hero-inner {
  position: relative;
  max-width: 1100px;
  margin: 0 auto;
}

.page-hero h1 {
  font-size: clamp(1.7rem, 4vw, 2.4rem);
  font-weight: 800;
  margin: 0 0 12px;
  line-height: 1.15;
  color: #fff;
}

.hero-accent {
  position: relative;
  color: var(--gold-bright);
  white-space: nowrap;
}

.hero-accent::after {
  content: '';
  position: absolute;
  left: 2%;
  right: 2%;
  bottom: -0.16em;
  height: 0.22em;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 10' preserveAspectRatio='none'%3E%3Cpath d='M2 8 Q 60 -2 118 6' fill='none' stroke='%23b08d4f' stroke-width='3' stroke-linecap='round' opacity='0.75'/%3E%3C/svg%3E") no-repeat center / 100% 100%;
}

.page-sub {
  margin: 0;
  color: rgba(255, 255, 255, 0.72);
  font-size: 1.02rem;
  max-width: 620px;
  line-height: 1.6;
}

.hero-facts {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 22px;
  margin-top: 24px;
}

.hero-fact {
  display: flex;
  flex-direction: column;
}

.hero-fact-value {
  font-family: var(--torap-font-display, inherit);
  font-size: 1.6rem;
  font-weight: 800;
  line-height: 1.1;
  color: var(--gold-bright);
  font-variant-numeric: tabular-nums;
}

.hero-fact-label {
  margin-top: 3px;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
}

.hero-fact-divider {
  width: 1px;
  height: 34px;
  background: rgba(255, 255, 255, 0.16);
}

/* ===== Layout ===== */
.info-layout {
  max-width: 1100px;
  margin: 0 auto;
  padding: 26px 20px 56px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 22px;
  align-items: start;
}

.panel {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 18px;
  box-shadow: 0 10px 30px rgba(16, 34, 46, 0.05);
  padding: 26px;
}

.panel h2 {
  font-size: 1.25rem;
  font-weight: 800;
  margin: 0 0 18px;
}

/* ===== Начать тест ===== */
.panel-label {
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--muted);
  margin: 0 0 12px;
}

.type-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 20px;
}

.type-option {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  background: #f7fafc;
  border: 2px solid var(--border);
  border-radius: 16px;
  padding: 18px 16px;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease;
}

.type-option:hover {
  border-color: rgba(23, 149, 192, 0.5);
  transform: translateY(-2px);
}

.type-option.active {
  border-color: var(--blue);
  background: rgba(23, 149, 192, 0.06);
}

.type-icon {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: var(--blue);
  background: linear-gradient(135deg, rgba(23, 149, 192, 0.14), rgba(23, 149, 192, 0.05));
  box-shadow: inset 0 0 0 1px rgba(23, 149, 192, 0.12);
  margin-bottom: 8px;
  transition: background 0.2s ease, color 0.2s ease;
}

.type-option.active .type-icon {
  background: linear-gradient(135deg, var(--blue), var(--blue-dark));
  color: #fff;
  box-shadow: 0 6px 14px rgba(23, 149, 192, 0.35);
}

.type-name {
  font-weight: 700;
  font-size: 1rem;
  color: var(--text);
}

.type-desc {
  font-size: 0.8rem;
  color: var(--muted);
}

.type-check {
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 1.1rem;
  color: var(--blue);
  opacity: 0;
  transform: scale(0.6);
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.type-option.active .type-check {
  opacity: 1;
  transform: scale(1);
}

.btn-begin {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  border: none;
  border-radius: 14px;
  padding: 15px 24px;
  font-size: 1.05rem;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, var(--blue), var(--blue-dark));
  cursor: pointer;
  box-shadow: 0 10px 24px rgba(23, 149, 192, 0.35);
  transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
}

.btn-begin i {
  transition: transform 0.2s ease;
}

.btn-begin:not(:disabled):hover {
  filter: brightness(1.08);
  transform: translateY(-2px);
  box-shadow: 0 14px 30px rgba(23, 149, 192, 0.45);
}

.btn-begin:not(:disabled):hover i {
  transform: translateX(4px);
}

.btn-begin:disabled {
  background: #c2cdd4;
  box-shadow: none;
  cursor: not-allowed;
}

.start-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 16px 0 0;
  font-size: 0.85rem;
  color: var(--muted);
}

.start-hint i {
  color: var(--gold);
  font-size: 1rem;
}

/* ===== Мои результаты ===== */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 140px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e8eef2;
  border-top-color: var(--blue);
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.unauth-box,
.empty-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
  padding: 26px 16px;
  color: var(--muted);
}

.unauth-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: var(--gold);
  background: rgba(176, 141, 79, 0.12);
}

.unauth-box p,
.empty-box p {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.55;
  max-width: 320px;
}

.empty-box i {
  font-size: 1.8rem;
  color: var(--gold);
}

.btn-login {
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 700;
  font-size: 0.95rem;
  color: #fff;
  background: linear-gradient(135deg, var(--blue), var(--blue-dark));
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(23, 149, 192, 0.35);
  transition: transform 0.2s ease;
}

.btn-login:hover {
  transform: translateY(-2px);
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 420px;
  overflow-y: auto;
  padding-right: 4px;
}

.result-card {
  position: relative;
  background: #f7fafc;
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 14px 40px 14px 16px;
  cursor: pointer;
  transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
}

.result-card:hover {
  transform: translateY(-2px);
  border-color: rgba(23, 149, 192, 0.45);
  box-shadow: 0 10px 24px rgba(16, 34, 46, 0.08);
}

.result-top {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 7px;
}

.result-date {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text);
}

.result-type {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: 999px;
  color: var(--blue-dark);
  background: rgba(23, 149, 192, 0.1);
  border: 1px solid rgba(23, 149, 192, 0.2);
}

.result-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
  font-size: 0.75rem;
  font-weight: 700;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.result-status.is-ready {
  color: #0d8a53;
}

.result-status.is-ready .status-dot {
  background: #10b981;
}

.result-status.is-pending {
  color: var(--gold);
}

.result-status.is-pending .status-dot {
  background: var(--gold-bright);
  animation: pendingPulse 1.6s ease-in-out infinite;
}

@keyframes pendingPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
}

.result-snippet {
  margin: 0;
  font-size: 0.86rem;
  color: #4a5b66;
  line-height: 1.5;
}

.result-snippet.muted {
  color: var(--muted);
  font-style: italic;
}

.result-arrow {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%) translateX(-6px);
  color: var(--blue);
  opacity: 0;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.result-card:hover .result-arrow {
  opacity: 1;
  transform: translateY(-50%) translateX(0);
}

.fade-list-enter-active {
  transition: all 0.3s ease;
}

.fade-list-enter-from {
  opacity: 0;
  transform: translateY(15px);
}

/* ===== Адаптив ===== */
@media (max-width: 860px) {
  .info-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 575px) {
  .page-hero {
    padding: 90px 16px 32px;
  }

  .type-options {
    grid-template-columns: 1fr;
  }
}
</style>
