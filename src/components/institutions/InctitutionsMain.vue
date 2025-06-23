<template>
    <div class="institutions-main-container">
        <!-- Loader -->
        <div v-if="isLoading" class="loader-container">
            <div class="spinner"></div>
        </div>
        <div class="sidebar">
            <div class="sidebar-header">
                <img v-if="logoSrc" :src="logoSrc" alt="Логотип университета" class="logo" />
                <h2>{{ institution.name || 'Название университета' }}</h2>
            </div>
            <div class="sidebar-buttons">
                <button @click="$router.push('/InctitutionsMain')" 
                        :class="{ active: $route.path === '/InctitutionsMain' }" 
                        class="sidebar-button">
                    Главное меню
                </button>
                <button @click="$router.push('/InctitutionsMain/InstitutionData')" 
                        :class="{ active: $route.path === '/InctitutionsMain/InstitutionData' }" 
                        class="sidebar-button">
                    Данные универа
                </button>
                <button @click="$router.push('/InctitutionsMain/InstitutionEvents')" 
                        :class="{ active: $route.path === '/InctitutionsMain/InstitutionEvents' }" 
                        class="sidebar-button">
                    Ивенты
                </button>
                <button @click="$router.push('/InctitutionsMain/InstitutionApplications')" 
                        :class="{ active: $route.path === '/InctitutionsMain/InstitutionApplications' }" 
                        class="sidebar-button">
                    Управление заявками
                </button>
                <button @click="$router.push('/InctitutionsMain/InstitutionSpecialties')" 
                        :class="{ active: $route.path === '/InctitutionsMain/InstitutionSpecialties' }" 
                        class="sidebar-button">
                    Специальности
                </button>
                <button @click="logout" class="sidebar-button logout-button">
                    Выход
                </button>
            </div>
        </div>
        <div class="main-content">
            <div v-if="$route.path === '/InctitutionsMain'" class="cards-wrapper">
                <div class="info-card">
                    <h3>Специальности</h3>
                    <p>{{ counts.specs }}</p>
                </div>
                <div class="info-card">
                    <h3>События</h3>
                    <p>{{ counts.events }}</p>
                </div>
                <div class="info-card">
                    <h3>Заявки</h3>
                    <p>{{ counts.apps }}</p>
                </div>
            </div>
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import api from '@/services/api';

export default {
    name: 'InctitutionsMain',
    data() {
        return {
            institution: {
                name: '',
                logo_url: '',
            },
            counts: {
                specs: 0,
                events: 0,
                apps: 0
            },
            loadingCounts: false,
            loadingInst: true,
        };
    },
    mounted() {
        const token = localStorage.getItem('institution_token');
        if (!token) {
            this.$router.push('/LoginInstitution');
            return;
        }

        // Проверяем данные в localStorage
        const savedData = localStorage.getItem('institution_data');
        if (savedData) {
            this.institution = JSON.parse(savedData);
            // локальные данные уже есть – загрузку по учреждению завершаем
            this.loadingInst = false;
        } else {
            this.fetchInstitutionData(token);
        }

        // Загружаем счётчики
        this.fetchCounts();
    },
    methods: {
        async fetchInstitutionData(token) {
            try {
                console.log('Токен:', token);
                const response = await api.get('/institutions/current', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                });
                console.log('Ответ сервера:', response.data);
                this.institution = {
                    name: response.data.institution.name,
                    logo_url: response.data.institution.logo_url,
                };
                localStorage.setItem('institution_data', JSON.stringify(this.institution));
            } catch (error) {
                console.error('Ошибка загрузки данных учреждения:', error.response ? error.response.data : error.message);
                this.$router.push('/LoginInstitution');
            } finally {
                this.loadingInst = false;
            }
        },
        async logout() {
            try {
                const token = localStorage.getItem('institution_token');
                if (token) {
                    // Выполняем запрос на сервер для выхода (опционально, если у вас есть эндпоинт)
                    await api.post('/institutions/logout', {}, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Accept': 'application/json',
                        },
                    });
                }

                // Удаляем данные из localStorage
                localStorage.removeItem('institution_token');
                localStorage.removeItem('institution_data');

                // Перенаправляем на страницу логина
                this.$router.push('/');
            } catch (error) {
                console.error('Ошибка при выходе:', error.response ? error.response.data : error.message);
                // В случае ошибки всё равно очищаем локальные данные и перенаправляем
                localStorage.removeItem('institution_token');
                localStorage.removeItem('institution_data');
                this.$router.push('/');
            }
        },
        async fetchCounts() {
            this.loadingCounts = true
            try {
                const [specRes, evRes, appRes] = await Promise.all([
                    api.get('/institution/specialties'),
                    api.get('/institution/events'),
                    api.get('/institution/applications')
                ])
                this.counts.specs  = specRes.data.length
                this.counts.events = evRes.data.length
                this.counts.apps   = appRes.data.length
            } catch (e) {
                console.error('Ошибка загрузки счётчиков')
            } finally {
                this.loadingCounts = false
            }
        },
    },
    computed: {
        logoSrc() {
            if (!this.institution.logo_url) return null;
            return this.institution.logo_url.startsWith('http')
                ? this.institution.logo_url
                : `http://localhost:8000${this.institution.logo_url}`;
        },
        isLoading(){
            return this.loadingCounts || this.loadingInst;
        }
    },
};
</script>

<style scoped>
.institutions-main-container {
    display: flex;
    min-height: 100vh;
    background-color: #f6f5f7;
}

/* Сайдбар */
.sidebar {
    width: 250px;
    background-color: #333;
    color: white;
    padding: 20px;
    display: flex;
    flex-direction: column;
}

.sidebar-header {
    margin-bottom: 30px;
    text-align: center;
}

.sidebar-header .logo {
    max-width: 100px;
    max-height: 100px;
    border-radius: 50%;
    margin-bottom: 10px;
}

.sidebar-header h2 {
    font-size: 1.2em;
    color: #fff;
    margin: 0;
}

.sidebar-buttons {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.sidebar-button {
    padding: 12px 20px;
    font-size: 1.1em;
    background-color: #444;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    text-align: left;
    transition: background-color 0.3s ease;
}

.sidebar-button:hover {
    background-color: #555;
}

.sidebar-button.active {
    background-color: #FF4B2B;
}

.logout-button {
    margin-top: 20px; /* Отступ сверху для отделения от других кнопок */
    background-color: #d9534f; /* Красный цвет для кнопки logout */
}

.logout-button:hover {
    background-color: #c9302c; /* Темнее при наведении */
}

/* Основное содержимое */
.main-content {
    flex: 1;
    padding: 20px;
    background-color: #fff;
}

/* Loader styles */
.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255,255,255,0.8);
  z-index: 1000;
}
.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #577C8E;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>