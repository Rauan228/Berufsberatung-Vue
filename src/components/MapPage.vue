<template>
  <div class="map-page">
    <!-- Модальное окно для ввода адреса -->
    <div v-if="showAddressModal" class="address-modal">
      <div class="modal-content">
        <h2>Введите ваш адрес</h2>
        <input 
          v-model="homeAddress" 
          placeholder="Введите ваш адрес..."
          class="modal-input"
        />
        <button @click="setHomeAddress" class="modal-button">Подтвердить</button>
      </div>
    </div>

    <div class="filter-container">
      <div>
        <button
          class="sidebar-toggle-button"
          :class="{ visible: !isSidebarOpen }"
          @click="toggleSidebar"
        >
          <img
            v-if="isSidebarOpen"
            src="@/components/img/ForwardArrow.png"
            alt="Back"
          />
          <img v-else src="@/components/img/BackArrow.png" alt="Forward" />
        </button>
      </div>

      <aside
        id="sidebar"
        ref="sidebar"
        class="sidebar sidebar-default"
        :class="{
          'open': isSidebarOpen,
          'sidebar-stacked': isStacked,
          'scrolled': isScrolled
        }"
      >
        <div class="sidebar-header">
          <div class="SearchBox">
            <input 
              type="text" 
              v-model="searchQuery"
              placeholder="Поиск по названию..."
              @input="filterInstitutions"
            />
          </div>
        </div>

        <ul class="nav sidebar-nav">
          <h>Фильтр учреждений</h>

          <div class="sidebar-nav-filtration">
            <p>Тип учебного заведения</p>
            <button
              v-for="(item, index) in type"
              :key="'type-' + index"
              @click="toggleSelection('type-' + index)"
              :class="{ selected: selectedIndexes.includes('type-' + index) }"
            >
              {{ item }}
            </button>

            <p>Направление обучения</p>
            <button
              v-for="(item, index) in directions"
              :key="'direction-' + index"
              @click="toggleSelection('direction-' + index)"
              :class="{
                selected: selectedIndexes.includes('direction-' + index),
              }"
            >
              {{ item }}
            </button>

            <p>Гранты</p>
            <button
              v-for="(item, index) in grantOptions"
              :key="'grant-' + index"
              @click="toggleSelection('grant-' + index)"
              :class="{
                selected: selectedIndexes.includes('grant-' + index),
              }"
            >
              {{ item }}
            </button>

            <p>Наличие общежития</p>
            <button
              v-for="(item, index) in dormitoryOptions"
              :key="'dormitory-' + index"
              @click="toggleSelection('dormitory-' + index)"
              :class="{
                selected: selectedIndexes.includes('dormitory-' + index),
              }"
            >
              {{ item }}
            </button>
          </div>
        </ul>
      </aside>
    </div>

    <div id="map"></div>

    <!-- Add route summary overlay -->
    <div v-if="isRoutePanelVisible && routeSummary" class="route-bar">
      <span class="time">{{ selectedMinutes }} мин</span>
      <span class="dist">{{ routeSummary.distanceKm }} км</span>
      <div class="mode-buttons">
        <button
          v-for="m in transportModes"
          :key="m.value"
          :class="{ active: selectedProfile === m.value }"
          @click="switchMode(m.value)"
        >{{ m.label }}</button>
      </div>
      <button class="close-btn" @click="closeRoutePanel">×</button>
    </div>
  </div>
</template>

<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
import 'leaflet.markercluster'
import 'leaflet-routing-machine'
import UnCardImage from '@/components/img/UnCard.png'

export default {
  name: 'MapPage',
  data() {
    return {
      map: null,
      markers: [],
      markerCluster: null,
      routingControl: null,
      searchQuery: '',
      selectedType: 'all',
      institutions: [],
      searchTimeout: null,
      showAddressModal: true,
      homeAddress: '',
      homeMarker: null,
      homeLat: null,
      homeLng: null,
      markersCache: new Map(),
      isUpdatingMarkers: false,
      isStacked: true,
      isSidebarOpen: true,
      isScrolled: false,
      selectedIndexes: [],
      directions: [
        "Все",
        "Техническое",
        "Гуманитарное",
        "Медицина",
        "IT",
        "Юриспруденция",
        "Искусство",
      ],
      type: ["Все", "Университет", "Колледж"],
      grantOptions: ["Все", "Да", "Нет"],
      dormitoryOptions: ["Все", "Да", "Нет"],
      placeholderImage: UnCardImage,
      routeSummary: null,
      selectedProfile: 'car',
      isRoutePanelVisible: false,
      destCoords: null,
      transportModes: [
        { label: 'Пешком', value: 'walk' },
        { label: 'Вело', value: 'bike' },
        { label: 'Машина', value: 'car' },
        { label: 'Автобус', value: 'bus' }
      ],
      timeLabelMarker: null,
    }
  },
  computed: {
    // Время поездки для выбранного профиля транспорта
    selectedMinutes() {
      if (!this.routeSummary) return ''
      switch (this.selectedProfile) {
        case 'walk': return this.routeSummary.walkMin
        case 'bike': return this.routeSummary.bikeMin
        case 'car': return this.routeSummary.carMin
        case 'bus': return this.routeSummary.busMin
        default: return ''
      }
    }
  },
  mounted() {
    this.initMap()
    this.loadInstitutions()
    window.addEventListener("scroll", this.handleScroll)
    
    // Добавляем глобальную функцию для построения маршрута
    window.showRoute = (lat, lng) => {
      this.showRoute(lat, lng)
    }
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll)
  },
  methods: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen
      if (this.$refs.sidebar) {
        this.$refs.sidebar.classList.toggle("open", this.isSidebarOpen)
      }
    },
    handleScroll() {
      this.isScrolled = window.scrollY > 50
    },
    toggleSelection(key) {
      const [category, index] = key.split('-')
      const indexNum = parseInt(index)
      
      // Handle "Все" selection - clear all filters from the same category
      if ((category === 'type' && this.type[indexNum] === 'Все') ||
          (category === 'direction' && this.directions[indexNum] === 'Все') ||
          (category === 'grant' && this.grantOptions[indexNum] === 'Все') ||
          (category === 'dormitory' && this.dormitoryOptions[indexNum] === 'Все')) {
        // Remove all selections from this category
        this.selectedIndexes = this.selectedIndexes.filter(i => !i.startsWith(category + '-'))
        this.filterInstitutions()
        return
      }
      
      // Normal toggle logic
      if (this.selectedIndexes.includes(key)) {
        this.selectedIndexes = this.selectedIndexes.filter((i) => i !== key)
      } else {
        this.selectedIndexes.push(key)
      }
      this.filterInstitutions()
    },
    createPopupContent(inst) {
      const imgSrc = this.getImageUrl(inst.photo_url, this.placeholderImage);
      const typeLabel = inst.type === 'university' ? 'Университет' : 'Колледж';
      const avgRating = Math.round(inst.reviews_avg_rating || 0);
      const stars = Array.from({ length: 5 }, (_, i) => `<span class="fa fa-star${i < avgRating ? ' checked' : ''}"></span>`).join(' ');
      const detailsPath = inst.type === 'university' ? `/UniversityAbout/${inst.id}` : `/CollegeAbout/${inst.id}`;
      return `
        <div class="popup-card">
          <div class="popup-image">
            <img src="${imgSrc}" class="popup-img" />
          </div>
          <div class="popup-info">
            <h3>${inst.name || 'Без названия'}</h3>
            <p class="direction">${inst.directions || ''}</p>
            <div class="rating-stars">${stars}</div>
            <ul class="popup-features">
              <li>${inst.dormitory ? 'Есть общежитие' : 'Нет общежития'}</li>
              <li>${inst.grants ? 'Есть гранты' : 'Нет грантов'}</li>
            </ul>
            <p class="popup-address">${inst.address || ''}</p>
            <div class="popup-actions">
              <a href="${detailsPath}" class="details-btn">Подробнее</a>
              <button class="route-btn" onclick="window.showRoute(${inst.latitude}, ${inst.longitude})">Маршрут</button>
            </div>
          </div>
        </div>
      `;
    },
    filterInstitutions() {
      if (!this.map || !this.markerCluster) return

      const bounds = this.map.getBounds()
      this.markerCluster.clearLayers()

      const visibleInstitutions = this.institutions.filter(inst => {
        // Проверяем валидность координат
        if (!this.isValidCoords(inst)) return false

        // Фильтр по типу
        const typeFilter = this.selectedIndexes.find(index => index.startsWith('type-'))
        if (typeFilter) {
          const typeIndex = parseInt(typeFilter.split('-')[1])
          const typeValue = this.type[typeIndex]
          if (typeValue === 'Университет' && inst.type !== 'university') return false
          if (typeValue === 'Колледж' && inst.type !== 'college') return false
        }

        // Фильтр по поиску
        if (this.searchQuery && !inst.name.toLowerCase().includes(this.searchQuery.toLowerCase())) {
          return false
        }

        // Фильтр по грантам
        const grantFilter = this.selectedIndexes.find(index => index.startsWith('grant-'))
        if (grantFilter) {
          const grantValue = this.grantOptions[parseInt(grantFilter.split('-')[1])]
          if (grantValue === 'Да' && !inst.grants) return false
          if (grantValue === 'Нет' && inst.grants) return false
        }

        // Фильтр по общежитию
        const dormitoryFilter = this.selectedIndexes.find(index => index.startsWith('dormitory-'))
        if (dormitoryFilter) {
          const dormitoryValue = this.dormitoryOptions[parseInt(dormitoryFilter.split('-')[1])]
          if (dormitoryValue === 'Да' && !inst.dormitory) return false
          if (dormitoryValue === 'Нет' && inst.dormitory) return false
        }

        // Фильтр по направлению обучения
        const directionFilters = this.selectedIndexes.filter(i => i.startsWith('direction-'))
        if (directionFilters.length) {
          const selectedDirs = directionFilters.map(idx => this.directions[parseInt(idx.split('-')[1])].toLowerCase())
          const instDir = (inst.directions || '').toLowerCase()
          if (!selectedDirs.some(dir => instDir.includes(dir))) return false
        }

        return bounds.contains(L.latLng(inst.latitude, inst.longitude))
      })

      visibleInstitutions.forEach(inst => {
        let marker = this.markersCache.get(inst.id)
        
        if (!marker) {
          marker = L.marker([inst.latitude, inst.longitude], {
            riseOnHover: true,
            bubblingMouseEvents: false
          })

          const popupContent = this.createPopupContent(inst)
          marker.bindPopup(popupContent)
          this.markersCache.set(inst.id, marker)
        }

        this.markerCluster.addLayer(marker)
      })
    },
    updateVisibleMarkers() {
      if (!this.map || !this.markerCluster) return

      const bounds = this.map.getBounds()
      this.markerCluster.clearLayers()

      const visibleInstitutions = this.institutions.filter(inst => {
        if (!this.isValidCoords(inst)) return false
        if (this.selectedType !== 'all' && inst.type !== this.selectedType) {
          return false
        }
        return bounds.contains(L.latLng(inst.latitude, inst.longitude))
      })

      visibleInstitutions.forEach(inst => {
        let marker = this.markersCache.get(inst.id)
        
        if (!marker) {
          marker = L.marker([inst.latitude, inst.longitude], {
            riseOnHover: true,
            bubblingMouseEvents: false
          })

          const popupContent = this.createPopupContent(inst)
          marker.bindPopup(popupContent)
          this.markersCache.set(inst.id, marker)
        }

        this.markerCluster.addLayer(marker)
      })
    },
    isValidCoords(inst) {
      const lat = parseFloat(inst.latitude)
      const lng = parseFloat(inst.longitude)
      return !isNaN(lat) && !isNaN(lng)
    },
    async initMap() {
      try {
        this.map = L.map('map', {
          preferCanvas: true,
          wheelDebounceTime: 150,
          zoomAnimation: true,
          markerZoomAnimation: true
        }).setView([51.1801, 71.446], 12)

        this.mapTiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 18,
          minZoom: 8
        }).addTo(this.map)

        // Инициализируем кластер маркеров
        this.markerCluster = L.markerClusterGroup({
          maxClusterRadius: 50,
          spiderfyOnMaxZoom: true,
          showCoverageOnHover: false,
          zoomToBoundsOnClick: true
        })
        this.map.addLayer(this.markerCluster)

        // Обработчик для обновления маркеров
        this.map.on('zoomend moveend', () => {
          if (!this.isUpdatingMarkers) {
            this.isUpdatingMarkers = true
            this.updateVisibleMarkers()
            setTimeout(() => {
              this.isUpdatingMarkers = false
            }, 100)
          }
        })
      } catch (error) {
        console.error('Ошибка инициализации карты:', error)
        throw new Error('Не удалось инициализировать карту')
      }
    },

    async loadInstitutions() {
      try {
        const response = await fetch('/api/institutions', {
          headers: { 'Accept': 'application/json' }
        })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        console.log('API response:', data) // Для отладки
        // Исправлено: поддержка пагинации
        const institutions = Array.isArray(data) ? data : data.data
        if (!Array.isArray(institutions)) {
          console.error('API did not return an array:', data)
          this.institutions = []
          alert('Ошибка: данные учреждений не в правильном формате.')
          return
        }
        this.institutions = institutions
        this.addMarkersToMap(this.institutions)
        // Обработаем destination из URL (если есть)
        this.parseDestination()
      } catch (error) {
        console.error('Error loading institutions:', error)
        this.institutions = []
        alert('Не удалось загрузить данные учреждений.')
      }
    },

    addMarkersToMap(institutions) {
      if (!this.map || !this.markerCluster) return

      this.markerCluster.clearLayers()
      this.markersCache.clear()

      if (!Array.isArray(institutions) || institutions.length === 0) {
        console.warn('No institutions to display')
        return
      }

      institutions.forEach(institution => {
        if (institution.latitude && institution.longitude) {
          const marker = L.marker([institution.latitude, institution.longitude])
            .bindPopup(this.createPopupContent(institution))
          this.markersCache.set(institution.id, marker)
          this.markerCluster.addLayer(marker)
        }
      })
    },

    searchAddress() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
      }

      this.searchTimeout = setTimeout(async () => {
        if (!this.searchQuery) {
          this.filterInstitutions()
          return
        }

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(this.searchQuery)}&countrycodes=kz&limit=1`,
            { headers: { 'User-Agent': 'EducationalMap/1.0' } }
          )
          const results = await response.json()
          if (results.length > 0) {
            const { lat, lon } = results[0]
            this.map.setView([lat, lon], 13)

            const filtered = this.institutions.filter(institution => {
              if (this.selectedType !== 'all' && institution.type !== this.selectedType) {
                return false
              }
              const distance = this.calculateDistance(
                lat, lon,
                institution.latitude,
                institution.longitude
              )
              return distance <= 5 // 5 км радиус
            })

            this.addMarkersToMap(filtered)
          } else {
            alert('Адрес не найден.')
          }
        } catch (error) {
          console.error('Error searching address:', error)
          alert('Ошибка при поиске адреса.')
        }
      }, 1000) // Увеличенный таймаут для Nominatim
    },

    calculateDistance(lat1, lon1, lat2, lon2) {
      const R = 6371 // Радиус Земли в км
      const dLat = this.toRad(lat2 - lat1)
      const dLon = this.toRad(lon2 - lon1)
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
      return R * c
    },

    toRad(value) {
      return value * Math.PI / 180
    },

    async setHomeAddress() {
      if (!this.homeAddress) {
        alert('Пожалуйста, введите ваш адрес')
        return
      }

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(this.homeAddress + ', Астана, Казахстан')}&countrycodes=kz&limit=1`,
          { headers: { 'User-Agent': 'EducationalMap/1.0' } }
        )
        const results = await response.json()

        if (results.length > 0) {
          // Проверяем, что адрес находится в Астане
          const address = results[0].display_name.toLowerCase()
          if (!address.includes('астана') && !address.includes('nur-sultan')) {
            alert('Пожалуйста, введите адрес в пределах города Астана')
            return
          }

          const { lat, lon } = results[0]
          this.homeLat = parseFloat(lat)
          this.homeLng = parseFloat(lon)

          // Удаляем предыдущий маркер, если он существует
          if (this.homeMarker) {
            this.map.removeLayer(this.homeMarker)
          }

          // Создаем новый маркер для домашнего адреса
          this.homeMarker = L.marker([this.homeLat, this.homeLng], {
            icon: L.icon({
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            })
          }).addTo(this.map)
          
          this.homeMarker.bindPopup('Ваш адрес').openPopup()
          this.map.setView([this.homeLat, this.homeLng], 13)
          this.showAddressModal = false

          // Если указан пункт назначения – строим маршрут
          if (this.destCoords) {
            this.buildRoute()
          }
          // Обновим маркеры (без лишних фильтров)
          this.filterInstitutions()
        } else {
          alert('Адрес не найден. Пожалуйста, уточните адрес в пределах города Астана.')
        }
      } catch (error) {
        console.error('Error setting home address:', error)
        alert('Ошибка при установке домашнего адреса.')
      }
    },

    showRoute(lat, lng) {
      if (!this.homeLat || !this.homeLng) {
        alert('Пожалуйста, сначала укажите ваш домашний адрес')
        this.showAddressModal = true
        return
      }
      this.destCoords = { lat, lng }
      this.buildRoute()
    },
    switchMode(mode) {
      if (this.selectedProfile === mode) return
      this.selectedProfile = mode
      if (this.destCoords) {
        this.buildRoute()
      }
    },
    closeRoutePanel() {
      this.isRoutePanelVisible = false
      this.routeSummary = null
      if (this.routingControl) {
        this.map.removeControl(this.routingControl)
        this.routingControl = null
      }
      if (this.timeLabelMarker) {
        this.map.removeLayer(this.timeLabelMarker)
        this.timeLabelMarker = null
      }
    },
    buildRoute() {
      if (!this.homeLat || !this.homeLng || !this.destCoords) return
      const profileMap = {
        walk: 'foot',
        bike: 'bike',
        car: 'car',
        bus: 'car' // bus приблизительно как автомобиль
      }
      if (this.routingControl) {
        this.map.removeControl(this.routingControl)
        this.routingControl = null
      }
      if (this.timeLabelMarker) {
        this.map.removeLayer(this.timeLabelMarker)
        this.timeLabelMarker = null
      }
      this.routingControl = L.Routing.control({
        waypoints: [
          L.latLng(this.homeLat, this.homeLng),
          L.latLng(this.destCoords.lat, this.destCoords.lng)
        ],
        routeWhileDragging: false,
        language: 'ru',
        router: L.Routing.osrmv1({
          language: 'ru',
          profile: profileMap[this.selectedProfile]
        }),
        formatter: new L.Routing.Formatter({ language: 'ru', units: 'metric' }),
        show: false,
        collapsible: true,
        addWaypoints: false,
        draggableWaypoints: false,
        showAlternatives: true,
        lineOptions: {
          styles: [{ color: '#FF0000', weight: 8, opacity: 0.9 }]
        },
        altLineOptions: {
          styles: [{ color: '#008FFF', weight: 6, opacity: 0.7 }]
        }
      }).addTo(this.map)

      this.routingControl.on('routesfound', (e) => {
        const route = e.routes[0]
        if (!route) return
        const distM = route.summary.totalDistance
        const distKm = (distM / 1000).toFixed(1)
        const walkMin = Math.round((distKm / 5) * 60)
        const bikeMin = Math.round((distKm / 15) * 60)
        const carMin = Math.round((distKm / 60) * 60)
        const busMin = Math.round((distKm / 40) * 60)
        this.routeSummary = {
          distanceKm: distKm,
          walkMin,
          bikeMin,
          carMin,
          busMin
        }
        this.isRoutePanelVisible = true

        // place time label midway along the route
        const coords = route.coordinates
        if (coords && coords.length) {
          const midIdx = Math.floor(coords.length / 2)
          const midCoord = coords[midIdx]
          // Determine minutes based on selectedProfile
          let minutes = 0
          switch (this.selectedProfile) {
            case 'walk': minutes = walkMin; break
            case 'bike': minutes = bikeMin; break
            case 'car': minutes = carMin; break
            case 'bus': minutes = busMin; break
          }
          const html = `<div class='route-time-label'>${minutes} мин</div>`
          this.timeLabelMarker = L.marker([midCoord.lat, midCoord.lng], {
            interactive: false,
            icon: L.divIcon({ className: 'route-time-label-wrapper', html })
          }).addTo(this.map)
        }
      })
    },
    getImageUrl(url, fallback) {
      if (!url) return fallback;

      // Полная ссылка
      if (/^https?:\/\//.test(url)) {
        // Если Laravel вернул http://localhost/… без порта, добавляем 8000
        return url.includes('://localhost/') && !url.includes('://localhost:')
          ? url.replace('://localhost/', '://localhost:8000/')
          : url;
      }

      // Относительный путь – формируем от бекенда
      const base = 'http://localhost:8000';
      const normalised = url.startsWith('/') ? url : `/${url}`;
      return `${base}${normalised}`;
    },
    parseDestination() {
      const { destLat, destLng, destName } = this.$route.query || {}
      if (destLat && destLng) {
        const lat = parseFloat(destLat)
        const lng = parseFloat(destLng)
        if (!isNaN(lat) && !isNaN(lng)) {
          this.destCoords = { lat, lng }
          // Optional: центрируем карту на учреждение
          if (this.map) {
            this.map.setView([lat, lng], 13)
          }
          // Если домашний адрес уже введён (например, был ранее), строим маршрут сразу
          if (this.homeLat && this.homeLng) {
            this.buildRoute()
          }
        }
      }
    },
  }
}
</script>

<style scoped>
:root {
  /* Базовая ширина сайдбара – переиспользуем ниже */
  --sidebar-width: 200px;
  --sidebar-offset: 20px; /* отступ слева */
}

.map-page {
  position: relative;
  height: 100vh;
  width: 100vw;
}

#map {
  height: 100%;
  width: 100%;
}

.filter-container {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000;
  height: 100%;
}

.sidebar {
  position: fixed;
  display: flex;
  flex-direction: column;
  width: 450px;
  background: #fff;
  z-index: 3;
  transition: transform 0.5s cubic-bezier(0.55, 0, 0.1, 1);
  transform: translateX(calc(-1 * (var(--sidebar-width) + var(--sidebar-offset))));
  top: 10%; /* вместо margin-top % — фиксируем от верха */
  left: var(--sidebar-offset);
  height: 85%;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  padding-left: 20px;
}

.sidebar.open {
  transform: translateX(0);
}

.sidebar.scrolled {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.sidebar-header {
  display: flex;
  align-items: center;
  height: 100px;
  width: 360px;
}

.SearchBox {
  width: 100%;
  padding: 0 20px;
}

.SearchBox input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0 20px;
}

.sidebar-nav-filtration {
  margin-top: 20px;
  width: 100%;
}

.sidebar-nav-filtration p {
  font-weight: bold;
  margin: 15px 0 10px 0;
}

.sidebar-nav-filtration button {
  padding: 12px 22px;
  margin: 6px 12px 12px 0;
  border: 1px solid #ccc;
  border-radius: 14px;
  background-color: #f0f0f0;
  color: #424242;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  font-size: 1.1em;
}

.sidebar-nav-filtration button.selected {
  background-color: #D0D0D0;
  color: #008FFF;
  font-weight: bold;
}

.sidebar-toggle-button {
  position: fixed;
  left: calc(var(--sidebar-offset) + var(--sidebar-width));
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 0 50% 50% 0;
  cursor: pointer;
  z-index: 2;
  transition: left 0.5s cubic-bezier(0.55, 0, 0.1, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.sidebar-toggle-button.visible {
  left: var(--sidebar-offset);
}

h {
  font-size: 1.9em;
  font-weight: bold;
  margin: 20px 0;
}

/* Модальное окно для адреса */
.address-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
}

.modal-input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.modal-button {
  width: 100%;
  padding: 10px;
  background: #008FFF;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.modal-button:hover {
  background: #0077cc;
}

:deep(.popup-card){display:flex;width:310px;gap:10px;}
:deep(.popup-image){flex-shrink:0;}
:deep(.popup-img){width:90px;height:90px;object-fit:cover;border-radius:6px;}
:deep(.popup-info){flex:1;font-family:inherit;}
:deep(.popup-info h3){margin:0 0 4px 0;font-size:16px;color:#00263b;font-weight:600;}
:deep(.direction){margin:0 0 4px 0;font-size:13px;color:#9ca3af;}
:deep(.rating-stars){margin:2px 0;}
:deep(.fa-star){color:#ccc;font-size:15px;}
:deep(.fa-star.checked){color:#ffd700;}
:deep(.popup-features){list-style-type:disc;padding-left:16px;margin:4px 0;font-size:13px;color:#00263b;}
:deep(.popup-features li){margin-bottom:2px;}
:deep(.popup-address){margin:4px 0;font-size:13px;color:#3b3b3b;}
:deep(.popup-actions){display:flex;gap:6px;margin-top:6px;}
:deep(.details-btn){flex:1;text-align:center;background:#e5e5e5;color:#333;border:none;padding:6px 8px;border-radius:4px;font-size:12px;text-decoration:none;}
:deep(.details-btn:hover){background:#d1d5db;}
:deep(.route-btn){flex:1;background:#008FFF;color:#fff;border:none;padding:6px 8px;border-radius:4px;cursor:pointer;font-size:12px;}
:deep(.route-btn:hover){background:#006fd3;}

/* Add route summary overlay styles */
.route-bar {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  background: #ffffff;
  border-radius: 10px;
  padding: 6px 14px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  z-index: 1200;
}

.route-bar .time {
  font-size: 20px;
  font-weight: 700;
  color: #FF0000;
}

.route-bar .dist {
  font-size: 18px;
  color: #424242;
}

.route-bar .mode-buttons button {
  background: #f3f3f3;
  border: none;
  padding: 6px 10px;
  border-radius: 14px;
  cursor: pointer;
  font-size: 12px;
  min-width: 60px;
  flex-shrink: 0;
}

.route-bar .mode-buttons button.active {
  background: #008FFF;
  color: white;
}

.route-bar .close-btn {
  background: transparent;
  border: none;
  font-size: 18px;
  cursor: pointer;
  min-width: 30px;
  flex-shrink: 0;
}

.route-bar .mode-buttons {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

.route-time-label-wrapper {
  transform: translateY(-25px) translateX(-20px);
}

.route-time-label {
  background: #ffffff;
  border: 2px solid #FF0000;
  border-radius: 8px;
  padding: 4px 8px;
  font-size: 20px;
  font-weight: bold;
  color: #FF0000;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}

@media (max-width: 600px) {
  :root {
    --sidebar-width: 240px;
  }
}
</style>
