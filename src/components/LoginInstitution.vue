<template>
    <div class="login-institution-container">
        <h1>Вход для университета</h1>
        <div class="step">
            <div class="form-group">
                <label for="email">Email</label>
                <input v-model="form.email" id="email" type="email" 
                       placeholder="Введите email" required />
            </div>
            <div class="form-group">
                <label for="password">Пароль</label>
                <input v-model="form.password" id="password" type="password" 
                       placeholder="Введите пароль" required />
            </div>
            <button @click="submitLogin" class="btn btn-primary">Войти</button>
        </div>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        <p v-if="successMessage" class="success">{{ successMessage }}</p>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            form: {
                email: '',
                password: '',
            },
            successMessage: '',
            errorMessage: '',
        };
    },
    methods: {
        async submitLogin() {
            try {
                this.errorMessage = '';
                this.successMessage = '';
                
                const response = await axios.post('http://localhost:8000/api/institutions/login', {
                    email: this.form.email,
                    password: this.form.password,
                });

                this.successMessage = '✅ Успешный вход!';
                if (response.data.token) {
                    localStorage.setItem('institution_token', response.data.token);
                    localStorage.setItem('institution_data', JSON.stringify({
                        name: response.data.institution.name,
                        logo_url: response.data.institution.logo_url,
                    }));
                }
                this.$router.push('/InctitutionsMain');
            } catch (error) {
                this.errorMessage = `❌ ${error.response?.data?.error || 'Ошибка входа'}`;
            }
        },
    },
};
</script>

<style scoped>
.login-institution-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background-color: #f6f5f7;
    padding: 20px;
}

h1 {
    font-size: 2.5em;
    margin-bottom: 20px;
    color: #333;
}

.form-group {
    margin-bottom: 15px;
    width: 100%;
    max-width: 400px;
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

button {
    padding: 12px 20px;
    font-size: 1.2em;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    margin: 10px 0;
    background-color: #FF4B2B;
    color: white;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #e03e1e;
}

.success {
    color: green;
    font-weight: bold;
    margin-top: 10px;
}

.error {
    color: red;
    font-weight: bold;
    margin-top: 10px;
}
</style>