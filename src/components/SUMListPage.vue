<template>
  <header class="header fixed-top"></header>

  <body>
    <div class="list-container">
      <div class="sidebar-left-minor"></div>
      <div class="sidebar-left fixed-sidebar">
        <h class="sidebar-text">Specialties for </h>
        <router-link
          to="/Specialties/Universities/GlobalSpecialties"
          class="sidebar-active-choice"
          :class="{ active: currentPage === 'Universities' }"
          >University</router-link
        >
        <router-link
          to="/Specialties/Colleges"
          class="sidebar-choice"
          :class="{ active: currentPage === 'Colleges' }"
          >College</router-link
        >
        <div
          class="active-indicator"
          :style="{ top: indicatorPosition + 'px' }"
        ></div>
      </div>

      <div class="main-content">
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item active" aria-current="page">
              University
            </li>
            <li class="breadcrumb-item active" aria-current="page">
              <a href="/Specialties/Universities/GlobalSpecialties"
                >Specialties</a
              >
            </li>
            <li class="breadcrumb-item" aria-current="page">Qualifications</li>
          </ol>
        </nav>

        <div class="qualifications">
          <div v-if="loading">Загрузка...</div>
          <div v-else-if="error">{{ error }}</div>
          <div v-else-if="qualifications.length === 0">Квалификации не найдены</div>
          <div v-else>
            <div v-for="qualification in qualifications" :key="qualification.id" class="qualifications-card">
              <div class="qualifications-card-title">
                <h1>{{ qualification.qualification_name }}</h1>
              </div>
              <div class="qualifications-card-subtext">
                <h2>{{ qualification.global_specialty_id }}</h2>
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
      qualifications: [], // Инициализируем как массив
      loading: false,
      error: null,
    };
  },
  watch: {
    "$route.params.id": {
      immediate: true,
      handler(newId) {
        if (newId) {
          this.fetchQualifications(newId);
        }
      },
    },
  },
  methods: {
    async fetchQualifications(id) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(`http://localhost:8000/api/qualifications?specialty_id=${id}`);
        this.qualifications = response.data || [];
      } catch (error) {
        console.error("Ошибка при загрузке квалификаций:", error);
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
  }
  h2:hover {
    transform: scale(1.2);
    color: #577c8e;
  }
  </style>
