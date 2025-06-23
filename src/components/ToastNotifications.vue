<template>
  <teleport to="body">
    <div class="toast-wrapper">
      <transition-group name="toast-fade" tag="div">
        <div
          v-for="t in visibleToasts"
          :key="t.id"
          class="toast-item"
        >
          <button class="close-btn" @click="close(t.id)">×</button>
          <p class="toast-msg">{{ t.message }}</p>
          <button class="toast-link" @click="goto(t)">Открыть</button>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<script>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { notificationsStore } from '@/store/notificationsStore';

export default {
  name: 'ToastNotifications',
  setup() {
    const router = useRouter();
    const visibleToasts = computed(() => notificationsStore.state.toasts.filter(t => t.visible));

    const close = (id) => {
      notificationsStore.markRead(id);
    };
    const goto = (notif) => {
      notificationsStore.markRead(notif.id);
      const msg = notif.message || '';
      const isEventCreated = msg.includes('опубликовал новое мероприятие');
      const isAppAccepted  = msg.includes('Ваша заявка');

      if(isEventCreated && notif.event_id){
        router.push({ path: '/Events', query: { eventId: notif.event_id, openModal: 1 } });
      } else if(isAppAccepted){
        const ticketMatch = msg.match(/[0-9a-fA-F-]{36}/);
        router.push({ path: '/User', query: { tab: 'planned', highlight: ticketMatch ? ticketMatch[0] : '' } });
      } else {
        router.push('/User');
      }
    };

    return { visibleToasts, close, goto };
  }
};
</script>

<style scoped>
.toast-wrapper{
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.toast-item{
  background: #536274;
  color: #fff;
  padding: 12px 16px 12px 16px;
  border-radius: 8px;
  min-width: 260px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  position: relative;
}
.toast-msg{margin:0 0 8px 0;}
.close-btn{
  position:absolute;top:4px;right:6px;background:none;border:none;color:#fff;font-size:16px;cursor:pointer;}
.toast-link{background:#FF9800;border:none;padding:4px 10px;border-radius:6px;color:#fff;cursor:pointer;font-size:0.8rem;}
.toast-fade-enter-active,.toast-fade-leave-active{transition:opacity .3s,transform .3s;}
.toast-fade-enter-from,.toast-fade-leave-to{opacity:0;transform:translateY(-10px);}
</style> 