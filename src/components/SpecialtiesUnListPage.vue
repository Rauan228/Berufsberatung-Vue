<template>
  <div class="spec-page">
    <header class="page-hero">
      <div class="hero-glow hero-glow-blue"></div>
      <div class="hero-glow hero-glow-gold"></div>
      <div class="page-hero-inner">
        <h1>Специальности <span class="hero-accent">университетов</span></h1>
        <p class="page-sub">
          Выберите направление — затем квалификацию и конкретную специальность
        </p>
        <div class="hero-facts">
          <div class="hero-fact">
            <span class="hero-fact-value">{{ globalSpecialties.length || '—' }}</span>
            <span class="hero-fact-label">{{ specialtiesWord(globalSpecialties.length) }}</span>
          </div>
          <span class="hero-fact-divider"></span>
          <div class="hero-fact">
            <span class="hero-fact-value">{{ totalQualifications || '—' }}</span>
            <span class="hero-fact-label">{{ qualWord(totalQualifications) }}</span>
          </div>
        </div>
      </div>
    </header>

    <div class="page-layout">
      <aside class="side-nav" :class="{ open: sideOpen }">
        <div class="side-nav-head">
          <h2>Тип</h2>
          <button type="button" class="side-close" @click="sideOpen = false" aria-label="Закрыть">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <p class="side-label">Специальности для</p>
        <router-link
          to="/Specialties/Universities/GlobalSpecialties"
          class="side-link active"
          @click="sideOpen = false"
        >
          <i class="bi bi-building"></i>
          Университетов
        </router-link>
        <router-link
          to="/Specialties/Colleges"
          class="side-link"
          @click="sideOpen = false"
        >
          <i class="bi bi-journal-bookmark"></i>
          Колледжей
        </router-link>
      </aside>

      <main class="main-panel">
        <div class="toolbar">
          <button type="button" class="btn-side-mobile" @click="sideOpen = true">
            <i class="bi bi-sliders"></i>
            Тип
          </button>

          <nav class="breadcrumb-bar" aria-label="breadcrumb">
            <router-link to="/Universities">Университеты</router-link>
            <span class="bc-sep">/</span>
            <span class="bc-current">Специальности</span>
          </nav>

          <div class="search-field">
            <i class="bi bi-search"></i>
            <input
              v-model="searchQuery"
              type="search"
              placeholder="Поиск направления..."
              autocomplete="off"
            />
          </div>
        </div>

        <div class="type-chips mobile-only">
          <router-link
            to="/Specialties/Universities/GlobalSpecialties"
            class="chip active"
          >Университеты</router-link>
          <router-link to="/Specialties/Colleges" class="chip">Колледжи</router-link>
        </div>

        <div v-if="loading" class="state-box">
          <div class="spinner"></div>
          <span>Загружаем специальности…</span>
        </div>

        <div v-else-if="error" class="state-box error">
          <i class="bi bi-exclamation-triangle"></i>
          <span>{{ error }}</span>
          <button type="button" class="btn-retry" @click="fetchGlobalSpecialties">Повторить</button>
        </div>

        <div v-else-if="!filteredSpecialties.length" class="state-box">
          <i class="bi bi-search"></i>
          <span>По запросу ничего не найдено</span>
        </div>

        <div v-else class="cards-grid">
          <article
            v-for="specialty in filteredSpecialties"
            :key="specialty.id"
            class="spec-card"
            @click="navigateToQualifications(specialty.id)"
          >
            <div class="spec-card-body">
              <div class="spec-card-top">
                <span class="spec-icon"><i :class="specIcon(specialty.name)"></i></span>
                <span class="spec-index">{{ String(specialty.id).padStart(2, '0') }}</span>
              </div>
              <h2 class="spec-title">{{ specialty.name }}</h2>
              <p class="spec-desc">
                {{ specialty.description || 'Описание направления будет добавлено позже.' }}
              </p>
              <div class="spec-card-foot">
                <span v-if="specialty.qualifications" class="spec-count">
                  {{ specialty.qualifications.length }}
                  {{ qualWord(specialty.qualifications.length) }}
                </span>
                <span class="spec-cta">
                  Смотреть
                  <i class="bi bi-arrow-right"></i>
                </span>
              </div>
            </div>
          </article>
        </div>
      </main>
    </div>

    <div v-if="sideOpen" class="backdrop" @click="sideOpen = false"></div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SpecialtiesUnListPage',
  data() {
    return {
      globalSpecialties: [],
      loading: false,
      error: null,
      searchQuery: '',
      sideOpen: false,
    };
  },
  computed: {
    totalQualifications() {
      return this.globalSpecialties.reduce(
        (sum, s) => sum + (s.qualifications ? s.qualifications.length : 0),
        0
      );
    },
    filteredSpecialties() {
      const q = this.searchQuery.trim().toLowerCase();
      if (!q) return this.globalSpecialties;
      return this.globalSpecialties.filter(
        (s) =>
          (s.name || '').toLowerCase().includes(q) ||
          (s.description || '').toLowerCase().includes(q)
      );
    },
  },
  mounted() {
    this.fetchGlobalSpecialties();
  },
  methods: {
    async fetchGlobalSpecialties() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get('http://localhost:8000/api/specialties', {
          params: { type: 'university' },
        });
        if (response.data.success) {
          this.globalSpecialties = response.data.data || [];
        } else {
          this.error = 'Не удалось загрузить специальности';
        }
      } catch (error) {
        console.error('Ошибка при загрузке специальностей:', error);
        this.error = 'Произошла ошибка при загрузке данных';
      } finally {
        this.loading = false;
      }
    },
    navigateToQualifications(specialtyId) {
      this.$router.push(
        `/Specialties/Universities/GlobalSpecialties/Qualifications/${specialtyId}`
      );
    },
    /** Иконка направления по ключевым словам названия */
    specIcon(name = '') {
      const n = name.toLowerCase();
      const map = [
        [/технолог|коммуникацион|\bикт\b|informat/, 'bi-cpu-fill'],
        [/педагог|образован/, 'bi-easel2-fill'],
        [/искусств|гуманитар/, 'bi-palette-fill'],
        [/журналист|социальные науки|информация/, 'bi-chat-square-text-fill'],
        [/бизнес|управлен|право|эконом/, 'bi-briefcase-fill'],
        [/естествен|математик|статистик/, 'bi-calculator-fill'],
        [/инженер|обрабатыва|строител|промышлен/, 'bi-gear-fill'],
        [/сельск|лесн|рыбн|аграр/, 'bi-tree-fill'],
        [/ветеринар/, 'bi-clipboard-heart-fill'],
        [/здравоохран|медицин/, 'bi-heart-pulse-fill'],
        [/социальное обеспечение|благосостоян/, 'bi-people-fill'],
        [/услуг|сервис|туризм/, 'bi-cup-hot-fill'],
        [/безопасност|воен|оборон/, 'bi-shield-check'],
      ];
      const hit = map.find(([re]) => re.test(n));
      return `bi ${hit ? hit[1] : 'bi-journal-bookmark-fill'}`;
    },
    specialtiesWord(n) {
      const m10 = n % 10;
      const m100 = n % 100;
      if (m100 >= 11 && m100 <= 14) return 'направлений';
      if (m10 === 1) return 'направление';
      if (m10 >= 2 && m10 <= 4) return 'направления';
      return 'направлений';
    },
    qualWord(n) {
      const m10 = n % 10;
      const m100 = n % 100;
      if (m100 >= 11 && m100 <= 14) return 'квалификаций';
      if (m10 === 1) return 'квалификация';
      if (m10 >= 2 && m10 <= 4) return 'квалификации';
      return 'квалификаций';
    },
  },
};
</script>

<style scoped>
.spec-page {
  --blue: var(--torap-blue, #1795c0);
  --blue-dark: var(--torap-blue-dark, #12799c);
  --gold: var(--torap-gold, #b08d4f);
  --navy: #0b1f2a;
  --text: #10222e;
  --muted: #64748b;
  --border: #e6edf2;
  --bg: #f4f7f9;
  --white: #ffffff;
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  padding-top: 72px;
  width: 100%;
  box-sizing: border-box;
}

.page-hero {
  position: relative;
  overflow: hidden;
  background: #0b1f2a;
  color: #fff;
  padding: 36px 20px 32px;
}

/* Волнистые линии в фирменных голубом и золотом, растворяются к правому краю */
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

/* Мягкие цветовые пятна */
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
  max-width: 1200px;
  margin: 0 auto;
}

.page-hero h1 {
  font-size: clamp(1.55rem, 4vw, 2.25rem);
  font-weight: 800;
  margin: 0 0 10px;
  line-height: 1.15;
  color: #fff;
}

/* Ключевое слово — золотое, с «мазком» под ним */
.hero-accent {
  position: relative;
  color: #d4af37;
  white-space: nowrap;
}

.hero-accent::after {
  content: '';
  position: absolute;
  left: 2%;
  right: 2%;
  bottom: -0.18em;
  height: 0.22em;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 10' preserveAspectRatio='none'%3E%3Cpath d='M2 8 Q 60 -2 118 6' fill='none' stroke='%23b08d4f' stroke-width='3' stroke-linecap='round' opacity='0.75'/%3E%3C/svg%3E") no-repeat center / 100% 100%;
}

.page-sub {
  margin: 0;
  color: rgba(255, 255, 255, 0.72);
  font-size: 1rem;
  max-width: 520px;
  line-height: 1.55;
}

/* Живые цифры каталога */
.hero-facts {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 22px;
  margin-top: 22px;
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
  color: #d4af37;
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

.page-layout {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 16px 48px;
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 20px;
  align-items: start;
}

.side-nav {
  position: sticky;
  top: 88px;
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 18px 14px;
  box-shadow: 0 8px 24px rgba(16, 34, 46, 0.04);
}

.side-nav-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.side-nav-head h2 {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 800;
}

.side-close {
  display: none;
  border: none;
  background: transparent;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  cursor: pointer;
  color: var(--text);
}

.side-label {
  margin: 0 0 10px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--muted);
}

.side-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 12px;
  border-radius: 12px;
  text-decoration: none;
  color: var(--muted);
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 6px;
  border: 1px solid transparent;
  transition: all 0.15s ease;
}

.side-link i {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 36px;
  font-size: 1.05rem;
  color: var(--blue);
  background: linear-gradient(135deg, rgba(23, 149, 192, 0.13), rgba(23, 149, 192, 0.05));
  box-shadow: inset 0 0 0 1px rgba(23, 149, 192, 0.12);
  transition: background 0.2s ease, color 0.2s ease;
}

.side-link:hover {
  background: rgba(23, 149, 192, 0.08);
  color: var(--blue-dark);
}

.side-link.active {
  background: rgba(23, 149, 192, 0.12);
  border-color: rgba(23, 149, 192, 0.35);
  color: var(--blue-dark);
}

.side-link.active i {
  background: linear-gradient(135deg, var(--blue), var(--blue-dark));
  color: #fff;
  box-shadow: 0 5px 12px rgba(23, 149, 192, 0.32);
}

.main-panel {
  min-width: 0;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.btn-side-mobile {
  display: none;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 10px 14px;
  font-weight: 600;
  cursor: pointer;
  color: var(--text);
}

.breadcrumb-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: var(--muted);
  flex: 1;
  min-width: 0;
}

.breadcrumb-bar a {
  color: var(--blue);
  text-decoration: none;
  font-weight: 600;
}

.breadcrumb-bar a:hover {
  color: var(--blue-dark);
  background: transparent;
  transform: none;
}

.bc-sep {
  color: var(--gold);
  font-weight: 700;
}

.bc-current {
  color: var(--text);
  font-weight: 600;
}

.search-field {
  position: relative;
  width: min(280px, 100%);
  margin-left: auto;
}

.search-field i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--muted);
}

.search-field input {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 10px 16px 10px 38px;
  font-size: 0.95rem;
  outline: none;
  background: #fff;
  box-shadow: 0 3px 10px rgba(16, 34, 46, 0.05);
  box-sizing: border-box;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.search-field input:focus {
  border-color: var(--blue);
  box-shadow: 0 0 0 3px rgba(23, 149, 192, 0.15);
}

.type-chips {
  display: none;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.chip {
  border: 1px solid var(--border);
  background: #fff;
  color: #2b3d47;
  border-radius: 999px;
  padding: 8px 14px;
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
}

.chip.active {
  background: rgba(23, 149, 192, 0.12);
  border-color: var(--blue);
  color: var(--blue-dark);
}

.mobile-only {
  display: none;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
  gap: 16px;
}

.spec-card {
  position: relative;
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 18px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
  box-shadow: 0 6px 18px rgba(16, 34, 46, 0.04);
  min-height: 190px;
}

/* Градиентная полоска сверху — проявляется на ховере */
.spec-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--blue), var(--gold));
  opacity: 0;
  transition: opacity 0.25s ease;
  z-index: 1;
}

.spec-card:hover {
  transform: translateY(-4px);
  border-color: rgba(23, 149, 192, 0.4);
  box-shadow: 0 16px 36px rgba(16, 34, 46, 0.12);
}

.spec-card:hover::before {
  opacity: 1;
}

.spec-card-body {
  padding: 20px 18px 16px;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
}

.spec-card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 14px;
}

/* Иконка направления в плитке */
.spec-icon {
  width: 48px;
  height: 48px;
  border-radius: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(23, 149, 192, 0.14), rgba(23, 149, 192, 0.05));
  box-shadow: inset 0 0 0 1px rgba(23, 149, 192, 0.12);
  color: var(--blue);
  font-size: 1.35rem;
  transition: background 0.25s ease, color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
}

.spec-card:hover .spec-icon {
  background: linear-gradient(135deg, var(--blue), var(--blue-dark));
  box-shadow: 0 8px 18px rgba(23, 149, 192, 0.35);
  color: #fff;
  transform: scale(1.06);
}

.spec-index {
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: rgba(176, 141, 79, 0.75);
}

.spec-count {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--blue-dark);
  background: rgba(23, 149, 192, 0.1);
  border: 1px solid rgba(23, 149, 192, 0.2);
  border-radius: 999px;
  padding: 4px 10px;
  white-space: nowrap;
}

.spec-title {
  margin: 0 0 8px;
  font-size: 1.1rem;
  font-weight: 800;
  line-height: 1.3;
  color: var(--navy);
}

.spec-desc {
  margin: 0;
  color: var(--muted);
  font-size: 0.9rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.spec-card-foot {
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.spec-cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--blue);
  font-weight: 700;
  font-size: 0.88rem;
  margin-left: auto;
}

.spec-cta i {
  transition: transform 0.2s ease;
}

.spec-card:hover .spec-cta {
  color: var(--blue-dark);
}

.spec-card:hover .spec-cta i {
  transform: translateX(4px);
}

.state-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 220px;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 16px;
  color: var(--muted);
  padding: 24px;
  text-align: center;
}

.state-box.error {
  color: #b45309;
}

.state-box i {
  font-size: 1.6rem;
  color: var(--gold);
}

.btn-retry {
  border: none;
  background: var(--blue);
  color: #fff;
  border-radius: 10px;
  padding: 10px 16px;
  font-weight: 600;
  cursor: pointer;
}

.spinner {
  width: 42px;
  height: 42px;
  border: 4px solid #e8eef2;
  border-top-color: var(--blue);
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.backdrop {
  display: none;
}

/* ===== Tablet ===== */
@media (max-width: 992px) {
  .page-layout {
    grid-template-columns: 1fr;
    padding: 16px 14px 40px;
  }

  .side-nav {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: min(300px, 86vw);
    max-width: 300px;
    z-index: 1200;
    border-radius: 0;
    transform: translateX(-105%);
    transition: transform 0.2s ease;
    box-shadow: 8px 0 30px rgba(0, 0, 0, 0.12);
  }

  .side-nav.open {
    transform: translateX(0);
  }

  .side-close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .btn-side-mobile {
    display: inline-flex;
  }

  .mobile-only {
    display: flex;
  }

  .backdrop {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(11, 31, 42, 0.45);
    z-index: 1100;
  }
}

/* ===== Phone ===== */
@media (max-width: 640px) {
  .spec-page {
    padding-top: 64px;
  }

  .page-hero {
    padding: 24px 16px 22px;
  }

  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .search-field {
    width: 100%;
    margin-left: 0;
  }

  .breadcrumb-bar {
    order: -1;
    font-size: 0.85rem;
  }

  .cards-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .spec-title {
    font-size: 1.05rem;
  }
}

/* ===== Very small ===== */
@media (max-width: 380px) {
  .page-hero h1 {
    font-size: 1.35rem;
  }

  .found-pill {
    width: 100%;
    justify-content: center;
  }
}
</style>
