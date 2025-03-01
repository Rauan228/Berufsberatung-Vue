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

      <div class="university-info" style="margin: 100px 0 0 0 ;">
        <div class="university-description" >
          <p2>{{ university.description1 }}</p2><br><br>
          
          <p2>{{ university.description2 }}</p2><br><br>
          <p2>{{ university.description3 }}</p2>
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
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      university: null,
      loading: true,
      error: null,
    };
  },
  created() {
    this.fetchUniversity();
  },
  methods: {
    async fetchUniversity() {
      this.loading = true;
      this.error = null;
      try {
        const id = this.$route.params.id;
        const response = await axios.get(`http://localhost:8000/api/institutions/${id}`);
        this.university = response.data;
      } catch (error) {
        console.error("Ошибка при загрузке университета:", error);
        this.error = "Ошибка загрузки данных";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.university-container {
  width: 100%;
  height: 100vh;
  margin-top: 4.5%;
}

.university-backgroundImg {
  width: 100%;
  height: 400px;
  object-fit: cover;
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
}

.university-main {
  width: 100%;
  height: 250px;
  position: relative;
}

.university-name {
  display: flex;
  justify-content: space-between;
  margin-left: 30%;
  padding: 10px;
}

h1 {
  font-size: 6rem;
  font-weight: bold;
  color: #424242;
}

.university-info {
  display: flex;
  padding: 5% 6% 3% 6%;
}

.university-description {
  width: 50%;
  height: 100%;
}

p {
  font-size: 1.2em;
}

.university-info-card {
  width: 350px;
  border-radius: 8px;
  padding: 16px;
  background-color: #f1f1f1;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-left: 100%;
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
}

a {
  color: #424242;
  text-decoration: none;
}

.user-events {
  margin-top: 1%;
}

.tabset > input[type="radio"] {
  position: absolute;
  left: -200px;
}

.tabset .tab-panel {
  display: none;
}

.tabset > input:first-child:checked ~ .tab-panels > .tab-panel:first-child,
.tabset > input:nth-child(3):checked ~ .tab-panels > .tab-panel:nth-child(2),
.tabset > input:nth-child(5):checked ~ .tab-panels > .tab-panel:nth-child(3),
.tabset > input:nth-child(7):checked ~ .tab-panels > .tab-panel:nth-child(4),
.tabset > input:nth-child(9):checked ~ .tab-panels > .tab-panel:nth-child(5),
.tabset > input:nth-child(11):checked ~ .tab-panels > .tab-panel:nth-child(6) {
  display: block;
}

.tabset > label {
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

.tabset > label:hover,
.tabset > input:focus + label,
.tabset > input:checked + label {
  color: #10222e;
  border-bottom: solid;
}

.tabset > label:hover::after,
.tabset > input:focus + label::after,
.tabset > input:checked + label::after {
  background: #10222e;
  color: #10222e;
}

.tabset > input:checked + label {
  margin-bottom: -1px;
  border-bottom: solid #10222e;
}

.tab-panel {
  padding: 30px;
  border-top: 1px solid #919ea9;
}

*,
*:before,
*:after {
  box-sizing: border-box;
}

.tabset {
  max-width: 100%;
}

.specialties-list {
  display: flex;
  flex-direction: column;
  padding: 10px;
}

.specialty {
  width: 70%;
  background-color: #f4f4f4;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
}

h4 {
  font-size: 1em;
  font-weight: bold;
  color: #333;
}

.event-card {
  width: 25%;
background-color: #536274;
padding: 20px;
border-radius: 12px;
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
  justify-content:space-between;
  margin-bottom: 10%;
}

.event-view {
  display: flex;
  justify-content: space-between;
  align-items:flex-end;
  margin-bottom: 5%;
}

.event-line {
  border: 1px solid #10222E;
}

.event-view-text {
  color: #CDCCCC;
  display: flex;
  justify-content: space-between;
  align-items:flex-end;
  margin-bottom: 0px;
}

.event-info-text {
  color: white;
}

.event-terms{
  color: #CDCCCC;
  height: 200px;
  display: flex;
  align-items: center;
 }
</style>
