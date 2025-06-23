<template>
  <header class="header fixed-top"></header>

  <body>
    <div class="list-container">
      <div class="sidebar-left-minor"></div>
      <div class="sidebar-left fixed-sidebar">
        <h class="sidebar-text">Специальности для</h>
        <router-link 
          to="/Specialties/Universities/GlobalSpecialties" 
          class="sidebar-choice"
          :class="{ 'sidebar-active-choice': currentPage === 'Universities' }"
        >
          Университетов
        </router-link>
        <router-link 
          to="/Specialties/Colleges" 
          class="sidebar-choice"
          :class="{ 'sidebar-active-choice': currentPage === 'Colleges' }"
        >
          Колледжей
        </router-link>
        <div class="active-indicator" :style="{ top: indicatorPosition + 'px' }"></div>
      </div>

      <div class="main-content">
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item active" aria-current="page">
              Университеты
            </li>
            <li class="breadcrumb-item" aria-current="page">Специальности</li>
          </ol>
        </nav>

        <div v-if="loading" class="loader-container">
          <div class="spinner"></div>
        </div>

        <!-- Error message -->
        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <!-- Список глобальных специальностей -->
        <div v-if="!loading && !error" class="global_specialties">
          <div v-for="specialty in globalSpecialties" :key="specialty.id" class="global_specialties-card">
            <h2 class="global_specialties-card-title"
              @click="navigateToQualifications(specialty.id)">
              {{ specialty.name }}
            </h2>
            <p class="global_specialties-card-description">
              {{ specialty.description }}
            </p>
            <div class="qualifications-count" v-if="specialty.qualifications">
              Квалификаций: {{ specialty.qualifications.length }}
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
      currentPage: "Universities",
      indicatorPosition: 220,
      globalSpecialties: [],
      loading: false,
      error: null
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
    this.fetchGlobalSpecialties();
  },
  methods: {
    updateIndicator() {
      this.indicatorPosition = this.currentPage === "Colleges" ? 180 : 220;
    },
    async fetchGlobalSpecialties() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.get("http://localhost:8000/api/specialties", {
          params: {
            type: 'university'
          }
        });

        if (response.data.success) {
          this.globalSpecialties = response.data.data;
        } else {
          this.error = "Не удалось загрузить специальности";
        }
      } catch (error) {
        console.error("Ошибка при загрузке специальностей:", error);
        this.error = "Произошла ошибка при загрузке данных";
      } finally {
        this.loading = false;
      }
    },
    navigateToQualifications(specialtyId) {
      this.$router.push(`/Specialties/Universities/GlobalSpecialties/Qualifications/${specialtyId}`);
    }
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
  width: 15%;
  height: 90vh;
  background-color: white;
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.sidebar-left-minor {
  position: relative;
  width: 15%;
  height: 100vh;
  background-color: white;
}

.fixed-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 15%;
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
  max-height: 100vh;
  flex-grow: 1;
  background-color: #d4e5ed;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  padding: 6% 8% 0% 8%;
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
  
  margin-top: 35px;
  width: 5px;
  height: 30px;
  background-color: #577c8e;
  transition: top 0.3s ease;
  border-radius: 3px;
}

.breadcrumb {
  font-size: 1.5em;
}

.global_specialties {
  width: 100%;
}

.global_specialties-card {
  background-color: white;
  padding: 10px;
  width: 70%;
  margin-bottom: 10px;
  border-radius: 6px;
  transition: transform 0.3s ease, background-color 0.3s ease;
  padding: 20px;
  border-radius: 10px;
  cursor: pointer;

}

.global_specialties-card:hover {
  transform: scale(1.05);
  background-color: #e0e0e0;
}

.global_specialties-card-title {
  font-size: 1.3em;
}

.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #577c8e;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
