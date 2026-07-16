<template>
  <div class="inst-events-container">
    <!-- Loader -->
    <div v-if="loading" class="loader-container">
      <div class="spinner"></div>
    </div>
    <h1>События учреждения</h1>

    <form @submit.prevent="createEvent" class="add-form">
      <input v-model="newEvent.event_name" placeholder="Название события" required />
      <input v-model="newEvent.event_date" type="datetime-local" required />
      <select v-model="newEvent.event_type" required>
        <option value="open">Открытое</option>
        <option value="closed">Закрытое</option>
        <option value="group">Групповое</option>
      </select>
      <input v-model="newEvent.description" placeholder="Описание" />
      <!-- Конструктор схемы заявки -->
      <div class="schema-builder">
        <h3>Поля заявки</h3>

        <div class="field-list" v-if="schemaFields.length">
          <div class="schema-field" v-for="(f,i) in schemaFields" :key="i">
            <span>{{ f.label }} ({{ f.type }}) <strong v-if="f.required">*</strong></span>
            <button type="button" class="btn-danger small" @click="removeField(i)">×</button>
          </div>
        </div>

        <div class="new-field">
          <input v-model="newField.label" placeholder="Метка поля" />
          <select v-model="newField.type">
            <option value="string">Строка</option>
            <option value="number">Число</option>
            <option value="email">Email</option>
            <option value="phone">Телефон</option>
          </select>
          <label class="req-check"><input type="checkbox" v-model="newField.required" /> Обязательное</label>
          <button type="button" class="btn-primary small" @click="addField">Добавить</button>
        </div>
      </div>
      <button type="submit" class="btn-primary">Добавить</button>
    </form>

    <table v-if="events.length" class="events-table">
      <thead>
        <tr><th>Название</th><th>Дата</th><th>Тип</th><th>Описание</th><th></th></tr>
      </thead>
      <tbody>
        <tr v-for="e in events" :key="e.id">
          <td>{{ e.event_name }}</td>
          <td>{{ formatDate(e.event_date) }}</td>
          <td>{{ translateType(e.event_type) }}</td>
          <td>{{ e.description }}</td>
          <td>
            <button @click="removeEvent(e.id)" class="btn-danger">×</button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else>Событий пока нет.</p>
    <span v-if="error" class="error">{{ error }}</span>
  </div>
</template>

<script>
import api from '@/services/api'
export default {
  data() {
    return {
      loading: true,
      events: [],
      newEvent: {
        event_name: '',
        event_date: '',
        description: '',
        event_type: 'open'
      },
      error: '',
      schemaFields: [],
      newField: { label: '', type: 'string', required: true }
    }
  },
  async mounted() {
    await this.fetchEvents()
    this.loading = false
  },
  methods: {
    formatDate(dt) {
      return new Date(dt).toLocaleString()
    },
    translateType(t){
      const map={open:'Открытое',closed:'Закрытое',group:'Групповое'}
      return map[t]||t
    },
    async fetchEvents() {
      try {
        const { data } = await api.get('/institution/events')
        this.events = data
      } catch (e) {
        this.error = 'Ошибка загрузки событий'
      }
    },
    async createEvent() {
      try {
        // формируем JSON схемы (или null)
        const payload = {
          ...this.newEvent,
          application_schema: this.schemaFields.length ? JSON.stringify(this.schemaFields) : null
        }
        const { data } = await api.post('/institution/events', payload)
        this.events.unshift(data)
        this.newEvent = { event_name: '', event_date: '', description: '', event_type: 'open' }
        this.schemaFields = []
      } catch (e) {
        this.error = 'Ошибка создания события'
      }
    },
    async removeEvent(id) {
      if (!confirm('Удалить событие?')) return
      try {
        await api.delete(`/institution/events/${id}`)
        this.events = this.events.filter(ev => ev.id !== id)
      } catch (e) {
        this.error = 'Ошибка удаления'
      }
    },
    addField(){
      if(!this.newField.label) return
      const name = this.slugify(this.newField.label)
      this.schemaFields.push({
        name,
        label: this.newField.label,
        type: this.newField.type,
        required: !!this.newField.required
      })
      this.newField = { label: '', type: 'string', required: true }
    },
    removeField(i){ this.schemaFields.splice(i,1) },
    slugify(text){ return text.toLowerCase().replace(/[^a-zа-я0-9]+/g,'_').replace(/^_|_$/g,'') }
  }
}
</script>

<style scoped>
.inst-events-container { max-width: 800px; margin: 40px auto; font-family: inherit; }
.add-form { display: flex; gap: 10px; margin-bottom: 20px; }
.add-form input { padding: 6px 8px; border: 1px solid #ccc; border-radius: 6px; flex:1; }
.add-form select { padding: 6px 8px; border: 1px solid #ccc; border-radius: 6px; }
.add-form textarea{padding:6px 8px;border:1px solid #ccc;border-radius:6px;width:100%;}
.btn-primary { background:#1795c0; color:#fff; border:none; padding:6px 14px; border-radius:6px; cursor:pointer; }
.btn-danger { background:#ff4d4f; color:#fff; border:none; padding:4px 10px; border-radius:6px; cursor:pointer; }
.events-table { width:100%; border-collapse: collapse; }
.events-table th, .events-table td { border:1px solid #ddd; padding:8px; text-align:left; }
.error { color:red; }
.btn-danger.small,.btn-primary.small{padding:2px 6px;font-size:12px;margin-left:6px}
.schema-builder{border:1px solid #ccc;padding:10px;border-radius:6px;width:100%;margin:10px 0}
.field-list{display:flex;flex-direction:column;gap:4px;margin-bottom:10px}
.schema-field{display:flex;justify-content:space-between;align-items:center;background:#f6f6f6;padding:4px 8px;border-radius:4px}
.new-field{display:flex;gap:6px;flex-wrap:wrap;margin-top:6px}
.new-field input,.new-field select{padding:4px 6px;border:1px solid #ccc;border-radius:4px}
.req-check{display:flex;align-items:center;gap:4px}

/* Loader styles */
.loader-container{display:flex;justify-content:center;align-items:center;position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(255,255,255,0.8);z-index:1000;}
.spinner{width:50px;height:50px;border:5px solid #f3f3f3;border-top:5px solid #1795c0;border-radius:50%;animation:spin 1s linear infinite;}
@keyframes spin{0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}
</style>