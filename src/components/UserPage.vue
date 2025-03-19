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
          <h1>{{ username }}</h1>
          <p class="profession">студент</p>
        </div>
        <div class="user-logout">
          <button class="logout-button" @click="showLogoutModal = true">Выйти</button>
        </div>
      </div>
    </div>

    <div class="modal fade" :class="{ 'show': showLogoutModal }" v-if="showLogoutModal" tabindex="-1" style="display: block;" aria-labelledby="logoutModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="logoutModalLabel">Подтверждение выхода</h5>
            <button type="button" class="btn-close" @click="showLogoutModal = false" aria-label="Закрыть"></button>
          </div>
          <div class="modal-body">
            Вы уверены, что хотите выйти из аккаунта?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showLogoutModal = false">Отмена</button>
            <button type="button" class="btn btn-danger" @click="confirmLogout">Выйти</button>
          </div>
        </div>
      </div>
    </div>

    <div class="user-events">
      <div class="tabset">
        <input type="radio" name="tabset" id="tab1" aria-controls="Notifications" checked />
        <label for="tab1">Уведомления</label>

        <input type="radio" name="tabset" id="tab2" aria-controls="Institution" />
        <label for="tab2">Университеты/Колледжи</label>

        <input type="radio" name="tabset" id="tab3" aria-controls="planned events" />
        <label for="tab3">Запланированные мероприятия</label>

        <input type="radio" name="tabset" id="tab4" aria-controls="Reviews" />
        <label for="tab4">Мои отзывы</label>

        <div class="tab-panels">
          <section id="Notifications" class="tab-panel">
            <div v-if="notifications.length > 0">
              <div v-for="notification in notifications" :key="notification.id" class="Notification-content" style="margin-top: 20px;">
                <div class="Notification-status-indicator">
                  <div class="indicator"></div>
                </div>
                <div class="Notification-text">
                  <h3>{{ notification.event ? notification.event.title : 'Нет события' }}</h3>
                  <p1>{{ notification.message }}</p1>
                  <button type="button" class="button-info" data-bs-toggle="modal" :data-bs-target="'#exampleModal' + notification.id">
                    Подробнее
                  </button>

                  <div class="modal fade" :id="'exampleModal' + notification.id" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                      <div class="modal-content">
                        <div class="modal-header">
                          <h1 class="modal-title fs-6" id="exampleModalLabel">
                            {{ notification.event ? notification.event.title : 'Нет события' }}
                          </h1>
                          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
                        </div>
                        <div class="modal-body">
                          <p>{{ notification.message }}</p>
                          <p v-if="notification.event">Дата: {{ notification.event.date }}</p>
                        </div>
                        <div class="modal-footer">
                          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
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
            <div v-if="likedInstitutions.length > 0" class="cards-container">
              <div v-for="institution in likedInstitutions" :key="institution.id" class="list-card">
                <div class="card-img">
                  <img :src="institution.photo_url || UnCardImage" class="card-img" />
                </div>
                <div class="card-info">
                  <div class="heart-container">
                    <span class="heart-icon" @click="removeLike(institution.id)">
                      <img :src="HeartFill" alt="Убрать лайк" />
                    </span>
                  </div>
                  <div class="card-info-up">
                    <h>
                      {{ institution.name }}
                      <br>
                      <span v-for="star in 5" :key="star" class="fa fa-star" :class="{ checked: star <= Math.round(institution.reviews_avg_rating || 0) }"></span>
                    </h>
                    <p>{{ institution.location }}</p>
                    <p>{{ institution.address }}</p>
                  </div>
                  <div class="card-info-down">
                    <div class="card-info-down-feature">
                      <p>Гранты</p>
                      <p class="feature">{{ institution.grants ? 'Да' : 'Нет' }}</p>
                    </div>
                    <div class="card-info-down-feature">
                      <p>Студенческое общежитие</p>
                      <p class="feature">{{ institution.dormitory ? 'Да' : 'Нет' }}</p>
                    </div>
                    <button type="button" class="university-button" @click="$router.push(`/UniversityAbout/${institution.id}`)">
                      Подробнее
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              <p>Вы не лайкнули ни одного университета.</p>
            </div>
          </section>

          <section id="planned events" class="tab-panel">
            <div v-if="userApplications.length > 0" class="cards-container">
              <div v-for="application in userApplications" :key="application.id" class="event-card">
                <div class="event-logo">
                  <img src="@/components/img/UnLogo.png" class="event-logo-img" alt="Логотип университета" />
                </div>
                <div class="event-view">
                  <h3 class="event-view-text">Ун
                    иверситет</h3>
                  <p class="event-view-text">{{ getDaysAgo(application.created_at) }}</p>

                </div>
                <div class="event-info">
                  <h3 class="event-info-text">{{ application.event.institution ? application.event.institution.name : 'Неизвестное учреждение' }}</h3>
                  <hr class="event-line" />
                  <h3 class="event-info-text">{{ application.event.event_name }}</h3>
                </div>
                <div class="event-terms">
                  <p class="terms-text">{{ formatEventDate(application.event.event_date) }}</p>
                  <p class="terms-text">Статус: {{ application.status }}</p>
                </div>
              </div>
            </div>
            <div v-else>
              <p>Вы не подали заявки на мероприятия.</p>
            </div>
          </section>

          <section id="Reviews" class="tab-panel">
            <div v-if="userReviews.length > 0">
              <div v-for="review in userReviews" :key="review.id" class="review-item">
                <div class="review-rating">
                  {{ getStarRating(review.rating) }}
                </div>
                <div class="review-comment">
                  <p>{{ review.comment }}</p>
                </div>
                <div class="review-user">
                  <p>Учреждение: {{ review.institution ? review.institution.name : 'Неизвестно' }}</p>
                  <p>Дата: {{ formatDate(review.created_at) }}</p>
                </div>
              </div>
            </div>
            <div v-else>
              <p>Вы не оставили отзывов.</p>
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
import UnCardImage from "@/components/img/UnCard.png";
import HeartFill from "@/components/icons/heart-fill.png";

export default {
  setup() {
    const router = useRouter();
    const likedInstitutions = ref([]);
    const username = ref('');
    const notifications = ref([]);
    const userApplications = ref([]);
    const userReviews = ref([]); // Добавляем для отзывов
    const showLogoutModal = ref(false); // Состояние для модального окна


    const confirmLogout = async () => {
      try {
        await authStore.logoutUser();
        showLogoutModal.value = false; // Закрываем модальное окно
        router.push('/'); // Перенаправляем на главную страницу
      } catch (error) {
        alert('Ошибка выхода: ' + error.message);
      }
    };   
    
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

    const removeLike = async (institutionId) => {
      try {
        await axios.delete(`http://localhost:8000/api/institutions/${institutionId}/unlike`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        likedInstitutions.value = likedInstitutions.value.filter(
          (institution) => institution.id !== institutionId
        );
      } catch (error) {
        console.error('Ошибка при удалении лайка:', error);
      }
    };

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

    const fetchUserApplications = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/user-applications', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        userApplications.value = response.data;
      } catch (error) {
        console.error('Ошибка при получении заявок пользователя:', error);
      }
    };

    const fetchUserReviews = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/user-reviews', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        userReviews.value = response.data;
      } catch (error) {
        console.error('Ошибка при получении отзывов пользователя:', error);
      }
    };

    const handleLogout = async () => {
      try {
        await authStore.logoutUser();
        alert('Выход выполнен');
        router.push('/');
      } catch (error) {
        alert('Ошибка выхода: ' + error.message);
      }
    };

    const getDaysAgo = (createdAt) => {
      const eventDate = new Date(createdAt);
      const currentDate = new Date();
      const diffTime = Math.abs(currentDate - eventDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `Added ${diffDays} days ago`;
    };

    const formatEventDate = (eventDate) => {
      const date = new Date(eventDate);
      const day = date.getDate();
      const monthNames = [
        'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
        'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
      ];
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    };

    const formatDate = (date) => {
      const d = new Date(date);
      return d.toLocaleDateString('ru-RU'); // Формат даты, например, "06.03.2025"
    };

    const getStarRating = (rating) => {
      return '★'.repeat(rating) + '☆'.repeat(5 - rating); // Отображаем звезды
    };

    onMounted(() => {
      fetchCurrentUser();
      fetchNotifications();
      fetchLikedInstitutions();
      fetchUserApplications();
      fetchUserReviews(); // Добавляем загрузку отзывов
    });

    return {
      username,
      notifications,
      handleLogout,
      likedInstitutions,
      removeLike,
      UnCardImage,
      HeartFill,
      userApplications,
      userReviews, // Возвращаем отзывы
      getDaysAgo,
      formatEventDate,
      formatDate,
      getStarRating,
      showLogoutModal, // Возвращаем состояние модального окна
      confirmLogout,
    };
  },
};
</script>

<style scoped>

/* Стили для вкладки Reviews */
.review-item {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.review-rating {
  font-size: 1.5rem;
  color: #ffd700; /* Золотой цвет для звезд */
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

/* Стили для карточек мероприятий в Planned Events */
.cards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
}

.event-card {
  width: 330px;
  height: 500px;
  max-width: 350px;
  background-color: #536274;
  padding: 20px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.event-logo {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.event-logo-img {
  width: 50px;
  height: 50px;
  background-color: white;
  border-radius: 12px;
  padding: 5px;
  object-fit: contain;
}

.event-view {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
}

.event-view-text {
  color: #cdcccc;
  margin: 0;
  font-size: 14px;
}

.event-info {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.event-info-text {
  color: white;
  margin: 0;
  font-size: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.event-line {
  border: 1px solid #10222e;
  margin: 10px 0;
}

.event-terms {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  gap: 10px;
}

.terms-text {
  color: #cdcccc;
  margin: 0;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Стили для карточек университетов */
.cards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
}

.list-card {
  display: flex;
  width: 100%;
  max-width: 100rem;
  min-height: 15rem;
  padding: 1rem;
  background-color: #F5F5F5;
  border-radius: 12px;
  position: relative;
  box-sizing: border-box;
}

.card-img {
  width: 100%;
  height: 100%;
  max-width: 24rem;
  height: auto;
  border-radius: 6px;
  margin-right: 1rem;
  flex-shrink: 0;
  object-fit: cover;
}

.card-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  min-width: 0;
}

.card-info-up {
  overflow: hidden;
}

.card-info-up h {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 0 0.5rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-info-up p {
  color: #919191;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0.25rem 0;
}

.hours {
  margin-top: 0 !important;
}

.card-info-down {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  width: 100%;
  margin-top: 1rem;
}

.card-info-down-feature {
  margin-right: 1rem;
  flex-shrink: 0;
}

.card-info-down-feature p:first-child {
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
}

.feature {
  color: black;
  font-size: 1rem;
  font-weight: bold;
  margin: 0;
}

.university-button {
  padding: 1rem 5rem;
  border-radius: 6px;
  background-color: #577C8E;
  color: white;
  border: none;
  transition: transform 0.3s ease;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.university-button:hover {
  transform: scale(1.1);
}

.heart-container {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 1;
}

.heart-icon {
  cursor: pointer;
  display: inline-block;
}

.heart-icon img {
  width: 2rem;
  height: 2rem;
  transition: all 0.3s ease;
}

.heart-icon:hover img {
  transform: scale(1.1);
}

.fa-star {
  color: #ccc;
  font-size: 1.8rem;
}

.fa-star.checked {
  color: #ffd700;
}

/* Медиа-запросы для карточек */
@media (max-width: 1024px) {
  .list-card {
    max-width: 100%;
  }
  .card-img {
    width: 35%;
    max-width: 12rem;
  }
}

@media (max-width: 768px) {
  .list-card {
    flex-direction: column;
    min-height: auto;
  }
  .card-img {
    width: 100%;
    max-width: none;
    margin: 0 0 0.5rem 0;
  }
  .card-info-down {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  .university-button {
    width: 100%;
    margin: 0.5rem 0 0 0;
  }
  .heart-icon img {
    width: 1.5rem;
    height: 1.5rem;
  }
}

@media (max-width: 480px) {
  .card-info-up h {
    font-size: 1.2rem;
  }
  .card-info-up p, .card-info-down-feature p:first-child {
    font-size: 0.8rem;
  }
  .feature {
    font-size: 0.9rem;
  }
  .university-button {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }
}

/* Остальные стили оставлены без изменений */
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