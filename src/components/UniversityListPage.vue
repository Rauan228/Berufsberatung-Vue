<template>
  <header class="header fixed-top">

  </header>


<body>
  <div class="list-container">
    <div class="sidebar-left-minor"></div>
    <div class="sidebar-left fixed-sidebar">
      <h class="sidebar-text">Type of educational institution</h>
      <router-link
        to="/Universities"
        class="sidebar-active-choice"
        :class="{ active: currentPage === 'Universities' }"
        >University</router-link
      >
      <router-link
        to="/Colleges"
        class="sidebar-choice"
        :class="{ active: currentPage === 'Colleges' }"
        >College</router-link
      >
      <div
        class="active-indicator"
        :style="{ top: indicatorPosition + 'px' }"
      ></div>
    </div>

    <div class="main-content">
      <div class="search-container">
        <input type="text" placeholder="Search.." />
        <button type="submit">Submit</button>
      </div>

      <div class="list-card">
        <div class="card-img">
          <img src="@/components/img/UnCard.png" class="card-img" />
        </div>
        <div class="card-info">
          <div class="card-info-up">
            <h style="margin-top: -10px"
              >Astana IT University
              <span class="fa fa-star checked"></span>
              <span class="fa fa-star checked"></span>
              <span class="fa fa-star checked"></span>
              <span class="fa fa-star checked"></span>
              <span class="fa fa-star checked"></span>
            </h>
            <p>Ave. Mangilik El., Astana 020000</p>
            <p style="margin-top: -10px">Open 10:00 - 22:00</p>
          </div>

          <div class="card-info-down">
            <div class="card-info-down-feature">
              <p>Direction of study</p>
              <p class="feature">IT</p>
            </div>
            <div class="card-info-down-feature">
              <p>Grants</p>
              <p class="feature">Yes</p>
            </div>
            <div class="card-info-down-feature">
              <p>Student dormitory</p>
              <p class="feature">Yes</p>
            </div>
            <button type="button" class="university-button"  @click="$router.push('/UniversityAbout')">More details</button>

          </div>

        </div>
      </div>

      <div class="list-card">
        <div class="card-img">
          <img src="@/components/img/UnCard.png" class="card-img" />
        </div>
        <div class="card-info">
          <div class="card-info-up">
            <h style="margin-top: -10px"
              >Astana IT University
              <span class="fa fa-star checked"></span>
              <span class="fa fa-star checked"></span>
              <span class="fa fa-star checked"></span>
              <span class="fa fa-star checked"></span>
              <span class="fa fa-star checked"></span>
            </h>
            <p>Ave. Mangilik El., Astana 020000</p>
            <p style="margin-top: -10px">Open 10:00 - 22:00</p>
          </div>

          <div class="card-info-down">
            <div class="card-info-down-feature">
              <p>Direction of study</p>
              <p class="feature">IT</p>
            </div>
            <div class="card-info-down-feature">
              <p>Grants</p>
              <p class="feature">Yes</p>
            </div>
            <div class="card-info-down-feature">
              <p>Student dormitory</p>
              <p class="feature">Yes</p>
            </div>
            <button type="button" class="university-button"  @click="$router.push('/UniversityAbout')">More details</button>

          </div>

        </div>
      </div>

      <div class="list-card">
        <div class="card-img">
          <img src="@/components/img/UnCard.png" class="card-img" />
        </div>
        <div class="card-info">
          <div class="card-info-up">
            <h style="margin-top: -10px"
              >Astana IT University
              <span class="fa fa-star checked"></span>
              <span class="fa fa-star checked"></span>
              <span class="fa fa-star checked"></span>
              <span class="fa fa-star checked"></span>
              <span class="fa fa-star checked"></span>
            </h>
            <p>Ave. Mangilik El., Astana 020000</p>
            <p style="margin-top: -10px">Open 10:00 - 22:00</p>
          </div>

          <div class="card-info-down">
            <div class="card-info-down-feature">
              <p>Direction of study</p>
              <p class="feature">IT</p>
            </div>
            <div class="card-info-down-feature">
              <p>Grants</p>
              <p class="feature">Yes</p>
            </div>
            <div class="card-info-down-feature">
              <p>Student dormitory</p>
              <p class="feature">Yes</p>
            </div>
            <button type="button" class="university-button"  @click="$router.push('/UniversityAbout')">More details</button>

          </div>


        </div>
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
          class="sidebar sidebar-default open"
          :class="{
            'sidebar-stacked': isStacked,
            scrolled: isScrolled,
          }"
        >
          <div class="sidebar-header">
            <div class="SearchBox">
              <input type="text" placeholder="Search.." />
              <button type="submit">Submit</button>
            </div>
          </div>

          <ul class="nav sidebar-nav">
            <h>Filter institutions</h>


            <div class="sidebar-nav-filtration">

              <p>Type of educational institution</p>
              <button
                v-for="(item, index) in type"
                :key="'type-' + index"
                @click="toggleSelection('type-' + index)"
                :class="{ selected: selectedIndexes.includes('type-' + index) }"
              >
                {{ item }}
              </button>

              <p>Direction of study</p>
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

              <p>Grants</p>
              <button
                v-for="(item, index) in Grants"
                :key="'Grants-' + index"
                @click="toggleSelection('Grants-' + index)"
                :class="{
                  selected: selectedIndexes.includes('Grants-' + index),
                }"
              >
                {{ item }}
              </button>

              <p>Availability of a dormitory for students</p>
              <button
                v-for="(item, index) in dormitory"
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
  </div>
  </body>
</template>

<script>
export default {
  data() {
    return {
      currentPage: this.$route.name,
      indicatorPosition: 0,
      isStacked: true,
      isSidebarOpen: true,
      isScrolled: false,
      directions: [
        "Technical",
        "Humanitarian",
        "Medicine",
        "IT",
        "Jurisprudence",
        "Art",
      ],
      type: ["Institute", "College"],
      Grants: ["Yes", "No", "Partial"],
      dormitory: ["Yes", "No"],
      selectedIndexes: [],
    };
  },
  watch: {
    $route(to) {
      this.currentPage = to.name;
      this.updateIndicator();
    },
  },
  mounted() {
    this.updateIndicator();
    window.addEventListener("scroll", this.handleScroll);

  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    updateIndicator() {
      this.indicatorPosition = this.currentPage === "Universities" ? 130 : 263;
    },
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
      const sidebar = document.getElementById("sidebar");
      const overlay = document.querySelector(".sidebar-overlay");
      sidebar.classList.toggle("open");
      overlay.classList.toggle("active");
    },
    handleScroll() {
      this.isScrolled = window.scrollY > 50;
    },
    selectDirection(index) {
      this.selectedIndex = index;
    },
    toggleSelection(key) {
  if (this.selectedIndexes.includes(key)) {
    this.selectedIndexes = this.selectedIndexes.filter((i) => i !== key);
  } else {
    this.selectedIndexes.push(key);
  }
},
  },
};
</script>

<style scoped>

html, body {
  height: 100%;
  overflow-y: auto;
  width: 100vw;
  margin: 0;
  padding: 0;
}




.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 70px;
  z-index: 1001;
  background-color: rgba(255, 255, 255, 0.9);
  transition: background-color 0.3s ease;
}
.nav-item {
  margin-left: 10px;
}
.navbar-logo {
  font-size: 2rem;
  font-weight: bolder;
  color: red;
}

.list-container {
  display: flex;
  width: 100%;
  overflow-y: auto;
}


.sidebar-left {
  position: fixed;
  width: 12%;
  height: 100vh;
  background-color: white;
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.sidebar-left-minor {
  position: relative;
  width: 12%;
  height: 100vh;
  background-color: white;
}

.fixed-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 12%;
  background-color: white;
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  z-index: 1;
}
.sidebar-text {
  font-size: 1.6rem;
  margin-bottom: 20px;
  font-weight: bold;
  margin-top: 45%;
}

.main-content {
  overflow-y: auto;
  max-height: 100vh;
  flex-grow: 1;
  background-color: #d4e5ed;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  padding: 0% 8% 0% 8%;

}

.sidebar-choice {
  font-size: 1.8rem;
  color: #919191;
  margin: 15px 0 0 20px;
  transition: transform 0.3s, color 0.3s;
  text-decoration: none;
}

.sidebar-active-choice {
  font-size: 1.8rem;
  color: #577c8e;
  margin: 15px 0 0 20px;
  transition: transform 0.3s, color 0.3s;
  text-decoration: none;
}

.sidebar-choice:hover {
  transform: scale(1.1);
  color: #577c8e;
}

.sidebar-choice.active {
  font-weight: bold;
  color: #577c8e;
}

.active-indicator {
  position: absolute;
  right: -1px;
  width: 5px;
  height: 30px;
  background-color: #577c8e;
  transition: top 0.3s ease;
  border-radius: 3px;
}



.search-container {
  margin-top: 20%;
  margin-bottom: 20px;
}

.list-card {
  display: flex;
  height: 250px;
  width: 100%;
  padding: 20px;
  background-color: white;
  border-radius: 12px;
  margin-bottom: 50px;
}

.card-img {
  width: 270px;
  height: 190px;
  border-radius: 6px;
  margin-right: 30px;
}

.card-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
}

.card-info-down {
  display: flex;
  align-items: flex-end;
}

.card-info-up {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.card-info-down-feature {
  margin-right: 15px;
}

h {
  font-size: 2em;
  font-weight: bold;
  margin-bottom: 5px;
}

p {
  color: #919191;
  font-size: 0.9em;
}

.feature {
  color: black;
  font-size: 1.2em;
  font-weight: bold;
  margin-top: -5px;
}

.sidebar-overlay.active {
  opacity: 0.5;
  visibility: visible;
  transition-delay: 0;
}

.sidebar {
  position: fixed;
  display: flex;
  flex-direction: column;
  width: 360px;
  background: #fff;
  z-index: 1000;
  transition: transform 0.4s cubic-bezier(0.55, 0, 0.1, 1);
  transform: translateX(-415px);
  height: 80%;
  margin-top: 7%;
  border-radius: 12px;
  margin-right: 3%;
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

.sidebar-toggle {
  position: absolute;
  right: 16px;
  top: 16px;
  background: none;
  border: none;
  cursor: pointer;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.sidebar-toggle-button {
  position: fixed;
  left: 98%;
  top: 50%;
  width: 40px;
  height: 40px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 50% 0 0 50%;
  cursor: pointer;
  z-index: 2;
  transition: all 0.3s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.sidebar-toggle-button.visible {
  transform: translateX(-417px) ;
}

.sidebar-nav-filtration {
  margin-top: 20px;
}

.sidebar-nav-filtration button {
  padding: 8px 15px;
  margin: -5px 10px 10px 0px;
  border: 1px solid #ccc;
  border-radius: 12px;
  background-color: #f0f0f0;
  color: #424242;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  font-size: 1em;
}


.sidebar-nav-filtration button.selected {
  background-color: #D0D0D0;
  color: #008FFF;
  font-weight: bold;
}

h {
  font-size: 1.9em;
  font-weight: bold;
}

.university-button {
  margin-bottom: 20px;
  border-radius: 6px;
  background-color: #577C8E ;
  color: white;
  border: none;
  margin-left: 40%;
  width: 150px;
  height: 40px;
  transition: transform 0.3s ease;

}

.university-button:hover {
        transform: scale(1.1);
    }

</style>
