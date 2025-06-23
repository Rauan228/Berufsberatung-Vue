<template>
  <div class="landing-page">
    <div class="left">
      <div class="left-content">
      <h1>Найди своё призвание</h1>
      <p>
        Пройди бесплатный профориентационный тест и узнай, какие профессии подходят именно тебе. <br>
        🔍 Учитываем твои интересы, склонности и сильные стороны. <br>
        ⏱️ Займёт всего 5–7 минут.

      </p>
      <button @click="$router.push('/Test/Info')"
      class="start-button">Подробнее</button>
      </div>
    </div>

    <div class="right">
      <img src="@/components/img/TestImg.png"
           alt="logo" class="logo" />
    </div>
  </div>
</template>

<script>

</script>

<style scoped>
.landing-page {
  display: flex;
  height: 100vh;
  margin: 0;
  font-family: 'Arial', sans-serif;
}

.left {
  flex: 1;
  background-color: #ffffff;
  color: #424242;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  text-align: left;
}

.left-content {
  display: flex;
  flex-direction: column;
  justify-content: left;
  align-items: left;
  text-align: left;
  width: 70%;
  animation: slideUp 1s ease-out;
}

.right {
  flex: 1;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
}

@keyframes slideUp {
  from {
    transform: translateY(100px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.logo {
  max-width: 700px;
  width: 100%;
  animation: slideUp 1s ease-out;
}

h1 {
  font-size: 5rem;
  margin-bottom: 20px;
  font-weight: bold;
}

p {
  font-size: 1.3rem;
  line-height: 1.5;
  max-width: 900px;
}

.start-button {
  margin-top: 30px;
  padding: 12px 24px;
  font-size: 16px;
  background-color: #536274;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.start-button:hover {
  background-color: #10222E;
}
</style>
