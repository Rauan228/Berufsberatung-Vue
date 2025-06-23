<template>
  <header class="header fixed-top"></header>

  <body>
    <div class="list-container">
      <div class="sidebar-left-minor"></div>
      <div class="sidebar-left fixed-sidebar">
        <h1 class="sidebar-text">Специальности для</h1>
        <router-link
          to="/Specialties/Universities/GlobalSpecialties"
          class="sidebar-choice"
          :class="{ active: currentPage === 'Universities' }"
        >
          Университетов
        </router-link>
        <router-link
          to="/Specialties/Colleges"
          class="sidebar-active-choice"
          :class="{ active: currentPage === 'Colleges' }"
        >
          Колледжей
        </router-link>
        <div
          class="active-indicator"
          :style="{ top: indicatorPosition + 'px' }"
        ></div>
      </div>

      <div class="main-content">
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <router-link to="/colleges">Колледжи</router-link>
            </li>
            <li class="breadcrumb-item">
              <router-link to="/Specialties/Colleges">
                Специальности
              </router-link>
            </li>
            <li class="breadcrumb-item active" aria-current="page">
              {{ currentSpecialtyName }}
            </li>
          </ol>
        </nav>

        <div class="qualifications">
          <div v-if="loading" class="qualifications-card">
            <div class="qualifications-card-title">Загрузка...</div>
          </div>
          <div v-else-if="error" class="qualifications-card">
            <div class="qualifications-card-title">{{ error }}</div>
          </div>
          <div
            v-else-if="qualifications.length === 0"
            class="qualifications-card"
          >
            <div class="qualifications-card-title">
              Квалификации не найдены
            </div>
          </div>
          <div v-else>
            <div
              v-for="qualification in qualifications"
              :key="qualification.id"
              class="qualifications-card"
            >
              <div class="qualifications-card-title">
                <h1>{{ qualification.qualification_name }}</h1>
              </div>
              <div
                v-if="
                  qualification.specializations &&
                  qualification.specializations.length > 0
                "
              >
                <div
                  v-for="specialization in qualification.specializations"
                  :key="specialization.id"
                  class="qualifications-card-subtext"
                  @click="navigateToSUMList(specialization)"
                >
                  <h2>{{ specialization.name }}</h2>
                </div>
              </div>
              <div v-else class="qualifications-card-subtext">
                <h2>Нет специальностей</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </body>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import axios from 'axios'

interface Specialization {
  id: number
  name: string
  description: string
  college_qualification_id: number
}

interface CollegeQualification {
  id: number
  qualification_name: string
  description: string
  college_global_specialty_id: number
  specializations: Specialization[]
}

interface CollegeGlobalSpecialty {
  id: number
  name: string
  description: string
  college_qualifications: CollegeQualification[]
}

export default defineComponent({
  name: 'CollegeQualificationsPage',
  
  data() {
    return {
      currentPage: 'Colleges',
      indicatorPosition: 180,
      qualifications: [],
      loading: false,
      error: null,
      currentSpecialtyName: '',
    }
  },

  watch: {
    "$route.params.specialty_id": {
      immediate: true,
      handler(newId) {
        if (newId) {
          this.fetchQualifications(newId);
          this.fetchSpecialtyName(newId);
        }
      },
    },
    $route(to) {
      this.currentPage = to.name;
      this.updateIndicator();
    },
  },

  mounted() {
    this.updateIndicator();
    if (this.$route.params.specialty_id) {
      this.fetchSpecialtyName(this.$route.params.specialty_id);
    }
  },

  methods: {
    updateIndicator() {
      this.indicatorPosition = this.currentPage === "Colleges" ? 180 : 220;
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
        console.error("Ошибка при загрузке названия специальности:", error);
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
          this.qualifications = response.data.data;
        } else {
          this.error = "Не удалось загрузить квалификации";
        }
      } catch (error) {
        console.error("Ошибка при загрузке квалификаций:", error);
        this.error = `Ошибка загрузки данных: ${
          error.response?.data?.message || error.message
        }`;
      } finally {
        this.loading = false;
      }
    },
    navigateToSUMList(specialization) {
      // Сохраняем данные о выбранной специализации в localStorage
      localStorage.setItem('selectedSpecialization', JSON.stringify({
        id: specialization.id,
        name: specialization.name,
        qualification_name: this.getCurrentQualificationName(specialization),
        specialty_name: this.currentSpecialtyName,
        type: 'college'
      }));
      
      // Переходим на страницу About
      this.$router.push({
        name: 'SpecializationAbout',
        params: { 
          id: specialization.id
        }
      });
    },
    getCurrentQualificationName(specialization) {
      const qualification = this.qualifications.find(q => 
        q.specializations.some(s => s.id === specialization.id)
      );
      return qualification ? qualification.qualification_name : '';
    }
  }
})
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
  margin-top: 125px;
  width: 5px;
  height: 30px;
  background-color: #577c8e;
  transition: top 0.3s ease;
  border-radius: 3px;
}

.breadcrumb {
  font-size: 1.5em;
}

.qualifications {
  width: 100%;
  background-color: #eeeeee;
  border-radius: 12px 12px 0 0;
}

.qualifications-card {
  width: 100%;
  border-radius: 6px;
  margin-bottom: 20px;
}

.qualifications-card-title {
  background-color: #eeeeee;
  padding: 10px;
  border-radius: 12px 12px 0 0;
}

.qualifications-card-subtext {
  padding: 10px;
  background-color: white;
  border: #eeeeee solid 1px;
}

.breadcrumb-item a {
  text-decoration: none;
  color: inherit;
}

.breadcrumb-item a:focus,
.breadcrumb-item a:hover {
  outline: none;
  color: inherit;
}

h1 {
  font-size: 1.7rem;
  margin: 0;
}

h2 {
  font-size: 1rem;
  font-weight: lighter;
  display: inline-block;
  transition: transform 0.3s ease, color 0.3s ease;
  cursor: pointer;
  text-decoration: none;
  color: black;
  margin-left: 15px;
  margin: 0;
}

h2:hover {
  transform: scale(1.2);
  color: #577c8e;
}
</style> 