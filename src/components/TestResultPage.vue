<template>
  <div class="result-page">

    <!-- ===== Загрузка результата ===== -->
    <div v-if="loading" class="state-screen">
      <div class="spinner"></div>
      <p>Загружаем результат…</p>
    </div>

    <!-- ===== ИИ ещё анализирует ===== -->
    <div v-else-if="analyzing" class="state-screen ai-wait">
      <div class="ai-orb">
        <i class="bi bi-stars"></i>
      </div>
      <h1>Torap AI анализирует ваши ответы</h1>
      <p class="ai-wait-sub">
        Нейросеть внимательно разбирает каждый ответ и готовит персональный разбор.
        Обычно это занимает несколько минут — можно не закрывать страницу
        или вернуться позже: результат сохранится в личном кабинете.
      </p>
      <div class="ai-progress">
        <div class="ai-progress-bar"></div>
      </div>
      <p class="ai-wait-step">{{ waitSteps[waitStepIndex] }}</p>
    </div>

    <!-- ===== Анализ не удался ===== -->
    <div v-else-if="failed" class="state-screen">
      <div class="ai-orb ai-orb-muted">
        <i class="bi bi-cloud-slash"></i>
      </div>
      <h1>Не удалось получить анализ</h1>
      <p class="ai-wait-sub">
        Сервер ИИ сейчас перегружен. Ваши ответы сохранены — загляните в личный
        кабинет чуть позже или пройдите тест ещё раз.
      </p>
      <button class="btn-primary" @click="$router.push('/User')">В личный кабинет</button>
    </div>

    <!-- ===== Результат ===== -->
    <template v-else>
      <header class="result-hero">
        <span class="result-eyebrow">Результат теста</span>
        <h1>Ваш персональный разбор</h1>
      </header>

      <section class="summary-card">
        <div class="summary-head">
          <span class="ai-avatar"><i class="bi bi-stars"></i></span>
          <div>
            <strong>Torap AI</strong>
            <span>на основе {{ answersCount }} ваших ответов</span>
          </div>
        </div>
        <div class="summary-text" v-html="formatSummary(result.summary)"></div>
      </section>

      <section class="spec-section" v-if="specialties.length">
        <h2>Рекомендуемые специальности</h2>
        <transition-group name="cards" tag="div" class="spec-cards" appear>
          <div
            v-for="spec in specialties"
            :key="spec.id"
            class="spec-card"
            @click="openSpec(spec)"
          >
            <span class="spec-card-icon"><i class="bi bi-mortarboard-fill"></i></span>
            <div class="spec-card-text">
              <h3>{{ spec.name }}</h3>
              <p>{{ spec.qualification_name }}</p>
            </div>
            <i class="bi bi-arrow-right spec-card-arrow"></i>
          </div>
        </transition-group>
      </section>
      <p v-else class="no-specs">К сожалению, подходящие специальности не найдены.</p>
    </template>

  </div>
</template>

<script>
import axios from 'axios';

const POLL_INTERVAL = 12000; // 12s
const POLL_MAX_MS = 45 * 60 * 1000; // 45 минут — потолок ожидания ИИ (общий медленный сервер)

export default {
  name: 'TestResultPage',
  data() {
    return {
      loading: true,
      analyzing: false,
      failed: false,
      result: {},
      specialties: [],
      waitSteps: [
        'Изучаем ваши интересы…',
        'Ищем сильные стороны…',
        'Сопоставляем со специальностями…',
        'Формулируем рекомендации…',
        'Почти готово — оформляем разбор…',
      ],
      waitStepIndex: 0,
      _pollTimer: null,
      _stepTimer: null,
      _pollStartedAt: null,
    };
  },
  computed: {
    answersCount() {
      const a = this.result.answers;
      return Array.isArray(a) ? a.length : Object.keys(a || {}).length;
    },
  },
  async created() {
    this._pollStartedAt = Date.now();
    await this.fetchResult(true);
  },
  beforeUnmount() {
    this.stopPolling();
  },
  methods: {
    stopPolling() {
      if (this._pollTimer) clearTimeout(this._pollTimer);
      if (this._stepTimer) clearInterval(this._stepTimer);
      this._pollTimer = null;
      this._stepTimer = null;
    },
    startWaitAnimation() {
      if (this._stepTimer) return;
      this._stepTimer = setInterval(() => {
        this.waitStepIndex = (this.waitStepIndex + 1) % this.waitSteps.length;
      }, 6000);
    },
    async fetchResult(first = false) {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(
          `http://localhost:8000/api/career-tests/${this.$route.params.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        this.result = data;

        if (data.summary) {
          // Анализ готов
          this.stopPolling();
          this.analyzing = false;
          this.loading = false;
          await this.fetchSpecialties();
          return;
        }

        // Анализ ещё идёт — поллим
        this.loading = false;
        if (Date.now() - this._pollStartedAt > POLL_MAX_MS) {
          this.analyzing = false;
          this.failed = true;
          this.stopPolling();
          return;
        }
        this.analyzing = true;
        this.startWaitAnimation();
        this._pollTimer = setTimeout(() => this.fetchResult(), POLL_INTERVAL);
      } catch (e) {
        console.error('Не удалось получить результат', e);
        this.loading = false;
        if (first) this.failed = true;
        // сетевые сбои в процессе поллинга — просто пробуем ещё раз
        else this._pollTimer = setTimeout(() => this.fetchResult(), POLL_INTERVAL);
      }
    },
    async fetchSpecialties() {
      let idsOrNames = this.result.suggestions || [];
      if (typeof idsOrNames === 'string') {
        try {
          idsOrNames = JSON.parse(idsOrNames);
        } catch (_) {
          idsOrNames = [];
        }
      }

      if (!Array.isArray(idsOrNames) || !idsOrNames.length) return;

      const type = this.result.institution_type;
      const prefix = type === 'college' ? 'college-' : '';

      for (const item of idsOrNames) {
        // строка-название (ИИ вернул имя, а не id) — ищем через поиск
        if (typeof item === 'string' && isNaN(Number(item))) {
          try {
            const { data: listResp } = await axios.get(
              `http://localhost:8000/api/specializations?search=${encodeURIComponent(item)}&type=${type}`
            );
            const firstMatch = listResp.data?.find(() => true);
            if (firstMatch) {
              this.specialties.push({
                ...firstMatch,
                qualification_name:
                  firstMatch.qualification?.qualification_name ||
                  firstMatch.qualification?.name ||
                  '—',
                type,
              });
            }
          } catch (e) {
            console.warn('Lookup by name failed', item, e);
          }
          continue;
        }

        try {
          const { data: apiResp } = await axios.get(
            `http://localhost:8000/api/${prefix}specializations/${item}`
          );
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
      localStorage.setItem('selectedSpecialization', JSON.stringify({
        ...spec,
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
  --blue: var(--torap-blue, #1795c0);
  --blue-dark: var(--torap-blue-dark, #12799c);
  --gold: var(--torap-gold, #b08d4f);
  --gold-bright: var(--torap-gold-bright, #d4af37);
  --text: #10222e;
  --muted: #64748b;
  --border: #e6edf2;
  max-width: 920px;
  margin: 0 auto;
  padding: 110px 20px 60px;
  color: var(--text);
}

/* ===== Экраны состояний ===== */
.state-screen {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 14px;
  padding: 40px 16px;
}

.state-screen h1 {
  font-size: clamp(1.4rem, 3.4vw, 1.9rem);
  font-weight: 800;
  color: var(--text);
  margin: 6px 0 0;
}

.ai-wait-sub {
  color: var(--muted);
  font-size: 0.98rem;
  line-height: 1.6;
  max-width: 520px;
  margin: 0;
}

.ai-orb {
  width: 92px;
  height: 92px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.1rem;
  color: #0b1f2a;
  background: linear-gradient(135deg, var(--gold-bright), var(--gold));
  box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.4);
  animation: orbPulse 2.2s ease-in-out infinite;
}

.ai-orb-muted {
  background: #eef2f5;
  color: var(--muted);
  animation: none;
}

@keyframes orbPulse {
  0% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.4); }
  60% { box-shadow: 0 0 0 26px rgba(212, 175, 55, 0); }
  100% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0); }
}

.ai-progress {
  width: min(360px, 80vw);
  height: 6px;
  border-radius: 999px;
  background: #e8eef2;
  overflow: hidden;
  margin-top: 6px;
}

.ai-progress-bar {
  height: 100%;
  width: 40%;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--blue), var(--gold-bright));
  animation: progressSlide 1.8s ease-in-out infinite;
}

@keyframes progressSlide {
  0% { transform: translateX(-110%); }
  100% { transform: translateX(280%); }
}

.ai-wait-step {
  color: var(--blue-dark);
  font-weight: 600;
  font-size: 0.92rem;
  margin: 0;
  min-height: 1.4em;
}

.spinner {
  width: 44px;
  height: 44px;
  border: 4px solid #e8eef2;
  border-top-color: var(--blue);
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.btn-primary {
  border: none;
  border-radius: 12px;
  padding: 12px 26px;
  background: linear-gradient(135deg, var(--blue), var(--blue-dark));
  color: #fff;
  font-weight: 700;
  font-size: 0.98rem;
  cursor: pointer;
  box-shadow: 0 8px 22px rgba(23, 149, 192, 0.35);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(23, 149, 192, 0.45);
}

/* ===== Результат ===== */
.result-hero {
  text-align: center;
  margin-bottom: 26px;
}

.result-eyebrow {
  display: inline-block;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 8px;
}

.result-hero h1 {
  font-size: clamp(1.6rem, 4vw, 2.2rem);
  font-weight: 800;
  margin: 0;
}

.summary-card {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 18px;
  box-shadow: 0 10px 30px rgba(16, 34, 46, 0.06);
  padding: 24px 26px;
  margin-bottom: 34px;
}

.summary-head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 16px;
  margin-bottom: 18px;
  border-bottom: 1px solid var(--border);
}

.ai-avatar {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 44px;
  background: linear-gradient(135deg, var(--gold-bright), var(--gold));
  color: #0b1f2a;
  font-size: 1.2rem;
  box-shadow: 0 6px 16px rgba(212, 175, 55, 0.35);
}

.summary-head strong {
  display: block;
  font-size: 1rem;
  color: var(--text);
}

.summary-head span {
  font-size: 0.83rem;
  color: var(--muted);
}

.summary-text {
  color: #2b3d47;
  font-size: 0.99rem;
  line-height: 1.75;
}

/* ===== Специальности ===== */
.spec-section h2 {
  font-size: 1.25rem;
  font-weight: 800;
  margin: 0 0 16px;
}

.spec-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 270px), 1fr));
  gap: 14px;
}

.spec-card {
  display: flex;
  align-items: center;
  gap: 13px;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 16px;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
}

.spec-card:hover {
  transform: translateY(-3px);
  border-color: rgba(23, 149, 192, 0.4);
  box-shadow: 0 14px 30px rgba(16, 34, 46, 0.1);
}

.spec-card-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 44px;
  font-size: 1.15rem;
  color: var(--blue);
  background: linear-gradient(135deg, rgba(23, 149, 192, 0.14), rgba(23, 149, 192, 0.05));
  box-shadow: inset 0 0 0 1px rgba(23, 149, 192, 0.12);
  transition: background 0.2s ease, color 0.2s ease;
}

.spec-card:hover .spec-card-icon {
  background: linear-gradient(135deg, var(--blue), var(--blue-dark));
  color: #fff;
}

.spec-card-text {
  min-width: 0;
}

.spec-card h3 {
  font-size: 0.99rem;
  font-weight: 700;
  margin: 0 0 3px;
  color: var(--text);
}

.spec-card p {
  font-size: 0.84rem;
  color: var(--muted);
  margin: 0;
}

.spec-card-arrow {
  margin-left: auto;
  color: var(--blue);
  opacity: 0;
  transform: translateX(-6px);
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.spec-card:hover .spec-card-arrow {
  opacity: 1;
  transform: translateX(0);
}

.no-specs {
  color: var(--muted);
}

/* Card appear animation */
.cards-enter-active {
  transition: all 0.35s ease;
}

.cards-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

@media (prefers-reduced-motion: reduce) {
  .ai-orb,
  .ai-progress-bar {
    animation: none;
  }
}
</style>
