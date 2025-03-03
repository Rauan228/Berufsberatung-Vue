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
          <h>{{ username }}</h>
          <p class="profession">student</p>
        </div>
        <div class="user-logout">
          <button class="logout-button" @click="handleLogout">Logout</button>
        </div>
      </div>
    </div>

    <div class="user-events">
      <div class="tabset">
        <input type="radio" name="tabset" id="tab1" aria-controls="Notifications" checked />
        <label for="tab1">Notifications</label>

        <input type="radio" name="tabset" id="tab2" aria-controls="Institution" />
        <label for="tab2">Universities/Colleges</label>

        <input type="radio" name="tabset" id="tab3" aria-controls="planned events" />
        <label for="tab3">planned events Bock</label>

        <div class="tab-panels">
          <section id="Notifications" class="tab-panel">
            <div v-if="notifications.length > 0">
              <div v-for="notification in notifications" :key="notification.id" class="Notification-content" style="margin-top: 20px;">
                <div class="Notification-status-indicator">
                  <div class="indicator"></div>
                </div>
                <div class="Notification-text">
                  <h3>{{ notification.event ? notification.event.title : 'No Event' }}</h3>
                  <p1>{{ notification.message }}</p1>
                  <button type="button" class="button-info" data-bs-toggle="modal"
                    :data-bs-target="'#exampleModal' + notification.id">
                    Подробнее
                  </button>

                  <!-- Модальное окно для уведомления -->
                  <div class="modal fade" :id="'exampleModal' + notification.id" tabindex="-1"
                    aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                      <div class="modal-content">
                        <div class="modal-header">
                          <h1 class="modal-title fs-6" id="exampleModalLabel">
                            {{ notification.event ? notification.event.title : 'No Event' }}
                          </h1>
                          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                          <p>{{ notification.message }}</p>
                          <p v-if="notification.event">
                            Дата: {{ notification.event.date }}
                          </p>
                        </div>
                        <div class="modal-footer">
                          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                            Закрыть
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              <p>Уведомлений нет.</p>
            </div>
          </section>
          <section id="LikedInstitutions" class="tab-panel">
            <div v-if="likedInstitutions.length > 0">
  <div v-for="institution in likedInstitutions" :key="institution.id" class="list-card">
    <div class="card-img">
      <img :src="institution.photo_url || '@/components/img/UnCard.png'" class="card-img" />
    </div>
    <div class="card-info">
      <div class="card-info-up">
        <h style="margin-top: -10px">
          {{ institution.name }} <button @click="removeLike(institution.id)" class="unlike-button">
            <i class="fas fa-heart"></i>
          </button><br>
          <span v-for="star in 5" :key="star" class="fa fa-star" 
            :class="{ checked: star <= Math.round(institution.reviews_avg_rating || 0) }"></span>
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
        <div class="card-buttons">
          <button type="button" class="university-button" 
            @click="$router.push(`/UniversityAbout/${institution.id}`)">
            More details
          </button>
          
        </div>
      </div>
    </div>
  </div>
</div>
  <div v-else>
    <p>Вы не лайкнули ни одного университета.</p>
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
    const likedInstitutions = ref([]);
    const username = ref('');
    const notifications = ref([]); // Состояние для уведомлений

    // Получаем лайкнутые университеты
    const fetchLikedInstitutions = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/liked-institutions', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        likedInstitutions.value = response.data;
      } catch (error) {
        console.error('Ошибка при получении лайкнутых университетов:', error);
      }
    };

    // Удаляем лайк
    const removeLike = async (institutionId) => {
      try {
        await axios.delete(`http://localhost:8000/api/likes/${institutionId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        // Обновляем список лайкнутых университетов
        likedInstitutions.value = likedInstitutions.value.filter(
          (institution) => institution.id !== institutionId
        );
      } catch (error) {
        console.error('Ошибка при удалении лайка:', error);
      }
    };

    // Получаем данные текущего пользователя
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/current-user', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        username.value = response.data.username;
      } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error);
      }
    };

    // Получаем уведомления пользователя
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/notifications', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        notifications.value = response.data;
      } catch (error) {
        console.error('Ошибка при получении уведомлений:', error);
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

    // При монтировании компонента загружаем данные
    onMounted(() => {
      fetchCurrentUser();
      fetchNotifications();
      fetchLikedInstitutions();
    });

    return {
      username,
      notifications,
      handleLogout,
      likedInstitutions,
      removeLike,
    };
  },
};
</script>
<style scoped>

.fa-star {
  color: #ccc;
  /* Цвет пустой звезды */
}

.fa-star.checked {
  color: #ffd700;
  /* Цвет заполненной звезды */
}

.list-card {
  display: flex;
  align-items: center;
  height: 350px !important; 
  width: 100%;
  padding: 20px;
  background-color: #F5F5F5;
  border-radius: 12px;
  margin-bottom: 50px;
  border-color: #C9C9C9;
}

.card-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 300px;
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

.card-buttons {
  display: flex;
  align-items: center;
  gap: 10px; /* Расстояние между кнопками */
}

.university-button {
  border-radius: 6px;
  background-color: #577C8E;
  color: white;
  border: none;
  width: 270px;
  height: 120px;
  position: absolute;
  transition: transform 0.3s ease;
}

.university-button:hover {
  transform: scale(1.1);
}

.unlike-button {
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: #ff4b2b;
  font-size: 1.5em;
  transition: color 0.3s ease;
}

.unlike-button:hover {
  color: #cc0000;
}

.fa-heart {
  font-size: 1.5em;
}
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
.tabset>input:nth-child(7):checked~.tab-panels>.tab-panel:nth-child(4),
.tabset>input:nth-child(9):checked~.tab-panels>.tab-panel:nth-child(5),
.tabset>input:nth-child(11):checked~.tab-panels>.tab-panel:nth-child(6) {
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
  border-color: #C9C9C9;
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
  border: 1px solid #10222E;
}

.event-view-text {
  color: #CDCCCC;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 0px;
}

.event-info-text {
  color: white;
}

.event-terms {
  color: #CDCCCC;
  height: 200px;
  display: flex;
  align-items: center;
}
</style>
