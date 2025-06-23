// notification store using reactive state
import { reactive } from 'vue';

const state = reactive({
  list: [], // all notifications fetched
  toasts: [] // recently added to show as toast
});

function addNotifications(notifs){
  notifs.forEach(n=>{
    if(!state.list.find(e=>e.id===n.id)){
      state.list.push(n);
    } else {
      Object.assign(state.list.find(e=>e.id===n.id), n);
    }
    if(!n.read_at){
      // показываем только непрочитанные
      if(!state.toasts.find(t=>t.id===n.id)){
        state.toasts.push({...n,visible:true});
      }
    }
  });
}

function markToastHidden(id){
  const t = state.toasts.find(n=>n.id===id);
  if(t) t.visible=false;
}

async function markRead(id){
  // оптимистично скрываем
  markToastHidden(id);
  const n = state.list.find(e=>e.id===id);
  if(n) n.read_at = new Date().toISOString();
  try{
    const token = localStorage.getItem('token');
    await fetch(`http://localhost:8000/api/notifications/${id}/read`,{
      method:'POST',headers:{'Authorization':`Bearer ${token}`}
    });
  }catch(e){/* ignore */}
}

export const notificationsStore = {
  state,
  addNotifications,
  markToastHidden,
  markRead,
}; 