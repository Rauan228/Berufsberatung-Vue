<template>
  <div class="inst-data-container">
    <h1>Профиль учреждения</h1>

    <div v-if="loading" class="loader">Загрузка...</div>
    <div v-else>
      <form @submit.prevent="saveProfile" class="profile-form">
        <h3 class="section-title">Основная информация</h3>
        <div class="form-row">
          <label>Название</label>
          <input v-model="form.name" type="text" required />
        </div>

        <div class="form-row">
          <label>Локация (город)</label>
          <input v-model="form.location" type="text" />
        </div>

        <div class="form-row">
          <label>Адрес</label>
          <input v-model="form.address" type="text" />
        </div>

        <div class="form-row">
          <label>Телефон</label>
          <input v-model="form.phone" type="text" />
        </div>

        <div class="form-row">
          <label>Сайт</label>
          <input v-model="form.website" type="text" />
        </div>

        <div class="form-row">
          <label>Есть общежитие</label>
          <input v-model="form.dormitory" type="checkbox" />
        </div>

        <div class="form-row">
          <label>Есть гранты</label>
          <input v-model="form.grants" type="checkbox" />
        </div>

        <h3 class="section-title">Контактная информация</h3>
        <div class="form-row">
          <label>Email</label>
          <input v-model="form.email" type="email" />
        </div>

        <div class="form-row">
          <label>Координаты (lat, lng)</label>
          <input v-model="form.latitude" type="text" style="max-width:140px" placeholder="lat" />
          <input v-model="form.longitude" type="text" style="max-width:140px" placeholder="lng" />
        </div>

        <div class="form-row column">
          <label>Направления</label>
          <select v-model="form.directions" multiple>
            <option v-for="dir in directionsOptions" :key="dir" :value="dir">{{ dir }}</option>
          </select>
        </div>

        <div class="form-row column">
          <label>Описание 1</label>
          <textarea v-model="form.description1" rows="3"></textarea>
        </div>
        <div class="form-row column">
          <label>Описание 2</label>
          <textarea v-model="form.description2" rows="3"></textarea>
        </div>
        <div class="form-row column">
          <label>Описание 3</label>
          <textarea v-model="form.description3" rows="3"></textarea>
        </div>

        <h3 class="section-title">Изображения</h3>
        <!-- Logo -->
        <div class="form-row column">
          <label>Логотип</label>
          <div v-if="form.logo_url" class="img-preview">
            <img :src="form.logo_url" alt="logo" @click="openPreview(form.logo_url)" class="clickable" />
            <button @click.prevent="removeLogo">Удалить</button>
          </div>
          <input type="file" accept="image/*" @change="onLogoChange" />
        </div>

        <!-- Photo -->
        <div class="form-row column">
          <label>Фото</label>
          <div v-if="form.photo_url" class="img-preview">
            <img :src="form.photo_url" alt="photo" @click="openPreview(form.photo_url)" class="clickable" />
            <button @click.prevent="removePhoto">Удалить</button>
          </div>
          <input type="file" accept="image/*" @change="onPhotoChange" />
        </div>

        <button class="btn-primary" type="submit">Сохранить</button>
        <span v-if="success" class="success">✔ Сохранено</span>
        <span v-if="error" class="error">❌ {{ error }}</span>
      </form>
    </div>

    <!-- Fullscreen preview overlay -->
    <div v-if="showPreview" class="overlay" @click="closePreview">
      <img :src="previewImage" class="overlay-img" />
    </div>
  </div>
</template>

<script>
import api from '@/services/api'
export default {
  data() {
    return {
      loading: true,
      form: {
        name: '',
        location: '',
        address: '',
        latitude: '',
        longitude: '',
        email: '',
        phone: '',
        website: '',
        directions: [],
        description1: '',
        description2: '',
        description3: '',
        dormitory: false,
        grants: false,
        logo_url: null,
        photo_url: null
      },
      success: false,
      error: '',
      logoFile: null,
      photoFile: null,
      removeLogoFlag: false,
      removePhotoFlag: false,
      showPreview: false,
      previewImage: null,
      directionsOptions: ['Техническое', 'Гуманитарное', 'Медицина', 'IT', 'Юриспруденция']
    }
  },
  mounted() {
    this.fetchProfile()
  },
  methods: {
    async fetchProfile() {
      try {
        const { data } = await api.get('/institution/profile')
        // Только атрибуты, пригодные для нашей формы
        const fields = ['name','location','address','latitude','longitude','email','phone','website','directions','description1','description2','description3','dormitory','grants','logo_url','photo_url']
        for (const key of fields) {
          if (key in data) {
            let val = data[key]
            if(['dormitory','grants'].includes(key)){
              // приводим 0/1/"0"/"1" к boolean
              val = !!Number(val)
            }
            if(key==='directions'){
              val = val ? val.split(',').map(s=>s.trim()).filter(Boolean) : []
            }
            this.form[key] = val
          }
        }
      } catch (e) {
        this.error = e.response?.data?.error || 'Ошибка загрузки'
      } finally {
        this.loading = false
      }
    },
    async saveProfile() {
      this.success = false
      this.error = ''
      try {
        const formData = new FormData()

        // Примитивные поля
        const primFields = ['name','location','address','latitude','longitude','email','phone','website','directions','description1','description2','description3','dormitory','grants']
        primFields.forEach(key=>{
          const val=this.form[key]
          if(val!==undefined && val!==null && !(typeof val==='string' && val.trim()==='')){
            let v=val
            if(typeof v==='boolean') v = v ? 1 : 0
            if(key==='directions' && Array.isArray(v)){
              v = v.join(',')
            }
            formData.append(key,v)
          }
        })

        // Файлы и флаги удаления
        if(this.logoFile){
          formData.append('logo',this.logoFile)
        }
        if(this.photoFile){
          formData.append('photo',this.photoFile)
        }
        if(this.removeLogoFlag){
          formData.append('remove_logo',1)
        }
        if(this.removePhotoFlag){
          formData.append('remove_photo',1)
        }

        await api.post('/institution/profile?_method=PUT',formData,{headers:{'Content-Type':'multipart/form-data'}})

        // при успехе обновляем данные в компоненте
        if(this.logoFile){ this.logoFile=null }
        if(this.photoFile){ this.photoFile=null }
        this.removeLogoFlag=this.removePhotoFlag=false
        this.fetchProfile()
      } catch (e) {
        if (e.response?.data?.errors) {
          // Собираем сообщения валидации в одну строку
          const errs = Object.values(e.response.data.errors).flat().join('\n')
          this.error = errs
        } else {
          this.error = e.response?.data?.error || 'Ошибка сохранения'
        }
      }
    },
    onLogoChange(e){
      this.logoFile=e.target.files[0]
    },
    onPhotoChange(e){
      this.photoFile=e.target.files[0]
    },
    removeLogo(){
      this.form.logo_url=null
      this.removeLogoFlag=true
    },
    removePhoto(){
      this.form.photo_url=null
      this.removePhotoFlag=true
    },
    openPreview(src){
      this.previewImage=src
      this.showPreview=true
    },
    closePreview(){
      this.showPreview=false
      this.previewImage=null
    }
  }
}
</script>

<style scoped>
.inst-data-container {
  max-width: 700px;
  margin: 40px auto;
  background: #fff;
  padding: 20px 30px;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  font-family: inherit;
}
.profile-form .form-row {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  gap: 10px;
}
.form-row.column {
  flex-direction: column;
  align-items: flex-start;
}
label { min-width: 160px; font-weight: 600; }
input[type="text"], textarea {
  flex: 1;
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
}
input[type="checkbox"] { width: 20px; height: 20px; }
select[multiple] { min-height: 80px; }
.btn-primary {
  background: #008FFF;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
}
.success { color: green; margin-left: 10px; }
.error { color: red; margin-left: 10px; }
.loader { text-align: center; }

.img-preview {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.img-preview img {
  max-height: 80px;
  border-radius: 6px;
  cursor: pointer;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.overlay-img {
  max-width: 90vw;
  max-height: 90vh;
  border-radius: 8px;
}

.clickable {
  cursor: pointer;
}

.section-title {
  margin: 30px 0 15px;
  font-size: 1.25rem;
  font-weight: 700;
  color: #008FFF;
  border-bottom: 2px solid #008FFF;
  padding-bottom: 4px;
}
</style>