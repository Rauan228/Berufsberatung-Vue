<template>
  <div class="page-container">
    <div class="background-image">
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
  </div>
</template>

<script>
export default {
  data() {
    return {
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
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    if (this.$refs.sidebar) {
      this.$refs.sidebar.classList.toggle("open", this.isSidebarOpen);
    }
  },
  methods: {
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
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 70px;
  z-index: 1000;
  background-color: rgba(255, 255, 255, 0.9);
  transition: background-color 0.3s ease;
}
.nav-item {
  margin-left: 10px;
}
.page-container {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
}

.background-image {
  background: url("@/components/img/Map3.png") no-repeat center center;
  background-size: cover;
  height: 100vh;
  width: 100%;
}

.navbar-logo {
  font-size: 2rem;
  font-weight: bolder;
  color: red;
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
  z-index: 3;
  transition: transform 0.5s cubic-bezier(0.55, 0, 0.1, 1);
  transform: translateX(-415px);
  height: 80%;
  margin-top: 2%;
  border-radius: 12px;
  margin-left: 3%;
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

.sidebar-nav-filtration {
  margin-top: 20px;
}

.sidebar-toggle-button {
  position: fixed;
  left: 410px;
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

.sidebar-toggle-button.visible {
  left: 0px;
}
</style>
