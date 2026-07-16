<template>
  <div class="test-landing">

    <!-- ===== Hero ===== -->
    <header class="page-hero">
      <div class="hero-glow hero-glow-blue"></div>
      <div class="hero-glow hero-glow-gold"></div>

      <div class="hero-inner">
        <div class="hero-text">
          <h1>
            Кем ты станешь?
            <span class="hero-accent">Узнай за 15 минут</span>
          </h1>
          <p class="hero-sub">
            Профориентационный тест Torap: отвечаешь на простые вопросы —
            нейросеть разбирает твои интересы и сильные стороны и подбирает
            специальности из реальной базы вузов и колледжей Казахстана.
          </p>
          <div class="hero-actions">
            <button class="btn-start" @click="$router.push('/Test/Info')">
              Пройти тест
              <i class="bi bi-arrow-right"></i>
            </button>
            <button class="btn-how" @click="scrollToHow">
              Как это работает
            </button>
          </div>
          <div class="hero-facts">
            <div class="hero-fact">
              <span class="hero-fact-value">80</span>
              <span class="hero-fact-label">вопросов</span>
            </div>
            <span class="hero-fact-divider"></span>
            <div class="hero-fact">
              <span class="hero-fact-value">4</span>
              <span class="hero-fact-label">этапа</span>
            </div>
            <span class="hero-fact-divider"></span>
            <div class="hero-fact">
              <span class="hero-fact-value">900+</span>
              <span class="hero-fact-label">специальностей в базе</span>
            </div>
          </div>
        </div>

        <!-- Анимированный «чат с ИИ» -->
        <div class="hero-visual">
          <div class="ai-chat">
            <div class="ai-chat-head">
              <span class="ai-avatar"><i class="bi bi-stars"></i></span>
              <div class="ai-chat-title">
                <strong>Torap AI</strong>
                <span>анализ ответов</span>
              </div>
              <span class="ai-online"></span>
            </div>

            <div class="ai-chat-body">
              <div class="msg msg-user">
                Мне нравятся математика и информатика, в свободное время
                программирую и собираю компьютеры
              </div>

              <div class="msg msg-typing">
                <span></span><span></span><span></span>
              </div>

              <div class="msg msg-ai">
                Вижу инженерное мышление и интерес к технологиям.
                Вам подойдут направления:
              </div>

              <div class="msg-chips">
                <span class="ai-chip">Программная инженерия</span>
                <span class="ai-chip">Информационные системы</span>
                <span class="ai-chip">Робототехника</span>
              </div>
            </div>
          </div>

          <!-- плавающие чипы вокруг чата -->
          <span class="float-chip fc-1"><i class="bi bi-heart-pulse-fill"></i> Медицина</span>
          <span class="float-chip fc-2"><i class="bi bi-cpu-fill"></i> IT</span>
          <span class="float-chip fc-3"><i class="bi bi-palette-fill"></i> Дизайн</span>
          <span class="float-chip fc-4"><i class="bi bi-briefcase-fill"></i> Бизнес</span>
        </div>
      </div>
    </header>

    <!-- ===== Как это работает ===== -->
    <section id="how-it-works" class="section fade-in">
      <div class="section-head">
        <span class="section-eyebrow">Процесс</span>
        <h2>Как это работает</h2>
        <p>Никаких правильных ответов — только твои интересы</p>
      </div>

      <div class="steps-grid">
        <div class="how-step">
          <div class="how-step-num">1</div>
          <div class="how-step-icon"><i class="bi bi-ui-checks"></i></div>
          <h3>Отвечаешь на вопросы</h3>
          <p>4 коротких этапа: личность, предпочтения в работе, интересы и профильные направления.</p>
        </div>
        <div class="how-step">
          <div class="how-step-num">2</div>
          <div class="how-step-icon ai-pulse"><i class="bi bi-stars"></i></div>
          <h3>ИИ анализирует ответы</h3>
          <p>Нейросеть Torap AI разбирает каждый ответ: интересы, склонности, сильные стороны — и объясняет свои выводы.</p>
        </div>
        <div class="how-step">
          <div class="how-step-num">3</div>
          <div class="how-step-icon"><i class="bi bi-mortarboard-fill"></i></div>
          <h3>Получаешь результат</h3>
          <p>Личный разбор + подборка специальностей из нашей базы, с переходом к вузам и колледжам, где им учат.</p>
        </div>
      </div>
    </section>

    <!-- ===== Что ты получишь ===== -->
    <section class="section section-tint fade-in">
      <div class="section-head">
        <span class="section-eyebrow">Результат</span>
        <h2>Что ты получишь</h2>
        <p>Не «ты — соционик-логик», а конкретный план действий</p>
      </div>

      <div class="gains-grid">
        <div class="gain-card">
          <div class="gain-icon"><i class="bi bi-person-check-fill"></i></div>
          <h3>Личный разбор</h3>
          <p>ИИ объяснит, какие интересы и качества видны в твоих ответах и почему делает такие выводы.</p>
        </div>
        <div class="gain-card">
          <div class="gain-icon"><i class="bi bi-list-stars"></i></div>
          <h3>Подборка специальностей</h3>
          <p>Рекомендации из реальной базы Torap — каждую можно открыть и изучить подробнее.</p>
        </div>
        <div class="gain-card">
          <div class="gain-icon"><i class="bi bi-buildings-fill"></i></div>
          <h3>Где этому учат</h3>
          <p>От специальности — сразу к вузам и колледжам Казахстана: стоимость, гранты, отзывы.</p>
        </div>
        <div class="gain-card">
          <div class="gain-icon"><i class="bi bi-clock-history"></i></div>
          <h3>История в кабинете</h3>
          <p>Результаты сохраняются в личном кабинете — можно вернуться и перечитать в любой момент.</p>
        </div>
      </div>
    </section>

    <!-- ===== Финальный CTA ===== -->
    <section class="cta-band fade-in">
      <div class="cta-glow"></div>
      <div class="cta-inner">
        <h2>Готов узнать, кем стать?</h2>
        <p>Бесплатно, без регистрации на сторонних сайтах — результат через несколько минут после теста.</p>
        <button class="btn-start btn-start-lg" @click="$router.push('/Test/Info')">
          Начать тест
          <i class="bi bi-arrow-right"></i>
        </button>
      </div>
    </section>

  </div>
</template>

<script>
export default {
  name: 'TestPage',
  mounted() {
    this.initObserver();
  },
  beforeUnmount() {
    if (this.observer) this.observer.disconnect();
    if (this._fadeFallback) clearTimeout(this._fadeFallback);
  },
  methods: {
    scrollToHow() {
      document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
    },
    initObserver() {
      const els = this.$el?.querySelectorAll?.('.fade-in');
      if (!els?.length) return;

      const revealAll = () => els.forEach((el) => el.classList.add('visible'));

      if (typeof IntersectionObserver === 'undefined') {
        revealAll();
        return;
      }

      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              this.observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
      );
      els.forEach((el) => this.observer.observe(el));

      this._fadeFallback = setTimeout(revealAll, 1200);
    },
  },
};
</script>

<style scoped>
.test-landing {
  --blue: var(--torap-blue, #1795c0);
  --blue-dark: var(--torap-blue-dark, #12799c);
  --gold: var(--torap-gold, #b08d4f);
  --gold-bright: var(--torap-gold-bright, #d4af37);
  --navy: #0b1f2a;
  --text: #10222e;
  --muted: #64748b;
  --border: #e6edf2;
  min-height: 100vh;
  background: #f4f7f9;
  color: var(--text);
}

/* ===== Hero ===== */
.page-hero {
  position: relative;
  overflow: hidden;
  background: #0b1f2a;
  color: #fff;
  padding: 118px 24px 64px;
}

/* Волнистые линии в фирменных цветах */
.page-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400' fill='none'%3E%3Cpath d='M0 60 Q150 10 300 60 T600 60' stroke='%231795c0' stroke-opacity='0.22' stroke-width='1.3'/%3E%3Cpath d='M0 120 Q150 66 300 120 T600 120' stroke='%231795c0' stroke-opacity='0.14' stroke-width='1.3'/%3E%3Cpath d='M0 180 Q150 122 300 180 T600 180' stroke='%23d4af37' stroke-opacity='0.16' stroke-width='1.3'/%3E%3Cpath d='M0 240 Q150 182 300 240 T600 240' stroke='%231795c0' stroke-opacity='0.11' stroke-width='1.3'/%3E%3Cpath d='M0 300 Q150 244 300 300 T600 300' stroke='%231795c0' stroke-opacity='0.17' stroke-width='1.3'/%3E%3Cpath d='M0 360 Q150 304 300 360 T600 360' stroke='%23d4af37' stroke-opacity='0.10' stroke-width='1.3'/%3E%3C/svg%3E") repeat;
  background-size: 600px 400px;
  -webkit-mask-image: linear-gradient(115deg, #000 30%, transparent 78%);
  mask-image: linear-gradient(115deg, #000 30%, transparent 78%);
  pointer-events: none;
}

.hero-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  pointer-events: none;
}

.hero-glow-blue {
  width: 560px;
  height: 560px;
  right: -140px;
  top: -300px;
  background: rgba(23, 149, 192, 0.42);
}

.hero-glow-gold {
  width: 460px;
  height: 460px;
  left: 30%;
  bottom: -340px;
  background: rgba(176, 141, 79, 0.22);
}

.hero-inner {
  position: relative;
  max-width: 1240px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  gap: 48px;
  align-items: center;
}

.hero-text {
  animation: heroIn 0.7s ease-out both;
}

@keyframes heroIn {
  from {
    opacity: 0;
    transform: translateY(26px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-text h1 {
  font-size: clamp(2rem, 4.6vw, 3.1rem);
  font-weight: 800;
  line-height: 1.14;
  color: #fff;
  margin: 0 0 16px;
}

.hero-accent {
  display: block;
  position: relative;
  color: var(--gold-bright);
  width: fit-content;
}

.hero-accent::after {
  content: '';
  position: absolute;
  left: 2%;
  right: 2%;
  bottom: -0.14em;
  height: 0.22em;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 10' preserveAspectRatio='none'%3E%3Cpath d='M2 8 Q 60 -2 118 6' fill='none' stroke='%23b08d4f' stroke-width='3' stroke-linecap='round' opacity='0.75'/%3E%3C/svg%3E") no-repeat center / 100% 100%;
}

.hero-sub {
  color: rgba(255, 255, 255, 0.72);
  font-size: 1.08rem;
  line-height: 1.6;
  max-width: 540px;
  margin: 0 0 26px;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 34px;
}

.btn-start {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, var(--blue), var(--blue-dark));
  color: #fff;
  border: none;
  border-radius: 14px;
  padding: 15px 32px;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 10px 26px rgba(23, 149, 192, 0.38);
  transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
}

.btn-start i {
  transition: transform 0.2s ease;
}

.btn-start:hover {
  filter: brightness(1.08);
  transform: translateY(-2px);
  box-shadow: 0 14px 34px rgba(23, 149, 192, 0.5);
}

.btn-start:hover i {
  transform: translateX(4px);
}

.btn-how {
  background: transparent;
  color: #fff;
  border: 2px solid rgba(255, 255, 255, 0.45);
  border-radius: 14px;
  padding: 13px 28px;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

.btn-how:hover {
  border-color: var(--gold-bright);
  color: var(--gold-bright);
  transform: translateY(-2px);
}

.hero-facts {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 22px;
}

.hero-fact {
  display: flex;
  flex-direction: column;
}

.hero-fact-value {
  font-family: var(--torap-font-display, inherit);
  font-size: 1.7rem;
  font-weight: 800;
  line-height: 1.1;
  color: var(--gold-bright);
  font-variant-numeric: tabular-nums;
}

.hero-fact-label {
  margin-top: 3px;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
}

.hero-fact-divider {
  width: 1px;
  height: 36px;
  background: rgba(255, 255, 255, 0.16);
}

/* ===== Чат с ИИ ===== */
.hero-visual {
  position: relative;
  animation: heroIn 0.7s ease-out 0.15s both;
}

.ai-chat {
  position: relative;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 22px;
  backdrop-filter: blur(12px);
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.35);
  overflow: hidden;
}

.ai-chat-head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.ai-avatar {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--gold-bright), var(--gold));
  color: #0b1f2a;
  font-size: 1.2rem;
  box-shadow: 0 6px 16px rgba(212, 175, 55, 0.4);
}

.ai-chat-title {
  display: flex;
  flex-direction: column;
  line-height: 1.25;
}

.ai-chat-title strong {
  color: #fff;
  font-size: 0.98rem;
}

.ai-chat-title span {
  color: rgba(255, 255, 255, 0.55);
  font-size: 0.78rem;
}

.ai-online {
  margin-left: auto;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #34d399;
  box-shadow: 0 0 10px 2px rgba(52, 211, 153, 0.6);
  animation: onlinePulse 2s ease-in-out infinite;
}

@keyframes onlinePulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.45; }
}

.ai-chat-body {
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 250px;
}

.msg {
  max-width: 85%;
  padding: 11px 14px;
  border-radius: 14px;
  font-size: 0.92rem;
  line-height: 1.45;
}

/* Цикл сценария чата: 12s */
.msg-user {
  align-self: flex-end;
  background: linear-gradient(135deg, var(--blue), var(--blue-dark));
  color: #fff;
  border-bottom-right-radius: 4px;
  animation: chatUser 12s ease-in-out infinite;
}

.msg-typing {
  align-self: flex-start;
  display: flex;
  gap: 5px;
  background: rgba(255, 255, 255, 0.1);
  border-bottom-left-radius: 4px;
  padding: 14px 16px;
  animation: chatTyping 12s ease-in-out infinite;
}

.msg-typing span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.75);
  animation: typingDot 1s ease-in-out infinite;
}

.msg-typing span:nth-child(2) { animation-delay: 0.16s; }
.msg-typing span:nth-child(3) { animation-delay: 0.32s; }

@keyframes typingDot {
  0%, 100% { transform: translateY(0); opacity: 0.5; }
  50% { transform: translateY(-4px); opacity: 1; }
}

.msg-ai {
  align-self: flex-start;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border-bottom-left-radius: 4px;
  animation: chatAi 12s ease-in-out infinite;
}

.msg-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  animation: chatChips 12s ease-in-out infinite;
}

.ai-chip {
  padding: 7px 13px;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 600;
  color: #0b1f2a;
  background: linear-gradient(135deg, var(--gold-bright), var(--gold));
  box-shadow: 0 5px 14px rgba(212, 175, 55, 0.35);
}

/* Тайминги сценария (12s цикл):
   0-6%   — появляется вопрос пользователя
   8-30%  — ИИ «печатает»
   32-38% — появляется ответ ИИ
   44-50% — появляются чипы
   92-100% — всё плавно гаснет и цикл начинается заново */
@keyframes chatUser {
  0% { opacity: 0; transform: translateY(10px); }
  6%, 90% { opacity: 1; transform: translateY(0); }
  97%, 100% { opacity: 0; transform: translateY(-6px); }
}

@keyframes chatTyping {
  0%, 8% { opacity: 0; transform: translateY(8px); }
  12%, 28% { opacity: 1; transform: translateY(0); }
  32%, 100% { opacity: 0; transform: translateY(-6px); }
}

@keyframes chatAi {
  0%, 32% { opacity: 0; transform: translateY(10px); }
  38%, 90% { opacity: 1; transform: translateY(0); }
  97%, 100% { opacity: 0; transform: translateY(-6px); }
}

@keyframes chatChips {
  0%, 44% { opacity: 0; transform: translateY(10px); }
  50%, 90% { opacity: 1; transform: translateY(0); }
  97%, 100% { opacity: 0; transform: translateY(-6px); }
}

/* Плавающие чипы вокруг чата */
.float-chip {
  position: absolute;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 15px;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #fff;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.16);
  backdrop-filter: blur(8px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.25);
  animation: floatY 5s ease-in-out infinite;
}

.float-chip i {
  color: var(--gold-bright);
  font-size: 0.95rem;
}

.fc-1 { top: -18px; left: -26px; animation-delay: 0s; }
.fc-2 { top: 30%; right: -34px; animation-delay: 1.2s; }
.fc-3 { bottom: -30px; left: 6%; animation-delay: 2.1s; }
.fc-4 { bottom: 52%; left: -52px; animation-delay: 3s; }

@keyframes floatY {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* ===== Секции ===== */
.section {
  max-width: 1240px;
  margin: 0 auto;
  padding: clamp(48px, 7vw, 84px) 24px;
}

.section-tint {
  max-width: none;
  background: #fff;
}

.section-tint > * {
  max-width: 1240px;
  margin-left: auto;
  margin-right: auto;
}

.section-head {
  text-align: center;
  max-width: 620px;
  margin: 0 auto clamp(30px, 5vw, 52px);
}

.section-eyebrow {
  display: inline-block;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 10px;
}

.section-eyebrow::after {
  content: '';
  display: block;
  width: 36px;
  height: 2px;
  border-radius: 2px;
  background: linear-gradient(90deg, var(--gold), transparent);
  margin: 6px auto 0;
}

.section-head h2 {
  font-size: clamp(1.6rem, 3.6vw, 2.2rem);
  font-weight: 800;
  color: var(--text);
  margin: 0 0 10px;
}

.section-head p {
  color: var(--muted);
  font-size: 1.02rem;
  margin: 0;
}

/* ===== Шаги ===== */
.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}

.how-step {
  position: relative;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 30px 24px 26px;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.how-step:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 36px rgba(16, 34, 46, 0.1);
  border-color: rgba(23, 149, 192, 0.4);
}

.how-step-num {
  position: absolute;
  top: 18px;
  right: 20px;
  font-family: var(--torap-font-display, inherit);
  font-size: 2.6rem;
  font-weight: 800;
  line-height: 1;
  color: rgba(176, 141, 79, 0.18);
}

.how-step-icon {
  width: 54px;
  height: 54px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.45rem;
  color: var(--blue);
  background: linear-gradient(135deg, rgba(23, 149, 192, 0.14), rgba(23, 149, 192, 0.05));
  box-shadow: inset 0 0 0 1px rgba(23, 149, 192, 0.12);
  margin-bottom: 16px;
}

.how-step-icon.ai-pulse {
  color: #0b1f2a;
  background: linear-gradient(135deg, var(--gold-bright), var(--gold));
  box-shadow: 0 8px 20px rgba(212, 175, 55, 0.35);
  animation: aiPulse 2.4s ease-in-out infinite;
}

@keyframes aiPulse {
  0%, 100% { box-shadow: 0 8px 20px rgba(212, 175, 55, 0.35); }
  50% { box-shadow: 0 8px 30px rgba(212, 175, 55, 0.65); }
}

.how-step h3 {
  font-size: 1.12rem;
  font-weight: 700;
  color: var(--text);
  margin: 0 0 8px;
}

.how-step p {
  color: var(--muted);
  font-size: 0.94rem;
  line-height: 1.55;
  margin: 0;
}

/* ===== Что получишь ===== */
.gains-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}

.gain-card {
  position: relative;
  background: #f7fafc;
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 28px 24px;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.gain-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--blue), var(--gold));
  opacity: 0;
  transition: opacity 0.25s ease;
}

.gain-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 36px rgba(16, 34, 46, 0.1);
  border-color: rgba(23, 149, 192, 0.4);
}

.gain-card:hover::before {
  opacity: 1;
}

.gain-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  color: var(--blue);
  background: linear-gradient(135deg, rgba(23, 149, 192, 0.14), rgba(23, 149, 192, 0.05));
  box-shadow: inset 0 0 0 1px rgba(23, 149, 192, 0.12);
  margin-bottom: 16px;
  transition: background 0.25s ease, color 0.25s ease, transform 0.25s ease;
}

.gain-card:hover .gain-icon {
  background: linear-gradient(135deg, var(--blue), var(--blue-dark));
  color: #fff;
  transform: scale(1.06);
}

.gain-card h3 {
  font-size: 1.08rem;
  font-weight: 700;
  color: var(--text);
  margin: 0 0 8px;
}

.gain-card p {
  color: var(--muted);
  font-size: 0.93rem;
  line-height: 1.55;
  margin: 0;
}

/* ===== CTA ===== */
.cta-band {
  position: relative;
  overflow: hidden;
  background: #0b1f2a;
  padding: clamp(56px, 8vw, 92px) 24px;
  text-align: center;
}

.cta-glow {
  position: absolute;
  width: 640px;
  height: 640px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: radial-gradient(circle, rgba(23, 149, 192, 0.35), transparent 65%);
  filter: blur(60px);
  pointer-events: none;
  animation: ctaGlow 5s ease-in-out infinite;
}

@keyframes ctaGlow {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}

.cta-inner {
  position: relative;
  max-width: 620px;
  margin: 0 auto;
}

.cta-band h2 {
  color: #fff;
  font-size: clamp(1.7rem, 4vw, 2.4rem);
  font-weight: 800;
  margin: 0 0 12px;
}

.cta-band p {
  color: rgba(255, 255, 255, 0.68);
  font-size: 1.02rem;
  margin: 0 0 28px;
}

.btn-start-lg {
  padding: 17px 42px;
  font-size: 1.12rem;
}

/* ===== Появление секций ===== */
.fade-in {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .msg-user, .msg-typing, .msg-ai, .msg-chips,
  .float-chip, .ai-online, .how-step-icon.ai-pulse, .cta-glow,
  .hero-text, .hero-visual {
    animation: none;
  }
  .msg, .msg-chips {
    opacity: 1;
  }
  .fade-in {
    transition-duration: 0.01ms;
  }
}

/* ===== Планшеты ===== */
@media (max-width: 991px) {
  .hero-inner {
    grid-template-columns: 1fr;
    gap: 56px;
  }

  .hero-visual {
    max-width: 480px;
    margin: 0 auto;
    width: 100%;
  }

  .fc-1 { left: -8px; }
  .fc-2 { right: -10px; }
  .fc-4 { left: -12px; }
}

/* ===== Телефоны ===== */
@media (max-width: 575px) {
  .page-hero {
    padding: 96px 16px 48px;
  }

  .hero-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .btn-start,
  .btn-how {
    width: 100%;
    justify-content: center;
    text-align: center;
  }

  .section {
    padding-left: 16px;
    padding-right: 16px;
  }

  .float-chip {
    display: none;
  }
}
</style>
