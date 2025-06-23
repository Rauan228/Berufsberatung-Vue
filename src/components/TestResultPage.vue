<template>
  <div class="result-page" v-if="loading">
    <p>Загрузка...</p>
  </div>
  <div class="result-page" v-else>
    <h1>Ваш результат</h1>
    <p class="summary" v-html="formatSummary(result.summary)"></p>

    <h2>Рекомендуемые специальности</h2>
    <transition-group
      v-if="specialties.length"
      name="cards"
      tag="div"
      class="spec-cards"
      appear
    >
      <div
        v-for="spec in specialties"
        :key="spec.id"
        class="spec-card"
        @click="openSpec(spec)"
      >
        <h3>{{ spec.name }}</h3>
        <p>{{ spec.qualification_name }}</p>
      </div>
    </transition-group>
    <p v-else>К сожалению, подходящие специальности не найдены.</p>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'TestResultPage',
  data() {
    return {
      loading: true,
      result: {},
      specialties: [],
    };
  },
  async created() {
    await this.fetchResult();
  },
  methods: {
    async fetchResult() {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`http://localhost:8000/api/career-tests/${this.$route.params.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.result = data;
        await this.fetchSpecialties();
      } catch (e) {
        console.error('Не удалось получить результат', e);
        alert('Ошибка загрузки');
      } finally {
        this.loading = false;
      }
    },
    async fetchSpecialties() {
      let idsOrNames = this.result.suggestions || [];
      // если пришло строкой ("[1,2,3]") – распарсим
      if (typeof idsOrNames === 'string') {
        try {
          idsOrNames = JSON.parse(idsOrNames);
        } catch (_) {
          idsOrNames = [];
        }
      }

      // если массив пуст – прекращаем
      if (!Array.isArray(idsOrNames) || !idsOrNames.length) return;

      const type = this.result.institution_type;
      const prefix = type === 'college' ? 'college-' : '';

      for (const item of idsOrNames) {
        // Если элемент строка и не является числом – считаем это названием, не id.
        if (typeof item === 'string' && isNaN(Number(item))) {
          // попытаемся найти специальность по поисковому API
          try {
            const { data: listResp } = await axios.get(`http://localhost:8000/api/specializations?search=${encodeURIComponent(item)}&type=${type}`);
            const firstMatch = listResp.data?.find(s => true);
            if (firstMatch) {
              this.specialties.push({
                ...firstMatch,
                qualification_name: firstMatch.qualification?.qualification_name || firstMatch.qualification?.name || '—',
                type,
              });
            }
          } catch (e) {
            console.warn('Lookup by name failed', item, e);
          }
          continue;
        }

        // обычный путь по id
        try {
          const { data: apiResp } = await axios.get(`http://localhost:8000/api/${prefix}specializations/${item}`);
          const specRaw = apiResp && apiResp.data ? apiResp.data : apiResp;
          this.specialties.push({
            ...specRaw,
            qualification_name:
              specRaw?.qualification?.qualification_name ||
              specRaw?.qualification?.name ||
              '—',
            type,
          });
        } catch (e) {
          console.warn('Spec fetch failed', item, e);
        }
      }
    },
    openSpec(spec) {
  // Сохраняем весь объект, пришедший с API
  localStorage.setItem('selectedSpecialization', JSON.stringify({
    ...spec,                       // id, name, qualification, …
    type: this.result.institution_type,
  }));
  this.$router.push({ name: 'SpecializationAbout', params: { id: spec.id } });
},
    formatSummary(text) {
      return (text || '').replace(/\n/g, '<br>');
    },
  },
};
</script>
<style scoped>
.result-page {
  max-width: 900px;
  margin: 40px auto;
  padding: 20px;
}
.summary {
  background: #f8f8f8;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 30px;
  white-space: pre-line;
}
.spec-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
.spec-card {
  flex: 0 0 250px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  padding: 16px;
  cursor: pointer;
  transition: transform 0.2s;
}
.spec-card:hover {
  transform: translateY(-4px);
}

/* Card appear animation */
.cards-enter-active {
  transition: all 0.35s ease;
}
.cards-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
</style> 