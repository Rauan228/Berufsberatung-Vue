<template>
  <header class="header fixed-top"></header>

  <div class="user-container">
    <div class="user-background"></div>
    <div class="user-content">
      <div class="user-img">
        <img src="@/components/img/UserAvatar.png" class="user-img-avatar" />
      </div>
      <div class="user-info">
        <div class="user-name">
          <h>{{ username }}</h> <!-- Отображаем имя пользователя -->
          <p class="profession">student</p>
        </div>
        <div class="user-logout">
          <button class="logout-button" @click="handleLogout">Logout</button>
        </div>
      </div>
    </div>

    <div class="user-events">
      <div class="tabset">
        <input
          type="radio"
          name="tabset"
          id="tab1"
          aria-controls="Notifications"
          checked
        />
        <label for="tab1">Notifications</label>

        <input
          type="radio"
          name="tabset"
          id="tab2"
          aria-controls="Institution"
        />
        <label for="tab2">Universities/Colleges</label>

        <input
          type="radio"
          name="tabset"
          id="tab3"
          aria-controls="planned events"
        />
        <label for="tab3">planned events Bock</label>

        <div class="tab-panels">
          <section id="Notifications" class="tab-panel">
            <div class="Notification-content">
              <div class="Notification-status-indicator">
                <div class="indicator"></div>
              </div>
              <div class="Notification-text">
                <h3>Institution name</h3>
                <p1
                  >В университете имени Месси, начинается день открытых дверей!
                </p1>
                <button
                  type="button"
                  class="button-info"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                >
                  Поподробнее
                </button>

                <div
                  class="modal fade"
                  id="exampleModal"
                  tabindex="-1"
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
                >
                  <div class="modal-dialog">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h1 class="modal-title fs-6" id="exampleModalLabel">
                          Modal title
                        </h1>
                        <button
                          type="button"
                          class="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                      <div class="modal-body">...</div>
                      <div class="modal-footer">
                        <button
                          type="button"
                          class="btn btn-secondary"
                          data-bs-dismiss="modal"
                        >
                          Close
                        </button>
                        <button type="button" class="btn btn-primary">
                          Save changes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section id="Institution" class="tab-panel">
            <div class="list-card">
              <div class="card-img">
                <img src="@/components/img/UnCard.png" class="card-img" />
              </div>
              <div class="card-info">
                <div class="card-info-up">
                  <h style="margin-top: -10px"
                    >Astana IT University
                    <span class="fa fa-star checked"></span>
                    <span class="fa fa-star checked"></span>
                    <span class="fa fa-star checked"></span>
                    <span class="fa fa-star checked"></span>
                    <span class="fa fa-star checked"></span>
                  </h>
                  <p>Ave. Mangilik El., Astana 020000</p>
                  <p style="margin-top: -10px">Open 10:00 - 22:00</p>
                </div>

                <div class="card-info-down">
                  <div class="card-info-down-feature">
                    <p>Direction of study</p>
                    <p class="feature">IT</p>
                  </div>
                  <div class="card-info-down-feature">
                    <p>Grants</p>
                    <p class="feature">Yes</p>
                  </div>
                  <div class="card-info-down-feature">
                    <p>Student dormitory</p>
                    <p class="feature">Yes</p>
                  </div>
                  <button
                    type="button"
                    class="university-button"
                    @click="$router.push('/UniversityAbout')"
                  >
                    More details
                  </button>
                </div>
              </div>
            </div>
          </section>
          <section id="planned events" class="tab-panel">
            <div class="event-card">
              <div class="event-logo">
                <img src="@/components/img/UnLogo.png" class="event-logo-img" />
                <img
                  src="@/components/img/Favourite.png"
                  class="event-logo-img"
                />
              </div>
              <div class="event-view">
                <h3 class="event-view-text">University</h3>
                <p2 class="event-view-text">Added 18 days ago</p2>
              </div>
              <div class="event-info">
                <h3 class="event-info-text">Nazarbayev University</h3>
                <hr class="event-line" />
                <h3 class="event-info-text">Open day</h3>
              </div>
              <div class="event-terms">
                <p3 class="terms-text">Need: Nothing</p3>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { authStore } from '@/store/authStore';

export default {
  setup() {
    const router = useRouter();
    const username = ref(''); // Состояние для имени пользователя

    // Получаем данные текущего пользователя
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/current-user', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Передаем токен
          },
        });
        username.value = response.data.username; // Сохраняем имя пользователя
      } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error);
      }
    };

    // Выход из системы
    const handleLogout = async () => {
      try {
        await authStore.logoutUser();
        alert('Выход выполнен');
        router.push('/');
      } catch (error) {
        alert('Ошибка выхода: ' + error.message);
      }
    };

    // При монтировании компонента загружаем данные пользователя
    onMounted(() => {
      fetchCurrentUser();
    });

    return {
      username,
      handleLogout,
    };
  },
};
</script>
<style scoped>
.logout-button {
  padding: 10px 20px;
  background-color: #ff4d4d;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.logout-button:hover {
  background-color: #cc0000;
}
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 70px;
  z-index: 1000;
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

.user-container {
  width: 100%;
  height: 100vw;
}

.user-background {
  background-color: #495b69;
  width: 100%;
  height: 10%;
}

.user-content {
  position: relative;
  height: 100px;
}

.user-img {
  position: absolute;
  width: 100px;
  height: 100px;
  bottom: 85px;
  left: 100px;
}

.user-img-avatar {
  position: absolute;
  width: 250px;
  height: 250px;
  border-radius: 50%;
}

.user-info {
  display: flex;
  justify-content: space-between;
  margin-left: 23%;
  padding: 10px;
}

h {
  font-size: 5rem;
  color: black;
  font-weight: bold;
}

.profession {
  font-size: 2rem;
  color: #919ea9;
  font-weight: normal;
}

.logout-button {
  background-color: white !important;
  color: #bb0000;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  font-size: 1.5em;
}

.user-events {
  margin-top: 7%;
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

.Notification-content {
  background-color: #536274;
  padding: 20px;
  border-radius: 12px;
  width: 70%;
  margin-left: 3%;
  display: flex;
}

.Notification-text {
  width: 90%;
  display: flex;
  flex-direction: column;
}
.Notification-status-indicator {
  width: 4%;
  height: 100px;
}

.indicator {
  background-color: #4fa300;
  border-radius: 25px;
  width: 20px;
  height: 20px;
  margin-top: 8px;
}

p1 {
  font-size: 1.4em;
  color: white;
}

h3 {
  font-size: 1.9em;
  color: white;
  font-weight: bold;
}

.button-info {
  font-size: 1.5em;
  background-color: #536274;
  color: white;
  border: none;
  cursor: pointer;
  margin-left: 85%;
  width: 11%;
  transition: transform 0.2s ease-in-out;
}

.button-info:hover {
  transform: scale(1.1);
}

.list-card {
  display: flex;
  height: 220px;
  width: 100%;
  padding: 20px;
  background-color: #F5F5F5;
  border-radius: 12px;
  margin-bottom: 50px;
  border-color:#C9C9C9;
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

.university-button {
  margin-bottom: 20px;
  border-radius: 6px;
  background-color: #577C8E ;
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
