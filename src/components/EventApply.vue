<template>
    <div>
      <h2>Заявка на участие в событии</h2>
      <form @submit.prevent="submitApplication">
        <input v-model="form.name" placeholder="Ваше имя" required />
        <input v-model="form.email" type="email" placeholder="Email" required />
        <button type="submit">Отправить</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        form: {
          name: '',
          email: '',
        },
        eventId: this.$route.params.id,
      };
    },
    methods: {
      async submitApplication() {
        try {
          await axios.post('/api/event-applications', {
            event_id: this.eventId,
            name: this.form.name,
            email: this.form.email,
          });
          alert('Заявка отправлена!');
          this.$router.push('/events');
        } catch (error) {
          console.error('Ошибка при отправке заявки:', error);
        }
      },
    },
  };
  </script>