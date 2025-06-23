<template>
  <div class="specialties-container">
    <!-- Loader -->
    <div v-if="loading" class="loader-container"><div class="spinner"></div></div>
    <h1>Специальности</h1>
    <div class="add-section">
      <select v-model="selectedGlobalId">
        <option disabled value="">Глоб. специальность…</option>
        <option v-for="g in catalog" :key="g.id" :value="g.id">{{ g.name }}</option>
      </select>

      <select v-model="selectedQualId" :disabled="!selectedGlobalId">
        <option disabled value="">Квалификация…</option>
        <option v-for="q in currentQuals" :key="q.id" :value="q.id">
          {{ q.qualification_name }}
        </option>
      </select>

      <select v-model="selectedSpecId" :disabled="!selectedQualId">
        <option disabled value="">Специальность…</option>
        <option v-for="s in currentSpecs" :key="s.id" :value="s.id">{{ s.name }}</option>
      </select>

      
      <button class="btn-primary" @click="attachSpec" :disabled="!selectedSpecId">Добавить</button>
    </div><div v-if="selectedSpecId" class="cost-block">  
        <input v-model.number="newCost" type="number" placeholder="Стоимость" />
        <input v-model="newDuration" placeholder="Длительность" />
      </div>

    <div v-for="(quals, gName) in grouped" :key="gName">
      <h2 class="global-title">{{ gName }}</h2>
      <div v-for="(list, qName) in quals" :key="qName" class="qual-block">
        <h3 class="qual-title">{{ qName }}</h3>
        <ul class="spec-list">
          <li v-for="item in list" :key="item.row.id">
            <template v-if="editingId === item.row.id">
              {{ item.specName }}
              <input v-model.number="item.row.cost" type="number" class="mini-input" />₸
              <input v-model="item.row.duration" class="mini-input" />
              <button class="icon-btn" @click="saveEdit(item.row)">✔</button>
            </template>
            <template v-else>
              {{ item.specName }} <span>({{ item.row.cost || '-' }}₸ / {{ item.row.duration || '-' }})</span>
              <button class="icon-btn" @click="editingId=item.row.id">✎</button>
              <button class="icon-btn btn-danger" @click="detachSpec(item.row.id)">🗑</button>
            </template>
          </li>
        </ul>
      </div>
    </div>

    <span v-if="error" class="error">{{ error }}</span>
  </div>
</template>

<script>
import api from '@/services/api'

export default {
  data() {
    return {
      catalog: [],
      selectedGlobalId: '',
      selectedQualId: '',
      selectedSpecId: '',
      specs: [],
      error: '',
      newCost: '',
      newDuration: '',
      editingId: null,
      loading: true
    }
  },
  async mounted() {
    try {
      const inst = JSON.parse(localStorage.getItem('institution_data'))
      const url = inst.type === 'college' ? '/college/catalog' : '/university/catalog'
      this.catalog = (await api.get(url)).data
      this.specs = (await api.get('/institution/specialties')).data
    } catch (e) {
      this.error = 'Ошибка загрузки данных'
    } finally {
      this.loading = false;
    }
  },
  computed: {
    currentQuals() {
      const g = this.catalog.find(g => g.id === this.selectedGlobalId)
      return g ? g.qualifications : []
    },
    currentSpecs() {
      const q = this.currentQuals.find(q => q.id === this.selectedQualId)
      return q ? q.specializations : []
    },
    grouped() {
      const map = {}
      for (const row of this.specs) {
        const specId = row.university_specialization_id || row.college_specialization_id
        const { g, q, s } = this.findHierarchy(specId)
        if (!map[g.name]) map[g.name] = {}
        if (!map[g.name][q.qualification_name]) map[g.name][q.qualification_name] = []
        map[g.name][q.qualification_name].push({ row, specName: s.name })
      }
      return map
    }
  },
  methods: {
    async attachSpec() {
      try {
        await api.post('/institution/specialties', {
          specialization_id: this.selectedSpecId,
          cost: this.newCost,
          duration: this.newDuration
        })
        this.specs = (await api.get('/institution/specialties')).data
        this.selectedGlobalId = ''
        this.selectedQualId = ''
        this.selectedSpecId = ''
        this.newCost = ''
        this.newDuration = ''
      } catch (e) {
        this.error = 'Ошибка добавления специальности'
      }
    },
    findHierarchy(specId) {
      for (const g of this.catalog) {
        for (const q of g.qualifications) {
          for (const s of q.specializations) {
            if (s.id === specId) {
              return { g, q, s }
            }
          }
        }
      }
      return { g: { name: '–' }, q: { qualification_name: '–' }, s: { name: '–' } }
    },
    toggleEdit(row) {
      if (this.editingId === row.id) {
        this.updateSpec(row)
        this.editingId = null
      } else {
        this.editingId = row.id
      }
    },
    async saveEdit(row){
      try{
        await api.put(`/institution/specialties/${row.id}`,{cost:row.cost,duration:row.duration});
        this.editingId=null;
      }catch(e){this.error='Ошибка сохранения'}
    },
    async detachSpec(id){
      if(!confirm('Удалить специальность?')) return;
      try{
        await api.delete(`/institution/specialties/${id}`);
        this.specs=this.specs.filter(r=>r.id!==id);
      }catch(e){this.error='Ошибка удаления'}
    }
  }
}
</script>

<style scoped>
.specialties-container {
  max-width: 900px;
  margin: 40px auto;
  font-family: inherit;
}
.add-section {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.add-section select, .add-section button {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
}
.add-section button {
  background: #4CAF50;
  color: #fff;
  cursor: pointer;
}
.add-section button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
h2, h3 {
  margin: 10px 0;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  padding: 8px;
  border-bottom: 1px solid #ddd;
}
.error {
  color: red;
}
.icon-btn{background:transparent;border:none;cursor:pointer;font-size:18px;margin-left:6px;}
.btn-danger{color:#ff4d4f}

.global-title{
  background:#008FFF;
  color:#fff;
  padding:6px 10px;
  border-radius:6px;
}

.qual-block{margin-left:20px;margin-top:8px;padding-left:10px;border-left:3px solid #008FFF;}

.qual-title{color:#005f9e;margin:4px 0;}

.spec-list{margin-left:20px;
}

.cost-block{display:flex;gap:10px;margin-top:10px}

/* Loader styles */
.loader-container{display:flex;justify-content:center;align-items:center;position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(255,255,255,0.8);z-index:1000;}
.spinner{width:50px;height:50px;border:5px solid #f3f3f3;border-top:5px solid #577C8E;border-radius:50%;animation:spin 1s linear infinite;}
@keyframes spin{0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}
</style>