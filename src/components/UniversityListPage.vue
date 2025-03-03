<template>
  <header class="header fixed-top"></header>

  <body>
    <div class="list-container">
      <div class="sidebar-left-minor"></div>
      <div class="sidebar-left fixed-sidebar">
        <h class="sidebar-text">Type of educational institution</h> 
        <router-link to="/Universities" class="sidebar-active-choice"
          :class="{ active: currentPage === 'Universities' }">University</router-link>
        <router-link to="/Colleges" class="sidebar-choice"
          :class="{ active: currentPage === 'Colleges' }">College</router-link>
        <div class="active-indicator" :style="{ top: indicatorPosition + 'px' }"></div>
      </div>

      <div class="main-content" style="margin: -150px 0 0 0 ; height: 10%;">
        <div class="search-container">
          <input type="text" placeholder="Search.." />
          <button type="submit">Submit</button>
        </div>
        
        <!-- Отображение карточек университетов -->
        <div v-if="loading">Загрузка...</div>
        <div v-else-if="error">{{ error }}</div>
        <div v-else>
          <div v-for="institution in institutions" :key="institution.id" class="list-card">
            <div class="card-img">
              <img :src="institution.photo_url || '@/components/img/UnCard.png'" class="card-img" />
            </div>
            <div class="card-info">
              <div class="card-info-up">
                <h style="margin-top: -10px">
                  {{ institution.name }}<br>
                  <!-- Отображение звездочек -->
                  <span v-for="star in 5" :key="star" class="fa fa-star" :class="{ checked: star <= Math.round(institution.reviews_avg_rating) }"></span>
                </h>
                <p>{{ institution.location }}</p>
                <p style="margin-top: -10px">Open 10:00 - 22:00</p>
              </div>

              <div class="card-info-down">
                <div class="card-info-down-feature">
                  <p>Grants</p>
                  <p class="feature">{{ institution.grants ? 'Yes' : 'No' }}</p>
                </div>
                <div class="card-info-down-feature">
                  <p>Student dormitory</p>
                  <p class="feature">{{ institution.dormitory ? 'Yes' : 'No' }}</p>
                </div>
                <button type="button" class="university-button" @click="$router.push(`/UniversityAbout/${institution.id}`)">
                  More details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </body>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      currentPage: this.$route.name,
      indicatorPosition: 0,
      isStacked: true,
      isSidebarOpen: true,
      isScrolled: false,
      directions: [
        "Technical",
        "Humanitarian",
        "Medicine",
        "IT",
        "Jurisprudence",
        "Art",
      ],
      type: ["Institute", "College"],
      Grants: ["Yes", "No", "Partial"],
      dormitory: ["Yes", "No"],
      selectedIndexes: [],
      institutions: [], // Добавляем массив для хранения данных об университетах
      loading: false, // Добавляем состояние загрузки
      error: null, // Добавляем состояние ошибки
    };
  },
  watch: {
    $route(to) {
      this.currentPage = to.name;
      this.updateIndicator();
    },
  },
  mounted() {
    this.updateIndicator();
    window.addEventListener("scroll", this.handleScroll);
    this.fetchInstitutions(); // Загружаем данные при монтировании компонента
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    updateIndicator() {
      this.indicatorPosition = this.currentPage === "Universities" ? 130 : 263;
    },
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
      const sidebar = document.getElementById("sidebar");
      const overlay = document.querySelector(".sidebar-overlay");
      sidebar.classList.toggle("open");
      overlay.classList.toggle("active");
    },
    handleScroll() {
      this.isScrolled = window.scrollY > 50;
    },
    selectDirection(index) {
      this.selectedIndex = index;
    },
    toggleSelection(key) {
      if (this.selectedIndexes.includes(key)) {
        this.selectedIndexes = this.selectedIndexes.filter((i) => i !== key);
      } else {
        this.selectedIndexes.push(key);
      }
    },
    async fetchInstitutions() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get("http://localhost:8000/api/institutions");
        this.institutions = response.data.data; // Предполагаем, что данные возвращаются в поле `data`
      } catch (error) {
        console.error("Ошибка при загрузке университетов:", error);
        this.error = "Ошибка загрузки данных";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
html,
body {
  height: 100%;
  overflow-y: auto;
  width: 100vw;
  margin: 0;
  padding: 0;
}

.fa-star {
  color: #ccc; /* Цвет пустой звезды */
}

.fa-star.checked {
  color: #ffd700; /* Цвет заполненной звезды */
}


.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 70px;
  z-index: 1001;
  background-color: rgba(255, 255, 255, 0.9);
  transition: background-color 0.3s ease;
}

.nav-item {
  margin-left: 10px;
}

.navbar-logo {
  font-size: 2rem;
  font-weight: bolder;
  color: red;
}

.list-container {
  display: flex;
  width: 100%;
  overflow-y: auto;
}


.sidebar-left {
  position: fixed;
  width: 12%;
  height: 100vh;
  background-color: white;
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.sidebar-left-minor {
  position: relative;
  width: 12%;
  height: 100vh;
  background-color: white;
}

.fixed-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 12%;
  background-color: white;
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.sidebar-text {
  font-size: 1.6rem;
  margin-bottom: 20px;
  font-weight: bold;
  margin-top: 45%;
}

.main-content {
  overflow-y: auto;
  max-height: 150vh;
  flex-grow: 1;
  background-color: #d4e5ed;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  /* Расстояние между карточками */
  justify-content: center;
  /* Центрируем карточки */
  padding: 0% 8% 0% 8%;
  margin: 0 0 0 0;
}

.sidebar-choice {
  font-size: 1.8rem;
  color: #919191;
  margin: 15px 0 0 20px;
  transition: transform 0.3s, color 0.3s;
  text-decoration: none;
}

.sidebar-active-choice {
  font-size: 1.8rem;
  color: #577c8e;
  margin: 15px 0 0 20px;
  transition: transform 0.3s, color 0.3s;
  text-decoration: none;
}

.sidebar-choice:hover {
  transform: scale(1.1);
  color: #577c8e;
}

.sidebar-choice.active {
  font-weight: bold;
  color: #577c8e;
}

.active-indicator {
  position: absolute;
  right: -1px;
  width: 5px;
  height: 30px;
  background-color: #577c8e;
  transition: top 0.3s ease;
  border-radius: 3px;
}



.search-container {
  margin-top: 20%;
  margin-bottom: 20px;
}

.list-card {
  display: flex;
  height: 250px;
  width: 100%;
  padding: 20px;
  background-color: white;
  border-radius: 12px;
  margin-bottom: 50px;
}

.card-img {
  width: 270px;
  height: 190px;
  border-radius: 6px;
  margin-right: 30px;
}

.card-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
}

.card-info-down {
  display: flex;
  align-items: flex-end;
}

.card-info-up {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.card-info-down-feature {
  margin-right: 15px;
}

h {
  font-size: 2em;
  font-weight: bold;
  margin-bottom: 5px;
}

p {
  color: #919191;
  font-size: 0.9em;
}

.feature {
  color: black;
  font-size: 1.2em;
  font-weight: bold;
  margin-top: -5px;
}

.sidebar-overlay.active {
  opacity: 0.5;
  visibility: visible;
  transition-delay: 0;
}

.sidebar {
  position: fixed;
  display: flex;
  flex-direction: column;
  width: 360px;
  background: #fff;
  z-index: 1000;
  transition: transform 0.4s cubic-bezier(0.55, 0, 0.1, 1);
  transform: translateX(-415px);
  height: 80%;
  margin-top: 7%;
  border-radius: 12px;
  margin-right: 3%;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  padding-left: 20px;
}

.sidebar.open {
  transform: translateX(0);
}

.sidebar.scrolled {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.sidebar-header {
  display: flex;
  align-items: center;
  height: 100px;
  width: 360px;
}

.sidebar-toggle {
  position: absolute;
  right: 16px;
  top: 16px;
  background: none;
  border: none;
  cursor: pointer;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.sidebar-toggle-button {
  position: fixed;
  left: 98%;
  top: 50%;
  width: 40px;
  height: 40px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 50% 0 0 50%;
  cursor: pointer;
  z-index: 2;
  transition: all 0.3s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.sidebar-toggle-button.visible {
  transform: translateX(-417px);
}

.sidebar-nav-filtration {
  margin-top: 20px;
}

.sidebar-nav-filtration button {
  padding: 8px 15px;
  margin: -5px 10px 10px 0px;
  border: 1px solid #ccc;
  border-radius: 12px;
  background-color: #f0f0f0;
  color: #424242;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  font-size: 1em;
}


.sidebar-nav-filtration button.selected {
  background-color: #D0D0D0;
  color: #008FFF;
  font-weight: bold;
}

h {
  font-size: 1.9em;
  font-weight: bold;
}

.university-button {
  margin-bottom: 20px;
  border-radius: 6px;
  background-color: #577C8E;
  color: white;
  border: none;
  margin-left: 40%;
  width: 150px;
  height: 40px;
  transition: transform 0.3s ease;

}

.university-button:hover {
  transform: scale(1.1);
}

</style>
