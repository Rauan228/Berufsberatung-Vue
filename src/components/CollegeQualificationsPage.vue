<template>
  <div class="spec-page">
    <header class="page-hero">
      <div class="hero-glow hero-glow-blue"></div>
      <div class="hero-glow hero-glow-gold"></div>
      <div class="page-hero-inner">
        <span class="hero-kicker">Направление</span>
        <h1>{{ heroTitle.main }}<template v-if="heroTitle.accent"> <span class="hero-accent">{{ heroTitle.accent }}</span></template></h1>
        <p class="page-sub">
          Выберите квалификацию и специальность, чтобы узнать подробности и колледжи
        </p>
        <div class="hero-facts">
          <div class="hero-fact">
            <span class="hero-fact-value">{{ qualifications.length || '—' }}</span>
            <span class="hero-fact-label">{{ qualWord(qualifications.length) }}</span>
          </div>
          <span class="hero-fact-divider"></span>
          <div class="hero-fact">
            <span class="hero-fact-value">{{ totalSpecs || '—' }}</span>
            <span class="hero-fact-label">{{ specWord(totalSpecs) }}</span>
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
          class="side-link"
          @click="sideOpen = false"
        >
          <i class="bi bi-building"></i>
          Университетов
        </router-link>
        <router-link
          to="/Specialties/Colleges"
          class="side-link active"
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
            <router-link to="/Colleges">Колледжи</router-link>
            <span class="bc-sep">/</span>
            <router-link to="/Specialties/Colleges">
              Специальности
            </router-link>
            <span class="bc-sep">/</span>
            <span class="bc-current">{{ currentSpecialtyName || '…' }}</span>
          </nav>

          <div class="search-field">
            <i class="bi bi-search"></i>
            <input
              v-model="searchQuery"
              type="search"
              placeholder="Поиск специальности..."
              autocomplete="off"
            />
          </div>
        </div>

        <div class="type-chips mobile-only">
          <router-link
            to="/Specialties/Universities/GlobalSpecialties"
            class="chip"
          >Университеты</router-link>
          <router-link to="/Specialties/Colleges" class="chip active">Колледжи</router-link>
        </div>

        <div v-if="loading" class="state-box">
          <div class="spinner"></div>
          <span>Загружаем квалификации…</span>
        </div>

        <div v-else-if="error" class="state-box error">
          <i class="bi bi-exclamation-triangle"></i>
          <span>{{ error }}</span>
          <button type="button" class="btn-retry" @click="reload">Повторить</button>
        </div>

        <div v-else-if="!filteredQualifications.length" class="state-box">
          <i class="bi bi-search"></i>
          <span>
            {{ searchQuery ? 'По запросу ничего не найдено' : 'Квалификации не найдены' }}
          </span>
        </div>

        <div v-else class="qual-list">
          <section
            v-for="qualification in filteredQualifications"
            :key="qualification.id"
            class="qual-block"
          >
            <header class="qual-head">
              <div class="qual-head-left">
                <span class="qual-badge">Квалификация</span>
                <h2>{{ qualification.qualification_name }}</h2>
              </div>
              <span class="qual-count">
                {{ (qualification.specializations || []).length }}
                {{ specWord((qualification.specializations || []).length) }}
              </span>
            </header>

            <div
              v-if="qualification.specializations && qualification.specializations.length"
              class="spec-rows"
            >
              <button
                v-for="specialization in qualification.specializations"
                :key="specialization.id"
                type="button"
                class="spec-row"
                @click="navigateToAbout(specialization, qualification)"
              >
                <span class="spec-row-name">{{ specialization.name }}</span>
                <span class="spec-row-cta">
                  Подробнее
                  <i class="bi bi-arrow-right"></i>
                </span>
              </button>
            </div>
            <div v-else class="empty-specs">Нет специальностей в этой квалификации</div>
          </section>
        </div>
      </main>
    </div>

    <div v-if="sideOpen" class="backdrop" @click="sideOpen = false"></div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'CollegeQualificationsPage',
  data() {
    return {
      qualifications: [],
      loading: false,
      error: null,
      currentSpecialtyName: '',
      searchQuery: '',
      sideOpen: false,
    };
  },
  computed: {
    totalSpecs() {
      return this.qualifications.reduce(
        (sum, q) => sum + (q.specializations ? q.specializations.length : 0),
        0
      );
    },
    // Разбиваем название: последнее «чистое» слово уходит в золотой акцент.
    // Слова со скобками/латиницей не акцентируем — «мазок» под ними смотрится криво.
    heroTitle() {
      const name = (this.currentSpecialtyName || 'Направление').trim();
      const words = name.split(/\s+/);
      const last = words[words.length - 1] || '';
      const clean = /^[А-Яа-яЁё-]{4,}$/.test(last);
      if (words.length < 2 || !clean) return { main: name, accent: '' };
      return { main: words.slice(0, -1).join(' '), accent: last };
    },
    filteredQualifications() {
      const q = this.searchQuery.trim().toLowerCase();
      if (!q) return this.qualifications;

      return this.qualifications
        .map((qual) => {
          const nameMatch = (qual.qualification_name || '').toLowerCase().includes(q);
          const specs = (qual.specializations || []).filter((s) =>
            (s.name || '').toLowerCase().includes(q)
          );
          if (nameMatch) return qual;
          if (specs.length) {
            return { ...qual, specializations: specs };
          }
          return null;
        })
        .filter(Boolean);
    },
  },
  watch: {
    '$route.params.specialty_id': {
      immediate: true,
      handler(newId) {
        if (newId) {
          this.fetchQualifications(newId);
          this.fetchSpecialtyName(newId);
        }
      },
    },
  },
  methods: {
    reload() {
      const id = this.$route.params.specialty_id;
      if (id) {
        this.fetchQualifications(id);
        this.fetchSpecialtyName(id);
      }
    },
    async fetchSpecialtyName(specialtyId) {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/specialties/${specialtyId}?type=college`
        );
        if (response.data.success) {
          this.currentSpecialtyName = response.data.data.name;
        }
      } catch (error) {
        console.error('Ошибка при загрузке названия специальности:', error);
      }
    },
    async fetchQualifications(specialtyId) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(
          `http://localhost:8000/api/specialties/${specialtyId}/qualifications?type=college`
        );
        if (response.data.success) {
          this.qualifications = response.data.data || [];
        } else {
          this.error = 'Не удалось загрузить квалификации';
        }
      } catch (error) {
        console.error('Ошибка при загрузке квалификаций:', error);
        this.error = `Ошибка загрузки данных: ${
          error.response?.data?.message || error.message
        }`;
      } finally {
        this.loading = false;
      }
    },
    navigateToAbout(specialization, qualification) {
      localStorage.setItem(
        'selectedSpecialization',
        JSON.stringify({
          id: specialization.id,
          name: specialization.name,
          qualification_name: qualification?.qualification_name || '',
          specialty_name: this.currentSpecialtyName,
          type: 'college',
        })
      );

      this.$router.push({
        name: 'SpecializationAbout',
        params: { id: specialization.id },
      });
    },
    qualWord(n) {
      const m10 = n % 10;
      const m100 = n % 100;
      if (m100 >= 11 && m100 <= 14) return 'квалификаций';
      if (m10 === 1) return 'квалификация';
      if (m10 >= 2 && m10 <= 4) return 'квалификации';
      return 'квалификаций';
    },
    specWord(n) {
      const m10 = n % 10;
      const m100 = n % 100;
      if (m100 >= 11 && m100 <= 14) return 'специальностей';
      if (m10 === 1) return 'специальность';
      if (m10 >= 2 && m10 <= 4) return 'специальности';
      return 'специальностей';
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
  width: 100%;
  box-sizing: border-box;
}

.page-hero {
  position: relative;
  overflow: hidden;
  background: #0b1f2a;
  color: #fff;
  /* верхний отступ учитывает прозрачный навбар, «плывущий» поверх блока */
  padding: 102px 20px 32px;
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

.hero-kicker {
  display: inline-block;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--gold-bright, #d4af37);
  margin-bottom: 10px;
}

.page-hero h1 {
  font-size: clamp(1.5rem, 4vw, 2.25rem);
  font-weight: 800;
  margin: 0 0 10px;
  line-height: 1.18;
  color: #fff;
  word-break: break-word;
}

/* Ключевое слово — золотое, с «мазком» под ним */
.hero-accent {
  position: relative;
  color: #d4af37;
  margin-left: 0.3em;
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
  font-size: 1rem;
  max-width: 560px;
  line-height: 1.55;
}

/* Живые цифры */
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
  padding: 12px;
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
  color: var(--gold);
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
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 220px;
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
  border-radius: 12px;
  padding: 10px 12px 10px 36px;
  font-size: 0.95rem;
  outline: none;
  background: #fff;
  box-sizing: border-box;
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

.qual-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.qual-block {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 6px 18px rgba(16, 34, 46, 0.04);
}

.qual-head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 18px;
  background: linear-gradient(90deg, rgba(23, 149, 192, 0.08), rgba(176, 141, 79, 0.08));
  border-bottom: 1px solid var(--border);
}

.qual-badge {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 6px;
}

.qual-head h2 {
  margin: 0;
  font-size: clamp(1.05rem, 2.5vw, 1.25rem);
  font-weight: 800;
  color: var(--navy);
  line-height: 1.3;
}

.qual-count {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--blue-dark);
  background: #fff;
  border: 1px solid rgba(23, 149, 192, 0.25);
  border-radius: 999px;
  padding: 6px 12px;
  white-space: nowrap;
}

.spec-rows {
  display: flex;
  flex-direction: column;
}

.spec-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  text-align: left;
  border: none;
  border-bottom: 1px solid var(--border);
  background: #fff;
  padding: 14px 18px;
  cursor: pointer;
  transition: background 0.15s ease;
}

.spec-row:last-child {
  border-bottom: none;
}

.spec-row:hover {
  background: rgba(23, 149, 192, 0.06);
}

.spec-row-name {
  font-size: 0.98rem;
  font-weight: 600;
  color: var(--text);
  line-height: 1.4;
  min-width: 0;
  word-break: break-word;
}

.spec-row-cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--blue);
  font-weight: 700;
  font-size: 0.85rem;
  flex-shrink: 0;
  white-space: nowrap;
}

.spec-row:hover .spec-row-cta {
  color: var(--blue-dark);
}

.empty-specs {
  padding: 18px;
  color: var(--muted);
  font-size: 0.95rem;
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

@media (max-width: 640px) {
  .page-hero {
    padding: 84px 16px 24px;
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
    font-size: 0.82rem;
  }

  .bc-current {
    max-width: 140px;
  }

  .spec-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    padding: 14px 14px;
  }

  .qual-head {
    padding: 14px;
  }
}
</style>
