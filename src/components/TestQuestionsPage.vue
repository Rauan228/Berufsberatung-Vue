<template>
  <div class="questions-page">

    <!-- ===== Тёмная шапка с прогрессом ===== -->
    <header class="quiz-head">
      <div class="quiz-head-inner">
        <div class="quiz-stages">
          <div
            v-for="(name, i) in stageNames"
            :key="name"
            class="quiz-stage"
            :class="{ active: stageNumber === i + 1, done: stageNumber > i + 1 }"
          >
            <span class="quiz-stage-dot">
              <i v-if="stageNumber > i + 1" class="bi bi-check-lg"></i>
              <template v-else>{{ i + 1 }}</template>
            </span>
            <span class="quiz-stage-name">{{ name }}</span>
          </div>
        </div>

        <div class="quiz-progress">
          <div class="quiz-progress-bar" :style="{ width: progressPercent + '%' }"></div>
        </div>
        <div class="quiz-counter">
          Вопрос <strong>{{ currentIndex + 1 }}</strong> из {{ questions.length }}
        </div>
      </div>
    </header>

    <!-- ===== Отправка ===== -->
    <div v-if="loading" class="submit-screen">
      <div class="spinner"></div>
      <p>Сохраняем ваши ответы…</p>
    </div>

    <!-- ===== Вопрос ===== -->
    <transition name="fade-slide" mode="out-in">
      <div v-if="!loading" :key="currentIndex" class="question-card">
        <p class="question-text">{{ currentQuestion.text }}</p>

        <div class="options">
          <label
            v-for="(opt, idx) in currentQuestion.options"
            :key="idx"
            class="option-row"
            :class="{ chosen: selectedAnswer === opt }"
          >
            <input type="radio" :value="opt" v-model="selectedAnswer" />
            <span class="option-mark"></span>
            <span class="option-text">{{ opt }}</span>
          </label>

          <label class="option-row option-other" :class="{ chosen: selectedAnswer === 'other' }">
            <input type="radio" value="other" v-model="selectedAnswer" />
            <span class="option-mark"></span>
            <span class="option-text">Другой ответ</span>
          </label>
          <input
            v-if="selectedAnswer === 'other'"
            v-model="otherAnswer"
            class="other-input"
            placeholder="Введите свой вариант…"
          />
        </div>

        <div class="nav-buttons">
          <button class="btn-back" @click="prev" :disabled="currentIndex === 0">
            <i class="bi bi-arrow-left"></i>
            Назад
          </button>
          <button
            class="btn-next"
            :class="{ 'btn-finish': currentIndex === questions.length - 1 }"
            @click="next"
            :disabled="!canProceed"
          >
            <template v-if="currentIndex === questions.length - 1">
              Завершить
              <i class="bi bi-stars"></i>
            </template>
            <template v-else>
              Далее
              <i class="bi bi-arrow-right"></i>
            </template>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'TestQuestionsPage',
  data() {
    return {
      questions: [
        // Этап 1 — личностные качества
        { text: 'Как вы обычно принимаете решения?', options: ['Быстро, интуитивно', 'После тщательного анализа', 'Советуюсь с другими', 'Откладываю решение'] },
        { text: 'Что из перечисленного вам ближе?', options: ['Структура и порядок', 'Свобода и спонтанность', 'Соревновательность', 'Служение и забота'] },
        { text: 'Как вы относитесь к конфликтам?', options: ['Избегаю', 'Решаю дипломатично', 'Смело отстаиваю позицию', 'Использую как возможность роста'] },
        { text: 'Что вас заряжает энергией?', options: ['Общение с людьми', 'Время в одиночестве', 'Физическая активность', 'Творчество'] },
        { text: 'Какой тип задач вас вдохновляет?', options: ['Практические', 'Теоретические', 'Креативные', 'Социально значимые'] },
        { text: 'Как вы относитесь к деталям?', options: ['Люблю детали', 'Фокус на общей картине', 'Умею переключаться', 'Предпочитаю делегировать детали'] },
        { text: 'Что для вас важнее в работе?', options: ['Стабильность', 'Вызов', 'Автономия', 'Признание'] },
        { text: 'Насколько легко вам адаптироваться к переменам?', options: ['Очень легко', 'Достаточно легко', 'Сложно, но могу', 'Тяжело'] },
        { text: 'Как вы реагируете на критику?', options: ['Слушаю и улучшаюсь', 'Защищаюсь', 'Перевожу в шутку', 'Игнорирую'] },
        { text: 'Что вас мотивирует достигать целей?', options: ['Внутренняя страсть', 'Внешнее признание', 'Материальное вознаграждение', 'Помощь другим'] },
        { text: 'Каким одним словом вы бы описали себя?', options: ['Аналитик', 'Визионер', 'Коммуникатор', 'Исполнитель'] },
        { text: 'Какая роль вам ближе в команде?', options: ['Лидер', 'Стратег', 'Вдохновитель', 'Исполнитель'] },
        { text: 'Каков ваш подход к обучению?', options: ['Следую программе', 'Нахожу ресурсы сам', 'Учусь в процессе', 'С наставником'] },
        { text: 'Насколько важно вам следовать правилам?', options: ['Очень важно', 'Важно, но бывают исключения', 'Использую как ориентир', 'Люблю создавать свои правила'] },
        { text: 'Что для вас «успех»?', options: ['Финансовая независимость', 'Счастье', 'Влияние на мир', 'Экспертиза'] },
        { text: 'Как вы относитесь к монотонной работе?', options: ['Люблю рутину', 'Справляюсь', 'Быстро устаю', 'Избегаю'] },
        { text: 'Что вас больше расслабляет?', options: ['Чтение', 'Спорт', 'Общение', 'Творчество'] },
        { text: 'Какая ваша сильная сторона?', options: ['Дисциплина', 'Креативность', 'Эмпатия', 'Аналитика'] },
        { text: 'Какой тип мышления у вас преобладает?', options: ['Логический', 'Абстрактный', 'Эмоциональный', 'Практический'] },
        { text: 'Как относитесь к многозадачности?', options: ['Люблю многозадачность', 'Предпочитаю одну задачу', 'Зависит от ситуации', 'Избегаю'] },

        // Этап 2 — предпочтения в работе
        { text: 'Где вы предпочли бы работать?', options: ['Большая корпорация', 'Стартап', 'Госучреждение', 'Фриланс'] },
        { text: 'Какой формат рабочего места вам подходит?', options: ['Офис', 'Удалённая работа', 'Разъездная работа', 'Под открытым небом/производстве'] },
        { text: 'Какой график вам комфортен?', options: ['9:00-18:00', 'Гибкий', 'Сменный', 'Проектный'] },
        { text: 'Насколько важно международное взаимодействие?', options: ['Очень важно', 'Желательно', 'Не важно', 'Предпочитаю локально'] },
        { text: 'На каком языке хотите работать?', options: ['Русский', 'Английский', 'Многоязычная среда', 'Без разницы'] },
        { text: 'Какой уровень ответственности интересен?', options: ['Исполнитель', 'Специалист', 'Руководитель', 'Предприниматель'] },
        { text: 'Чего ожидаете от руководства?', options: ['Чётких указаний', 'Доверия и автономии', 'Регулярной обратной связи', 'Вдохновения и видения'] },
        { text: 'Какие задачи нравятся?', options: ['Рутинные', 'Проектные', 'Исследовательские', 'Творческие'] },
        { text: 'Какую культуру компании предпочитаете?', options: ['Формальная', 'Дружеская', 'Инновационная', 'Ориентированная на результат'] },
        { text: 'Насколько готовы к командировкам?', options: ['Всегда', 'Иногда', 'Редко', 'Никогда'] },
        { text: 'Как важны социальные льготы?', options: ['Очень важны', 'Желательны', 'Не важны', 'Не интересуют'] },
        { text: 'Какой размер команды комфортен?', options: ['1-5', '6-15', '16-50', '50+'] },
        { text: 'Какой темп работы вам подходит?', options: ['Высокий', 'Средний', 'Спокойный', 'Переменный'] },
        { text: 'При выборе работы вы ориентируетесь прежде всего на…', options: ['Деньги', 'Опыт и рост', 'Комфорт', 'Миссию компании'] },
        { text: 'Как относитесь к работе под жёсткими сроками?', options: ['Люблю дедлайны', 'Справляюсь', 'Стараюсь избегать', 'Не приемлю'] },
        { text: 'Какая форма признания важнее?', options: ['Публичная', 'От руководителя', 'Материальная', 'Внутренняя удовлетворённость'] },
        { text: 'Насколько важна стабильность?', options: ['Критична', 'Желательна', 'Не принципиальна', 'Скучна, ищу перемен'] },
        { text: 'Предпочтительный канал коммуникации в команде?', options: ['Очные встречи', 'Чаты', 'Видеозвонки', 'Email'] },
        { text: 'Значима ли экологическая/социальная миссия компании?', options: ['Очень', 'Скорее да', 'Не критично', 'Не важно'] },
        { text: 'Готовность учиться на работе:', options: ['Всегда готов', 'При необходимости', 'Только по интересу', 'Не хочу обучаться'] },

        // Этап 3 — занятия и интересы
        { text: 'Что вы любите делать в свободное время?', options: ['Читать научпоп', 'Рисовать/создавать', 'Заниматься спортом', 'Играть с технологиями'] },
        { text: 'Какие темы вы часто обсуждаете?', options: ['Бизнес и финансы', 'Наука и технологии', 'Культура и искусство', 'Люди и отношения'] },
        { text: 'Что приносит вам чувство успеха?', options: ['Завершённый проект', 'Восторг публики', 'Помощь другим', 'Личный рекорд'] },
        { text: 'Какой тип контента вы предпочитаете?', options: ['Научные статьи', 'Визуальное искусство', 'Тренировочные планы', 'Технические руководства'] },
        { text: 'Какую деятельность выберете?', options: ['Организовать событие', 'Сконструировать устройство', 'Написать статью', 'Провести эксперимент'] },
        { text: 'Что вас вдохновляет?', options: ['Природа', 'Технологические инновации', 'Люди', 'История и культура'] },
        { text: 'Какие игры вам нравятся?', options: ['Стратегии', 'Ролевые', 'Спортивные', 'Головоломки'] },
        { text: 'Какие навыки хотите развивать?', options: ['Кодирование/аналитика', 'Дизайн/креатив', 'Лидерство/общение', 'Ремесло/ручной труд'] },
        { text: 'За каким занятием теряете счёт времени?', options: ['Программирование', 'Музыка/рисование', 'Общение/волонтёрство', 'Сборка/ремонт'] },
        { text: 'Какие книги вам ближе?', options: ['Бизнес', 'Фантастика', 'Документалистика', 'Поэзия'] },
        { text: 'Какие фильмы предпочитаете?', options: ['Драмы', 'Документальные', 'Фантастика', 'Комедии'] },
        { text: 'Что предпочитаете исследовать?', options: ['Данные', 'Материалы/структуры', 'Человеческое поведение', 'Идеи/концепции'] },
        { text: 'Где вам нравится бывать?', options: ['Музеи и выставки', 'Стадионы', 'Коворкинги', 'Мастерские'] },
        { text: 'Что хотели бы создать?', options: ['Приложение', 'Художественное произведение', 'Свой бизнес', 'Исследовательский отчёт'] },
        { text: 'Как обычно проводите выходные?', options: ['С проектом', 'С друзьями', 'На природе', 'За обучением'] },
        { text: 'Что помогает расслабиться?', options: ['Музыка', 'Медитация', 'Спорт', 'Рукоделие'] },
        { text: 'Какие темы подписок в соцсетях?', options: ['Технологии', 'Искусство и мода', 'Спорт и здоровье', 'Психология и отношения'] },
        { text: 'Что бы вы выбрали?', options: ['Хакатон', 'Культурный фестиваль', 'Спортивное соревнование', 'Благотворительная акция'] },
        { text: 'В каком виде деятельности чувствуете уверенность?', options: ['Аналитический расчёт', 'Публичное выступление', 'Творческий эксперимент', 'Работа руками'] },
        { text: 'К чему тянулись в детстве?', options: ['Собирать конструкторы', 'Рисовать и сочинять', 'Организовывать игры', 'Придумывать истории'] },

        // Этап 4 — профильные предпочтения (по направлениям обучения)
        { text: 'Что вам интереснее изучать?', options: ['Кодирование и алгоритмы', 'Биологию и здоровье', 'Историю и социологию', 'Экономику и финансы'] },
        { text: 'Какой тип проектов вам ближе?', options: ['Разработка ИТ-систем', 'Медицинские исследования', 'Культурные проекты', 'Стартапы и бизнес-планы'] },
        { text: 'Что вас больше мотивирует?', options: ['Создавать новые технологии', 'Помогать людям выздоравливать', 'Развивать общество и культуру', 'Повышать экономическую эффективность'] },
        { text: 'С какими инструментами вы хотели бы работать?', options: ['Компьютерный код и данные', 'Лабораторное оборудование', 'Архивы и музейные коллекции', 'Финансовые модели и отчёты'] },
        { text: 'Какой результат работы вам приятнее видеть?', options: ['Работающее ПО/сайт', 'Улучшение здоровья пациентов', 'Общественное событие или выставка', 'Рост прибыли компании'] },
        { text: 'Что для вас важнее в профессии?', options: ['Технологические инновации', 'Социальная значимость', 'Культурное влияние', 'Экономический успех'] },
        { text: 'Какой формат решения проблем вам ближе?', options: ['Логические задачи', 'Диагностика симптомов', 'Исследование исторических источников', 'Финансовый анализ'] },
        { text: 'Какую область знаний вы хотели бы углублённо изучать?', options: ['Искусственный интеллект', 'Фармакология', 'Мировое искусство', 'Инвестиции'] },
        { text: 'Какая роль в проекте вам нравится?', options: ['Full-stack разработчик', 'Клинический исследователь', 'Куратор выставки', 'Финансовый аналитик'] },
        { text: 'Что вас вдохновляет на обучение?', options: ['Новые технологические тренды', 'Истории выздоровления', 'Культурные открытия', 'Успехи бизнеса'] },
        { text: 'Чем вам интереснее делиться с другими?', options: ['Кодом на GitHub', 'Советами по здоровью', 'Культурными фактами', 'Финансовыми лайфхаками'] },
        { text: 'Какой тип лаборатории/офиса вам по душе?', options: ['IT-open space', 'Медицинская лаборатория', 'Архив и библиотека', 'Бизнес-инновационный центр'] },
        { text: 'Как вы видите свой вклад через 10 лет?', options: ['Разработал популярный сервис', 'Помог тысячам пациентов', 'Сохранил культурное наследие', 'Поднял крупную компанию'] },
        { text: 'Какие конференции вам хочется посещать?', options: ['Техконференции', 'Медицинские конгрессы', 'Культурные форумы', 'Бизнес-саммиты'] },
        { text: 'Какой тип литературы вам ближе?', options: ['Книги по программированию', 'Медицинские журналы', 'Каталоги выставок', 'Отчёты о рынках капитала'] },
        { text: 'Какую практику выбрали бы?', options: ['Стажировка в IT-компании', 'Практика в больнице/клинике', 'Работа в музее/галерее', 'Практика в банке или консалтинге'] },
        { text: 'Какие навыки мечтаете освоить?', options: ['Машинное обучение', 'Медицинская диагностика', 'Организация культурных событий', 'Финансовое планирование'] },
        { text: 'Какой критерий успеха для вас важнее?', options: ['Техническое совершенство', 'Здоровье людей', 'Культурное влияние', 'Финансовые показатели'] },
        { text: 'Что бы вы выбрали при равных условиях?', options: ['Создать игру', 'Разработать лекарство', 'Организовать фестиваль', 'Сделать инвестиционный портфель'] },
        { text: 'Какой курс вас бы заинтересовал в первую очередь?', options: ['Data Science', 'Анатомия человека', 'История искусств', 'Финансовая аналитика'] },
        { text: 'Какая тема диплома кажется привлекательной?', options: ['Нейронные сети', 'Иммунология', 'Современное искусство', 'Корпоративные финансы'] },
      ],
      currentIndex: 0,
      answers: [],
      selectedAnswer: '',
      otherAnswer: '',
      loading: false,
      institutionType: this.$route.query.type || '',
    };
  },
  computed: {
    stageNames() {
      return ['Личность', 'Работа', 'Интересы', 'Профиль'];
    },
    currentQuestion() {
      return this.questions[this.currentIndex];
    },
    // percentage for progress bar
    progressPercent() {
      return Math.round(((this.currentIndex + 1) / this.questions.length) * 100);
    },
    canProceed() {
      if (this.selectedAnswer === 'other') return this.otherAnswer.trim().length > 0;
      return this.selectedAnswer !== '';
    },
    stageTotal() {
      return 4;
    },
    stageNumber() {
      // в последнем этапе 21 вопрос — не выходим за пределы 4 этапов
      return Math.min(this.stageTotal, Math.floor(this.currentIndex / 20) + 1);
    },
  },
  methods: {
    prev() {
      if (this.currentIndex === 0) return;
      this.saveAnswer();
      this.currentIndex--;
      this.loadSavedAnswer();
    },
    next() {
      if (!this.canProceed) return;
      this.saveAnswer();
      if (this.currentIndex < this.questions.length - 1) {
        this.currentIndex++;
        this.loadSavedAnswer();
      } else {
        this.submitTest();
      }
    },
    saveAnswer() {
      const answerValue = this.selectedAnswer === 'other' ? this.otherAnswer.trim() : this.selectedAnswer;
      this.answers[this.currentIndex] = answerValue;
    },
    loadSavedAnswer() {
      this.selectedAnswer = '';
      this.otherAnswer = '';
      const prev = this.answers[this.currentIndex];
      if (!prev) return;
      if (this.currentQuestion.options.includes(prev)) {
        this.selectedAnswer = prev;
      } else {
        this.selectedAnswer = 'other';
        this.otherAnswer = prev;
      }
    },
    async submitTest() {
      this.loading = true;
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Для сохранения результата необходимо войти.');
          this.$router.push('/login');
          return;
        }
        const { data } = await axios.post(
          'http://localhost:8000/api/career-tests',
          {
            institution_type: this.institutionType,
            answers: this.questions.map((q, i) => ({ question: q.text, answer: this.answers[i] }))
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        this.$router.push({ name: 'TestResult', params: { id: data.id } });
      } catch (e) {
        console.error('Не удалось отправить тест', e);
        alert('Ошибка при сохранении результата');
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.questions-page {
  --blue: var(--torap-blue, #1795c0);
  --blue-dark: var(--torap-blue-dark, #12799c);
  --gold: var(--torap-gold, #b08d4f);
  --gold-bright: var(--torap-gold-bright, #d4af37);
  --text: #10222e;
  --muted: #64748b;
  --border: #e6edf2;
  min-height: 100vh;
  background: #f4f7f9;
  color: var(--text);
  padding-bottom: 60px;
}

/* ===== Тёмная шапка с прогрессом ===== */
.quiz-head {
  position: relative;
  overflow: hidden;
  background: #0b1f2a;
  color: #fff;
  padding: 96px 24px 26px;
}

.quiz-head::before {
  content: '';
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400' fill='none'%3E%3Cpath d='M0 60 Q150 10 300 60 T600 60' stroke='%231795c0' stroke-opacity='0.22' stroke-width='1.3'/%3E%3Cpath d='M0 120 Q150 66 300 120 T600 120' stroke='%231795c0' stroke-opacity='0.14' stroke-width='1.3'/%3E%3Cpath d='M0 180 Q150 122 300 180 T600 180' stroke='%23d4af37' stroke-opacity='0.16' stroke-width='1.3'/%3E%3Cpath d='M0 240 Q150 182 300 240 T600 240' stroke='%231795c0' stroke-opacity='0.11' stroke-width='1.3'/%3E%3C/svg%3E") repeat;
  background-size: 600px 400px;
  -webkit-mask-image: linear-gradient(115deg, #000 30%, transparent 78%);
  mask-image: linear-gradient(115deg, #000 30%, transparent 78%);
  pointer-events: none;
}

.quiz-head-inner {
  position: relative;
  max-width: 760px;
  margin: 0 auto;
}

.quiz-stages {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 18px;
}

.quiz-stage {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.quiz-stage-dot {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  flex: 0 0 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.82rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.55);
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.18);
  transition: all 0.25s ease;
}

.quiz-stage-name {
  font-size: 0.82rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  white-space: nowrap;
  transition: color 0.25s ease;
}

.quiz-stage.active .quiz-stage-dot {
  background: linear-gradient(135deg, var(--blue), var(--blue-dark));
  border-color: transparent;
  color: #fff;
  box-shadow: 0 0 0 4px rgba(23, 149, 192, 0.25);
}

.quiz-stage.active .quiz-stage-name {
  color: #fff;
}

.quiz-stage.done .quiz-stage-dot {
  background: linear-gradient(135deg, var(--gold-bright), var(--gold));
  border-color: transparent;
  color: #0b1f2a;
}

.quiz-stage.done .quiz-stage-name {
  color: rgba(255, 255, 255, 0.75);
}

.quiz-progress {
  height: 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  overflow: hidden;
}

.quiz-progress-bar {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--blue), var(--gold-bright));
  transition: width 0.4s ease;
}

.quiz-counter {
  margin-top: 10px;
  font-size: 0.88rem;
  color: rgba(255, 255, 255, 0.65);
}

.quiz-counter strong {
  color: var(--gold-bright);
}

/* ===== Карточка вопроса ===== */
.question-card {
  max-width: 760px;
  margin: 26px auto 0;
  padding: 30px 28px;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 20px;
  box-shadow: 0 14px 40px rgba(16, 34, 46, 0.07);
}

.question-text {
  font-size: 1.3rem;
  font-weight: 700;
  line-height: 1.4;
  margin: 0 0 22px;
  color: var(--text);
}

.options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.option-row {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 14px 16px;
  border: 2px solid var(--border);
  border-radius: 14px;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.15s ease;
  user-select: none;
}

.option-row:hover {
  border-color: rgba(23, 149, 192, 0.5);
  transform: translateX(3px);
}

.option-row.chosen {
  background: rgba(23, 149, 192, 0.06);
  border-color: var(--blue);
}

.option-row input[type='radio'] {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

/* Кастомная радио-точка */
.option-mark {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  flex: 0 0 22px;
  border: 2px solid #c4d2da;
  position: relative;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.option-row.chosen .option-mark {
  border-color: var(--blue);
  background: var(--blue);
}

.option-row.chosen .option-mark::after {
  content: '';
  position: absolute;
  inset: 5px;
  border-radius: 50%;
  background: #fff;
}

.option-text {
  font-size: 0.98rem;
  color: var(--text);
  line-height: 1.4;
}

.option-other .option-text {
  color: var(--muted);
}

.option-other.chosen .option-text {
  color: var(--text);
}

.other-input {
  margin-top: 2px;
  padding: 13px 16px;
  width: 100%;
  border: 2px solid rgba(23, 149, 192, 0.4);
  border-radius: 14px;
  font-size: 0.98rem;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.other-input:focus {
  border-color: var(--blue);
  box-shadow: 0 0 0 3px rgba(23, 149, 192, 0.15);
}

/* ===== Навигация ===== */
.nav-buttons {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 28px;
}

.btn-back,
.btn-next {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 13px 26px;
  font-size: 1rem;
  font-weight: 700;
  border-radius: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-back {
  background: transparent;
  border: 2px solid var(--border);
  color: var(--muted);
}

.btn-back:not(:disabled):hover {
  border-color: var(--blue);
  color: var(--blue-dark);
}

.btn-back:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.btn-next {
  border: none;
  color: #fff;
  background: linear-gradient(135deg, var(--blue), var(--blue-dark));
  box-shadow: 0 8px 20px rgba(23, 149, 192, 0.35);
}

.btn-next:not(:disabled):hover {
  filter: brightness(1.08);
  transform: translateY(-2px);
  box-shadow: 0 12px 26px rgba(23, 149, 192, 0.45);
}

.btn-next:disabled {
  background: #c2cdd4;
  box-shadow: none;
  cursor: not-allowed;
}

/* Последний вопрос — золотая кнопка «Завершить» */
.btn-finish {
  background: linear-gradient(135deg, var(--gold-bright), var(--gold));
  color: #10222e;
  box-shadow: 0 8px 20px rgba(212, 175, 55, 0.4);
}

.btn-finish:not(:disabled):hover {
  box-shadow: 0 12px 28px rgba(212, 175, 55, 0.5);
}

/* ===== Отправка ===== */
.submit-screen {
  min-height: 40vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: var(--muted);
  font-size: 1.05rem;
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

/* ===== Переходы между вопросами ===== */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* ===== Адаптив ===== */
@media (max-width: 640px) {
  .quiz-head {
    padding: 84px 16px 22px;
  }

  .quiz-stage-name {
    display: none;
  }

  .quiz-stage.active .quiz-stage-name {
    display: inline;
  }

  .question-card {
    margin: 18px 14px 0;
    padding: 22px 18px;
  }

  .question-text {
    font-size: 1.12rem;
  }

  .nav-buttons {
    flex-direction: column-reverse;
  }

  .btn-back,
  .btn-next {
    width: 100%;
    justify-content: center;
  }
}
</style> 