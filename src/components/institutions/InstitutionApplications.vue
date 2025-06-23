<template>
    
    <div class="apps-container">
        <!-- Loader -->
        <div v-if="loading" class="loader-container">
            <div class="spinner"></div>
        </div>

        <h1>Заявки пользователей</h1>

        <div class="tab-buttons">
          <button :class="{active:tab==='individual'}" @click="tab='individual'">Индивидуальные</button>
          <button :class="{active:tab==='group'}" @click="tab='group'">Командные</button>
        </div>

        <!-- Индивидуальные заявки -->
        <table v-if="tab==='individual' && apps.length" class="apps-table">
            <thead><tr><th>Пользователь</th><th>Событие</th><th>Дата</th><th>Статус</th><th></th></tr></thead>
            <tbody>
                <tr v-for="a in apps" :key="a.id">
                    <td>{{ a.user?.name || a.user_id }}</td>
                    <td>{{ a.event?.event_name }}</td>
                    <td>{{ new Date(a.created_at).toLocaleDateString() }}</td>
                    <td>{{ a.status }}</td>
                    <td><button @click="viewPayload(a.payload)">Поля</button></td>
                    <td>
                        <button v-if="a.status==='Pending'" @click="setStatus(a,'Accepted')" class="btn-ok">✔</button>
                        <button v-if="a.status==='Pending'" @click="setStatus(a,'Rejected')" class="btn-danger">✕</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Командные заявки -->
        <table v-if="tab==='group' && groupApps.length" class="apps-table">
            <thead><tr><th>Команда</th><th>Участники</th><th>Дата</th><th>Статус</th><th></th></tr></thead>
            <tbody>
                <tr v-for="g in groupApps" :key="g.id">
                    <td>{{ g.team_name }}</td>
                    <td>
                       <ul>
                         <li v-for="m in g.members" :key="m.id">{{ m.user?.name || m.user_id }} ({{ m.role || 'участник' }})</li>
                       </ul>
                    </td>
                    <td>{{ new Date(g.created_at).toLocaleDateString() }}</td>
                    <td>{{ g.status }}</td>
                    <td><button @click="viewPayload(g.payload)">Поля</button></td>
                    <td>
                       <button v-if="g.status==='pending'" @click="setGroupStatus(g,'approved')" class="btn-ok">✔</button>
                       <button v-if="g.status==='pending'" @click="setGroupStatus(g,'rejected')" class="btn-danger">✕</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <p v-if="(tab==='individual' && !apps.length)||(tab==='group' && !groupApps.length)">Заявок нет.</p>

        <!-- Модальное окно просмотра данных заявки -->
        <div v-if="showPayloadModal" class="modal-overlay">
          <div class="modal-content payload-modal">
             <h3>Данные заявки</h3>
             <table v-if="Object.keys(payloadData).length" class="payload-table">
               <tr v-for="(val,key) in payloadData" :key="key"><th>{{ key }}</th><td>{{ val }}</td></tr>
             </table>
             <p v-else>Нет данных</p>
             <div class="modal-actions"><button @click="showPayloadModal=false">OK</button></div>
          </div>
        </div>

        <span v-if="error" class="error">{{ error }}</span>
    </div>
</template>

<script>
import api from '@/services/api'
export default {
    data(){return{apps:[],groupApps:[],tab:'individual',error:'',showPayloadModal:false,payloadData:{},loading:true}},
    async mounted(){await this.loadData();},
    methods:{
        async loadData(){
            this.loading = true;
            await Promise.all([this.fetchApps(), this.fetchGroup()]);
            this.loading = false;
        },
        async fetchApps(){try{const{data}=await api.get('/institution/applications');this.apps=data}catch(e){this.error='Ошибка загрузки'}},
        async fetchGroup(){try{const{data}=await api.get('/institution/group-applications');this.groupApps=data}catch(e){this.error='Ошибка загрузки'}},
        async setStatus(app,newStatus){try{await api.put(`/institution/applications/${app.id}`,{status:newStatus});app.status=newStatus}catch(e){this.error='Ошибка изменения статуса'}},
        async setGroupStatus(g,newStatus){try{await api.put(`/institution/group-applications/${g.id}`,{status:newStatus});g.status=newStatus}catch(e){this.error='Ошибка изменения статуса'}},
        viewPayload(payload){this.payloadData=payload||{};this.showPayloadModal=true;}
    }
}
</script>

<style scoped>
.apps-container{max-width:900px;margin:40px auto;font-family:inherit}
.apps-table{width:100%;border-collapse:collapse}
.apps-table th,.apps-table td{border:1px solid #ddd;padding:8px;text-align:left}
.btn-ok{background:#4CAF50;color:#fff;border:none;padding:4px 8px;border-radius:4px;cursor:pointer}
.btn-danger{background:#ff4d4f;color:#fff;border:none;padding:4px 8px;border-radius:4px;cursor:pointer}
.tab-buttons{margin-bottom:20px;display:flex;gap:10px;}
.tab-buttons button{padding:6px 14px;border:1px solid #008FFF;background:#fff;border-radius:6px;cursor:pointer}
.tab-buttons button.active{background:#008FFF;color:#fff}
.error{color:red}

.modal-overlay{position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:9999;}
.payload-modal{background:#fff;padding:20px;border-radius:8px;max-width:400px;width:90%;}
.payload-table{width:100%;border-collapse:collapse;margin-bottom:12px;}
.payload-table th,.payload-table td{border:1px solid #ddd;padding:6px;text-align:left;}
.modal-actions{display:flex;justify-content:flex-end;}
.modal-actions button{padding:6px 12px;border:none;background:#008FFF;color:#fff;border-radius:6px;cursor:pointer;}

/* Loader styles */
.loader-container{display:flex;justify-content:center;align-items:center;position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(255,255,255,0.8);z-index:1000;}
.spinner{width:50px;height:50px;border:5px solid #f3f3f3;border-top:5px solid #577C8E;border-radius:50%;animation:spin 1s linear infinite;}
@keyframes spin{0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}
</style>