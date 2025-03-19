<template>
  <header class="header fixed-top"></header>

  <body>
    <div class="list-container">
      <div class="sidebar-left-minor"></div>
      <div class="sidebar-left fixed-sidebar">
        <h class="sidebar-text">Специальности для</h>
        <router-link to="/Specialties/Universities/GlobalSpecialties" class="sidebar-active-choice"
          :class="{ active: currentPage === 'Universities' }">
          Университетов
        </router-link>
        <router-link to="/Specialties/Colleges" class="sidebar-choice"
          :class="{ active: currentPage === 'Colleges' }">
          Колледжей
        </router-link>
        <div class="active-indicator" :style="{ top: indicatorPosition + 'px' }"></div>
      </div>
      <div class="main-content">
        
      </div>
    </div>
  </body>
</template>

<script>
export default {
  data() {
    return {
      currentPage: this.$route.name,
      indicatorPosition: 0,
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
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    updateIndicator() {
      this.indicatorPosition = this.currentPage === "Colleges" ? 180 : 290;
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
  margin-top: 30px;
  right: -1px;
  width: 5px;
  height: 30px;
  background-color: #577c8e;
  transition: top 0.3s ease;
  border-radius: 3px;
}

.main-content {
  overflow-y: auto;
  max-height: 100vh;
  flex-grow: 1;
  background-color: #d4e5ed;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 8%;
}

/* Стили для "Coming Soon..." */
.coming-soon {
  text-align: center;
}

.coming-soon h1 {
  font-size: 5rem;
  font-weight: bold;
  background: linear-gradient(90deg, #577c8e, #4fa300);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: fadeIn 2s ease-in-out infinite alternate;
}

@keyframes fadeIn {
  0% {
    opacity: 0.5;
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@media (max-width: 768px) {
  .sidebar-left {
    width: 20%;
  }
  .sidebar-left-minor {
    width: 20%;
  }
  .main-content {
    padding: 0 4%;
  }
  .coming-soon h1 {
    font-size: 3rem;
  }
}

@media (max-width: 480px) {
  .sidebar-left {
    width: 30%;
  }
  .sidebar-left-minor {
    width: 30%;
  }
  .sidebar-text {
    font-size: 1.2rem;
  }
  .sidebar-choice,
  .sidebar-active-choice {
    font-size: 1.4rem;
  }
  .coming-soon h1 {
    font-size: 2rem;
  }
}
</style>