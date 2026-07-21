<template>
  <div class="uni-page">
    <!-- ===== Page header ===== -->
    <header class="page-hero">
      <div class="hero-glow hero-glow-blue"></div>
      <div class="hero-glow hero-glow-gold"></div>
      <div class="page-hero-inner">
        <div class="hero-copy">
          <h1>Колледжи <span class="hero-accent">Казахстана</span></h1>
          <p class="page-sub">
            Карта, фильтры, сравнение и отзывы — всё, чтобы получить профессию быстрее.
          </p>
        </div>
        <div class="hero-facts">
          <div class="hero-fact">
            <span class="hero-fact-value">{{ totalColleges || '—' }}</span>
            <span class="hero-fact-label">{{ collegeWord(totalColleges) }}</span>
          </div>
          <span class="hero-fact-divider"></span>
          <div class="hero-fact">
            <span class="hero-fact-value">{{ totalCities || '—' }}</span>
            <span class="hero-fact-label">{{ cityWordRu(totalCities) }}</span>
          </div>
          <span class="hero-fact-divider"></span>
          <div class="hero-fact">
            <span class="hero-fact-value">{{ grantsCount || '—' }}</span>
            <span class="hero-fact-label">с грантами</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Плавающая кнопка сравнения -->
    <transition name="fab-pop">
      <button
        v-if="compareList.length"
        class="compare-fab"
        type="button"
        @click="showCompare = true"
      >
        <i class="bi bi-bar-chart-steps"></i>
        Сравнение · {{ compareList.length }}
      </button>
    </transition>

    <div class="page-layout">
      <!-- ===== Sidebar filters ===== -->
      <aside class="filters-sidebar" :class="{ open: filtersOpen }">
        <div class="filters-head">
          <h2>Фильтры</h2>
          <button type="button" class="filters-close" @click="filtersOpen = false" aria-label="Закрыть">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <div class="filter-block">
          <label class="filter-label" for="uni-search">Поиск</label>
          <div class="search-field">
            <i class="bi bi-search"></i>
            <input
              id="uni-search"
              v-model="filters.search"
              type="search"
              placeholder="Название колледжа..."
              autocomplete="off"
            />
          </div>
        </div>

        <div class="filter-block">
          <label class="filter-label">Город на карте</label>
          <div class="chip-list">
            <button
              v-for="city in kzCityNames"
              :key="city"
              type="button"
              class="chip"
              :class="{ active: selectedMapCity === city }"
              @click="selectMapCity(city)"
            >
              {{ city }}
              <span class="chip-count">{{ cityUniCount(city) }}</span>
            </button>
          </div>
        </div>

        <div class="filter-block">
          <label class="filter-label">Тип колледжа</label>
          <div class="chip-list">
            <button
              v-for="t in ownershipOptions"
              :key="t.value"
              type="button"
              class="chip"
              :class="{ active: filters.ownership === t.value }"
              @click="filters.ownership = filters.ownership === t.value ? '' : t.value"
            >
              {{ t.label }}
            </button>
          </div>
        </div>

        <div class="filter-block">
          <label class="filter-label">Направление</label>
          <div class="chip-list">
            <button
              v-for="d in directionOptions"
              :key="d"
              type="button"
              class="chip"
              :class="{ active: filters.directions.includes(d) }"
              @click="toggleMulti('directions', d)"
            >
              {{ d }}
            </button>
          </div>
        </div>

        <div class="filter-block">
          <div class="filter-label-row">
            <label class="filter-label">Стоимость обучения</label>
            <span class="range-value">до {{ formatMoney(filters.costMax) }} ₸</span>
          </div>
          <input
            v-model.number="filters.costMax"
            type="range"
            class="range"
            :min="costBounds.min"
            :max="costBounds.max"
            :step="50000"
          />
          <div class="range-ends">
            <span>{{ formatMoney(costBounds.min) }} ₸</span>
            <span>{{ formatMoney(costBounds.max) }} ₸</span>
          </div>
        </div>

        <div class="filter-block">
          <div class="filter-label-row">
            <label class="filter-label">Проходной балл</label>
            <span class="range-value">до {{ filters.scoreMax }}</span>
          </div>
          <input
            v-model.number="filters.scoreMax"
            type="range"
            class="range"
            :min="scoreBounds.min"
            :max="scoreBounds.max"
            step="0.1"
          />
          <div class="range-ends">
            <span>{{ scoreBounds.min }}</span>
            <span>{{ scoreBounds.max }}</span>
          </div>
        </div>

        <div class="filter-block">
          <label class="filter-label">Форма обучения</label>
          <div class="chip-list">
            <button
              v-for="f in formOptions"
              :key="f"
              type="button"
              class="chip"
              :class="{ active: filters.forms.includes(f) }"
              @click="toggleMulti('forms', f)"
            >
              {{ f }}
            </button>
          </div>
        </div>

        <div class="filter-block">
          <label class="filter-label">Дополнительно</label>
          <div class="chip-list">
            <button
              type="button"
              class="chip"
              :class="{ active: filters.grants === true }"
              @click="filters.grants = filters.grants === true ? null : true"
            >
              Гранты
            </button>
            <button
              type="button"
              class="chip"
              :class="{ active: filters.dormitory === true }"
              @click="filters.dormitory = filters.dormitory === true ? null : true"
            >
              Общежитие
            </button>
          </div>
        </div>

        <button type="button" class="btn-reset" @click="resetFilters">
          <i class="bi bi-arrow-counterclockwise"></i>
          Сбросить все фильтры
        </button>
      </aside>

      <!-- ===== Main: map + list ===== -->
      <main class="main-panel">
        <div class="mobile-bar">
          <button type="button" class="btn-filters-mobile" @click="filtersOpen = true">
            <i class="bi bi-sliders"></i>
            Фильтры
            <span v-if="activeFilterCount" class="filter-count">{{ activeFilterCount }}</span>
          </button>
          <select v-model="sortBy" class="sort-select">
            <option value="rating">По рейтингу</option>
            <option value="score">По проходному баллу</option>
            <option value="cost">По стоимости</option>
            <option value="name">По названию</option>
          </select>
        </div>

        <section class="map-section" :class="{ 'is-city-mode': !!selectedMapCity }">
          <div class="map-hint" v-if="!selectedMapCity && !loading && !error">
            <i class="bi bi-geo-alt-fill"></i>
            <span>Кликните на область или город — откроется карта улиц</span>
          </div>
          <div class="map-selected-chip" v-if="selectedMapCity">
            <i class="bi bi-map"></i>
            <strong>{{ selectedMapCity }}</strong>
            <span class="map-mode-badge">улицы</span>
            <span class="map-selected-count">{{ cityUniCount(selectedMapCity) }} {{ collegeWord(cityUniCount(selectedMapCity)) }}</span>
            <button type="button" class="map-chip-clear" @click="clearMapCity" aria-label="Сбросить город">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
          <button
            v-if="selectedMapCity"
            type="button"
            class="map-back-kz"
            @click="clearMapCity"
          >
            <i class="bi bi-arrow-left"></i>
            Вся карта КЗ
          </button>
          <div ref="mapEl" class="map-canvas"></div>
          <div v-if="loading" class="map-overlay">
            <div class="spinner"></div>
            <span>Загружаем карту Казахстана…</span>
          </div>
          <div v-else-if="error" class="map-overlay error">
            <i class="bi bi-exclamation-triangle"></i>
            <span>{{ error }}</span>
            <button type="button" class="btn-retry" @click="fetchInstitutions">Повторить</button>
          </div>
        </section>

        <section class="list-section" id="college-list-section">
          <div class="list-toolbar desktop-only">
            <h2 class="list-title">
              <template v-if="selectedMapCity">Колледжи · {{ selectedMapCity }}</template>
              <template v-else>Список колледжей</template>
              <span v-if="selectedMapCity" class="list-count">{{ filteredList.length }}</span>
            </h2>
            <select v-model="sortBy" class="sort-select">
              <option value="rating">По рейтингу</option>
              <option value="score">По проходному баллу</option>
              <option value="cost">По стоимости</option>
              <option value="name">По названию</option>
            </select>
          </div>

          <div v-if="!loading && !error && !selectedMapCity" class="empty-state">
            <i class="bi bi-map"></i>
            <p>Выберите город на карте — ниже появится список колледжей этого города.</p>
          </div>

          <div v-else-if="!loading && !error && selectedMapCity && filteredList.length === 0" class="empty-state">
            <i class="bi bi-search"></i>
            <p>В городе «{{ selectedMapCity }}» колледжей по текущим фильтрам не найдено.</p>
            <button type="button" class="btn-primary" @click="resetFiltersKeepCity">Сбросить фильтры</button>
          </div>

          <div v-else-if="!loading && !error && filteredList.length" class="cards-grid">
            <article
              v-for="uni in pagedList"
              :key="uni.id"
              :id="`college-card-${uni.id}`"
              class="uni-card"
              :class="{
                highlighted: highlightedId === uni.id,
                selected: selectedId === uni.id,
              }"
              @mouseenter="onCardHover(uni)"
              @mouseleave="onCardLeave"
              @click="onCardClick(uni)"
            >
              <div class="card-logo-wrap">
                <img
                  :src="getImageUrl(uni.logo_url || uni.photo_url, fallbackLogo)"
                  :alt="uni.name"
                  class="card-logo"
                  @error="onImgError"
                />
              </div>

              <div class="card-body">
                <div class="card-top">
                  <h3 class="card-name">{{ uni.name }}</h3>
                  <div class="card-rating" :title="`${ratingText(uni)} из 5`">
                    <span
                      v-for="s in 5"
                      :key="s"
                      class="star"
                      :class="{ on: s <= Math.round(uni.reviews_avg_rating || 0) }"
                    >★</span>
                    <span class="rating-num">{{ ratingText(uni) }}</span>
                    <span class="reviews-count">({{ uni.reviews_count || 0 }})</span>
                  </div>
                </div>

                <p class="card-location">
                  <i class="bi bi-geo-alt-fill"></i>
                  {{ cityOf(uni) }}{{ regionOf(uni) ? ` · ${regionOf(uni)}` : '' }}
                </p>

                <div class="card-tags">
                  <span
                    v-for="tag in tagsOf(uni)"
                    :key="tag"
                    class="tag"
                  >{{ tag }}</span>
                  <span v-if="uni.ownershipLabel" class="tag tag-muted">{{ uni.ownershipLabel }}</span>
                </div>

                <div class="card-stats">
                  <div class="stat">
                    <span class="stat-k">Проходной балл</span>
                    <span class="stat-v">{{ uni.passScore }}</span>
                  </div>
                  <div class="stat">
                    <span class="stat-k">Стоимость / год</span>
                    <span class="stat-v">{{ formatMoney(uni.costMin) }}–{{ formatMoney(uni.costMax) }} ₸</span>
                  </div>
                </div>

                <div class="card-actions">
                  <button
                    v-if="!uni.isDemo"
                    type="button"
                    class="btn-primary"
                    @click.stop="$router.push(`/CollegeAbout/${uni.id}`)"
                  >
                    Подробнее
                  </button>
                  <button
                    v-else
                    type="button"
                    class="btn-primary is-demo"
                    disabled
                    title="Демо-запись"
                  >
                    Демо
                  </button>
                  <button
                    type="button"
                    class="btn-ghost"
                    :class="{ active: isInCompare(uni.id) }"
                    @click.stop="toggleCompare(uni)"
                  >
                    <i :class="isInCompare(uni.id) ? 'bi bi-check2' : 'bi bi-plus-lg'"></i>
                    {{ isInCompare(uni.id) ? 'В сравнении' : 'В сравнение' }}
                  </button>
                </div>
              </div>
            </article>
          </div>

          <div v-if="pageCount > 1" class="pagination">
            <button
              type="button"
              class="page-btn"
              :disabled="page <= 1"
              @click="page--"
            >
              <i class="bi bi-chevron-left"></i>
            </button>
            <button
              v-for="p in visiblePages"
              :key="p"
              type="button"
              class="page-btn"
              :class="{ active: page === p }"
              @click="page = p"
            >
              {{ p }}
            </button>
            <button
              type="button"
              class="page-btn"
              :disabled="page >= pageCount"
              @click="page++"
            >
              <i class="bi bi-chevron-right"></i>
            </button>
          </div>
        </section>
      </main>
    </div>

    <div v-if="filtersOpen" class="filters-backdrop" @click="filtersOpen = false"></div>

    <!-- Compare drawer -->
    <transition name="drawer">
      <div v-if="showCompare" class="compare-drawer">
        <div class="compare-head">
          <h3>Сравнение колледжей</h3>
          <button type="button" class="filters-close" @click="showCompare = false" aria-label="Закрыть">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div v-if="!compareList.length" class="empty-state compact">
          <p>Добавьте колледжи кнопкой «В сравнение»</p>
        </div>
        <div v-else class="compare-table-wrap">
          <table class="compare-table">
            <thead>
              <tr>
                <th>Параметр</th>
                <th v-for="u in compareList" :key="u.id">
                  <div class="cmp-name">{{ shortName(u.name) }}</div>
                  <button type="button" class="cmp-remove" @click="toggleCompare(u)">×</button>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Город</td>
                <td v-for="u in compareList" :key="'c'+u.id">{{ cityOf(u) }}</td>
              </tr>
              <tr>
                <td>Рейтинг</td>
                <td v-for="u in compareList" :key="'r'+u.id">{{ ratingText(u) }} ({{ u.reviews_count || 0 }})</td>
              </tr>
              <tr>
                <td>Проходной балл</td>
                <td v-for="u in compareList" :key="'s'+u.id">{{ u.passScore }}</td>
              </tr>
              <tr>
                <td>Стоимость</td>
                <td v-for="u in compareList" :key="'$'+u.id">{{ formatMoney(u.costMin) }}–{{ formatMoney(u.costMax) }} ₸</td>
              </tr>
              <tr>
                <td>Направление</td>
                <td v-for="u in compareList" :key="'d'+u.id">{{ u.directions || '—' }}</td>
              </tr>
              <tr>
                <td>Гранты / общежитие</td>
                <td v-for="u in compareList" :key="'g'+u.id">
                  {{ u.grants ? 'Гранты' : 'Без грантов' }} · {{ u.dormitory ? 'Общежитие' : 'Нет общежития' }}
                </td>
              </tr>
              <tr>
                <td></td>
                <td v-for="u in compareList" :key="'a'+u.id">
                  <button type="button" class="btn-primary sm" @click="$router.push(`/CollegeAbout/${u.id}`)">
                    Подробнее
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </transition>
    <div v-if="showCompare" class="filters-backdrop" @click="showCompare = false"></div>
  </div>
</template>

<script>
import axios from 'axios';
import { markRaw } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import UnLogo from '@/components/img/UnLogo.png';

const PER_PAGE = 9;
const COMPARE_KEY = 'torap_compare_colleges';

const OWNERSHIP = [
  { value: 'state', label: 'Государственные' },
  { value: 'private', label: 'Частные' },
  { value: 'research', label: 'При вузах' },
];

const DIRECTIONS = ['IT', 'Медицина', 'Гуманитарное', 'Техническое', 'Юриспруденция', 'Искусство'];
const FORMS = ['Очная', 'Заочная', 'Дистанционная'];

/** Границы Казахстана (примерно) — карта не уходит за пределы страны */
const KZ_SW = [40.95, 46.45];
const KZ_NE = [55.45, 87.35];

/**
 * Крупные города КЗ (пины на силуэте карты).
 * regionKeys — соответствие областям GADM NAME_1.
 */
const KZ_CITIES = [
  { name: 'Астана', lat: 51.1694, lng: 71.4491, regionKeys: ['Aqmola'] },
  { name: 'Алматы', lat: 43.238, lng: 76.945, regionKeys: ['Almaty'] },
  { name: 'Шымкент', lat: 42.3419, lng: 69.5901, regionKeys: ['SouthKazakhstan'] },
  { name: 'Караганда', lat: 49.8047, lng: 73.1094, regionKeys: ['Qaraghandy'] },
  { name: 'Актобе', lat: 50.2839, lng: 57.167, regionKeys: ['Aqtöbe', 'Aqtobe'] },
  { name: 'Атырау', lat: 47.1164, lng: 51.9203, regionKeys: ['Atyrau'] },
  { name: 'Павлодар', lat: 52.2873, lng: 76.9674, regionKeys: ['Pavlodar'] },
  { name: 'Усть-Каменогорск', lat: 49.9483, lng: 82.627, regionKeys: ['EastKazakhstan'] },
  { name: 'Семей', lat: 50.4111, lng: 80.2275, regionKeys: ['EastKazakhstan'] },
  { name: 'Костанай', lat: 53.2144, lng: 63.6246, regionKeys: ['Qostanay'] },
  { name: 'Петропавловск', lat: 54.8728, lng: 69.143, regionKeys: ['NorthKazakhstan'] },
  { name: 'Тараз', lat: 42.9, lng: 71.3667, regionKeys: ['Zhambyl'] },
  { name: 'Уральск', lat: 51.2333, lng: 51.3667, regionKeys: ['WestKazakhstan'] },
  { name: 'Кызылорда', lat: 44.8488, lng: 65.4823, regionKeys: ['Qyzylorda'] },
  { name: 'Актау', lat: 43.6532, lng: 51.1975, regionKeys: ['Mangghystau'] },
];

/** GADM NAME_1 → основной город для клика по области */
const REGION_TO_CITY = {
  Almaty: 'Алматы',
  Aqmola: 'Астана',
  Aqtöbe: 'Актобе',
  Aqtobe: 'Актобе',
  Atyrau: 'Атырау',
  EastKazakhstan: 'Усть-Каменогорск',
  Mangghystau: 'Актау',
  NorthKazakhstan: 'Петропавловск',
  Pavlodar: 'Павлодар',
  Qaraghandy: 'Караганда',
  Qostanay: 'Костанай',
  Qyzylorda: 'Кызылорда',
  SouthKazakhstan: 'Шымкент',
  WestKazakhstan: 'Уральск',
  Zhambyl: 'Тараз',
};

/** Демо-колледжи для городов без данных в API (примерная логика) */
const DEMO_BY_CITY = {
  Алматы: [
    { name: 'Алматинский колледж связи', directions: 'IT', ownership: 'state' },
    { name: 'Алматинский технологический колледж', directions: 'Техническое', ownership: 'state' },
    { name: 'Медицинский колледж «Авиценна»', directions: 'Медицина', ownership: 'private' },
    { name: 'Колледж при КазНУ', directions: 'Гуманитарное', ownership: 'research' },
  ],
  Шымкент: [
    { name: 'Шымкентский политехнический колледж', directions: 'Техническое', ownership: 'state' },
    { name: 'Южно-Казахстанский гуманитарный колледж', directions: 'Гуманитарное', ownership: 'private' },
  ],
  Караганда: [
    { name: 'Карагандинский технический колледж', directions: 'Техническое', ownership: 'state' },
    { name: 'Карагандинский медицинский колледж', directions: 'Медицина', ownership: 'state' },
  ],
  Актобе: [
    { name: 'Актюбинский медицинский колледж', directions: 'Медицина', ownership: 'state' },
    { name: 'Актюбинский колледж сервиса', directions: 'Гуманитарное', ownership: 'state' },
  ],
  Атырау: [
    { name: 'Атырауский нефтяной колледж', directions: 'Техническое', ownership: 'state' },
  ],
  Павлодар: [
    { name: 'Павлодарский IT-колледж', directions: 'IT', ownership: 'state' },
  ],
  'Усть-Каменогорск': [
    { name: 'Восточно-Казахстанский политехнический колледж', directions: 'Техническое', ownership: 'state' },
  ],
  Семей: [
    { name: 'Семейский педагогический колледж', directions: 'Гуманитарное', ownership: 'state' },
  ],
  Костанай: [
    { name: 'Костанайский колледж сферы услуг', directions: 'Гуманитарное', ownership: 'state' },
  ],
  Петропавловск: [
    { name: 'Северо-Казахстанский IT-колледж', directions: 'IT', ownership: 'state' },
  ],
  Тараз: [
    { name: 'Таразский технический колледж', directions: 'Техническое', ownership: 'state' },
  ],
  Уральск: [
    { name: 'Западно-Казахстанский колледж экономики', directions: 'Гуманитарное', ownership: 'state' },
  ],
  Кызылорда: [
    { name: 'Кызылординский цифровой колледж', directions: 'IT', ownership: 'state' },
  ],
  Актау: [
    { name: 'Каспийский морской колледж', directions: 'Техническое', ownership: 'state' },
  ],
};

export default {
  name: 'CollegesListPage',
  data() {
    return {
      loading: false,
      error: null,
      institutions: [],
      filtersOpen: false,
      showCompare: false,
      highlightedId: null,
      selectedId: null,
      selectedMapCity: null,
      sortBy: 'rating',
      page: 1,
      compareIds: this.loadCompareIds(),
      filters: this.defaultFilters(),
      costBounds: { min: 200000, max: 800000 },
      scoreBounds: { min: 3, max: 5 },
      ownershipOptions: OWNERSHIP,
      directionOptions: DIRECTIONS,
      formOptions: FORMS,
      fallbackLogo: UnLogo,
      // только флаги UI — Leaflet-объекты НЕ в data (Vue Proxy ломает latLngToLayerPoint)
      mapAlive: false,
      mapGeoReady: false,
      mapBusy: false,
      /** country = силуэт КЗ; city = уличная карта выбранного города */
      mapMode: 'country',
    };
  },
  created() {
    // Leaflet state вне реактивности Vue
    this.map = null;
    this.regionsLayer = null;
    this.citiesLayer = null;
    this.markersLayer = null;
    this.streetTiles = null;
    this.markersById = new Map();
    this.cityLayersByName = {};
    this.regionLayers = [];
    this.pinIcon = null;
    this.pinIconActive = null;
    this.pinIconCity = null;
    this.pinIconCityActive = null;
  },
  computed: {
    kzCityNames() {
      return KZ_CITIES.map((c) => c.name);
    },
    totalColleges() {
      return this.institutions.length;
    },
    totalCities() {
      return new Set(this.institutions.map((u) => this.cityOf(u))).size;
    },
    grantsCount() {
      return this.institutions.filter((u) => u.grants).length;
    },
    filteredList() {
      // Список показывается только после выбора города на карте
      if (!this.selectedMapCity) return [];
      let list = this.institutions.filter((u) => this.matchesFilters(u));
      list = this.sortList(list);
      return list;
    },
    /** Колледжи для маркеров: только в режиме города (на силуэте КЗ — лишь пины городов) */
    mapColleges() {
      if (!this.selectedMapCity) return [];
      return this.institutions.filter((u) => {
        if (!this.isValidCoords(u)) return false;
        if (this.cityOf(u) !== this.selectedMapCity) return false;
        return this.matchesFilters(u);
      });
    },
    pageCount() {
      return Math.max(1, Math.ceil(this.filteredList.length / PER_PAGE));
    },
    pagedList() {
      const start = (this.page - 1) * PER_PAGE;
      return this.filteredList.slice(start, start + PER_PAGE);
    },
    visiblePages() {
      const total = this.pageCount;
      const cur = this.page;
      const pages = [];
      let from = Math.max(1, cur - 2);
      let to = Math.min(total, cur + 2);
      if (to - from < 4) {
        if (from === 1) to = Math.min(total, from + 4);
        else from = Math.max(1, to - 4);
      }
      for (let i = from; i <= to; i++) pages.push(i);
      return pages;
    },
    compareList() {
      return this.compareIds
        .map((id) => this.institutions.find((u) => u.id === id))
        .filter(Boolean);
    },
    activeFilterCount() {
      let n = 0;
      if (this.filters.search) n++;
      if (this.selectedMapCity) n++;
      if (this.filters.ownership) n++;
      if (this.filters.directions.length) n++;
      if (this.filters.forms.length) n++;
      if (this.filters.grants === true) n++;
      if (this.filters.dormitory === true) n++;
      if (this.filters.costMax < this.costBounds.max) n++;
      if (this.filters.scoreMax < this.scoreBounds.max) n++;
      return n;
    },
  },
  watch: {
    filters: {
      deep: true,
      handler() {
        this.page = 1;
        this.$nextTick(() => {
          this.renderCityPins();
          this.syncRegionStyles();
          this.syncMarkers();
        });
      },
    },
    selectedMapCity() {
      this.page = 1;
      // вход/выход из режимов полностью в selectMapCity / clearMapCity / exitCityStreetMode
    },
    sortBy() {
      this.page = 1;
    },
    filteredList() {
      this.$nextTick(() => this.syncMarkers());
    },
    page() {
      const el = document.getElementById('college-list-section');
      if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
    },
  },
  mounted() {
    this.createPinIcons();
    this.initMap();
    this.fetchInstitutions();
    window.addEventListener('resize', this.invalidateMap);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.invalidateMap);
    this.destroyMap();
  },
  methods: {
    defaultFilters() {
      return {
        search: '',
        ownership: '',
        directions: [],
        forms: [],
        grants: null,
        dormitory: null,
        costMax: 800000,
        scoreMax: 5,
      };
    },
    loadCompareIds() {
      try {
        const raw = localStorage.getItem(COMPARE_KEY);
        const arr = raw ? JSON.parse(raw) : [];
        return Array.isArray(arr) ? arr.slice(0, 4) : [];
      } catch {
        return [];
      }
    },
    saveCompareIds() {
      localStorage.setItem(COMPARE_KEY, JSON.stringify(this.compareIds));
    },
    resetFilters() {
      this.filters = this.defaultFilters();
      this.selectedMapCity = null;
      this.selectedId = null;
      this.highlightedId = null;
      this.page = 1;
      this.$nextTick(() => {
        if (!this.mapAlive) return;
        this.exitCityStreetMode();
      });
    },
    resetFiltersKeepCity() {
      const city = this.selectedMapCity;
      this.filters = this.defaultFilters();
      this.selectedMapCity = city;
      this.page = 1;
    },
    clearMapCity() {
      this.selectedMapCity = null;
      this.selectedId = null;
      this.highlightedId = null;
      this.$nextTick(() => {
        if (!this.mapAlive) return;
        this.exitCityStreetMode();
      });
    },
    selectMapCity(cityName, { fly = true, scrollList = true } = {}) {
      this.selectedMapCity = cityName;
      this.selectedId = null;
      this.highlightedId = null;
      this.page = 1;

      if (fly && this.map) {
        this.$nextTick(() => {
          if (!this.mapAlive) return;
          // переключаемся на уличную карту города + пины колледжей
          this.enterCityStreetMode(cityName);
        });
      }
      if (scrollList) {
        this.$nextTick(() => {
          const el = document.getElementById('college-list-section');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
    },
    /**
     * Режим города: OSM-улицы, зум на весь город, все колледжи на карте.
     */
    enterCityStreetMode(cityName) {
      if (!this.mapAlive || !this.map) return;
      try {
        this.mapBusy = true;
        this.map.stop();
        this.map.closePopup();
        this.mapMode = 'city';

        // 1) Уличные тайлы
        if (!this.streetTiles) {
          this.streetTiles = markRaw(
            L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
              attribution: '© OpenStreetMap, © CARTO',
              maxZoom: 19,
              minZoom: 9,
            })
          );
        }
        if (!this.map.hasLayer(this.streetTiles)) {
          this.streetTiles.addTo(this.map);
          // тайлы под регионами/маркерами
          this.streetTiles.bringToBack();
        }

        // 2) Силуэт областей КЗ скрываем — мешает читать улицы
        if (this.regionsLayer && this.map.hasLayer(this.regionsLayer)) {
          this.map.removeLayer(this.regionsLayer);
        }
        if (this.citiesLayer) this.citiesLayer.clearLayers();

        // 3) Границы и zoom для города (можно гулять по улицам)
        const city = KZ_CITIES.find((c) => c.name === cityName);
        const cityBounds = this.getCityBounds(cityName);
        this.map.setMinZoom(10);
        this.map.setMaxZoom(18);
        if (cityBounds) {
          this.map.setMaxBounds(cityBounds.pad(0.6));
        } else {
          this.map.setMaxBounds(null);
        }

        // 4) Кадр на весь город / колледжи
        this.fitCityView(cityName, city);

        // 5) Пины колледжей
        this.syncMarkers();
      } catch (e) {
        console.warn('enterCityStreetMode', e);
      } finally {
        this.mapBusy = false;
        this.$nextTick(() => {
          if (this.mapAlive && this.map) this.map.invalidateSize();
        });
      }
    },
    /** Назад к силуэту Казахстана (полный кадр страны) */
    exitCityStreetMode() {
      if (!this.mapAlive || !this.map) return;
      try {
        this.mapBusy = true;
        this.map.stop();
        this.map.closePopup();
        this.mapMode = 'country';

        // 1) убрать уличные тайлы
        if (this.streetTiles && this.map.hasLayer(this.streetTiles)) {
          this.map.removeLayer(this.streetTiles);
        }

        // 2) СНАЧАЛА снять maxBounds города — иначе fitBounds на КЗ не сработает
        this.map.setMaxBounds(null);
        this.map.setMinZoom(4);
        this.map.setMaxZoom(14);

        // 3) вернуть слой областей (силуэт)
        if (this.regionsLayer) {
          if (!this.map.hasLayer(this.regionsLayer)) {
            this.regionsLayer.addTo(this.map);
          }
          // слой областей снизу, маркеры сверху
          try {
            this.regionsLayer.bringToBack();
          } catch (_) {
            /* ignore */
          }
        }

        // 4) убрать пины колледжей города + нарисовать пины городов
        this.syncMarkers(); // selectedMapCity=null → пусто
        this.renderCityPins();
        this.syncRegionStyles();

        // 5) кадр на весь Казахстан
        this.fitKazakhstan();

        // 6) снова ограничить pan границами КЗ (после fit)
        const kzBounds = L.latLngBounds(KZ_SW, KZ_NE);
        this.map.setMinZoom(4.5);
        this.map.setMaxBounds(kzBounds.pad(0.08));
        this.map.setMaxBoundsViscosity(1.0);
      } catch (e) {
        console.warn('exitCityStreetMode', e);
      } finally {
        this.mapBusy = false;
        this.$nextTick(() => {
          if (!this.mapAlive || !this.map) return;
          // повторный fit — на случай если invalidateSize/layout сдвинул view
          this.fitKazakhstan();
          this.map.invalidateSize();
        });
      }
    },
    /** Bounds города по колледжам + запас, либо вокруг центра */
    getCityBounds(cityName) {
      const unis = this.institutions.filter(
        (u) => this.cityOf(u) === cityName && this.isValidCoords(u)
      );
      if (unis.length >= 2) {
        return L.latLngBounds(
          unis.map((u) => [parseFloat(u.latitude), parseFloat(u.longitude)])
        );
      }
      const city = KZ_CITIES.find((c) => c.name === cityName);
      if (!city) return null;
      // ~8–10 км вокруг центра — видно весь город
      const d = 0.08;
      return L.latLngBounds(
        [city.lat - d, city.lng - d],
        [city.lat + d, city.lng + d]
      );
    },
    fitCityView(cityName, cityMeta) {
      if (!this.mapAlive || !this.map) return;
      const unis = this.institutions.filter(
        (u) => this.cityOf(u) === cityName && this.isValidCoords(u)
      );

      if (unis.length >= 2) {
        const bounds = L.latLngBounds(
          unis.map((u) => [parseFloat(u.latitude), parseFloat(u.longitude)])
        );
        // pad побольше — «весь город» + улицы вокруг кампусов
        this.map.fitBounds(bounds.pad(0.85), {
          animate: false,
          maxZoom: 13,
          padding: [40, 40],
        });
        return;
      }

      if (unis.length === 1) {
        this.map.setView(
          [parseFloat(unis[0].latitude), parseFloat(unis[0].longitude)],
          13,
          { animate: false }
        );
        return;
      }

      const city = cityMeta || KZ_CITIES.find((c) => c.name === cityName);
      if (city) {
        // обзорный зум города со всеми улицами
        this.map.setView([city.lat, city.lng], 12, { animate: false });
      }
    },
    destroyMap() {
      this.mapAlive = false;
      this.mapMode = 'country';
      if (!this.map) return;
      const map = this.map;
      this.map = null;
      try {
        map.stop();
        map.scrollWheelZoom?.disable();
        map.dragging?.disable();
        map.doubleClickZoom?.disable();
        map.boxZoom?.disable();
        map.keyboard?.disable();
        map.closePopup();
        this.markersLayer?.clearLayers();
        this.citiesLayer?.clearLayers();
        this.regionsLayer?.clearLayers();
        if (this.streetTiles) {
          try {
            map.removeLayer(this.streetTiles);
          } catch (_) {
            /* ignore */
          }
        }
        this.markersById.clear();
        this.cityLayersByName = {};
        this.regionLayers = [];
        map.eachLayer((layer) => {
          try {
            map.removeLayer(layer);
          } catch (_) {
            /* ignore */
          }
        });
        map.off();
        map.remove();
      } catch (e) {
        // ignore teardown races
      }
      this.markersLayer = null;
      this.citiesLayer = null;
      this.regionsLayer = null;
      this.streetTiles = null;
      this.mapGeoReady = false;
    },
    cityUniCount(cityName) {
      return this.institutions.filter((u) => this.cityOf(u) === cityName).length;
    },
    toggleMulti(key, value) {
      const arr = this.filters[key];
      const i = arr.indexOf(value);
      if (i >= 0) arr.splice(i, 1);
      else arr.push(value);
    },
    matchesFilters(u, { ignoreCity = false } = {}) {
      const f = this.filters;
      // Город с карты — основной фильтр списка (можно отключить для обзора маркеров)
      if (!ignoreCity && this.selectedMapCity && this.cityOf(u) !== this.selectedMapCity) {
        return false;
      }

      if (f.search) {
        const q = f.search.toLowerCase().trim();
        if (!u.name.toLowerCase().includes(q) && !(u.location || '').toLowerCase().includes(q)) {
          return false;
        }
      }
      if (f.ownership && u.ownership !== f.ownership) return false;
      if (f.directions.length) {
        const dir = (u.directions || '').toLowerCase();
        const tags = this.tagsOf(u).map((t) => t.toLowerCase());
        const ok = f.directions.some(
          (d) => dir.includes(d.toLowerCase()) || tags.includes(d.toLowerCase())
        );
        if (!ok) return false;
      }
      if (f.forms.length) {
        if (!f.forms.some((form) => (u.forms || []).includes(form))) return false;
      }
      if (f.grants === true && !u.grants) return false;
      if (f.dormitory === true && !u.dormitory) return false;
      if (u.costMin > f.costMax) return false;
      if (u.passScore > f.scoreMax) return false;
      return true;
    },
    sortList(list) {
      const arr = [...list];
      switch (this.sortBy) {
        case 'score':
          return arr.sort((a, b) => a.passScore - b.passScore);
        case 'cost':
          return arr.sort((a, b) => a.costMin - b.costMin);
        case 'name':
          return arr.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
        case 'rating':
        default:
          return arr.sort(
            (a, b) => (b.reviews_avg_rating || 0) - (a.reviews_avg_rating || 0)
          );
      }
    },
    enrichCollege(raw) {
      const id = raw.id || 0;
      const seed = id * 37 + (raw.name || '').length;
      const ownership = this.classifyOwnership(raw.name);
      // Для колледжей — типичный диапазон проходного балла аттестата
      const passScore = 3.0 + ((seed % 20) / 10);
      const costMin = 240000 + (seed % 10) * 30000;
      const costMax = costMin + 80000 + (seed % 6) * 40000;
      const forms = ['Очная'];
      if (seed % 3 === 0) forms.push('Заочная');
      if (seed % 5 === 0) forms.push('Дистанционная');

      // cost from college / university specialty pivots if present
      let realMin = null;
      let realMax = null;
      const specs =
        raw.college_specializations ||
        raw.collegeSpecializations ||
        raw.specializations ||
        [];
      specs.forEach((s) => {
        const c = s.pivot?.cost ?? s.cost;
        if (c != null && !Number.isNaN(Number(c))) {
          const n = Number(c);
          realMin = realMin == null ? n : Math.min(realMin, n);
          realMax = realMax == null ? n : Math.max(realMax, n);
        }
      });

      return {
        ...raw,
        ownership,
        ownershipLabel: OWNERSHIP.find((o) => o.value === ownership)?.label || '',
        passScore: Math.round(passScore * 10) / 10,
        costMin: realMin != null ? realMin : costMin,
        costMax: realMax != null ? realMax : costMax,
        forms,
        specialtyTags: this.extractTags(raw),
      };
    },
    classifyOwnership(name = '') {
      const n = name.toLowerCase();
      if (
        n.includes('при ') ||
        n.includes('aitu') ||
        n.includes('айти') ||
        n.includes('ену') ||
        n.includes('enu') ||
        n.includes('нур-мубарак') ||
        n.includes('назарбаев') ||
        n.includes('национальн')
      ) {
        return 'research';
      }
      if (
        n.includes('международн') ||
        n.includes('international') ||
        n.includes('urban') ||
        n.includes('частн') ||
        n.includes('private')
      ) {
        return 'private';
      }
      return 'state';
    },
    extractTags(raw) {
      const tags = [];
      if (raw.directions) {
        raw.directions.split(/[,;]/).forEach((t) => {
          const v = t.trim();
          if (v) tags.push(v);
        });
      }
      const specs =
        raw.college_specializations ||
        raw.collegeSpecializations ||
        raw.specializations ||
        [];
      specs.slice(0, 4).forEach((s) => {
        if (s.name && !tags.includes(s.name)) tags.push(s.name);
      });
      return tags.slice(0, 4);
    },
    tagsOf(u) {
      return (u.specialtyTags && u.specialtyTags.length
        ? u.specialtyTags
        : u.directions
          ? [u.directions]
          : []
      ).slice(0, 4);
    },
    cityOf(u) {
      if (!u.location) return 'Казахстан';
      return u.location.split(',')[0].trim();
    },
    regionOf(u) {
      if (!u.location) return '';
      const parts = u.location.split(',').map((p) => p.trim());
      return parts[1] || '';
    },
    shortName(name) {
      if (!name) return '';
      return name.length > 36 ? `${name.slice(0, 34)}…` : name;
    },
    ratingText(u) {
      const r = u.reviews_avg_rating;
      if (r == null || Number.isNaN(Number(r))) return '—';
      return Number(r).toFixed(1);
    },
    formatMoney(n) {
      if (n == null) return '—';
      return Math.round(n).toLocaleString('ru-RU');
    },
    cityWordRu(n) {
      const m10 = n % 10;
      const m100 = n % 100;
      if (m100 >= 11 && m100 <= 14) return 'городов';
      if (m10 === 1) return 'город';
      if (m10 >= 2 && m10 <= 4) return 'города';
      return 'городов';
    },
    collegeWord(n) {
      const m10 = n % 10;
      const m100 = n % 100;
      if (m100 >= 11 && m100 <= 14) return 'колледжей';
      if (m10 === 1) return 'колледж';
      if (m10 >= 2 && m10 <= 4) return 'колледжа';
      return 'колледжей';
    },
    getImageUrl(url, fallback) {
      if (!url) return fallback;
      if (url.startsWith('http') || url.startsWith('data:')) return url;
      const base = 'http://localhost:8000';
      if (url.startsWith('/')) return `${base}${url}`;
      return `${base}/storage/${url}`;
    },
    onImgError(e) {
      e.target.src = this.fallbackLogo;
    },
    isInCompare(id) {
      return this.compareIds.includes(id);
    },
    toggleCompare(uni) {
      const i = this.compareIds.indexOf(uni.id);
      if (i >= 0) {
        this.compareIds.splice(i, 1);
      } else {
        if (this.compareIds.length >= 4) {
          this.compareIds.shift();
        }
        this.compareIds.push(uni.id);
      }
      this.saveCompareIds();
    },
    async fetchInstitutions() {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await axios.get('http://localhost:8000/api/institutions');
        const list = data.data || data || [];
        const real = list
          .filter((i) => i.type && i.type.toLowerCase() === 'college')
          .map((i) => this.enrichCollege(i));

        // Нормализуем «Нур-Султан» → «Астана» и т.п.
        real.forEach((u) => {
          u.location = this.normalizeLocation(u.location);
        });

        // Демо-колледжи по другим городам (примерная логика, пока в API мало городов)
        const demo = this.buildDemoColleges(real);
        this.institutions = [...real, ...demo];

        if (this.institutions.length) {
          const costs = this.institutions.flatMap((u) => [u.costMin, u.costMax]);
          const scores = this.institutions.map((u) => u.passScore);
          this.costBounds = {
            min: Math.min(...costs),
            max: Math.max(...costs),
          };
          this.scoreBounds = {
            min: Math.min(...scores),
            max: Math.max(...scores),
          };
          this.filters.costMax = this.costBounds.max;
          this.filters.scoreMax = this.scoreBounds.max;
        }

        this.$nextTick(async () => {
          if (!this.mapAlive) return;
          await this.ensureMapGeometry();
          if (!this.mapAlive) return;
          this.renderCityPins();
          this.syncRegionStyles();
          this.syncMarkers();
          this.fitKazakhstan();
        });
      } catch (e) {
        console.error(e);
        this.error = 'Не удалось загрузить колледжи. Проверьте, что API запущен.';
      } finally {
        this.loading = false;
      }
    },
    normalizeLocation(location) {
      if (!location) return 'Астана, Казахстан';
      let loc = String(location);
      loc = loc.replace(/Нур-?Султан/gi, 'Астана');
      loc = loc.replace(/Nur-?Sultan/gi, 'Astana');
      return loc;
    },
    buildDemoColleges(existing) {
      const existingCities = new Set(existing.map((u) => this.cityOf(u)));
      const demo = [];
      let demoId = 90000;

      Object.entries(DEMO_BY_CITY).forEach(([cityName, unis]) => {
        // Не дублируем, если в API уже есть колледжи этого города
        if (existingCities.has(cityName)) return;
        const cityMeta = KZ_CITIES.find((c) => c.name === cityName);
        if (!cityMeta) return;

        unis.forEach((item, idx) => {
          demoId += 1;
          const jitterLat = (idx - 1) * 0.04;
          const jitterLng = (idx % 2 === 0 ? 1 : -1) * 0.05;
          // раскидываем демо-пины вокруг центра города (≈1–3 км)
          const angle = (idx / Math.max(unis.length, 1)) * Math.PI * 2;
          const dist = 0.02 + (idx % 3) * 0.012;
          const raw = {
            id: demoId,
            name: item.name,
            location: `${cityName}, Казахстан`,
            latitude: cityMeta.lat + Math.cos(angle) * dist + jitterLat * 0.1,
            longitude: cityMeta.lng + Math.sin(angle) * dist + jitterLng * 0.1,
            directions: item.directions,
            type: 'college',
            grants: idx % 2 === 0,
            dormitory: idx % 3 !== 0,
            reviews_avg_rating: 3.5 + (idx % 3) * 0.4,
            reviews_count: 8 + idx * 5,
            logo_url: null,
            photo_url: null,
            isDemo: true,
          };
          const enriched = this.enrichCollege(raw);
          if (item.ownership) {
            enriched.ownership = item.ownership;
            enriched.ownershipLabel =
              OWNERSHIP.find((o) => o.value === item.ownership)?.label || '';
          }
          demo.push(enriched);
        });
      });
      return demo;
    },
    createPinIcons() {
      const make = (color, scale = 1, extraClass = '') =>
        markRaw(
          L.divIcon({
            className: `torap-pin ${extraClass}`,
            html: `<div class="pin-dot" style="--pin:${color};transform:scale(${scale})"><span></span></div>`,
            iconSize: [28, 36],
            iconAnchor: [14, 34],
            popupAnchor: [0, -30],
          })
        );
      this.pinIcon = make('#1795c0', 0.95);
      this.pinIconActive = make('#0b1f2a', 1.15);
      this.pinIconCity = make('#d4af37', 1.05, 'is-city');
      this.pinIconCityActive = make('#b08d4f', 1.25, 'is-city is-active');
    },
    initMap() {
      if (!this.$refs.mapEl || this.map) return;

      const bounds = L.latLngBounds(KZ_SW, KZ_NE);

      // markRaw: критично для Vue 3 — иначе Proxy ломает Leaflet при zoom/wheel
      this.map = markRaw(
        L.map(this.$refs.mapEl, {
          zoomControl: true,
          scrollWheelZoom: true,
          attributionControl: false,
          maxBounds: bounds.pad(0.08),
          maxBoundsViscosity: 1.0,
          minZoom: 4.5,
          maxZoom: 14,
          zoomSnap: 0.25,
          zoomAnimation: false,
          markerZoomAnimation: false,
          fadeAnimation: false,
        })
      );
      this.mapAlive = true;

      this.regionsLayer = markRaw(L.layerGroup().addTo(this.map));
      this.citiesLayer = markRaw(L.layerGroup().addTo(this.map));
      this.markersLayer = markRaw(L.layerGroup().addTo(this.map));

      // не пересоздавать маркеры во время жеста zoom
      this.map.on('zoomstart movestart', () => {
        this.mapBusy = true;
      });
      this.map.on('zoomend moveend', () => {
        this.mapBusy = false;
      });

      this.ensureMapGeometry().then(() => {
        if (!this.mapAlive) return;
        this.renderCityPins();
        this.syncRegionStyles();
        this.fitKazakhstan();
      });

      setTimeout(() => {
        if (this.mapAlive && this.map) this.map.invalidateSize();
      }, 120);
    },
    async ensureMapGeometry() {
      if (!this.mapAlive || !this.map || this.mapGeoReady) return;
      try {
        const res = await fetch('/kz-regions.geojson');
        if (!res.ok) throw new Error(`regions ${res.status}`);
        const geo = await res.json();

        this.regionLayers = [];
        this.regionsLayer.clearLayers();

        const layer = markRaw(
          L.geoJSON(geo, {
            style: () => this.regionStyle(false),
            onEachFeature: (feature, lyr) => {
              markRaw(lyr);
              const name = feature.properties?.NAME_1 || '';
              lyr._regionName = name;
              lyr.on('click', (e) => {
                L.DomEvent.stopPropagation(e);
                const city = REGION_TO_CITY[name];
                if (city) this.selectMapCity(city);
              });
              lyr.on('mouseover', () => {
                if (this.selectedRegionName() !== name) {
                  lyr.setStyle(this.regionStyle(false, true));
                }
                if (lyr._path) lyr._path.style.cursor = 'pointer';
              });
              lyr.on('mouseout', () => this.syncRegionStyles());
              this.regionLayers.push(lyr);
            },
          })
        );

        layer.addTo(this.regionsLayer);
        this.mapGeoReady = true;
      } catch (e) {
        console.error('KZ geometry load failed', e);
        try {
          const res = await fetch('/kz-country.geojson');
          const geo = await res.json();
          markRaw(
            L.geoJSON(geo, {
              style: {
                color: '#ffffff',
                weight: 2,
                fillColor: '#1795c0',
                fillOpacity: 0.85,
              },
            })
          ).addTo(this.regionsLayer);
          this.mapGeoReady = true;
        } catch (e2) {
          console.error(e2);
        }
      }
    },
    regionStyle(active, hover = false) {
      if (active) {
        return {
          color: '#ffffff',
          weight: 1.5,
          fillColor: '#0e6a8c',
          fillOpacity: 0.95,
          opacity: 1,
        };
      }
      if (hover) {
        return {
          color: '#ffffff',
          weight: 1.2,
          fillColor: '#3fb0d8',
          fillOpacity: 0.92,
          opacity: 1,
        };
      }
      // фирменный голубой силуэт + белые границы областей
      return {
        color: '#ffffff',
        weight: 1.1,
        fillColor: '#1795c0',
        fillOpacity: 0.88,
        opacity: 1,
      };
    },
    selectedRegionName() {
      if (!this.selectedMapCity) return null;
      const city = KZ_CITIES.find((c) => c.name === this.selectedMapCity);
      return city?.regionKeys?.[0] || null;
    },
    syncRegionStyles() {
      const activeRegion = this.selectedRegionName();
      this.regionLayers.forEach((lyr) => {
        const active = activeRegion && lyr._regionName === activeRegion;
        lyr.setStyle(this.regionStyle(!!active));
        if (active) lyr.bringToFront();
      });
    },
    fitKazakhstan() {
      if (!this.mapAlive || !this.map) return;
      try {
        this.map.stop();
        // на время fit снимаем maxBounds, иначе Leaflet «держит» старый городской кадр
        const prevMax = this.map.options.maxBounds;
        this.map.setMaxBounds(null);

        let bounds = L.latLngBounds(KZ_SW, KZ_NE);
        if (this.regionLayers.length) {
          try {
            const group = L.featureGroup(this.regionLayers);
            const b = group.getBounds();
            if (b && b.isValid()) bounds = b;
          } catch (_) {
            /* use default KZ box */
          }
        }

        this.map.fitBounds(bounds, {
          padding: [32, 32],
          maxZoom: 6,
          animate: false,
        });

        // вернуть ограничение КЗ
        this.map.setMaxBounds(L.latLngBounds(KZ_SW, KZ_NE).pad(0.08));
        this.map.setMaxBoundsViscosity(1.0);
        // prevMax unused — always KZ in country mode
        void prevMax;
      } catch (e) {
        /* map may be gone */
      }
    },
    invalidateMap() {
      if (this.mapAlive && this.map) {
        try {
          this.map.invalidateSize();
        } catch (e) {
          /* ignore */
        }
      }
    },
    renderCityPins() {
      if (!this.mapAlive || !this.map || !this.citiesLayer) return;
      if (this.mapBusy) {
        // карта в полёте (fitKazakhstan) — не теряем вызов, пробуем после анимации
        clearTimeout(this._pinsRetry);
        this._pinsRetry = setTimeout(() => this.renderCityPins(), 250);
        return;
      }
      try {
        this.citiesLayer.clearLayers();
      } catch (e) {
        return;
      }
      this.cityLayersByName = {};

      // Когда город выбран — только маркеры колледжей
      if (this.selectedMapCity) return;

      KZ_CITIES.forEach((city) => {
        const count = this.cityUniCount(city.name);
        if (!count) return;

        // один DivIcon: пин + подпись (без Leaflet Tooltip — они падают на wheel zoom)
        const pin = markRaw(
          L.marker([city.lat, city.lng], {
            icon: markRaw(
              L.divIcon({
                className: 'city-label-wrap',
                html: `<div class="city-pin-label">
                  <div class="pin-dot city-pin" style="--pin:#d4af37"><span></span></div>
                  <div class="city-label">
                    <span class="city-label-name">${city.name}</span>
                    <span class="city-label-count">${count}</span>
                  </div>
                </div>`,
                iconSize: [120, 48],
                iconAnchor: [14, 36],
              })
            ),
            riseOnHover: true,
            keyboard: false,
            zIndexOffset: 400,
          })
        );

        pin.on('click', (e) => {
          L.DomEvent.stopPropagation(e);
          this.selectMapCity(city.name);
        });

        pin.addTo(this.citiesLayer);
        this.cityLayersByName[city.name] = { pin };
      });
    },
    syncCityStyles() {
      this.renderCityPins();
      this.syncRegionStyles();
    },
    isValidCoords(u) {
      const lat = parseFloat(u.latitude);
      const lng = parseFloat(u.longitude);
      if (Number.isNaN(lat) || Number.isNaN(lng)) return false;
      if (lat === 0 && lng === 0) return false;
      if (lat < 40 || lat > 56 || lng < 46 || lng > 88) return false;
      return true;
    },
    syncMarkers() {
      if (!this.mapAlive || !this.map || !this.markersLayer) return;
      if (this.mapBusy) return;
      try {
        this.map.stop();
        this.map.closePopup();
        this.markersLayer.clearLayers();
      } catch (e) {
        return;
      }
      this.markersById.clear();

      const list = this.mapColleges;
      const overview = !this.selectedMapCity;

      list.forEach((u) => {
        if (!this.mapAlive) return;
        const lat = parseFloat(u.latitude);
        const lng = parseFloat(u.longitude);
        const active = this.highlightedId === u.id || this.selectedId === u.id;

        const icon = active
          ? this.pinIconActive
          : overview
            ? this.pinIconCity
            : this.pinIcon;

        // markRaw — Leaflet marker нельзя держать в Vue Proxy
        const marker = markRaw(
          L.marker([lat, lng], {
            icon,
            riseOnHover: true,
            keyboard: false,
            zIndexOffset: active ? 700 : overview ? 350 : 500,
          })
        );

        // только popup по клику — без bindTooltip (источник latLngToLayerPoint null)
        marker.bindPopup(this.popupHtml(u), {
          maxWidth: 280,
          className: 'torap-popup',
          autoPan: false,
        });

        marker.on('click', () => {
          if (!this.mapAlive) return;
          const city = this.cityOf(u);
          if (!this.selectedMapCity || this.selectedMapCity !== city) {
            this.selectMapCity(city, { fly: true, scrollList: true });
            this.$nextTick(() => {
              if (!this.mapAlive) return;
              this.selectedId = u.id;
              this.highlightedId = u.id;
              this.scrollToCard(u.id);
              this.syncMarkerStyles();
              try {
                marker.openPopup();
              } catch (e) {
                /* ignore */
              }
            });
            return;
          }
          this.selectedId = u.id;
          this.highlightedId = u.id;
          this.scrollToCard(u.id);
          this.syncMarkerStyles();
          try {
            marker.openPopup();
          } catch (e) {
            /* ignore */
          }
        });

        marker.addTo(this.markersLayer);
        this.markersById.set(u.id, marker);
      });
    },
    syncMarkerStyles() {
      if (!this.mapAlive || this.mapBusy) return;
      const overview = !this.selectedMapCity;
      this.markersById.forEach((marker, id) => {
        try {
          if (!marker || !marker._map) return;
          const active = this.highlightedId === id || this.selectedId === id;
          if (active) marker.setIcon(this.pinIconActive);
          else marker.setIcon(overview ? this.pinIconCity : this.pinIcon);
        } catch (e) {
          /* marker may be detached */
        }
      });
    },
    popupHtml(u) {
      const img = this.getImageUrl(u.logo_url || u.photo_url, this.fallbackLogo);
      const demoBadge = u.isDemo ? '<span class="popup-demo">демо</span>' : '';
      const link = u.isDemo
        ? '<span class="popup-meta">Демо-запись · страница скоро</span>'
        : `<a href="/CollegeAbout/${u.id}" class="popup-link">Подробнее →</a>`;
      return `
        <div class="popup-inner">
          <img src="${img}" alt="" class="popup-logo" onerror="this.style.display='none'"/>
          <div>
            <strong>${u.name}</strong> ${demoBadge}
            <div class="popup-meta">${this.cityOf(u)} · проходной ${u.passScore}</div>
            ${link}
          </div>
        </div>
      `;
    },
    onCardHover(u) {
      if (this.mapBusy) return;
      this.highlightedId = u.id;
      this.syncMarkerStyles();
    },
    onCardLeave() {
      if (this.mapBusy) return;
      if (!this.selectedId) this.highlightedId = null;
      else this.highlightedId = this.selectedId;
      this.syncMarkerStyles();
    },
    onCardClick(u) {
      this.selectedId = u.id;
      this.highlightedId = u.id;
      this.syncMarkerStyles();
      if (this.isValidCoords(u) && this.mapAlive && this.map) {
        try {
          const lat = parseFloat(u.latitude);
          const lng = parseFloat(u.longitude);
          this.map.stop();
          this.map.setView([lat, lng], Math.max(this.map.getZoom(), 13), { animate: false });
          const marker = this.markersById.get(u.id);
          if (marker) {
            marker.openPopup();
            marker.setZIndexOffset(800);
          }
        } catch (e) {
          /* ignore */
        }
      }
    },
    scrollToCard(id) {
      const idx = this.filteredList.findIndex((u) => u.id === id);
      if (idx >= 0) {
        this.page = Math.floor(idx / PER_PAGE) + 1;
      }
      this.$nextTick(() => {
        const el = document.getElementById(`college-card-${id}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    },
  },
};
</script>

<style scoped>
.uni-page {
  --blue: var(--torap-blue, #1795c0);
  --blue-dark: var(--torap-blue-dark, #12799c);
  --gold: var(--torap-gold, #b08d4f);
  --navy: #0b1f2a;
  --text: #10222e;
  --muted: #64748b;
  --border: #e6edf2;
  --bg: #f4f7f9;
  --white: #ffffff;
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  width: 100%;
}

/* ===== Hero ===== */
.page-hero {
  position: relative;
  overflow: hidden;
  background: #0b1f2a;
  color: #fff;
  /* верхний отступ учитывает прозрачный навбар, «плывущий» поверх блока */
  padding: 96px 24px 22px;
}

/* Волнистые линии в фирменных голубом и золотом, растворяются к правому краю */
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

/* Мягкие цветовые пятна */
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

.page-hero-inner {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px 48px;
  flex-wrap: wrap;
}

.hero-copy {
  flex: 1 1 280px;
  min-width: 0;
}

.page-hero h1 {
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  font-weight: 800;
  margin: 0 0 10px;
  line-height: 1.15;
  color: #fff;
}

/* Ключевое слово — золотое, с «мазком» под ним */
.hero-accent {
  position: relative;
  color: #d4af37;
  white-space: nowrap;
}

.hero-accent::after {
  content: '';
  position: absolute;
  left: 2%;
  right: 2%;
  bottom: -0.18em;
  height: 0.22em;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 10' preserveAspectRatio='none'%3E%3Cpath d='M2 8 Q 60 -2 118 6' fill='none' stroke='%23b08d4f' stroke-width='3' stroke-linecap='round' opacity='0.75'/%3E%3C/svg%3E") no-repeat center / 100% 100%;
}

.page-sub {
  margin: 0;
  color: rgba(255, 255, 255, 0.72);
  font-size: 1.05rem;
  max-width: 560px;
  line-height: 1.5;
}

/* Живые цифры каталога — справа от заголовка */
.hero-facts {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 20px;
  margin-top: 0;
  flex: 0 0 auto;
}

.hero-fact {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.hero-fact-value {
  font-family: var(--torap-font-display, inherit);
  font-size: 1.7rem;
  font-weight: 800;
  line-height: 1.1;
  color: #d4af37;
  font-variant-numeric: tabular-nums;
}

.hero-fact-label {
  margin-top: 3px;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  white-space: nowrap;
}

.hero-fact-divider {
  width: 1px;
  height: 36px;
  background: rgba(255, 255, 255, 0.16);
  flex-shrink: 0;
}

/* Счётчик в заголовке списка */
.list-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 26px;
  height: 26px;
  padding: 0 9px;
  border-radius: 999px;
  background: rgba(23, 149, 192, 0.12);
  color: var(--blue-dark);
  font-size: 0.85rem;
  font-weight: 700;
  margin-left: 10px;
  vertical-align: 3px;
}

/* Плавающая кнопка сравнения */
.compare-fab {
  position: fixed;
  right: 22px;
  bottom: 22px;
  z-index: 900;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 13px 20px;
  border: none;
  border-radius: 999px;
  background: linear-gradient(135deg, #d4af37, var(--gold));
  color: #10222e;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  box-shadow: 0 12px 30px rgba(176, 141, 79, 0.45);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.compare-fab:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 36px rgba(176, 141, 79, 0.55);
}

.fab-pop-enter-active,
.fab-pop-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fab-pop-enter-from,
.fab-pop-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.9);
}

/* ===== Layout ===== */
.page-layout {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px 20px 48px;
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 20px;
  align-items: start;
}

.filters-sidebar {
  position: sticky;
  top: 88px;
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 18px 16px 20px;
  max-height: calc(100vh - 110px);
  overflow-y: auto;
  box-shadow: 0 8px 24px rgba(16, 34, 46, 0.04);
}

.filters-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.filters-head h2 {
  font-size: 1.1rem;
  font-weight: 800;
  margin: 0;
}

.filters-close {
  display: none;
  background: transparent;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  cursor: pointer;
  color: var(--text);
}

.filter-block {
  margin-bottom: 18px;
}

.filter-label {
  display: block;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 8px;
}

.filter-label-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
}

.filter-label-row .filter-label {
  margin-bottom: 0;
}

.range-value {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--blue);
  white-space: nowrap;
}

.search-field {
  position: relative;
}

.search-field i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--muted);
  font-size: 0.9rem;
}

.search-field input {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 10px 12px 10px 36px;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  background: #fafbfc;
}

.search-field input:focus {
  border-color: var(--blue);
  box-shadow: 0 0 0 3px rgba(23, 149, 192, 0.15);
  background: #fff;
}

.chip-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.chip {
  border: 1px solid var(--border);
  background: #f7fafc;
  color: #2b3d47;
  border-radius: 999px;
  padding: 6px 11px;
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.chip:hover {
  border-color: var(--blue);
  color: var(--blue-dark);
}

.chip.active {
  background: rgba(23, 149, 192, 0.12);
  border-color: var(--blue);
  color: var(--blue-dark);
  font-weight: 600;
}

.range {
  width: 100%;
  accent-color: var(--blue);
  cursor: pointer;
}

.range-ends {
  display: flex;
  justify-content: space-between;
  font-size: 0.72rem;
  color: var(--muted);
  margin-top: 4px;
}

.btn-reset {
  width: 100%;
  margin-top: 4px;
  border: 1px dashed #c5d0d8;
  background: transparent;
  color: var(--muted);
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: color 0.15s ease, border-color 0.15s ease, background 0.15s ease;
}

.btn-reset:hover {
  color: var(--blue-dark);
  border-color: var(--blue);
  background: rgba(23, 149, 192, 0.06);
}

/* ===== Main panel ===== */
.main-panel {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.mobile-bar {
  display: none;
  gap: 10px;
  align-items: center;
}

.btn-filters-mobile {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 10px 14px;
  font-weight: 600;
  cursor: pointer;
  color: var(--text);
}

.filter-count {
  background: var(--blue);
  color: #fff;
  border-radius: 999px;
  font-size: 0.75rem;
  min-width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 6px;
}

.sort-select {
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 10px 12px;
  background: #fff;
  font-size: 0.9rem;
  color: var(--text);
  cursor: pointer;
  outline: none;
}

.sort-select:focus {
  border-color: var(--blue);
}

.map-section {
  position: relative;
  background: #f7fafb;
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(16, 34, 46, 0.05);
  height: clamp(420px, 56vh, 640px);
  transition: height 0.25s ease;
}

/* В режиме города — карта выше, удобнее смотреть улицы */
.map-section.is-city-mode {
  height: clamp(480px, 62vh, 720px);
}

.map-canvas {
  width: 100%;
  height: 100%;
  z-index: 1;
  background: #f7fafb;
}

/* Leaflet: белый «пустой» фон вместо тайлов мира */
:deep(.leaflet-container) {
  background: #f7fafb !important;
  font: inherit;
}

:deep(.leaflet-control-zoom a) {
  color: #10222e !important;
  border-color: #e6edf2 !important;
}

:deep(.city-tip) {
  background: #0b1f2a;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 0.78rem;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.18);
}

:deep(.city-tip::before) {
  border-top-color: #0b1f2a !important;
}

.map-hint {
  position: absolute;
  top: 14px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 6;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(11, 31, 42, 0.88);
  color: #fff;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 500;
  pointer-events: none;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18);
  max-width: calc(100% - 24px);
  white-space: nowrap;
}

.map-hint i {
  color: var(--gold);
}

.map-selected-chip {
  position: absolute;
  top: 14px;
  left: 14px;
  z-index: 6;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px 8px 12px;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(16, 34, 46, 0.12);
  font-size: 0.9rem;
  color: var(--text);
}

.map-selected-chip i {
  color: var(--blue);
}

.map-selected-count {
  color: var(--muted);
  font-size: 0.82rem;
}

.map-mode-badge {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  background: rgba(23, 149, 192, 0.12);
  color: #12799c;
  border-radius: 6px;
  padding: 2px 6px;
}

.map-back-kz {
  position: absolute;
  top: 14px;
  right: 14px;
  z-index: 6;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(16, 34, 46, 0.12);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text);
  cursor: pointer;
  transition: border-color 0.15s ease, color 0.15s ease;
}

.map-back-kz:hover {
  border-color: var(--blue);
  color: var(--blue-dark);
}

.map-chip-clear {
  border: none;
  background: #f1f4f6;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--muted);
}

.map-chip-clear:hover {
  background: #e6edf2;
  color: var(--text);
}

.chip-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  margin-left: 4px;
  border-radius: 999px;
  background: rgba(16, 34, 46, 0.08);
  font-size: 0.7rem;
  font-weight: 700;
}

.chip.active .chip-count {
  background: rgba(23, 149, 192, 0.2);
  color: var(--blue-dark);
}

.btn-primary.is-demo {
  opacity: 0.7;
  cursor: default;
  background: #94a3b8;
}

/* Подписи городов на силуэте */
:deep(.city-label-wrap) {
  background: transparent !important;
  border: none !important;
}

:deep(.city-pin-label) {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  cursor: pointer;
}

:deep(.city-pin-label .city-pin) {
  width: 22px;
  height: 22px;
}

:deep(.city-label) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(13, 148, 136, 0.25);
  border-radius: 999px;
  padding: 2px 8px;
  white-space: nowrap;
  cursor: pointer;
  pointer-events: auto;
  box-shadow: 0 2px 8px rgba(16, 34, 46, 0.1);
}

:deep(.city-label-name) {
  font-size: 0.72rem;
  font-weight: 700;
  color: #0b1f2a;
}

:deep(.city-label-count) {
  min-width: 18px;
  height: 18px;
  border-radius: 999px;
  background: #b08d4f;
  color: #fff;
  font-size: 0.68rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
}

:deep(.popup-demo) {
  display: inline-block;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  background: #f1f4f6;
  color: #64748b;
  border-radius: 4px;
  padding: 1px 5px;
  margin-left: 4px;
  vertical-align: middle;
}

.map-overlay {
  position: absolute;
  inset: 0;
  z-index: 5;
  background: rgba(255, 255, 255, 0.78);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: var(--muted);
  font-weight: 500;
}

.map-overlay.error {
  color: #b45309;
}

.btn-retry {
  border: none;
  background: var(--blue);
  color: #fff;
  border-radius: 10px;
  padding: 8px 16px;
  cursor: pointer;
  font-weight: 600;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e8eef2;
  border-top-color: var(--blue);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ===== List ===== */
.list-section {
  background: transparent;
}

.list-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
  gap: 12px;
}

.list-title {
  font-size: 1.15rem;
  font-weight: 800;
  margin: 0;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 14px;
}

.uni-card {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  gap: 14px;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
}

.uni-card:hover,
.uni-card.highlighted {
  transform: translateY(-2px);
  border-color: var(--blue);
  box-shadow: 0 12px 28px rgba(16, 34, 46, 0.1);
}

.uni-card.selected {
  border-color: var(--gold);
  box-shadow: 0 12px 28px rgba(176, 141, 79, 0.18);
}

.card-logo-wrap {
  flex-shrink: 0;
  width: 64px;
  height: 64px;
  border-radius: 14px;
  background: #f0f5f8;
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.card-logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 6px;
}

.card-body {
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.card-top {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card-name {
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.3;
  color: var(--text);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-rating {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 0.85rem;
}

.star {
  color: #d5dde3;
  font-size: 0.9rem;
  line-height: 1;
}

.star.on {
  color: var(--gold);
}

.rating-num {
  margin-left: 6px;
  font-weight: 700;
  color: var(--text);
}

.reviews-count {
  color: var(--muted);
  margin-left: 2px;
}

.card-location {
  margin: 0;
  color: var(--muted);
  font-size: 0.88rem;
  display: flex;
  align-items: center;
  gap: 4px;
}

.card-location i {
  color: var(--blue);
  font-size: 0.85rem;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  background: rgba(23, 149, 192, 0.1);
  color: var(--blue-dark);
  border-radius: 999px;
  padding: 3px 9px;
  font-size: 0.75rem;
  font-weight: 600;
}

.tag-muted {
  background: #f1f4f6;
  color: var(--muted);
}

.card-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 2px;
}

.stat {
  background: #f7fafc;
  border-radius: 10px;
  padding: 8px 10px;
}

.stat-k {
  display: block;
  font-size: 0.7rem;
  color: var(--muted);
  margin-bottom: 2px;
}

.stat-v {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text);
}

.card-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
}

.btn-primary {
  background: var(--blue);
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 9px 16px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.15s ease, transform 0.15s ease;
}

.btn-primary:hover {
  background: var(--blue-dark);
}

.btn-primary.sm {
  padding: 7px 12px;
  font-size: 0.82rem;
}

.btn-ghost {
  background: transparent;
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 9px 14px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: border-color 0.15s ease, color 0.15s ease, background 0.15s ease;
}

.btn-ghost:hover {
  border-color: var(--gold);
  color: #8a6d35;
}

.btn-ghost.active {
  background: rgba(176, 141, 79, 0.12);
  border-color: var(--gold);
  color: #8a6d35;
}

.empty-state {
  text-align: center;
  padding: 48px 20px;
  background: #fff;
  border-radius: 16px;
  border: 1px solid var(--border);
  color: var(--muted);
}

.empty-state i {
  font-size: 1.8rem;
  color: var(--blue);
  margin-bottom: 10px;
}

.empty-state.compact {
  padding: 28px;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 22px;
  flex-wrap: wrap;
}

.page-btn {
  min-width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: #fff;
  color: var(--text);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.page-btn:hover:not(:disabled) {
  border-color: var(--blue);
  color: var(--blue);
}

.page-btn.active {
  background: var(--blue);
  border-color: var(--blue);
  color: #fff;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Compare drawer */
.compare-drawer {
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  width: min(920px, 100vw);
  background: #fff;
  z-index: 1400;
  box-shadow: -12px 0 40px rgba(16, 34, 46, 0.18);
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.compare-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.compare-head h3 {
  margin: 0;
  font-weight: 800;
}

.compare-head .filters-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.compare-table-wrap {
  overflow: auto;
  flex: 1;
}

.compare-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.compare-table th,
.compare-table td {
  border-bottom: 1px solid var(--border);
  padding: 12px 10px;
  text-align: left;
  vertical-align: top;
}

.compare-table th {
  background: #f7fafc;
  position: sticky;
  top: 0;
}

.cmp-name {
  font-weight: 700;
  max-width: 160px;
  line-height: 1.3;
}

.cmp-remove {
  border: none;
  background: transparent;
  color: var(--muted);
  font-size: 1.2rem;
  cursor: pointer;
  line-height: 1;
  margin-top: 4px;
}

.filters-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(4, 22, 32, 0.45);
  z-index: 1300;
}

.drawer-enter-active,
.drawer-leave-active {
  transition: transform 0.3s ease;
}
.drawer-enter-from,
.drawer-leave-to {
  transform: translateX(100%);
}

/* Leaflet pin via global class inside divIcon */
:deep(.torap-pin) {
  background: transparent;
  border: none;
}

:deep(.pin-dot) {
  width: 22px;
  height: 22px;
  position: relative;
}

:deep(.pin-dot span) {
  display: block;
  width: 18px;
  height: 18px;
  border-radius: 50% 50% 50% 0;
  background: var(--pin, #b08d4f);
  transform: rotate(-45deg);
  border: 2px solid #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
  margin: 2px auto 0;
}

:deep(.pin-dot span::after) {
  content: '';
  position: absolute;
  width: 6px;
  height: 6px;
  background: #fff;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

:deep(.torap-popup .leaflet-popup-content-wrapper) {
  border-radius: 12px;
  box-shadow: 0 10px 28px rgba(16, 34, 46, 0.15);
  padding: 0;
}

:deep(.torap-popup .leaflet-popup-content) {
  margin: 12px 14px;
}

:deep(.popup-inner) {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  min-width: 200px;
}

:deep(.popup-logo) {
  width: 42px;
  height: 42px;
  object-fit: contain;
  border-radius: 8px;
  background: #f4f7f9;
  flex-shrink: 0;
}

:deep(.popup-meta) {
  color: #64748b;
  font-size: 0.8rem;
  margin: 4px 0 6px;
}

:deep(.popup-link) {
  color: #1795c0;
  font-weight: 600;
  font-size: 0.85rem;
  text-decoration: none;
}

/* ===== Responsive ===== */
@media (max-width: 1100px) {
  .page-layout {
    grid-template-columns: 230px 1fr;
  }
}

@media (max-width: 900px) {
  .page-layout {
    grid-template-columns: 1fr;
  }

  .filters-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: min(340px, 90vw);
    max-height: none;
    z-index: 1350;
    border-radius: 0 16px 16px 0;
    transform: translateX(-105%);
    transition: transform 0.3s ease;
    margin: 0;
  }

  .filters-sidebar.open {
    transform: translateX(0);
  }

  .filters-close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .mobile-bar {
    display: flex;
  }

  .desktop-only {
    display: none;
  }

  .map-section {
    height: 360px;
  }
}

@media (max-width: 720px) {
  .page-hero-inner {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .hero-facts {
    gap: 16px;
  }
}

@media (max-width: 575px) {
  .page-hero {
    padding: 88px 16px 18px;
  }

  .hero-fact-value {
    font-size: 1.4rem;
  }

  .hero-facts {
    gap: 12px;
  }

  .page-layout {
    padding: 14px 12px 36px;
  }

  .uni-card {
    flex-direction: column;
  }

  .card-stats {
    grid-template-columns: 1fr;
  }

  .card-actions {
    flex-direction: column;
  }

  .card-actions .btn-primary,
  .card-actions .btn-ghost {
    width: 100%;
    justify-content: center;
  }

  .map-section {
    height: 300px;
  }
}
</style>
