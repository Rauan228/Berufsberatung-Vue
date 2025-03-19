<template>
    <div class="register-institution-container">
        <h1>Регистрация университета</h1>
        
        <!-- Прогресс-бар -->
        <div class="progress-bar">
            <div class="progress" :style="{ width: ((step - 1) / 4 * 100) + '%' }"></div>
        </div>

        <!-- Единая форма -->
        <form @submit.prevent="submitForm" class="registration-form">
            <!-- Шаг 1: Название -->
            <div v-if="step === 1" class="form-section">
                <h2>Шаг 1: Название университета</h2>
                <div class="form-group">
                    <label for="name">Название университета</label>
                    <input v-model="form.name" id="name" type="text" placeholder="Введите название" required />
                </div>
                <div class="form-controls">
                    <button type="button" @click="$router.push('/LoginInstitution')" class="btn btn-secondary">Войти</button>
                    <button type="button" @click="nextStep" class="btn btn-primary">Далее</button>
                </div>
            </div>

            <!-- Шаг 2: Email и пароль -->
            <div v-if="step === 2" class="form-section">
                <h2>Шаг 2: Email и пароль</h2>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input v-model="form.email" id="email" type="email" placeholder="Введите email" required />
                </div>
                <div class="form-group">
                    <label for="password">Пароль</label>
                    <input v-model="form.password" id="password" type="password" placeholder="Введите пароль" required />
                </div>
                <div class="form-group">
                    <label for="password_confirmation">Подтверждение пароля</label>
                    <input v-model="form.password_confirmation" id="password_confirmation" type="password"
                        placeholder="Подтвердите пароль" required />
                </div>
                <div class="form-controls">
                    <button type="button" @click="prevStep" class="btn btn-secondary">Назад</button>
                    <button type="button" @click="nextStep" class="btn btn-primary">Далее</button>
                </div>
            </div>

            <!-- Шаг 3: Контакты -->
            <div v-if="step === 3" class="form-section">
                <h2>Шаг 3: Контактные данные</h2>
                <div class="form-group">
                    <label for="location">Местоположение</label>
                    <input v-model="form.location" id="location" type="text" placeholder="Например, Астана, Казахстан"
                        required />
                </div>
                <div class="form-group">
                    <label for="phone">Телефон</label>
                    <input v-model="form.phone" id="phone" type="text" placeholder="Например, +7 (7172) 70-66-88"
                        required />
                </div>
                <div class="form-group">
                    <label for="website">Веб-сайт</label>
                    <input v-model="form.website" id="website" type="text" placeholder="Например, https://nu.edu.kz"
                        required />
                </div>
                <div class="form-group">
                    <label for="address">Адрес</label>
                    <input v-model="form.address" id="address" type="text" placeholder="Например, просп. Кабанбай Батыра 53"
                        required />
                </div>
                <div class="form-group">
                    <label class="checkbox-container">
                        <input type="checkbox" v-model="form.dormitory" id="dormitory" />
                        <span class="checkmark"></span>
                        Есть общежитие
                    </label>
                </div>
                <div class="form-group">
                    <label class="checkbox-container">
                        <input type="checkbox" v-model="form.grants" id="grants" />
                        <span class="checkmark"></span>
                        Есть гранты
                    </label>
                </div>
                <div class="form-controls">
                    <button type="button" @click="prevStep" class="btn btn-secondary">Назад</button>
                    <button type="button" @click="nextStep" class="btn btn-primary">Далее</button>
                </div>
            </div>

            <!-- Шаг 4: Специальности -->
            <div v-if="step === 4" class="form-section">
                <h2>Шаг 4: Выбор специальностей</h2>
                <div class="specialties-container">
                    <div v-if="specializations.length === 0">Загрузка специальностей...</div>
                    <div v-else class="specialties-list">
                        <details v-for="qual in qualifications" :key="qual.id" class="specialty-group">
                            <summary>{{ qual.qualification_name }}</summary>
                            <div class="checkbox-group">
                                <label v-for="spec in qual.specializations" :key="spec.id" class="checkbox-container">
                                    <input type="checkbox" :value="spec.id" v-model="selectedSpecializations" />
                                    <span class="checkmark"></span>
                                    {{ spec.name }}
                                </label>
                            </div>
                        </details>
                    </div>
                </div>
                <div class="form-controls">
                    <button type="button" @click="prevStep" class="btn btn-secondary">Назад</button>
                    <button type="submit" class="btn btn-primary">Отправить заявку</button>
                </div>
            </div>
        </form>

        <!-- Сообщения -->
        <p v-if="step === 5" class="success">{{ successMessage }}</p>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            step: 1,
            form: {
                name: '',
                email: '',
                password: '',
                password_confirmation: '',
                location: '',
                phone: '',
                website: '',
                address: '',
                dormitory: false,
                grants: false,
            },
            selectedSpecializations: [],
            specializations: [],
            qualifications: [],
            successMessage: '',
            errorMessage: '',
        };
    },
    mounted() {
        this.fetchQualifications();
    },
    methods: {
        async fetchQualifications() {
            try {
                const response = await axios.get('http://localhost:8000/api/qualifications');
                this.qualifications = response.data;
                this.specializations = this.qualifications.flatMap(qual => qual.specializations);
            } catch (error) {
                console.error('Ошибка при загрузке квалификаций:', error);
                this.errorMessage = 'Не удалось загрузить квалификации и специальности.';
            }
        },
        nextStep() {
            if (this.validateStep()) {
                this.step++;
            }
        },
        prevStep() {
            this.step--;
            this.errorMessage = '';
        },
        validateStep() {
            this.errorMessage = '';
            if (this.step === 1 && !this.form.name) {
                this.errorMessage = 'Введите название университета.';
                return false;
            }
            if (this.step === 2) {
                if (!this.form.email) {
                    this.errorMessage = 'Введите email.';
                    return false;
                }
                if (!this.form.password || this.form.password.length < 6) {
                    this.errorMessage = 'Пароль должен быть не менее 6 символов.';
                    return false;
                }
                if (this.form.password !== this.form.password_confirmation) {
                    this.errorMessage = 'Пароли не совпадают.';
                    return false;
                }
            }
            if (this.step === 3) {
                if (!this.form.location || !this.form.phone || !this.form.website || !this.form.address) {
                    this.errorMessage = 'Заполните все контактные данные.';
                    return false;
                }
            }
            return true;
        },
        async submitForm() {
            try {
                this.errorMessage = '';
                const response = await axios.post('http://localhost:8000/api/institutions/register', {
                    name: this.form.name,
                    email: this.form.email,
                    password: this.form.password,
                    password_confirmation: this.form.password_confirmation,
                    location: this.form.location,
                    phone: this.form.phone,
                    website: this.form.website,
                    address: this.form.address,
                    dormitory: this.form.dormitory,
                    grants: this.form.grants,
                    specializations: this.selectedSpecializations,
                });

                this.successMessage = '✅ Заявка на регистрацию университета успешно отправлена! Ожидайте подтверждения.';
                this.step = 5;
            } catch (error) {
                this.errorMessage = `❌ ${error.response?.data?.error || error.message}`;
                console.log('Ошибка валидации:', error.response?.data);
            }
        },
    },
};
</script>

<style scoped>
.register-institution-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    background-color: #f6f5f7;
    padding: 20px;
}

.progress-bar {
    width: 100%;
    max-width: 600px;
    height: 10px;
    background-color: #ddd;
    border-radius: 5px;
    margin-bottom: 20px;
}

.progress {
    height: 100%;
    background-color: #FF4B2B;
    border-radius: 5px;
    transition: width 0.3s ease;
}

.registration-form {
    width: 100%;
    max-width: 600px;
}

.form-section {
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.form-controls {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

h1 {
    font-size: 2.5em;
    margin-bottom: 20px;
    color: #333;
}

h2 {
    font-size: 1.8em;
    margin-bottom: 15px;
    color: #333;
}

.form-group {
    margin-bottom: 15px;
    width: 100%;
}

label {
    font-size: 1.1em;
    color: #333;
    margin-bottom: 5px;
    display: block;
}

input {
    width: 100%;
    padding: 10px;
    font-size: 1em;
    border: 1px solid #ddd;
    border-radius: 5px;
    background-color: #eee;
}

.specialties-container {
    max-height: 400px;
    overflow-y: auto;
    margin-bottom: 20px;
    text-align: left;
}

.specialty-group {
    margin-bottom: 10px;
    background-color: white;
    padding: 10px;
    border-radius: 6px;
    transition: transform 0.3s ease, background-color 0.3s ease;
}

.specialty-group:hover {
    transform: scale(1.02);
    background-color: #e0e0e0;
}

summary {
    font-size: 1.3em;
    cursor: pointer;
    padding: 5px;
}

.checkbox-group {
    padding: 10px;
}

.checkbox-container {
    display: block;
    position: relative;
    padding-left: 35px;
    margin: 10px 0;
    cursor: pointer;
    font-size: 1em;
    user-select: none;
}

.checkbox-container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
}

.checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 20px;
    width: 20px;
    background-color: #eee;
    border-radius: 4px;
    transition: background-color 0.3s ease;
}

.checkbox-container:hover input~.checkmark {
    background-color: #ccc;
}

.checkbox-container input:checked~.checkmark {
    background-color: #FF4B2B;
}

.checkmark:after {
    content: "";
    position: absolute;
    display: none;
}

.checkbox-container input:checked~.checkmark:after {
    display: block;
}

.checkbox-container .checkmark:after {
    left: 7px;
    top: 3px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
}

button {
    padding: 12px 20px;
    font-size: 1.2em;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    margin: 10px 5px;
    transition: background-color 0.3s ease;
}

.btn-primary {
    background-color: #FF4B2B;
    color: white;
}

.btn-primary:hover {
    background-color: #e03e1e;
}

.btn-secondary {
    background-color: #ccc;
    color: #333;
}

.btn-secondary:hover {
    background-color: #bbb;
}

.success {
    color: green;
    font-weight: bold;
    margin-top: 20px;
}

.error {
    color: red;
    font-weight: bold;
    margin-top: 20px;
}
</style>