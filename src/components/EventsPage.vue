<template>
  <body>
    <div class="events-container">
      <div class="events-list">
        <div class="event-card">
          <div class="event-logo">
            <img src="@/components/img/UnLogo.png" class="event-logo-img" />
            <img src="@/components/img/Favourite.png" class="event-logo-img" />
          </div>
          <div class="event-view">
            <h3 class="event-view-text" href="/UniversityAbout" >University</h3>
            <p2 class="event-view-text"> Added 18 days ago</p2>
          </div>
          <div class="event-info">
            <h3 class="event-info-text">Nazarbayev University</h3>
            <hr class="event-line" />
            <h3 class="event-info-text">Open day</h3>
          </div>
          <div class="event-terms">
            <p3 class="terms-text">Need: Nothing</p3>
          </div>
        </div>

        <div class="event-card">
          <div class="event-logo">
            <img src="@/components/img/UnLogo.png" class="event-logo-img" />
            <img src="@/components/img/Favourite.png" class="event-logo-img" />
          </div>
          <div class="event-view">
            <h3 class="event-view-text">University</h3>
            <p2 class="event-view-text"> Added 18 days ago</p2>
          </div>
          <div class="event-info">
            <h3 class="event-info-text">Nazarbayev University</h3>
            <hr class="event-line" />
            <h3 class="event-info-text">Open day</h3>
          </div>
          <div class="event-terms">
            <p3 class="terms-text">Need: Nothing</p3>
          </div>
        </div>

        <div class="event-card">
          <div class="event-logo">
            <img src="@/components/img/UnLogo.png" class="event-logo-img" />
            <img src="@/components/img/Favourite.png" class="event-logo-img" />
          </div>
          <div class="event-view">
            <h3 class="event-view-text">University</h3>
            <p2 class="event-view-text"> Added 18 days ago</p2>
          </div>
          <div class="event-info">
            <h3 class="event-info-text">Nazarbayev University</h3>
            <hr class="event-line" />
            <h3 class="event-info-text">Open day</h3>
          </div>
          <div class="event-terms">
            <p3 class="terms-text">Need: Nothing</p3>
          </div>
        </div>

        <div class="event-card">
          <div class="event-logo">
            <img src="@/components/img/UnLogo.png" class="event-logo-img" />
            <img src="@/components/img/Favourite.png" class="event-logo-img" />
          </div>
          <div class="event-view">
            <h3 class="event-view-text">University</h3>
            <p2 class="event-view-text"> Added 18 days ago</p2>
          </div>
          <div class="event-info">
            <h3 class="event-info-text">Nazarbayev University</h3>
            <hr class="event-line" />
            <h3 class="event-info-text">Open day</h3>
          </div>
          <div class="event-terms">
            <p3 class="terms-text">Need: Nothing</p3>
          </div>
        </div>

        <div class="event-card">
          <div class="event-logo">
            <img src="@/components/img/UnLogo.png" class="event-logo-img" />
            <img src="@/components/img/Favourite.png" class="event-logo-img" />
          </div>
          <div class="event-view">
            <h3 class="event-view-text">University</h3>
            <p2 class="event-view-text"> Added 18 days ago</p2>
          </div>
          <div class="event-info">
            <h3 class="event-info-text">Nazarbayev University</h3>
            <hr class="event-line" />
            <h3 class="event-info-text">Open day</h3>
          </div>
          <div class="event-terms">
            <p3 class="terms-text">Need: Nothing</p3>
          </div>
        </div>

        <div class="event-card">
          <div class="event-logo">
            <img src="@/components/img/UnLogo.png" class="event-logo-img" />
            <img src="@/components/img/Favourite.png" class="event-logo-img" />
          </div>
          <div class="event-view">
            <h3 class="event-view-text" >University</h3>
            <p2 class="event-view-text"> Added 18 days ago</p2>
          </div>
          <div class="event-info">
            <h3 class="event-info-text">Nazarbayev University</h3>
            <hr class="event-line" />
            <h3 class="event-info-text">Open day</h3>
          </div>
          <div class="event-terms">
            <p3 class="terms-text">Need: Nothing</p3>
          </div>
        </div>

        <div class="event-card">
          <div class="event-logo">
            <img src="@/components/img/UnLogo.png" class="event-logo-img" />
            <img src="@/components/img/Favourite.png" class="event-logo-img" />
          </div>
          <div class="event-view">
            <h3 class="event-view-text">University</h3>
            <p2 class="event-view-text"> Added 18 days ago</p2>
          </div>
          <div class="event-info">
            <h3 class="event-info-text">Nazarbayev University</h3>
            <hr class="event-line" />
            <h3 class="event-info-text">Open day</h3>
          </div>
          <div class="event-terms">
            <p3 class="terms-text">Need: Nothing</p3>
          </div>
        </div>

        <div class="event-card">
          <div class="event-logo">
            <img src="@/components/img/UnLogo.png" class="event-logo-img" />
            <img src="@/components/img/Favourite.png" class="event-logo-img" />
          </div>
          <div class="event-view">
            <h3 class="event-view-text">University</h3>
            <p2 class="event-view-text"> Added 18 days ago</p2>
          </div>
          <div class="event-info">
            <h3 class="event-info-text">Nazarbayev University</h3>
            <hr class="event-line" />
            <h3 class="event-info-text">Open day</h3>
          </div>
          <div class="event-terms">
            <p3 class="terms-text">Need: Nothing</p3>
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

              <p> By event type</p>
              <button
                v-for="(item, index) in EventType"
                :key="'EventType-' + index"
                @click="toggleSelection('EventType-' + index)"
                :class="{
                  selected: selectedIndexes.includes('EventType-' + index),
                }"
              >
                {{ item }}
              </button>

              <p>By publication date</p>
              <button
                v-for="(item, index) in ByPublicationDate"
                :key="'ByPublicationDate-' + index"
                @click="toggleSelection('ByPublicationDate-' + index)"
                :class="{
                  selected: selectedIndexes.includes('ByPublicationDate-' + index),
                }"
              >
                {{ item }}
              </button>

              <p>Sorting dates</p>
              <button
                v-for="(item, index) in SortingDates"
                :key="'SortingDates-' + index"
                @click="toggleSelection('SortingDates-' + index)"
                :class="{
                  selected: selectedIndexes.includes('SortingDates-' + index),
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
      isStacked: true,
      isSidebarOpen: true,
      isScrolled: false,
      ByPublicationDate: [
        "Today",
        "for this week",
        "for this month",
        "for this year",
        "for all time",
      ],
      type: ["Institute", "College"],
      EventType: ["Open day", "Hackathon", "Olympiad"],
      SortingDates: ["Oldest", "Newest"],
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
body {
  width: 100%;
  height: 100vh;
  align-items: flex-start;
  overflow-y: auto;

}

.events-container {
  margin-top: 5%;
  width: 100%;
  height: 100vw;
  background-color: #f0f0f0;
  padding: 3% 2% 0 1%;
  display: flex;
  align-items: flex-start;
}

.events-list {
  display: flex;
  flex-wrap: wrap;
  width: 100vw;
}
.event-card {
  width: 22%;
  background-color: #536274;
  padding: 20px;
  border-radius: 12px;
  margin: 25px 25px 25px 25px;
}

.event-logo-img {
  width: 50px;
  height: 50px;
  background-color: white;
  border-radius: 12px;
  padding: 5px;
}

.event-logo {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10%;
}

.event-view {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 5%;
}

.event-line {
  border: 1px solid #10222e;
}

.event-view-text {
  color: #cdcccc;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 0px;
}

.event-info-text {
  color: white;
}

.event-terms {
  color: #cdcccc;
  height: 200px;
  display: flex;
  align-items: center;
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
</style>
