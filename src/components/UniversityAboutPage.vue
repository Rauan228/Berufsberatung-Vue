<template>
  <div v-if="loading" class="loader-container">
    <div class="spinner"></div>
  </div>

  <div v-else class="university-container">
    <div v-if="error">{{ error }}</div>
    <div v-else>
      <div class="university-background">
        <img v-if="photoSrc" :src="photoSrc" class="university-backgroundImg" />
        <div v-else class="university-bg-placeholder"></div>
      </div>

      <div class="university-main">
        <div class="university-logo">
          <div v-if="!imageLoaded.logo" class="image-loader">
            <div class="spinner"></div>
          </div>
          <img 
            :src="logoSrc" 
            class="university-logo-img" 
            @load="imageLoaded.logo = true"
            :style="{ display: imageLoaded.logo ? 'block' : 'none' }"
          />
        </div>
        <div class="university-name">
          <h1>{{ university.name }}</h1>
        </div>
      </div>

      <div class="university-info">
        <div class="university-description">
          <p>{{ university.description1 }}</p><br>
          <p>{{ university.description2 }}</p><br>
          <p>{{ university.description3 }}</p>
        </div>

        <div class="university-info-block">
          <div class="university-info-card">
            <h3 class="info-title">Основная информация</h3>
            <ul class="info-list">
              <li><span class="dot"></span> Университет</li>
              <li><span class="dot"></span> {{ university.dormitory ? 'Есть общежитие' : 'Нет общежития' }}</li>
              <li><span class="dot"></span> {{ university.grants ? 'Есть гранты' : 'Нет грантов' }}</li>
            </ul>
            <div class="info-details">
              <p>
                <img src="@/components/img/location.png" class="icon" /> {{ university.address }}
              </p>
              <p>
                <img src="@/components/img/Phone.png" class="icon" />
                <a :href="`tel:${university.phone}`">{{ university.phone }}</a>
              </p>
              <p>
                <img src="@/components/img/Website.png" class="icon" />
                <a :href="university.website" target="_blank">{{ university.website }}</a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Вкладки -->
      <div class="user-events">
        <div class="tabset">
  <input type="radio" name="tabset" id="tab1" aria-controls="Specialties" checked />
  <label for="tab1">Специальности</label>

  <input type="radio" name="tabset" id="tab2" aria-controls="Events" />
  <label for="tab2">Мероприятия</label>

  <input type="radio" name="tabset" id="tab3" aria-controls="Reviews" />
  <label for="tab3">Отзывы</label>

  <input type="radio" name="tabset" id="tab4" aria-controls="Location" @change="locationTabChanged" />
  <label for="tab4">Местоположение</label>

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
              <p class="specialty-cost">Стоимость: {{ specialization.pivot && specialization.pivot.cost ? specialization.pivot.cost + '₸' : 'Не указана' }}</p>
              <p class="specialty-duration">Длительность: {{ specialization.pivot && specialization.pivot.duration ? specialization.pivot.duration + ' ' + getYearText(specialization.pivot.duration) : 'Не указана' }}</p>
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
                <p2 class="event-view-text">{{ getDaysAgo(event.created_at) }}</p2>
              </div>
              <div class="event-info">
                <h3 class="event-info-text">{{ university.name }}</h3>
                <hr class="event-line">
                <h3 class="event-info-text">{{ event.event_name }}</h3>
              </div>
              <div class="event-terms">
                <p3 class="terms-text">Описание: {{ event.description || 'Ничего' }}</p3>
                <p3 class="terms-text">Дата: {{ formatEventDate(event.event_date) }}</p3>
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
</template>

<script>
import axios from "axios";
import UnFonImg from '@/components/img/UnFonimg.png';
import UnLogoImg from '@/components/img/UnLogo.png';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Modal } from 'bootstrap';

export default {
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
      try {
        const response = await axios.get('http://localhost:8000/api/current-user', { headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}});
        this.isAuthenticated = !!response.data;
        this.currentUser = response.data || null;
      } catch { this.isAuthenticated=false; this.currentUser=null; }
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
        console.log("University data:", this.university);
        if (!this.university.specializations) {
          console.warn('No specializations data received for university:', this.university.name);
        }
        await this.fetchEventsByInstitution(id);
        await this.fetchReviewsByInstitution(id);

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
        await this.checkAuth();
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
        console.error("Ошибка при загрузке событий:", error);
        this.error = "Ошибка загрузки событий";
      }
    },

    async fetchReviewsByInstitution(institutionId) {
      try {
        const response = await axios.get(`http://localhost:8000/api/institutions/${institutionId}/reviews`);
        this.reviews = response.data;
        console.log("Reviews data:", this.reviews);
      } catch (error) {
        console.error("Ошибка при загрузке отзывов:", error);
        this.error = "Ошибка загрузки отзывов";
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

      this.previewMap = L.map(this.$refs.locationPreviewMap, {
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        scrollWheelZoom: false,
      }).setView([this.university.latitude, this.university.longitude], 14);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(this.previewMap);
      L.marker([this.university.latitude, this.university.longitude]).addTo(this.previewMap);
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
    this.checkAuth();
    this.fetchUniversity();
  },

  watch: {
    '$route.params.id': {
      handler: async function(newId) {
        if (newId) {
          await this.fetchUniversity();
        }
      },
      immediate: true
    },
  }
};
</script>

<style scoped>
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
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.review-form {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.rating-input {
  margin: 10px 0;
}

.star {
  font-size: 24px;
  cursor: pointer;
  color: #ccc;
}

.star.filled {
  color: #ffd700;
}

.review-textarea {
  width: 100%;
  min-height: 100px;
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.submit-review-btn {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.submit-review-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.review-item {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.review-rating {
  font-size: 1.5rem;
  color: #ffd700;
}

.review-comment {
  font-size: 1rem;
  color: #555;
  margin-top: 10px;
}

.review-user {
  font-size: 0.9rem;
  color: #777;
  margin-top: 10px;
}

.events-cont {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(4, auto);
  gap: 30px;
  padding: 20px;
}

@media (min-width: 768px) {
  .events-cont {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .events-cont {
    grid-template-columns: repeat(4, 1fr);
  }
}

.university-container {
  width: 100%;
  min-height: 100vh;
  margin-top: 4.5%;
  padding: 20px;
  box-sizing: border-box;
}

.university-backgroundImg {
  width: 100%;
  height: 400px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.university-backgroundImg:hover {
  transform: scale(1.02);
}

.university-logo {
  position: absolute;
  width: 100px;
  height: 100px;
  bottom: 250px;
  left: 100px;
}

.university-logo-img {
  position: absolute;
  width: 350px;
  height: 350px;
  border-radius: 12px;
  background-color: #f4f4f4;
  transition: transform 0.3s ease;
}

.university-logo-img:hover {
  transform: scale(1.05);
}

.university-main {
  width: 100%;
  height: 250px;
  position: relative;
  display: flex;
  align-items: center;
}

.university-name {
  display: flex;
  justify-content: center;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  margin: 0 0 0 500px;
  padding: 10px;
  max-width: 80%;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

h1 {
  font-size: 4rem;
  font-weight: bold;
  color: #424242;
  transition: color 0.3s ease;
  text-align: center;
}

h1:hover {
  color: #10222e;
}

.university-info {
  display: flex;
  padding: 5% 6% 3% 6%;
  flex-wrap: wrap;
}

.university-description {
  width: 50%;
  height: 100%;
  font-size: 1.2em;
  line-height: 1.6;
}

.university-info-card {
  width: 350px;
  border-radius: 8px;
  padding: 16px;
  background-color: #f1f1f1;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-left: 100%;
  transition: transform 0.3s ease;
}

.university-info-card:hover {
  transform: translateY(-10px);
}

.info-title {
  font-size: 2em;
  font-weight: bold;
  color: #333;
  margin-bottom: 12px;
}

.info-list {
  list-style: none;
  padding: 0;
  margin-bottom: 12px;
}

.info-list li {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
  color: #555;
  font-size: 1.4em;
}

.dot {
  width: 8px;
  height: 8px;
  background-color: lightgray;
  border-radius: 50%;
  margin-right: 8px;
}

.info-details p {
  display: flex;
  align-items: center;
  margin: 10px 0;
  font-size: 1.4em;
  color: #333;
}

.icon {
  width: 25px;
  height: 25px;
  margin-right: 8px;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.icon:hover {
  opacity: 1;
}

.a {
  color: #424242;
  text-decoration: none;
  transition: color 0.3s ease;
}

.a:hover {
  color: #10222e;
}

.user-events {
  margin-top: 20px;
}

.tabset {
  max-width: 100%;
}

.tabset>input[type="radio"] {
  position: absolute;
  left: -200px;
}

.tabset .tab-panel {
  display: none;
}

.tabset>input:first-child:checked~.tab-panels>.tab-panel:first-child,
.tabset>input:nth-child(3):checked~.tab-panels>.tab-panel:nth-child(2),
.tabset>input:nth-child(5):checked~.tab-panels>.tab-panel:nth-child(3),
.tabset>input:nth-child(7):checked~.tab-panels>.tab-panel:nth-child(4) {
  display: block;
}

.tabset>label {
  position: relative;
  display: inline-block;
  padding: 15px 15px 15px;
  border-bottom: none;
  cursor: pointer;
  font-weight: bold;
  margin-left: 5%;
  color: #919ea9;
  font-size: 1.5em;
}

.tabset>label:hover,
.tabset>input:focus+label,
.tabset>input:checked+label {
  color: #10222e;
  border-bottom: solid;
}

.tabset>label:hover::after,
.tabset>input:focus+label::after,
.tabset>input:checked+label::after {
  background: #10222e;
  color: #10222e;
}

.tabset>input:checked+label {
  margin-bottom: -1px;
  border-bottom: solid #10222e;
}

.tab-panel {
  padding: 30px;
  border-top: 1px solid #919ea9;
}

.specialties-list {
  display: flex;
  flex-direction: column;
  padding: 10px;
}

.qualification {
  margin-bottom: 20px;
}

.qualification h4 {
  color: #10222e;
  font-size: 1.3em;
  margin-bottom: 15px;
  font-weight: 600;
}

.specialty {
  width: 70%;
  background-color: #f4f4f4;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.specialty:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.specialty p {
  color: #333;
  font-size: 1.1em;
  margin: 5px 0;
}

.specialty-name {
  font-weight: 600;
  color: #10222e !important;
  font-size: 1.2em !important;
}

.specialty-cost, .specialty-duration {
  color: #666 !important;
}

@media (max-width: 768px) {
  .specialty {
    width: 100%;
}

  .qualification h4 {
    font-size: 1.2em;
  }
  
  .specialty p {
    font-size: 1em;
  }
}

.event-card {
  background-color: #536274;
  padding: 20px;
  border-radius: 12px;
  width: 400px;
  box-sizing: border-box;
  margin: 0 0 50px 0;
  transition: transform 0.3s ease;
  position: relative;
}

.event-card:hover {
  transform: translateY(-5px);
}

.event-logo-img {
  width: 50px;
  height: 50px;
  background-color: white;
  border-radius: 12px;
  padding: 5px;
}

.event-logo {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10%;
}

.event-view {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 5%;
}

.event-line {
  border: 1px solid #10222e;
}

.event-view-text {
  color: #cdcccc;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 0px;
}

.event-info-text {
  color: white;
}

.event-terms {
  margin: 50px 0 0 0;
  color: #cdcccc;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.image-loader {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #f3f3f3;
}

.spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.university-bg-placeholder {
  width: 100%;
  height: 400px;
  background-color: #ffffff;
}

.preview-map {
  width: 100%;
  height: 300px;
}
.location-preview {
  cursor: pointer;
}
.click-hint {
  text-align: center;
  margin-top: 8px;
  color: #666;
  font-size: 0.9rem;
}

.type-badge{position:absolute;top:8px;right:8px;background:#008FFF;color:#fff;padding:2px 6px;border-radius:4px;font-size:12px;}
.event-buttons{display:flex;gap:10px;margin-top:10px;}
.more-button,.apply-button{padding:6px 12px;border:none;border-radius:6px;cursor:pointer;background:#577c8e;color:#fff;}
.applied-text{color:#4fa300;font-weight:600;}
.success-modal-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;justify-content:center;align-items:center;z-index:2000;}
.success-modal{background:#fff;padding:20px;border-radius:12px;text-align:center;width:300px;}
.success-modal-close{padding:8px 20px;background:#577c8e;color:#fff;border:none;border-radius:6px;cursor:pointer;}
.modal-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;justify-content:center;align-items:center;z-index:2000;}
.modal-header{padding:20px;background:#04202D;color:#fff;border-top-left-radius:12px;border-top-right-radius:12px;}
.modal-footer{padding:15px;display:flex;justify-content:space-between;}
.modal-actions{display:flex;justify-content:space-between;margin-top:10px;}
.error-message{color:red;margin-top:8px;}
.apply-modal,.group-modal{background:#fff;border-radius:12px;max-width:400px;width:100%;text-align:center;}
.details-modal{background:#fff;border-radius:15px;box-shadow:0 10px 30px rgba(0,0,0,0.2);max-width:400px;width:100%;text-align:center;}
.details-modal .modal-header{padding:20px;background:#04202D;color:#fff;border-top-left-radius:15px;border-top-right-radius:15px;}
.details-modal .modal-body{padding:20px;font-size:1rem;color:#333;}
.details-modal .modal-footer{padding:15px;background:#f8f9fa;border-bottom-left-radius:15px;border-bottom-right-radius:15px;display:flex;justify-content:space-between;}
</style>