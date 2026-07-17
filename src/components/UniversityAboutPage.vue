<template>
  <div class="university-about-root">
  <div v-if="loading" class="loader-container">
    <div class="spinner"></div>
  </div>

  <div v-else class="university-container">
    <div v-if="error">{{ error }}</div>
    <div v-else>
      <!-- ===== Hero: фото вуза + логотип + название ===== -->
      <header class="uni-hero">
        <img v-if="photoSrc" :src="photoSrc" class="uni-hero-photo" alt="" />
        <div class="uni-hero-overlay"></div>
        <div class="uni-hero-content">
          <div class="uni-hero-logo">
            <div v-if="!imageLoaded.logo" class="image-loader">
              <div class="spinner"></div>
            </div>
            <img
              :src="logoSrc"
              class="uni-hero-logo-img"
              @load="imageLoaded.logo = true"
              :style="{ opacity: imageLoaded.logo ? 1 : 0 }"
            />
          </div>
          <div class="uni-hero-text">
            <h1>{{ university.name }}</h1>
            <div class="uni-hero-chips">
              <span class="hero-chip"><i class="bi bi-mortarboard-fill"></i> Университет</span>
              <span v-if="university.location" class="hero-chip">
                <i class="bi bi-geo-alt-fill"></i> {{ university.location }}
              </span>
              <span class="hero-chip" :class="university.dormitory ? 'is-yes' : 'is-muted'">
                <i class="bi bi-house-heart-fill"></i>
                {{ university.dormitory ? 'Есть общежитие' : 'Нет общежития' }}
              </span>
              <span class="hero-chip" :class="university.grants ? 'is-yes' : 'is-muted'">
                <i class="bi bi-award-fill"></i>
                {{ university.grants ? 'Есть гранты' : 'Нет грантов' }}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div class="university-info">
        <div class="university-description">
          <span class="section-eyebrow">Об университете</span>
          <p>{{ university.description1 }}</p>
          <p>{{ university.description2 }}</p>
          <p>{{ university.description3 }}</p>
        </div>

        <aside class="university-info-card">
          <h3 class="info-title">Основная информация</h3>
          <div class="info-details">
            <p v-if="university.address">
              <span class="info-icon"><i class="bi bi-geo-alt-fill"></i></span>
              <span>{{ university.address }}</span>
            </p>
            <p v-if="university.phone">
              <span class="info-icon"><i class="bi bi-telephone-fill"></i></span>
              <a :href="`tel:${university.phone}`">{{ university.phone }}</a>
            </p>
            <p v-if="university.website">
              <span class="info-icon"><i class="bi bi-globe2"></i></span>
              <a :href="university.website" target="_blank">{{ university.website }}</a>
            </p>
          </div>
          <ul class="info-list">
            <li>
              <i class="bi" :class="university.dormitory ? 'bi-check-circle-fill ok' : 'bi-x-circle-fill no'"></i>
              {{ university.dormitory ? 'Есть общежитие' : 'Нет общежития' }}
            </li>
            <li>
              <i class="bi" :class="university.grants ? 'bi-check-circle-fill ok' : 'bi-x-circle-fill no'"></i>
              {{ university.grants ? 'Есть гранты' : 'Нет грантов' }}
            </li>
          </ul>
        </aside>
      </div>

      <!-- Вкладки -->
      <div class="user-events">
        <div class="tabset">
  <input type="radio" name="tabset" id="tab1" aria-controls="Specialties" checked />
  <label for="tab1"><i class="bi bi-mortarboard-fill"></i><span>Специальности</span></label>

  <input type="radio" name="tabset" id="tab2" aria-controls="Events" />
  <label for="tab2"><i class="bi bi-calendar2-event-fill"></i><span>Мероприятия</span></label>

  <input type="radio" name="tabset" id="tab3" aria-controls="Reviews" />
  <label for="tab3"><i class="bi bi-chat-square-text-fill"></i><span>Отзывы</span></label>

  <input type="radio" name="tabset" id="tab4" aria-controls="Location" @change="locationTabChanged" />
  <label for="tab4"><i class="bi bi-geo-alt-fill"></i><span>Местоположение</span></label>

  <div class="tab-panels">
    <section id="Specialties" class="tab-panel">
      <div class="specialties-list">
        <div v-if="loading" class="qualification">
          <h4>Загрузка...</h4>
        </div>
        <div v-else-if="error" class="qualification">
          <h4>{{ error }}</h4>
        </div>
        <div v-else-if="!university.specializations || university.specializations.length === 0" class="qualification">
          <h4>Нет данных о специальностях</h4>
        </div>
        <div v-else>
          <div v-for="(specializations, qualificationName) in groupedSpecializations" 
               :key="qualificationName" 
            class="qualification">
            <h4>{{ qualificationName }}</h4>
            <div v-for="specialization in specializations"
                 :key="specialization.id"
                 class="specialty"
                 @click="navigateToSpecialization(specialization)">
              <p class="specialty-name">{{ specialization.name }}</p>
              <div class="specialty-meta">
                <span class="specialty-chip">
                  <i class="bi bi-cash-coin"></i>
                  Стоимость: {{ formatSpecialtyCost(specialization) }}
                </span>
                <span class="specialty-chip">
                  <i class="bi bi-clock-history"></i>
                  Длительность: {{ formatSpecialtyDuration(specialization) }}
                </span>
                <i class="bi bi-arrow-right specialty-arrow"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="Events" class="tab-panel">
      <div class="event-cards-container">
        <div v-if="events.length > 0">
          <div class="events-cont">
            <div v-for="event in events" :key="event.id" class="event-card">
              <span class="type-badge">{{ translateType(event.event_type) }}</span>
              <div class="event-logo">
                <img :src="logoSrc" class="event-logo-img" />
              </div>
              <div class="event-view">
                <h3 class="event-view-text">Университет</h3>
                <p class="event-view-text">{{ getDaysAgo(event.created_at) }}</p>
              </div>
              <div class="event-info">
                <h3 class="event-info-text">{{ university.name }}</h3>
                <hr class="event-line">
                <h3 class="event-info-text">{{ event.event_name }}</h3>
              </div>
              <div class="event-terms">
                <p class="terms-text">Описание: {{ event.description || 'Ничего' }}</p>
                <p class="terms-text">Дата: {{ formatEventDate(event.event_date) }}</p>
                <div class="event-buttons">
                  <button class="more-button" @click="openDetailsModal(event)">Подробнее</button>
                  <template v-if="event.event_type !== 'open'">
                    <span v-if="event.isApplied" class="applied-text">Подана</span>
                    <button v-else class="apply-button" @click="handleApplyClick(event)">
                      {{ event.event_type === 'group' ? 'Регистрация команды' : 'Записаться' }}
                    </button>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <p>Нет доступных мероприятий.</p>
        </div>
      </div>
    </section>

    <section id="Reviews" class="tab-panel">
      <!-- Форма для нового отзыва (только для авторизованных пользователей) -->
      <div v-if="isAuthenticated" class="review-form">
        <h3>Оставить отзыв</h3>
        <div class="rating-input">
          <span v-for="star in 5" :key="star" 
                @click="newReview.rating = star"
                class="star"
                :class="{ 'filled': star <= newReview.rating }">
            ★
          </span>
        </div>
        <textarea v-model="newReview.comment" 
                  placeholder="Ваш отзыв об университете"
                  class="review-textarea"></textarea>
        <button @click="submitReview" 
                :disabled="!newReview.rating"
                class="submit-review-btn">
          Отправить отзыв
        </button>
      </div>

      <!-- Существующие отзывы -->
      <div v-if="reviews.length > 0">
        <div v-for="review in reviews" :key="review.id" class="review-item">
          <div class="review-rating">
            {{ getStarRating(review.rating) }}
          </div>
          <div class="review-comment">
            <p>{{ review.comment }}</p>
          </div>
          <div class="review-user">
            <p>Отзыв от: {{ review.user.username }}</p>
            <p>Дата: {{ formatDate(review.created_at) }}</p>
          </div>
        </div>
      </div>
      <div v-else>
        <p>Нет отзывов.</p>
      </div>
    </section>

    <section id="Location" class="tab-panel">
      <div class="location-preview" @click="goToMap">
        <div ref="locationPreviewMap" class="preview-map"></div>
        <p class="click-hint">Нажмите, чтобы открыть карту</p>
      </div>
    </section>
  </div>
</div>
      </div>
    </div>
  </div>

  <!-- Success & auth modals same as college page -->
  <div v-if="showSuccessModal" class="success-modal-overlay">
    <div class="success-modal">
      <h3>Успех!</h3>
      <p>Ваша заявка успешно подана.</p>
      <button class="success-modal-close" @click="closeSuccessModal">ОК</button>
    </div>
  </div>

  <div v-if="showAuthModal" class="modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Требуется авторизация</h5>
      </div>
      <div class="modal-body">Пожалуйста, войдите, чтобы записаться.</div>
      <div class="modal-footer">
        <button class="btn btn-secondary" @click="showAuthModal=false">Отмена</button>
        <button class="btn btn-primary" @click="redirectToLogin">Войти</button>
      </div>
    </div>
  </div>

  <!-- Group registration modal -->
  <div v-if="showGroupModal" class="modal-overlay">
    <div class="modal-content group-modal">
      <h3>Регистрация команды на "{{ groupEvent?.event_name }}"</h3>
      <label>Название команды</label>
      <input v-model="teamName" placeholder="Team name" />
      <h4>Участники</h4>
      <div v-for="(m,idx) in members" :key="idx" class="member-row">
        <input v-model="m.user_id" placeholder="ID пользователя" />
        <input v-model="m.role" placeholder="Роль" />
        <button @click="removeMember(idx)" v-if="members.length>1">–</button>
      </div>
      <button @click="addMember">Добавить участника</button>
      <div v-if="groupSchema.length" class="schema-block">
        <h4>Дополнительные данные</h4>
        <div v-for="field in groupSchema" :key="field.name" class="form-row">
          <label>{{ field.label }}</label>
          <input v-model="groupAnswers[field.name]" :type="inputType(field.type)" :required="field.required" :placeholder="field.label" />
        </div>
      </div>
      <div class="modal-actions">
        <button @click="submitGroup">Отправить</button>
        <button @click="closeGroupModal">Отмена</button>
      </div>
      <p v-if="groupError" class="error-message">{{ groupError }}</p>
    </div>
  </div>

  <!-- Apply modal -->
  <div v-if="showApplyModal" class="modal-overlay">
    <div class="modal-content apply-modal">
      <h3>Заявка на "{{ currentEvent?.event_name }}"</h3>
      <form @submit.prevent="submitApply">
        <div v-for="field in currentSchema" :key="field.name" class="form-row">
          <label>{{ field.label }}</label>
          <input v-model="applyAnswers[field.name]" :type="inputType(field.type)" :required="field.required" :placeholder="field.label" />
        </div>
        <div class="modal-actions">
          <button type="submit">Отправить</button>
          <button type="button" @click="closeApplyModal">Отмена</button>
        </div>
        <p v-if="applyError" class="error-message">{{ applyError }}</p>
      </form>
    </div>
  </div>

  <!-- Custom details modal -->
  <div v-if="showDetailsModal" class="modal-overlay">
    <div class="details-modal">
      <div class="modal-header"><h5 class="modal-title">{{ detailsEvent?.event_name }}</h5></div>
      <div class="modal-body">
        <p><strong>{{ getInstitutionType() }}:</strong> {{ university.name }}</p>
        <p><strong>Дата:</strong> {{ formatEventDate(detailsEvent?.event_date) }}</p>
        <p><strong>Описание:</strong> {{ detailsEvent?.description || 'Нет описания' }}</p>
      </div>
      <div class="modal-footer">
        <span v-if="detailsEvent && detailsEvent.event_type !== 'open'">
          <span v-if="detailsEvent.isApplied" class="applied-text">Подана</span>
          <button v-else class="btn btn-primary" @click="applyFromDetails(detailsEvent)">
            {{ detailsEvent.event_type === 'group' ? 'Регистрация команды' : 'Записаться' }}
          </button>
        </span>
        <button class="btn btn-secondary" @click="closeDetailsModal">Закрыть</button>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import axios from "axios";
import { markRaw } from 'vue';
import UnFonImg from '@/components/img/UnFonimg.png';
import UnLogoImg from '@/components/img/UnLogo.png';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Modal } from 'bootstrap';

export default {
  name: 'UniversityAboutPage',
  inheritAttrs: false,
  props: {
    id: {
      type: [String, Number],
      default: null,
    },
  },
  data() {
    return {
      university: null,
      events: [],
      reviews: [],
      loading: true,
      error: null,
      isAuthenticated: false,
      newReview: {
        rating: 0,
        comment: ''
      },
      imageLoaded: {
        logo: false
      },
      previewMap: null,
      showSuccessModal: false,
      showAuthModal: false,
      currentUser: null,
      showGroupModal: false,
      groupEvent: null,
      teamName: '',
      members: [{ user_id: '', role: '' }],
      groupError: '',
      showApplyModal: false,
      currentEvent: null,
      currentSchema: [],
      applyAnswers: {},
      applyError: '',
      groupSchema: [],
      groupAnswers: {},
      showDetailsModal: false,
      detailsEvent: null,
    };
  },
  computed: {
    groupedSpecializations() {
      if (!this.university || !Array.isArray(this.university.specializations)) {
        console.warn('Specializations data is missing or not an array:', this.university?.specializations);
        return {};
      }

      return this.university.specializations.reduce((acc, specialization) => {
        const qualificationName = specialization?.qualification?.qualification_name || 'Неизвестная квалификация';
        if (!acc[qualificationName]) {
          acc[qualificationName] = [];
        }
        acc[qualificationName].push(specialization);
        return acc;
      }, {});
    },
    photoSrc() {
      if (!this.university?.photo_url) return UnFonImg;
      return this.getImageUrl(this.university.photo_url, UnFonImg);
    },
    logoSrc() {
      if (!this.university?.logo_url) return UnLogoImg;
      return this.getImageUrl(this.university.logo_url, UnLogoImg);
    },
  },
  methods: {
    async checkAuth() {
      const token = localStorage.getItem('token');
      if (!token) {
        this.isAuthenticated = false;
        this.currentUser = null;
        return;
      }
      try {
        const response = await axios.get('http://localhost:8000/api/current-user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.isAuthenticated = !!response.data;
        this.currentUser = response.data || null;
      } catch (e) {
        this.isAuthenticated = false;
        this.currentUser = null;
        // просроченный/битый токен — убираем, чтобы не долбить API 401
        if (e?.response?.status === 401) localStorage.removeItem('token');
      }
    },
    
    async submitReview() {
      try {
        const response = await axios.post(
          `http://localhost:8000/api/institutions/${this.$route.params.id}/reviews`,
          this.newReview,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        
        this.reviews.unshift(response.data);
        this.newReview = { rating: 0, comment: '' };
      } catch (error) {
        console.error('Ошибка при отправке отзыва:', error);
        this.error = 'Не удалось отправить отзыв';
      }
    },

    formatEventDate(dateString) {
      if (!dateString) return "Дата неизвестна";
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString("ru-RU", options);
    },

    async fetchUniversity() {
      this.loading = true;
      this.error = null;
      try {
        const id = this.$route.params.id;
        console.log('Fetching university with ID:', id);
        const response = await axios.get(`http://localhost:8000/api/institutions/${id}`);
        this.university = response.data;
        if (!this.university.specializations) {
          console.warn('No specializations data received for university:', this.university.name);
        }

        // Показываем страницу сразу; события и отзывы (вкладки ниже)
        // догружаются параллельно и не блокируют рендер
        this.loading = false;
        Promise.all([
          this.fetchEventsByInstitution(id),
          this.fetchReviewsByInstitution(id),
        ]).catch(() => {});

        // инициализируем превью-карту после загрузки данных
        this.$nextTick(() => this.initPreviewMap());
      } catch (error) {
        console.error("Ошибка при загрузке университета:", error);
        if (error.response) {
          if (error.response.status === 404) {
            this.error = "Учебное заведение не найдено";
          } else if (error.response.data && error.response.data.message) {
            this.error = error.response.data.message;
          } else {
            this.error = "Произошла ошибка при загрузке данных учебного заведения";
          }
          console.error("Response data:", error.response.data);
          console.error("Status code:", error.response.status);
        } else if (error.request) {
          this.error = "Не удалось подключиться к серверу";
          console.error("No response received:", error.request);
        } else {
          this.error = "Произошла ошибка при выполнении запроса";
          console.error("Request setup error:", error.message);
        }
      } finally {
        this.loading = false;
      }
    },

    async fetchEventsByInstitution(institutionId) {
      try {
        // checkAuth уже запущен в created() — не дублируем запрос current-user
        await this._authReady;
        const {data:evts}=await axios.get(`http://localhost:8000/api/institutions/${institutionId}/events`);
        let applied=[];
        if(this.currentUser){
          try{
            const token=localStorage.getItem('token');
            const resp=await axios.get('/api/user-applications',{headers:{Authorization:`Bearer ${token}`}});
            applied=(resp.data.data||resp.data||[]).map(a=>a.event_id);
          }catch{}
        }
        this.events=evts.map(ev=>({...ev,isApplied:applied.includes(ev.id)}));
      } catch (error) {
        // не пишем в this.error — он заменяет всю страницу, а события лишь вкладка
        console.error("Ошибка при загрузке событий:", error);
      }
    },

    async fetchReviewsByInstitution(institutionId) {
      try {
        const response = await axios.get(`http://localhost:8000/api/institutions/${institutionId}/reviews`);
        this.reviews = response.data;
        console.log("Reviews data:", this.reviews);
      } catch (error) {
        // не пишем в this.error — он заменяет всю страницу, а отзывы лишь вкладка
        console.error("Ошибка при загрузке отзывов:", error);
      }
    },

    getStarRating(rating) {
      const fullStar = '★';
      const emptyStar = '☆';
      return fullStar.repeat(rating) + emptyStar.repeat(5 - rating);
    },

    formatDate(dateString) {
      if (!dateString) return "";
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString("ru-RU", options);
    },

    getYearText(duration) {
      if (!duration) return "лет";
      if (duration === 1) {
        return "год";
      } else if (duration >= 2 && duration <= 4) {
        return "года";
      } else {
        return "лет";
      }
    },

    formatSpecialtyCost(specialization) {
      const cost = specialization?.pivot?.cost ?? specialization?.cost;
      if (cost === null || cost === undefined || cost === '' || Number(cost) <= 0) {
        return '-';
      }
      return Number(cost).toLocaleString('ru-RU') + ' ₸';
    },

    formatSpecialtyDuration(specialization) {
      const duration = specialization?.pivot?.duration ?? specialization?.duration;
      if (duration === null || duration === undefined || duration === '' || Number(duration) <= 0) {
        return '-';
      }
      return `${duration} ${this.getYearText(Number(duration))}`;
    },

    navigateToSpecialization(specialization) {
      // Сохраняем данные о выбранной специализации в localStorage
      localStorage.setItem('selectedSpecialization', JSON.stringify({
        id: specialization.id,
        name: specialization.name,
        qualification: specialization.qualification ? {
          id: specialization.qualification.id,
          name: specialization.qualification.qualification_name
        } : null,
        specialty_name: this.university.name,
        type: 'university',
        cost: specialization.pivot?.cost,
        duration: specialization.pivot?.duration
      }));
      
      // Переходим на страницу About
      this.$router.push({
        name: 'SpecializationAbout',
        params: { 
          id: specialization.id
        }
      });
    },

    initPreviewMap() {
      if (!this.university || !this.university.latitude || !this.university.longitude) return;

      if (!this.$refs.locationPreviewMap) {
        this.$nextTick(() => this.initPreviewMap());
        return;
      }

      if (this.previewMap) {
        this.previewMap.setView([this.university.latitude, this.university.longitude], 14);
        return;
      }

      this.previewMap = markRaw(
        L.map(this.$refs.locationPreviewMap, {
          zoomControl: false,
          attributionControl: false,
          dragging: false,
          scrollWheelZoom: false,
          zoomAnimation: false,
          markerZoomAnimation: false,
          fadeAnimation: false,
        }).setView([this.university.latitude, this.university.longitude], 14)
      );
      markRaw(
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 })
      ).addTo(this.previewMap);
      markRaw(
        L.marker([this.university.latitude, this.university.longitude])
      ).addTo(this.previewMap);
    },

    goToMap() {
      if (!this.university || !this.university.latitude || !this.university.longitude) return;
      this.$router.push({
        path: '/Map',
        query: {
          destLat: this.university.latitude,
          destLng: this.university.longitude,
          destName: this.university.name,
        }
      });
    },

    getImageUrl(url, fallback) {
      if (!url) return fallback;

      if (/^https?:\/\//.test(url)) {
        return url.replace('://localhost/', '://localhost:8000/');
      }

      const normalised = url.startsWith('/') ? url : `/${url}`;
      return `http://localhost:8000${normalised}`;
    },

    locationTabChanged() {
      this.$nextTick(() => {
        if (this.previewMap) {
          this.previewMap.invalidateSize();
        } else {
          this.initPreviewMap();
        }
      });
    },

    translateType(t){const map={open:'Открытое',closed:'Закрытое',group:'Групповое'};return map[t]||t;},
    getInstitutionType(){return 'Университет';},
    getDaysAgo(c){const d=new Date(c);const diff=Math.ceil((Date.now()-d)/(1000*60*60*24));return `Добавлено ${diff} дней назад`;},
    closeSuccessModal(){this.showSuccessModal=false;},
    redirectToLogin(){this.$router.push('/login');},
    async applyToEvent(id){if(!this.currentUser){this.showAuthModal=true;return;}try{const token=localStorage.getItem('token');await axios.post(`/api/events/${id}/apply`,{user_id:this.currentUser.id},{headers:{Authorization:`Bearer ${token}`}});this.showSuccessModal=true;this.events=this.events.map(e=>e.id===id?{...e,isApplied:true}:e);}catch(e){console.error(e);}},
    handleApplyClick(evt){
      if(evt.event_type==='group'){ this.openGroupModal(evt); return; }
      const schema=this.normalizeSchema(evt.application_schema);
      if(schema.length){ this.currentEvent=evt; this.currentSchema=schema; this.applyAnswers={}; this.showApplyModal=true; }
      else { this.applyToEvent(evt.id); }
    },
    modalApply(evt){const el=document.getElementById('eventModal'+evt.id);if(el){const inst=Modal.getInstance(el)||new Modal(el);inst.hide();setTimeout(()=>{document.body.classList.remove('modal-open');document.querySelectorAll('.modal-backdrop').forEach(b=>b.remove());this.handleApplyClick(evt);},300);}else{this.handleApplyClick(evt);}},
    openGroupModal(evt){
      this.groupEvent=evt; this.showGroupModal=true; this.teamName=''; this.members=[{ user_id:this.currentUser?.id||'', role:'капитан' }]; this.groupSchema=this.normalizeSchema(evt.application_schema); this.groupAnswers={};
    },
    closeGroupModal(){ this.showGroupModal=false; this.groupError=''; this.groupEvent=null; },
    addMember(){ this.members.push({ user_id:'', role:'' }); },
    removeMember(idx){ this.members.splice(idx,1); },
    async submitGroup(){ if(!this.teamName){ this.groupError='Введите название команды'; return; }
      try{ const token=localStorage.getItem('token'); await axios.post(`/api/events/${this.groupEvent.id}/apply`,{ institution_id:this.groupEvent.institution_id||this.groupEvent.institution?.id, team_name:this.teamName, members:this.members, payload:this.groupSchema.length?this.groupAnswers:undefined },{ headers:{ Authorization:`Bearer ${token}` }});
        this.closeGroupModal(); this.showSuccessModal=true; this.events=this.events.map(e=>e.id===this.groupEvent.id?{...e,isApplied:true}:e);
      }catch(e){ this.groupError=e.response?.data?.error||'Ошибка'; }
    },
    inputType(t){ const map={string:'text',email:'email',number:'number',phone:'tel'}; return map[t]||'text'; },
    normalizeSchema(raw){ if(!raw) return []; if(Array.isArray(raw)) return raw; try{ const p=JSON.parse(raw); return Array.isArray(p)?p:[]; }catch{return []; } },
    closeApplyModal(){ this.showApplyModal=false; this.applyError=''; },
    async submitApply(){ try{ const token=localStorage.getItem('token'); await axios.post(`/api/events/${this.currentEvent.id}/apply`,{ user_id:this.currentUser.id, payload:this.applyAnswers },{ headers:{ Authorization:`Bearer ${token}` }}); this.showApplyModal=false; this.showSuccessModal=true; this.events=this.events.map(e=>e.id===this.currentEvent.id?{...e,isApplied:true}:e);}catch(e){ this.applyError=e.response?.data?.error||'Ошибка'; } },
    openDetailsModal(event) {
      this.detailsEvent = event;
      this.showDetailsModal = true;
    },
    closeDetailsModal() {
      this.showDetailsModal = false;
      this.detailsEvent = null;
    },
    applyFromDetails(evt){
      this.closeDetailsModal();
      this.$nextTick(()=>this.handleApplyClick(evt));
    },
  },

  created() {
    // один запрос current-user на страницу; fetchEventsByInstitution ждёт этот промис
    this._authReady = this.checkAuth();
  },

  beforeUnmount() {
    if (this.previewMap) {
      try {
        this.previewMap.remove();
      } catch (e) {
        /* ignore */
      }
      this.previewMap = null;
    }
  },

  watch: {
    '$route.params.id': {
      handler: async function (newId) {
        if (newId) {
          await this.fetchUniversity();
        }
      },
      immediate: true,
    },
  },
};
</script>

<style scoped>
.university-about-root {
  --blue: var(--torap-blue, #1795c0);
  --blue-dark: var(--torap-blue-dark, #12799c);
  --gold: var(--torap-gold, #b08d4f);
  --gold-bright: var(--torap-gold-bright, #d4af37);
  --navy: #0b1f2a;
  --text: #10222e;
  --muted: #64748b;
  --border: #e6edf2;
  --bg: #f4f7f9;
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
}

.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 9999;
}

.spinner {
  width: 44px;
  height: 44px;
  border: 4px solid #e8eef2;
  border-top-color: var(--blue);
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.university-container {
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
}

/* ===== Hero: фото + тёмный оверлей, уходит под прозрачный навбар ===== */
.uni-hero {
  position: relative;
  overflow: hidden;
  min-height: 420px;
  display: flex;
  align-items: flex-end;
  background: var(--navy);
}

.uni-hero-photo {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  animation: heroZoom 1.2s ease-out both;
}

@keyframes heroZoom {
  from { transform: scale(1.06); }
  to { transform: scale(1); }
}

.uni-hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(4, 22, 32, 0.55) 0%, rgba(4, 22, 32, 0.25) 40%, rgba(4, 22, 32, 0.9) 100%);
}

.uni-hero-content {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: 120px 24px 34px;
  display: flex;
  align-items: flex-end;
  gap: 26px;
  animation: heroIn 0.6s ease-out both;
}

@keyframes heroIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.uni-hero-logo {
  position: relative;
  width: 128px;
  height: 128px;
  flex: 0 0 128px;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.35);
  overflow: hidden;
}

.uni-hero-logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 10px;
  box-sizing: border-box;
  transition: opacity 0.3s ease;
}

.uni-hero-text {
  min-width: 0;
}

.uni-hero-text h1 {
  font-size: clamp(1.6rem, 3.6vw, 2.5rem);
  font-weight: 800;
  color: #fff;
  line-height: 1.18;
  margin: 0 0 14px;
  text-shadow: 0 2px 18px rgba(0, 0, 0, 0.35);
}

.uni-hero-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.hero-chip {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 14px;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
}

.hero-chip i {
  color: var(--gold-bright);
  font-size: 0.9rem;
}

.hero-chip.is-yes {
  background: rgba(16, 185, 129, 0.18);
  border-color: rgba(16, 185, 129, 0.4);
}

.hero-chip.is-yes i {
  color: #34d399;
}

.hero-chip.is-muted {
  opacity: 0.65;
}

.hero-chip.is-muted i {
  color: rgba(255, 255, 255, 0.55);
}

/* ===== Описание + инфокарта ===== */
.university-info {
  max-width: 1240px;
  margin: 0 auto;
  padding: 36px 24px 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 26px;
  align-items: flex-start;
}

.university-description {
  flex: 1 1 520px;
  min-width: 0;
  font-size: 1.02rem;
  line-height: 1.75;
  color: #2b3d47;
}

.university-description p {
  margin: 0 0 14px;
}

.section-eyebrow {
  display: block;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 10px;
}

.section-eyebrow::after {
  content: '';
  display: block;
  width: 36px;
  height: 2px;
  border-radius: 2px;
  background: linear-gradient(90deg, var(--gold), transparent);
  margin-top: 6px;
}

.university-info-card {
  flex: 0 1 340px;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 22px;
  box-shadow: 0 10px 30px rgba(16, 34, 46, 0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.university-info-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 38px rgba(16, 34, 46, 0.1);
}

.info-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--text);
  margin: 0 0 16px;
}

.info-details p {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 0 12px;
  font-size: 0.93rem;
  color: var(--text);
  word-break: break-word;
}

.info-details a {
  color: var(--blue-dark);
  text-decoration: none;
  padding: 0;
}

.info-details a:hover {
  color: var(--blue);
  background: none;
  transform: none;
}

.info-icon {
  width: 38px;
  height: 38px;
  border-radius: 11px;
  flex: 0 0 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: var(--blue);
  background: linear-gradient(135deg, rgba(23, 149, 192, 0.14), rgba(23, 149, 192, 0.05));
  box-shadow: inset 0 0 0 1px rgba(23, 149, 192, 0.12);
}

.info-list {
  list-style: none;
  padding: 14px 0 0;
  margin: 6px 0 0;
  border-top: 1px solid var(--border);
}

.info-list li {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 8px;
  color: #2b3d47;
  font-size: 0.92rem;
  font-weight: 500;
}

.info-list i.ok {
  color: #10b981;
}

.info-list i.no {
  color: #cbd5dd;
}

/* ===== Вкладки ===== */
.user-events {
  max-width: 1240px;
  margin: 10px auto 0;
  padding: 0 24px 56px;
}

.tabset {
  max-width: 100%;
}

.tabset > input[type='radio'] {
  position: absolute;
  left: -200px;
}

.tabset .tab-panel {
  display: none;
}

.tabset > input:first-child:checked ~ .tab-panels > .tab-panel:first-child,
.tabset > input:nth-child(3):checked ~ .tab-panels > .tab-panel:nth-child(2),
.tabset > input:nth-child(5):checked ~ .tab-panels > .tab-panel:nth-child(3),
.tabset > input:nth-child(7):checked ~ .tab-panels > .tab-panel:nth-child(4) {
  display: block;
  animation: panelIn 0.3s ease-out both;
}

@keyframes panelIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Вкладки: строка с иконками и анимированной чертой под активной */
.tabset > label {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  width: 25%;
  padding: 14px 8px 15px;
  margin: 0;
  border-bottom: 2px solid var(--border);
  cursor: pointer;
  font-weight: 600;
  color: var(--muted);
  font-size: 0.97rem;
  transition: color 0.2s ease;
  user-select: none;
  box-sizing: border-box;
}

.tabset > label i {
  font-size: 1.05rem;
  transition: color 0.2s ease, transform 0.2s ease;
}

/* Градиентная черта — вырастает под активной вкладкой */
.tabset > label::after {
  content: '';
  position: absolute;
  left: 14%;
  right: 14%;
  bottom: -2px;
  height: 3px;
  border-radius: 3px;
  background: linear-gradient(90deg, var(--blue), var(--gold-bright));
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
}

.tabset > label:hover {
  color: var(--blue-dark);
}

.tabset > input:checked + label {
  color: var(--text);
}

.tabset > input:checked + label i {
  color: var(--gold);
  transform: translateY(-1px) scale(1.08);
}

.tabset > input:checked + label::after {
  transform: scaleX(1);
}

.tabset > input:focus-visible + label {
  outline: 2px solid var(--blue);
  outline-offset: -2px;
  border-radius: 8px;
}

.tab-panel {
  margin-top: 8px;
  padding: 26px;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 18px;
  box-shadow: 0 10px 30px rgba(16, 34, 46, 0.05);
}

/* ===== Специальности ===== */
.specialties-list {
  display: flex;
  flex-direction: column;
}

.qualification {
  margin-bottom: 26px;
}

.qualification h4 {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text);
  font-size: 1.12rem;
  margin: 0 0 14px;
  font-weight: 800;
}

.qualification h4::before {
  content: '';
  width: 4px;
  height: 20px;
  border-radius: 3px;
  background: linear-gradient(180deg, var(--gold-bright), var(--gold));
  flex: 0 0 4px;
}

.specialty {
  position: relative;
  background: #f7fafc;
  border: 1px solid var(--border);
  padding: 16px 18px;
  border-radius: 14px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
}

.specialty:hover {
  transform: translateY(-3px);
  border-color: rgba(23, 149, 192, 0.45);
  box-shadow: 0 12px 28px rgba(16, 34, 46, 0.09);
}

.specialty-name {
  font-weight: 700;
  color: var(--text);
  font-size: 1.02rem;
  margin: 0 0 10px;
}

.specialty-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.specialty-chip {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--blue-dark);
  background: rgba(23, 149, 192, 0.08);
  border: 1px solid rgba(23, 149, 192, 0.18);
}

.specialty-chip i {
  color: var(--gold);
}

.specialty-arrow {
  margin-left: auto;
  color: var(--blue);
  opacity: 0;
  transform: translateX(-6px);
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.specialty:hover .specialty-arrow {
  opacity: 1;
  transform: translateX(0);
}

/* ===== Мероприятия ===== */
.events-cont {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

@media (min-width: 768px) {
  .events-cont {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1200px) {
  .events-cont {
    grid-template-columns: repeat(3, 1fr);
  }
}

.event-card {
  position: relative;
  background: linear-gradient(160deg, #10222e 0%, #14384a 100%);
  padding: 20px;
  border-radius: 18px;
  width: 100%;
  box-sizing: border-box;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.event-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 40px rgba(11, 31, 42, 0.35);
}

.event-logo-img {
  width: 52px;
  height: 52px;
  background-color: #fff;
  border-radius: 13px;
  padding: 5px;
  object-fit: contain;
}

.event-logo {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.event-view {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 10px;
}

.event-line {
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.14);
  margin: 8px 0;
}

.event-view-text {
  color: rgba(255, 255, 255, 0.55);
  font-size: 0.85rem;
  margin: 0;
}

.event-info-text {
  color: #fff;
  font-size: 1.02rem;
  font-weight: 600;
  margin: 0;
}

.event-terms {
  margin-top: 16px;
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.terms-text {
  font-size: 0.88rem;
  margin: 0 0 6px;
}

.type-badge {
  position: absolute;
  top: 14px;
  right: 14px;
  background: linear-gradient(135deg, var(--gold-bright), var(--gold));
  color: #10222e;
  padding: 4px 11px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
}

.event-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 12px;
}

.more-button,
.apply-button {
  padding: 9px 16px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.88rem;
  transition: transform 0.15s ease, filter 0.15s ease;
}

.more-button {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.22);
}

.apply-button {
  background: linear-gradient(135deg, var(--blue), var(--blue-dark));
  color: #fff;
  box-shadow: 0 6px 16px rgba(23, 149, 192, 0.4);
}

.more-button:hover,
.apply-button:hover {
  transform: translateY(-1px);
  filter: brightness(1.1);
}

.applied-text {
  color: #34d399;
  font-weight: 700;
  align-self: center;
}

/* ===== Отзывы ===== */
.review-form {
  margin-bottom: 22px;
  padding: 20px;
  border: 1px solid var(--border);
  border-radius: 16px;
  background: #f7fafc;
}

.review-form h3 {
  margin: 0 0 6px;
  font-size: 1.08rem;
  font-weight: 800;
}

.rating-input {
  margin: 10px 0;
}

.star {
  font-size: 26px;
  cursor: pointer;
  color: #cbd5dd;
  transition: color 0.15s ease, transform 0.15s ease;
  display: inline-block;
}

.star:hover {
  transform: scale(1.15);
}

.star.filled {
  color: var(--gold-bright);
}

.review-textarea {
  width: 100%;
  min-height: 100px;
  margin: 10px 0;
  padding: 12px 14px;
  border: 1px solid var(--border);
  border-radius: 12px;
  font-size: 0.95rem;
  box-sizing: border-box;
  outline: none;
  resize: vertical;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.review-textarea:focus {
  border-color: var(--blue);
  box-shadow: 0 0 0 3px rgba(23, 149, 192, 0.15);
}

.submit-review-btn {
  padding: 11px 24px;
  background: linear-gradient(135deg, var(--blue), var(--blue-dark));
  color: #fff;
  border: none;
  border-radius: 11px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(23, 149, 192, 0.3);
  transition: transform 0.15s ease, filter 0.15s ease;
}

.submit-review-btn:not(:disabled):hover {
  transform: translateY(-1px);
  filter: brightness(1.08);
}

.submit-review-btn:disabled {
  background: #c2cdd4;
  box-shadow: none;
  cursor: not-allowed;
}

.review-item {
  background: #f7fafc;
  padding: 16px 18px;
  border: 1px solid var(--border);
  border-radius: 14px;
  margin-bottom: 10px;
  transition: border-color 0.2s ease;
}

.review-item:hover {
  border-color: rgba(23, 149, 192, 0.35);
}

.review-rating {
  font-size: 1.2rem;
  color: var(--gold-bright);
  letter-spacing: 2px;
}

.review-comment {
  font-size: 0.96rem;
  color: #2b3d47;
  margin-top: 8px;
  line-height: 1.55;
}

.review-comment p {
  margin: 0;
}

.review-user {
  font-size: 0.82rem;
  color: var(--muted);
  margin-top: 10px;
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}

.review-user p {
  margin: 0;
}

/* ===== Местоположение ===== */
.preview-map {
  width: 100%;
  height: 320px;
  border-radius: 14px;
  overflow: hidden;
}

.location-preview {
  cursor: pointer;
  position: relative;
}

.location-preview:hover .click-hint {
  background: var(--blue);
  color: #fff;
}

.click-hint {
  position: absolute;
  left: 50%;
  bottom: 16px;
  transform: translateX(-50%);
  z-index: 500;
  margin: 0;
  padding: 9px 18px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.94);
  color: var(--text);
  font-size: 0.88rem;
  font-weight: 600;
  box-shadow: 0 8px 22px rgba(16, 34, 46, 0.2);
  transition: background 0.2s ease, color 0.2s ease;
  pointer-events: none;
}

/* ===== Лоадеры картинок ===== */
.image-loader {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
  background-color: #f3f6f8;
}

.image-loader .spinner {
  width: 28px;
  height: 28px;
  border-width: 3px;
}

/* ===== Модалки ===== */
.success-modal-overlay,
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(4, 22, 32, 0.55);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  padding: 16px;
}

.success-modal {
  background: #fff;
  padding: 26px;
  border-radius: 16px;
  text-align: center;
  width: 320px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.25);
}

.success-modal h3 {
  margin: 0 0 8px;
  font-weight: 800;
}

.success-modal-close {
  margin-top: 12px;
  padding: 10px 26px;
  background: linear-gradient(135deg, var(--blue), var(--blue-dark));
  color: #fff;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
}

.modal-content,
.apply-modal,
.group-modal,
.details-modal {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.25);
  max-width: 420px;
  width: 100%;
  text-align: center;
  overflow: hidden;
}

.apply-modal,
.group-modal {
  padding: 20px;
}

.modal-header {
  padding: 18px 20px;
  background: var(--navy);
  color: #fff;
}

.modal-title {
  margin: 0;
  font-weight: 700;
}

.modal-body {
  padding: 20px;
  font-size: 0.98rem;
  color: #2b3d47;
  text-align: left;
}

.modal-footer {
  padding: 14px 20px;
  background: #f7fafc;
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 14px;
}

.modal-actions button,
.modal-footer .btn {
  padding: 10px 18px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}

.modal-actions button:first-child,
.modal-footer .btn-primary {
  background: linear-gradient(135deg, var(--blue), var(--blue-dark));
  color: #fff;
}

.modal-actions button:last-child,
.modal-footer .btn-secondary {
  background: #eef2f5;
  color: var(--text);
}

.group-modal input,
.apply-modal input {
  width: 100%;
  padding: 10px 13px;
  margin: 6px 0;
  border: 1px solid var(--border);
  border-radius: 10px;
  font-size: 0.93rem;
  box-sizing: border-box;
  outline: none;
}

.group-modal input:focus,
.apply-modal input:focus {
  border-color: var(--blue);
  box-shadow: 0 0 0 3px rgba(23, 149, 192, 0.14);
}

.member-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.error-message {
  color: #dc2626;
  margin-top: 8px;
}

/* ===== Адаптив ===== */
@media (max-width: 768px) {
  .uni-hero {
    min-height: 340px;
  }

  .uni-hero-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    padding: 100px 16px 26px;
  }

  .uni-hero-logo {
    width: 92px;
    height: 92px;
    flex-basis: 92px;
  }

  .university-info {
    padding: 26px 16px 6px;
  }

  .university-info-card {
    flex-basis: 100%;
  }

  .user-events {
    padding: 0 16px 44px;
  }

  .tab-panel {
    padding: 18px 14px;
  }

  .tabset > label {
    width: 50%;
    padding: 12px 6px;
    font-size: 0.88rem;
    gap: 7px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .uni-hero-photo,
  .uni-hero-content {
    animation: none;
  }
}
</style>