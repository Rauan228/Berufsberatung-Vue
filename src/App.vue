<template>
  <div>
    <router-view>

    </router-view>
  </div>
  <nav :class="['navbar', isScrolled ? 'bg-body-tertiary' : 'transparent-header', 'fixed-top']">
      <div class="container-fluid">
        <a class="navbar-logo"  @click="$router.push('/')">B|B</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasNavbar"
          aria-controls="offcanvasNavbar"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div
          class="offcanvas offcanvas-end"
          tabindex="-1"
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
        >
          <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasNavbarLabel">Меню</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div class="offcanvas-body">
            <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
              <li class="nav-item">
                <a class="nav-link" @click="$router.push('/User')">Личный кабинет</a>
              </li>
              <li class="nav-item">
                <h class="nav-link">Специальности
                  <li class="nav-item">
                <a class="nav-link" @click="$router.push('/Specialties/Universities/GlobalSpecialties')"> For Universities</a>
                <a class="nav-link" @click="$router.push('/Specialties/Colleges')">For Colleges</a>
                  </li>
                </h>
              </li>
              <li class="nav-item">
                <h class="nav-link">Студентам
                  <li class="nav-item">
                <a class="nav-link" @click="$router.push('/Universities')">Universities</a>
                <a class="nav-link" @click="$router.push('/Colleges')">Colleges</a>
                <a class="nav-link" @click="$router.push('/Map')">Карта учебных заведений</a>
                <a class="nav-link" @click="$router.push('/Events')">Мероприятия </a>
                <a class="nav-link" @click="$router.push('/Test')">Профориентационный тест</a>
                  </li>
                </h>
              </li>

            </ul>
          </div>
        </div>
      </div>
    </nav>
</template>

<script>
export default {
  data() {
    return {
      isScrolled: false,
    };
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);

    const options = {
      root: null,
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        } else if (entry.boundingClientRect.top > 0) {

          entry.target.classList.remove("visible");
        }
      });
    }, options);

    const elements = document.querySelectorAll(".fade-in");
    elements.forEach((el) => observer.observe(el));
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll() {
      this.isScrolled = window.scrollY > 50;
    },
  },
};


</script>

<style>
.container-fluid {
  padding: 0 30px 0 30px
}

.navbar {
  transition: background-color 0.2s ease, box-shadow 10s ease;
}
.nav-item {
  margin-left: 10px;
}

.navbar-logo {
  font-size: 2rem;
  font-weight: bolder;
  color: red;
}

.navbar.bg-body-tertiary {
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.transparent-header {
  background-color: transparent !important;
}

.background-image {
  position: relative;
  background: url('@/components/img/HeadImgFon.png') no-repeat  ;
  background-size: cover;
  height: 95vh;
  width: 100%;
  margin-top: 4.5%;
}

.background-image-dark-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1;
}

.background-image-content {
  position: relative;
  z-index: 2;
  top: 10%;
  left: 7%;
  width: 90%;
}


</style>
