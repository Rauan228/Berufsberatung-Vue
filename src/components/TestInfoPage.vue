<template>
  <div class="test-info-page">
    <h1>Профориентационный тест</h1>
    <p class="intro-text">
      Этот тест состоит из 80 вопросов (4 блока по 20): личностные качества, рабочие предпочтения, интересы и профильные предпочтения.
      Он поможет глубже выявить ваши склонности и, с помощью искусственного интеллекта, предложит специальности,
      которые лучше всего подойдут именно вам.
    </p>

    <div class="info-grid">
      <div class="previous-results" :class="{ unauth: !isAuthenticated && !loading }">
        <h2>Мои результаты</h2>

        <!-- Лоадер -->
        <div v-if="loading" class="loading-container">
          <div class="spinner"></div>
        </div>

        <template v-else>
          <!-- Пользователь не авторизован -->
          <div v-if="!isAuthenticated" class="unauth-message">
            <p class="warning">
              Вы не авторизованы. Ваши результаты не будут сохранены. Чтобы сохранить результаты и
              иметь к ним доступ позже, пожалуйста, войдите в систему.
            </p>
            <button class="login-btn" @click="goLogin">Войти / Регистрация</button>
          </div>

          <!-- Авторизован, но нет результатов -->
          <p v-else-if="!results.length" class="no-results">Нет пройденных тестов</p>

          <!-- Авторизован и имеются результаты -->
          <transition-group name="fade-list" tag="div" appear>
            <div
              v-for="res in results"
              :key="res.id"
              class="result-card"
              @click="openResult(res.id)"
            >
              <p class="date">{{ formatDate(res.created_at) }}</p>
              <p class="summary" v-text="truncate(res.summary, 120)" />
            </div>
          </transition-group>
        </template>
      </div>

      <div class="start-test">
        <h2>Начать тест</h2>
        <label>Куда планируете поступать?</label>
        <select v-model="institutionType">
          <option disabled value="">Выберите тип учреждения</option>
          <option value="university">Университет</option>
          <option value="college">Колледж</option>
        </select>

        <button class="start-btn" :disabled="!institutionType" @click="beginTest">Приступить</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      results: [],
      isAuthenticated: false,
      institutionType: '',
      loading: true,
    };
  },
  created() {
    this.initialize();
  },
  methods: {
    async initialize() {
      // параллельно проверяем авторизацию и ждём 3-секундный таймер
      const authPromise = this.checkAuth();
      const minDelay = new Promise((resolve) => setTimeout(resolve, 3000));
      await Promise.all([authPromise, minDelay]);
      this.loading = false;
    },
    async checkAuth() {
      const token = localStorage.getItem('token');
      if (!token) {
        this.isAuthenticated = false;
        return;
      }
      try {
        await axios.get('http://localhost:8000/api/current-user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.isAuthenticated = true;
        await this.fetchResults();
      } catch (e) {
        this.isAuthenticated = false;
      }
    },
    async fetchResults() {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('http://localhost:8000/api/career-tests', {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.results = data;
      } catch (e) {
        console.error('Не удалось получить результаты', e);
      }
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString('ru-RU');
    },
    truncate(str, len) {
      if (!str) return '';
      return str.length > len ? str.slice(0, len) + '…' : str;
    },
    beginTest() {
      this.$router.push({ name: 'TestQuestions', query: { type: this.institutionType } });
    },
    openResult(id) {
      this.$router.push({ name: 'TestResult', params: { id } });
    },
    // Добавляем переход на страницу авторизации
    goLogin() {
      this.$router.push('/login');
    },
  },
};
</script>

<style scoped>
.test-info-page {
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
}
.intro-text {
  font-size: 1.2rem;
  margin-bottom: 30px;
}
.info-grid {
  display: flex;
  gap: 40px;
}
.previous-results {
  flex: 1;
  max-height: 450px;
  overflow-y: auto;
  padding-right: 6px;
}
.result-card {
  background: #f4f4f4;
  padding: 16px;
  border-radius: 10px;
  margin-bottom: 14px;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}
.result-card:hover {
  background: #e6e6e6;
  transform: translateY(-4px);
}
.start-test {
  flex: 1;
  background: #ffffff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.start-btn {
  padding: 14px 24px;
  font-size: 18px;
  background: #536274;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
.start-btn:disabled {
  background: #aaa;
  cursor: not-allowed;
}
.previous-results.unauth {
  background: #ffecec;
  border: 2px solid #ff6b6b;
  padding: 20px;
  border-radius: 12px;
}
.warning {
  color: #c0392b;
  margin-bottom: 14px;
}
.login-btn {
  padding: 12px 20px;
  font-size: 16px;
  background: #ff6b6b;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
.login-btn:hover {
  background: #e55b5b;
}
.no-results {
  color: #555;
}
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 120px;
}
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #ccc;
  border-top-color: #536274;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.fade-list-enter-active {
  transition: all 0.3s ease;
}
.fade-list-enter-from {
  opacity: 0;
  transform: translateY(15px);
}
</style> 