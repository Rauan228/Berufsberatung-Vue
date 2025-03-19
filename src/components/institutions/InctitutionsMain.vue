<template>
    <div class="institutions-main-container">
        <div class="sidebar">
            <div class="sidebar-header">
                <img v-if="institution.logo_url" :src="institution.logo_url" alt="Логотип университета" class="logo" />
                <h2>{{ institution.name || 'Название университета' }}</h2>
            </div>
            <div class="sidebar-buttons">
                <button @click="$router.push('/InctitutionsMain')" 
                        :class="{ active: $route.path === '/InctitutionsMain' }" 
                        class="sidebar-button">
                    Main menu
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
                    Logout
                </button>
            </div>
        </div>
        <div class="main-content">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'InctitutionsMain',
    data() {
        return {
            institution: {
                name: '',
                logo_url: '',
            },
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
        } else {
            this.fetchInstitutionData(token);
        }
    },
    methods: {
        async fetchInstitutionData(token) {
            try {
                console.log('Токен:', token);
                const response = await axios.get('http://localhost:8000/api/institutions/current', {
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
            }
        },
        async logout() {
            try {
                const token = localStorage.getItem('institution_token');
                if (token) {
                    // Выполняем запрос на сервер для выхода (опционально, если у вас есть эндпоинт)
                    await axios.post('http://localhost:8000/api/institutions/logout', {}, {
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
</style>