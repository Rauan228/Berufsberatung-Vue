<template>
  <div class="spec-page">
    <header class="page-hero">
      <div class="page-hero-inner">
        <div class="page-hero-text">
          <span class="page-badge">{{ isCollege ? 'Колледж' : 'Университет' }}</span>
          <h1>{{ specializationName || 'Специальность' }}</h1>
          <p class="page-sub" v-if="qualificationName">
            Квалификация: <span class="gold-text">{{ qualificationName }}</span>
          </p>
          <p class="page-sub muted" v-if="specialtyName">
            Направление: {{ specialtyName }}
          </p>
        </div>
      </div>
    </header>

    <div class="page-body">
      <nav class="breadcrumb-bar" aria-label="breadcrumb">
        <button type="button" class="bc-link" @click="navigateTo(isCollege ? '/Colleges' : '/Universities')">
          {{ isCollege ? 'Колледжи' : 'Университеты' }}
        </button>
        <span class="bc-sep">/</span>
        <button
          type="button"
          class="bc-link"
          @click="navigateTo(isCollege ? '/Specialties/Colleges' : '/Specialties/Universities/GlobalSpecialties')"
        >
          Специальности
        </button>
        <span class="bc-sep">/</span>
        <span class="bc-current">{{ specializationName || '…' }}</span>
      </nav>

      <div class="tabs" role="tablist">
        <button
          type="button"
          role="tab"
          class="tab"
          :class="{ active: activeTab === 'about' }"
          @click="activeTab = 'about'"
        >
          <i class="bi bi-info-circle"></i>
          Описание
        </button>
        <button
          type="button"
          role="tab"
          class="tab"
          :class="{ active: activeTab === 'institutions' }"
          @click="activeTab = 'institutions'"
        >
          <i class="bi bi-geo-alt"></i>
          Где обучаться
        </button>
      </div>

      <div v-if="loading" class="state-box">
        <div class="spinner"></div>
        <span>Загружаем данные…</span>
      </div>

      <div v-else-if="error" class="state-box error">
        <i class="bi bi-exclamation-triangle"></i>
        <span>{{ error }}</span>
        <button type="button" class="btn-primary" @click="fetchData">Повторить</button>
      </div>

      <template v-else>
        <!-- About -->
        <section v-if="activeTab === 'about'" class="about-section">
          <article class="about-card">
            <div class="about-card-accent"></div>
            <div class="about-card-inner">
              <h2>{{ specializationName }}</h2>
              <p class="qual-line" v-if="qualificationName">
                <i class="bi bi-award"></i>
                {{ qualificationName }}
              </p>

              <div
                v-if="specialization.about1 || specialization.about2 || specialization.about3"
                class="about-blocks"
              >
                <div v-if="specialization.about1" class="about-item">
                  <span class="about-num">01</span>
                  <p>{{ specialization.about1 }}</p>
                </div>
                <div v-if="specialization.about2" class="about-item">
                  <span class="about-num">02</span>
                  <p>{{ specialization.about2 }}</p>
                </div>
                <div v-if="specialization.about3" class="about-item">
                  <span class="about-num">03</span>
                  <p>{{ specialization.about3 }}</p>
                </div>
              </div>

              <div v-else class="empty-about">
                <i class="bi bi-file-text"></i>
                <p>Описание для данной специальности пока не добавлено</p>
              </div>

              <div v-if="extraFields.length" class="extra-grid">
                <div v-for="field in extraFields" :key="field.key" class="extra-card">
                  <h3>{{ field.label }}</h3>
                  <p>{{ field.value }}</p>
                </div>
              </div>
            </div>
          </article>
        </section>

        <!-- Institutions -->
        <section v-if="activeTab === 'institutions'" class="institutions-section">
          <div v-if="loadingInstitutions" class="state-box">
            <div class="spinner"></div>
            <span>Загружаем учебные заведения…</span>
          </div>

          <div v-else-if="errorInstitutions" class="state-box error">
            <i class="bi bi-exclamation-triangle"></i>
            <span>{{ errorInstitutions }}</span>
          </div>

          <div v-else-if="!filteredInstitutions.length" class="state-box">
            <i class="bi bi-building"></i>
            <span>Результатов не найдено</span>
          </div>

          <div v-else class="inst-grid">
            <article
              v-for="institution in filteredInstitutions"
              :key="institution.id"
              class="inst-card"
            >
              <div class="inst-media">
                <img
                  :src="getImageUrl(institution.photo_url, defaultImage)"
                  :alt="institution.name"
                  @error="onImgError"
                />
              </div>
              <div class="inst-body">
                <div class="inst-top">
                  <h3 class="inst-name">{{ institution.name }}</h3>
                  <button
                    type="button"
                    class="heart-btn"
                    :class="{ liked: institution.isLiked, 'is-animating': institution.isAnimating }"
                    @click="toggleLike(institution)"
                    :aria-label="institution.isLiked ? 'Убрать из избранного' : 'В избранное'"
                  >
                    <img :src="institution.isLiked ? HeartFill : HeartLine" alt="" />
                  </button>
                </div>

                <div class="inst-rating">
                  <span
                    v-for="star in 5"
                    :key="star"
                    class="star"
                    :class="{ on: star <= Math.round(institution.reviews_avg_rating || 0) }"
                  >★</span>
                  <span class="likes">
                    <i class="bi bi-heart-fill"></i>
                    {{ institution.likes_count || 0 }}
                  </span>
                </div>

                <p class="inst-loc" v-if="institution.location || institution.address">
                  <i class="bi bi-geo-alt-fill"></i>
                  {{ institution.location || institution.address }}
                </p>
                <p class="inst-addr" v-if="institution.address && institution.location">
                  {{ institution.address }}
                </p>

                <div class="inst-features">
                  <span class="feat" :class="{ on: institution.grants }">
                    {{ institution.grants ? 'Есть гранты' : 'Без грантов' }}
                  </span>
                  <span class="feat" :class="{ on: institution.dormitory }">
                    {{ institution.dormitory ? 'Есть общежитие' : 'Нет общежития' }}
                  </span>
                </div>

                <div class="inst-actions">
                  <button
                    type="button"
                    class="btn-primary"
                    @click="$router.push(`/${isCollege ? 'College' : 'University'}About/${institution.id}`)"
                  >
                    Подробнее
                  </button>
                </div>
              </div>
            </article>
          </div>
        </section>
      </template>
    </div>

    <div v-if="showAuthModal" class="modal-overlay" @click.self="showAuthModal = false">
      <div class="modal-card">
        <h3>Требуется авторизация</h3>
        <p>Войдите в аккаунт, чтобы поставить лайк.</p>
        <div class="modal-actions">
          <button type="button" class="btn-ghost" @click="showAuthModal = false">Отмена</button>
          <button type="button" class="btn-primary" @click="redirectToLogin">Войти</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import HeartFill from '@/components/icons/heart-fill.png';
import HeartLine from '@/components/icons/heart-line.png';
import UnCardImage from '@/components/img/UnCard.png';
import ColCardImage from '@/components/img/CollegeCard.png';

export default {
  name: 'SpecializationAboutPage',

  data() {
    return {
      activeTab: 'about',
      specialization: {},
      institutions: [],
      filteredInstitutions: [],
      loading: true,
      loadingInstitutions: false,
      error: null,
      errorInstitutions: null,
      specializationName: '',
      specialtyName: '',
      qualificationName: '',
      isCollege: false,
      HeartFill,
      HeartLine,
      defaultImage: null,
      currentUser: null,
      showAuthModal: false,
    };
  },

  computed: {
    extraFields() {
      const s = this.specialization || {};
      const fields = [];
      if (s.requirements) fields.push({ key: 'req', label: 'Требования', value: s.requirements });
      if (s.opportunities) fields.push({ key: 'opp', label: 'Возможности', value: s.opportunities });
      if (s.skills) fields.push({ key: 'skills', label: 'Навыки', value: s.skills });
      if (s.description && !s.about1) {
        fields.push({ key: 'desc', label: 'Описание', value: s.description });
      }
      return fields;
    },
  },

  async created() {
    const savedData = JSON.parse(localStorage.getItem('selectedSpecialization') || '{}');
    this.specializationName = savedData.name || '';
    this.specialtyName = savedData.specialty_name || '';
    this.qualificationName =
      savedData.qualification?.name ||
      savedData.qualification_name ||
      'Неизвестная квалификация';
    this.isCollege = savedData.type === 'college';
    this.defaultImage = this.isCollege ? ColCardImage : UnCardImage;

    await this.fetchCurrentUser();
    await this.fetchData();
  },

  watch: {
    activeTab(newTab) {
      if (newTab === 'institutions') {
        this.fetchInstitutions(this.$route.params.id);
      }
    },
  },

  methods: {
    async fetchCurrentUser() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.currentUser = null;
          return;
        }
        const response = await axios.get('http://localhost:8000/api/current-user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.currentUser = response.data;
      } catch (error) {
        console.error('Error fetching current user:', error);
        this.currentUser = null;
      }
    },

    async fetchData() {
      this.loading = true;
      this.error = null;

      try {
        const savedData = JSON.parse(localStorage.getItem('selectedSpecialization') || '{}');
        const specializationId = savedData.id || this.$route.params.id;
        const type = savedData.type || 'university';

        if (!specializationId) {
          throw new Error('ID специализации не найден');
        }

        const endpoint =
          type === 'college'
            ? `http://localhost:8000/api/college-specializations/${specializationId}`
            : `http://localhost:8000/api/specializations/${specializationId}`;

        const response = await axios.get(endpoint);

        if (response.data.success) {
          this.specialization = response.data.data;
          this.specializationName = this.specialization.name;
          this.qualificationName =
            this.specialization.qualification?.qualification_name ||
            this.specialization.qualification?.name ||
            this.qualificationName ||
            'Неизвестная квалификация';
          this.specialtyName =
            this.specialization.qualification?.global_specialty?.name ||
            this.specialtyName ||
            '';
        } else {
          this.error = 'Не удалось загрузить данные о специальности';
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        this.error = 'Произошла ошибка при загрузке данных';
      } finally {
        this.loading = false;
      }
    },

    async fetchInstitutions(specializationId) {
      this.loadingInstitutions = true;
      this.errorInstitutions = null;

      try {
        const savedData = JSON.parse(localStorage.getItem('selectedSpecialization') || '{}');
        const type = savedData.type || 'university';
        const id = specializationId || savedData.id || this.$route.params.id;

        const endpoint =
          type === 'college'
            ? `http://localhost:8000/api/college-specializations/${id}/institutions`
            : `http://localhost:8000/api/specializations/${id}/institutions`;

        const response = await axios.get(endpoint);

        if (response.data.success) {
          const liked = this.currentUser ? await this.fetchLikedInstitutions() : [];
          const likedIds = new Set((liked || []).map((i) => i.id));
          const list = (response.data.data || []).map((inst) => ({
            ...inst,
            isLiked: likedIds.has(inst.id),
            isAnimating: false,
          }));
          this.institutions = list;
          this.filteredInstitutions = list;
        } else {
          this.errorInstitutions = 'Не удалось загрузить список учебных заведений';
        }
      } catch (error) {
        console.error('Ошибка при загрузке учебных заведений:', error);
        this.errorInstitutions = 'Произошла ошибка при загрузке данных';
      } finally {
        this.loadingInstitutions = false;
      }
    },

    async fetchLikedInstitutions() {
      try {
        const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
        const response = await axios.get('http://localhost:8000/api/liked-institutions', {
          headers,
        });
        return response.data;
      } catch (error) {
        console.error('Error fetching liked institutions:', error);
        return [];
      }
    },

    async toggleLike(institution) {
      if (!this.currentUser) {
        this.showAuthModal = true;
        return;
      }

      try {
        const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
        institution.isAnimating = true;

        if (institution.isLiked) {
          await axios.delete(
            `http://localhost:8000/api/institutions/${institution.id}/unlike`,
            { headers }
          );
          institution.isLiked = false;
          institution.likes_count = (institution.likes_count || 1) - 1;
        } else {
          await axios.post(
            `http://localhost:8000/api/institutions/${institution.id}/like`,
            {},
            { headers }
          );
          institution.isLiked = true;
          institution.likes_count = (institution.likes_count || 0) + 1;
        }

        const patch = (list) =>
          list.map((inst) =>
            inst.id === institution.id
              ? {
                  ...inst,
                  isLiked: institution.isLiked,
                  likes_count: institution.likes_count,
                  isAnimating: true,
                }
              : inst
          );

        this.institutions = patch(this.institutions);
        this.filteredInstitutions = patch(this.filteredInstitutions);

        setTimeout(() => {
          const clearAnim = (list) =>
            list.map((inst) =>
              inst.id === institution.id ? { ...inst, isAnimating: false } : inst
            );
          this.institutions = clearAnim(this.institutions);
          this.filteredInstitutions = clearAnim(this.filteredInstitutions);
        }, 300);
      } catch (error) {
        console.error('Error toggling like:', error);
      }
    },

    redirectToLogin() {
      this.showAuthModal = false;
      this.$router.push('/login');
    },

    navigateTo(path) {
      this.$router.push(path);
    },

    getImageUrl(url, fallback) {
      if (!url) return fallback;
      if (url.startsWith('http') || url.startsWith('data:')) return url;
      const base = 'http://localhost:8000';
      if (url.startsWith('/')) return `${base}${url}`;
      return `${base}/storage/${url}`;
    },

    onImgError(e) {
      e.target.src = this.defaultImage;
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
  background: linear-gradient(120deg, #0b1f2a 0%, #14384a 55%, #1795c0 160%);
  color: #fff;
  padding: 32px 20px 28px;
}

.page-hero-inner {
  max-width: 1100px;
  margin: 0 auto;
}

.page-badge {
  display: inline-block;
  padding: 6px 12px;
  border: 1px solid var(--gold);
  border-radius: 999px;
  color: var(--gold);
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 10px;
}

.page-hero h1 {
  font-size: clamp(1.4rem, 4vw, 2.2rem);
  font-weight: 800;
  margin: 0 0 10px;
  line-height: 1.2;
  color: #fff;
  word-break: break-word;
}

.page-sub {
  margin: 0 0 4px;
  color: rgba(255, 255, 255, 0.88);
  font-size: 1rem;
  line-height: 1.5;
}

.page-sub.muted {
  color: rgba(255, 255, 255, 0.65);
  font-size: 0.92rem;
}

.gold-text {
  color: var(--gold);
  font-weight: 700;
}

.page-body {
  max-width: 1100px;
  margin: 0 auto;
  padding: 20px 16px 48px;
}

.breadcrumb-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: var(--muted);
  margin-bottom: 16px;
}

.bc-link {
  border: none;
  background: none;
  padding: 0;
  color: var(--blue);
  font-weight: 600;
  cursor: pointer;
  font-size: inherit;
}

.bc-link:hover {
  color: var(--blue-dark);
}

.bc-sep {
  color: var(--gold);
  font-weight: 700;
}

.bc-current {
  color: var(--text);
  font-weight: 600;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: min(100%, 360px);
}

.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 18px;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 8px;
}

.tab {
  flex: 1 1 140px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid transparent;
  background: transparent;
  border-radius: 10px;
  padding: 12px 14px;
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--muted);
  cursor: pointer;
  transition: all 0.15s ease;
}

.tab:hover {
  color: var(--blue-dark);
  background: rgba(23, 149, 192, 0.06);
}

.tab.active {
  color: var(--blue-dark);
  background: rgba(23, 149, 192, 0.12);
  border-color: rgba(23, 149, 192, 0.3);
}

.tab i {
  color: var(--gold);
}

.about-card {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(16, 34, 46, 0.05);
}

.about-card-accent {
  height: 4px;
  background: linear-gradient(90deg, var(--blue), var(--gold));
}

.about-card-inner {
  padding: 22px 20px 24px;
}

.about-card h2 {
  margin: 0 0 8px;
  font-size: clamp(1.2rem, 3vw, 1.55rem);
  font-weight: 800;
  color: var(--navy);
  line-height: 1.25;
}

.qual-line {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 18px;
  color: var(--blue);
  font-weight: 600;
}

.qual-line i {
  color: var(--gold);
}

.about-blocks {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.about-item {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  padding: 14px 16px;
  background: linear-gradient(90deg, rgba(23, 149, 192, 0.06), rgba(176, 141, 79, 0.05));
  border: 1px solid var(--border);
  border-radius: 12px;
}

.about-num {
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  color: var(--gold);
  padding-top: 2px;
}

.about-item p {
  margin: 0;
  line-height: 1.65;
  color: #334155;
  font-size: 0.98rem;
  word-break: break-word;
}

.empty-about {
  text-align: center;
  padding: 28px 16px;
  color: var(--muted);
  background: #f8fafc;
  border-radius: 12px;
  border: 1px dashed var(--border);
}

.empty-about i {
  font-size: 1.5rem;
  color: var(--gold);
  display: block;
  margin-bottom: 8px;
}

.extra-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
  gap: 12px;
  margin-top: 16px;
}

.extra-card {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 14px;
  border-top: 3px solid var(--gold);
}

.extra-card h3 {
  margin: 0 0 8px;
  font-size: 0.85rem;
  font-weight: 800;
  color: var(--blue-dark);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.extra-card p {
  margin: 0;
  color: #334155;
  line-height: 1.55;
  font-size: 0.92rem;
  white-space: pre-wrap;
  word-break: break-word;
}

.inst-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
}

.inst-card {
  display: grid;
  grid-template-columns: minmax(120px, 220px) 1fr;
  gap: 0;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 6px 18px rgba(16, 34, 46, 0.04);
}

.inst-media {
  min-height: 160px;
  background: #e8f4f8;
}

.inst-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  min-height: 160px;
}

.inst-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.inst-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}

.inst-name {
  margin: 0;
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  font-weight: 800;
  color: var(--navy);
  line-height: 1.3;
  word-break: break-word;
}

.heart-btn {
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  flex-shrink: 0;
}

.heart-btn img {
  width: 28px;
  height: 28px;
  transition: transform 0.2s ease;
}

.heart-btn:hover img,
.heart-btn.is-animating img {
  transform: scale(1.15);
}

.inst-rating {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin: 8px 0;
}

.star {
  color: #d1d5db;
  font-size: 0.95rem;
}

.star.on {
  color: var(--gold);
}

.likes {
  color: var(--muted);
  font-size: 0.85rem;
  font-weight: 600;
}

.likes i {
  color: #e11d48;
  margin-right: 2px;
}

.inst-loc,
.inst-addr {
  margin: 0 0 4px;
  color: var(--muted);
  font-size: 0.9rem;
  line-height: 1.4;
  word-break: break-word;
}

.inst-loc i {
  color: var(--blue);
  margin-right: 4px;
}

.inst-features {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 10px 0 14px;
}

.feat {
  font-size: 0.78rem;
  font-weight: 700;
  padding: 6px 10px;
  border-radius: 999px;
  background: #f1f5f9;
  color: var(--muted);
  border: 1px solid var(--border);
}

.feat.on {
  background: rgba(23, 149, 192, 0.1);
  color: var(--blue-dark);
  border-color: rgba(23, 149, 192, 0.25);
}

.inst-actions {
  margin-top: auto;
}

.btn-primary {
  border: none;
  background: var(--blue);
  color: #fff;
  border-radius: 10px;
  padding: 10px 16px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s ease;
}

.btn-primary:hover {
  background: var(--blue-dark);
}

.btn-ghost {
  border: 1px solid var(--border);
  background: #fff;
  color: var(--text);
  border-radius: 10px;
  padding: 10px 16px;
  font-weight: 600;
  cursor: pointer;
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

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(11, 31, 42, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 16px;
}

.modal-card {
  width: min(420px, 100%);
  background: #fff;
  border-radius: 16px;
  padding: 22px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
}

.modal-card h3 {
  margin: 0 0 8px;
  color: var(--navy);
}

.modal-card p {
  margin: 0 0 18px;
  color: var(--muted);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
}

/* Tablet */
@media (max-width: 900px) {
  .inst-card {
    grid-template-columns: 160px 1fr;
  }
}

/* Phone */
@media (max-width: 640px) {
  .spec-page {
    padding-top: 64px;
  }

  .page-hero {
    padding: 24px 16px 22px;
  }

  .page-body {
    padding: 14px 12px 40px;
  }

  .tabs {
    padding: 6px;
  }

  .tab {
    flex: 1 1 100%;
    padding: 12px 10px;
    font-size: 0.9rem;
  }

  .about-card-inner {
    padding: 16px 14px 18px;
  }

  .about-item {
    grid-template-columns: 1fr;
    gap: 6px;
  }

  .inst-card {
    grid-template-columns: 1fr;
  }

  .inst-media {
    height: 180px;
  }

  .inst-media img {
    min-height: 180px;
    height: 180px;
  }

  .inst-body {
    padding: 14px;
  }

  .bc-current {
    max-width: 160px;
  }
}

@media (max-width: 380px) {
  .page-hero h1 {
    font-size: 1.3rem;
  }

  .btn-primary,
  .btn-ghost {
    width: 100%;
  }

  .modal-actions {
    flex-direction: column;
  }
}
</style>
