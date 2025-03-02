  <template>
    <div class="university-container">
      <div v-if="loading">Загрузка...</div>
      <div v-else-if="error">{{ error }}</div>
      <div v-else>
        <div class="university-background">
          <img :src="university.photo_url || '@/components/img/UnFonimg.png'" class="university-backgroundImg" />
        </div>

        <div class="university-main">
          <div class="university-logo">
            <img :src="university.logo_url || '@/components/img/UnLogo.png'" class="university-logo-img" />
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
                  <img src="@/components/img/location.png" class="icon" /> {{ university.location }}
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
            <label for="tab1">Specialties</label>

            <input type="radio" name="tabset" id="tab2" aria-controls="Events" />
            <label for="tab2">Events</label>

            <input type="radio" name="tabset" id="tab3" aria-controls="location" />
            <label for="tab3">Location</label>

            <div class="tab-panels">
              <section id="Specialties" class="tab-panel">
                <div class="specialties-list">
                  <div v-if="university.specializations && university.specializations.length > 0">
                    <div v-for="(specializations, qualificationName) in groupedSpecializations" :key="qualificationName"
                      class="qualification">
                      <h4>{{ qualificationName }}</h4>
                      <div v-for="specialization in specializations" :key="specialization.id" class="specialty">
                        <p>{{ specialization.name }}</p>
                        <p>Cost: {{ specialization.pivot.cost }}₸</p>
                        <p>Duration: {{ specialization.pivot.duration }} {{ getYearText(specialization.pivot.duration)
                        }}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div v-else>
                    <p>Нет данных о квалификациях и специальностях.</p>
                  </div>
                </div>
              </section>

              <section id="Events" class="tab-panel">
                <div class="event-cards-container">
                  <div v-if="events.length > 0">
                    <div class="events-cont">
                      <div v-for="event in events" :key="event.id" class="event-card">
                        <div class="event-logo">
                          <img :src="university.logo_url || '@/components/img/UnLogo.png'" class="event-logo-img" />
                          <img src="@/components/img/Favourite.png" class="event-logo-img" />
                        </div>
                        <div class="event-view">
                          <h3 class="event-view-text">University</h3>
                          <p2 class="event-view-text">Added {{ formatDate(event.created_at) }}</p2>
                        </div>
                        <div class="event-info">
                          <h3 class="event-info-text">{{ university.name }}</h3>
                          <hr class="event-line">
                          <h3 class="event-info-text">{{ event.event_name }}</h3>
                        </div>
                        <div class="event-terms" >
                          <p3 class="terms-text">Description: {{ event.description || 'Nothing' }}</p3>
                          <p3 class="terms-text">Date: {{ formatEventDate(event.event_date) }}</p3>
                        </div>

                      </div>
                    </div>
                  </div>
                  <div v-else>
                    <p>Нет доступных событий.</p>
                  </div>
                </div>
              </section>

              <section id="location" class="tab-panel">
                <!-- Здесь можно добавить карту или другую информацию о местоположении -->
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      university: null,
      events: [], // Добавляем массив для хранения событий
      loading: true,
      error: null,
    };
  },
  computed: {
    groupedSpecializations() {
      if (!this.university || !this.university.specializations) return {};

      // Группируем специальности по квалификациям
      return this.university.specializations.reduce((acc, specialization) => {
        const qualificationName = specialization.qualification.qualification_name;
        if (!acc[qualificationName]) {
          acc[qualificationName] = [];
        }
        acc[qualificationName].push(specialization);
        return acc;
      }, {});
    },
  },
  methods: {
    formatEventDate(dateString) {
      if (!dateString) return "Unknown date";
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString("en-US", options);
    },
    async fetchUniversity() {
      this.loading = true;
      this.error = null;
      try {
        const id = this.$route.params.id;
        const response = await axios.get(`http://localhost:8000/api/institutions/${id}`);
        this.university = response.data;
        console.log("University data:", this.university); // Отладка
        await this.fetchEventsByInstitution(id); // Загружаем события после загрузки университета
      } catch (error) {
        console.error("Ошибка при загрузке университета:", error);
        this.error = "Ошибка загрузки данных";
        if (error.response) {
          console.error("Response data:", error.response.data); // Отладка
        }
      } finally {
        this.loading = false;
      }
    },
    async fetchEventsByInstitution(institutionId) {
      try {
        const response = await axios.get(`http://localhost:8000/api/institutions/${institutionId}/events`);
        this.events = response.data;
        console.log("Events data:", this.events); // Отладка
      } catch (error) {
        console.error("Ошибка при загрузке событий:", error);
        this.error = "Ошибка загрузки событий";
      }
    },
    getYearText(duration) {
      if (duration === 1) {
        return "год";
      } else if (duration >= 2 && duration <= 4) {
        return "года";
      } else {
        return "лет";
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const daysAgo = Math.floor((new Date() - date) / (1000 * 60 * 60 * 24));
      return `${daysAgo} дней назад`;
    },
  },
  created() {
    this.fetchUniversity();
  },
};
</script>

<style scoped>
.events-cont {
  display: grid;
  grid-template-columns: 1fr;
  /* Одна колонка */
  grid-template-rows: repeat(4, auto);
  /* Четыре строки с авторазмером */
  gap: 30px;
  /* Расстояние между карточками */
  padding: 20px;
}

@media (min-width: 768px) {
  .events-cont {
    grid-template-columns: repeat(2, 1fr);
    /* Две колонки на средних экранах */
  }
}

@media (min-width: 1024px) {
  .events-cont {
    grid-template-columns: repeat(4, 1fr);
    /* Четыре колонки на больших экранах */
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
  /* Ограничение ширины */
  word-wrap: break-word;
  overflow-wrap: break-word;
}

h1 {
  font-size: 4rem;
  /* Уменьши размер, чтобы длинные названия помещались */
  font-weight: bold;
  color: #424242;
  transition: color 0.3s ease;
  text-align: center;
  /* Выравнивание по центру */
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

a {
  color: #424242;
  text-decoration: none;
  transition: color 0.3s ease;
}

a:hover {
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
.tabset>input:nth-child(5):checked~.tab-panels>.tab-panel:nth-child(3) {
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

.specialty {
  width: 70%;
  background-color: #f4f4f4;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 10px;
}

/* Контейнер для карточек событий */
.event-cards-container {
  display: flex;
  width: 1200px;
  flex-direction: row;
  gap: 20px;
  /* Расстояние между карточками */
  padding: 20px;
}

/* Основные стили для карточки события */
.event-card {
  background-color: #536274;
  padding: 20px;
  border-radius: 12px;
  width: 400px;
  box-sizing: border-box;
  /* Учитываем padding в ширине */
  margin: 0 0 50px 0;
}

/* Стили для логотипов внутри карточки */
.event-logo-img {
  width: 50px;
  height: 50px;
  background-color: white;
  border-radius: 12px;
  padding: 5px;
}

/* Контейнер для логотипов */
.event-logo {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10%;
}

/* Стили для блока с информацией о событии */
.event-view {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 5%;
}

/* Линия-разделитель */
.event-line {
  border: 1px solid #10222e;
}

/* Текст в блоке event-view */
.event-view-text {
  color: #cdcccc;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 0px;
}

/* Текст в блоке event-info */
.event-info-text {
  color: white;
}

/* Блок с условиями события */
.event-terms {
  margin: 50px 0 0 0;
  color: #cdcccc;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items:flex-start;
}

/* Адаптивные стили для экранов меньше 768px */
@media (max-width: 768px) {
  .event-cards-container {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    /* 2 карточки в ряд */
  }

  .university-logo {
    position: static;
    width: 100%;
    text-align: center;
    margin-bottom: 20px;
  }

  .university-logo-img {
    position: static;
    width: 200px;
    height: 200px;
    margin: 0 auto;
  }

  .university-name {
    margin-left: 0;
    text-align: center;
  }

  h1 {
    font-size: 4rem;
  }

  .university-info {
    flex-direction: column;
    padding: 20px;
  }

  .university-description {
    width: 100%;
    margin-bottom: 20px;
  }

  .university-info-card {
    width: 100%;
    margin-left: 0;
  }

  .specialty {
    width: 100%;
  }
}

/* Адаптивные стили для экранов меньше 480px */
@media (max-width: 480px) {
  .event-cards-container {
    grid-template-columns: 1fr;
    /* 1 карточка в ряд */
  }

  h1 {
    font-size: 3rem;
  }

  .university-description {
    font-size: 1em;
  }

  .info-title {
    font-size: 1.5em;
  }

  .info-list li {
    font-size: 1.2em;
  }

  .info-details p {
    font-size: 1.2em;
  }
}
</style>
