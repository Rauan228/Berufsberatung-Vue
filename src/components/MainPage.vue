<template>
  <header>


    <div class="background-image">
      <div class="background-image-dark-overlay"></div>
      <div class="background-image-content">
        <h1 class="text-white">Добро <br>
          пожаловать</h1>
        <p class="text-white lead">
          Пройдите тест профориентации и <br>
          найдите свое место в жизни
        </p>
        <button @click="$router.push('/TestPage')" class="btn btn-light btn-lg header-button">
          <h2>Пройти тест</h2>
        </button>
      </div>
    </div>
  </header>

  <main class="container py-5">
    <div class="row align-items-center fade-in" ref="blocks">
      <div class="col-12 col-md-8  p-4 text-block">
        <h3>
          Тест для профориентации</h3>
        <p>

          "Пройдите простой тест профориентации и узнайте подходящие <br>
          профессии и учебные направления. Ответьте на вопросы и получите<br>
          рекомендации, основанные на ваших интересах и сильных
          сторонах. <br>
          Начните свой карьерный путь уже сегодня!".
        </p>
      </div>
      <div class="col-12 col-md-4 text-center">
        <img src="@/components/img/MainImg.png" alt="Image" class="img-fluid" />
      </div>
    </div>

    <div class="row align-items-center fade-in" ref="blocks">
      <div class="col-12 col-md-4 text-center">
        <img src="@/components/img/MainImgtwo.png" alt="Image" class="img-fluid" />
      </div>
      <div class="col-12 col-md-8 p-4 text-block">
        <h3>Узнай больше о профессии </h3>
        <p>
          Познакомься поближе с разнообразием профессий и их уникальными<br>
          особенностями. Пойми, какие навыки, знания и качества требуются для <br>
          успеха в выбранной области. Узнай о ключевых задачах, карьерных перспективах и возможностях роста.
        </p>
      </div>
    </div>

    <div class="row align-items-center fade-in" ref="blocks">
      <div class="col-12 col-md-8 p-4 text-block">
        <h3>
          Черном по белому</h3>
        <p>
          Узнайте о его престижности, уникальных программах, условиях <br>
          обучения и специализациях, которые помогут в карьерном росте. <br>
          Мы собрали всё самое важное: курсы, стоимость, преподавателей <br>
          и отзывы студентов, чтобы вы могли сделать осознанный <br>
          выбор без лишних деталей.
        </p>
      </div>
      <div class="col-12 col-md-4 text-center">
        <img src="@/components/img/MainImgThree.png" alt="Image" class="img-fluid" />
      </div>
    </div>
  </main>


  <div class="Specialties_feed">
    <div class="group">
      <div class="card card-1">
        <div class="card-content">
          <h2>Творческие <br>
            специальности</h2>
          <hr>
          <ul>
            <li>Живопись</li>
            <li>Графика</li>
            <li>Скульптура</li>
            <li>Дизайн</li>
          </ul>
          <button @click="$router.push('/Specialties/Universities/GlobalSpecialties')"
            class="card-button">Подробнее</button>
        </div>
      </div>

      <div class="card card-2">
        <div class="card-content">
          <h2>Технические <br>
            специальности</h2>
          <hr>
          <ul>
            <li>Программирование</li>
            <li>Сетевые технологии</li>
            <li>Робототехника</li>
            <li>Механика</li>
          </ul>
          <button @click="$router.push('/Specialties/Universities/GlobalSpecialties')"
            class="card-button">Подробнее</button>

        </div>
      </div>

      <div class="card card-3">
        <div class="card-content">
          <h2>Научные <br>
            специальности</h2>
          <hr>
          <ul>
            <li>Физика</li>
            <li>Химия</li>
            <li>Биология</li>
            <li>Астрономия</li>
          </ul>
          <button @click="$router.push('/Specialties/Universities/GlobalSpecialties')"
            class="card-button">Подробнее</button>

        </div>
      </div>

      <div class="card card-4">
        <div class="card-content">
          <h2>Социальные <br>
            специальности</h2>
          <hr>
          <ul>
            <li>Психология</li>
            <li>Социология</li>
            <li>История</li>
            <li>Культурология</li>
          </ul>
          <button @click="$router.push('/Specialties/Universities/GlobalSpecialties')"
            class="card-button">Подробнее</button>

        </div>
      </div>

    </div>

    <div aria-hidden class="group">
      <div class="card card-1">
        <div class="card-content">
          <h2>Творческие<br>
            специальности</h2>
          <hr>
          <ul>
            <li>Живопись</li>
            <li>Графика</li>
            <li>Скульптура</li>
            <li>Дизайн</li>
          </ul>
          <button @click="$router.push('/Specialties/Universities/GlobalSpecialties')"
            class="card-button">Подробнее</button>

        </div>
      </div>

      <div class="card card-2">
        <div class="card-content">
          <h2>Технические <br>
            специальности</h2>
          <hr>
          <ul>
            <li>Программирование</li>
            <li>Сетевые технологии</li>
            <li>Робототехника</li>
            <li>Механика</li>
          </ul>
          <button @click="$router.push('/Specialties/Universities/GlobalSpecialties')"
            class="card-button">Подробнее</button>

        </div>
      </div>

      <div class="card card-3">
        <div class="card-content">
          <h2>Научные <br>
            специальности</h2>
          <ul>
            <li>Физика</li>
            <li>Химия</li>
            <li>Биология</li>
            <li>Астрономия</li>
          </ul>
          <button @click="$router.push('/Specialties/Universities/GlobalSpecialties')"
            class="card-button">Подробнее</button>

        </div>
      </div>

      <div class="card card-4">
        <div class="card-content">
          <h2>Социальные <br>
            специальности</h2>
          <ul>
            <li>Психология</li>
            <li>Социология</li>
            <li>История</li>
            <li>Культурология</li>
          </ul>
          <button @click="$router.push('/Specialties/Universities/GlobalSpecialties')"
            class="card-button">Подробнее</button>

        </div>
      </div>

    </div>
  </div>

  <div class="Find-university-container fade-in">
    <div class="Find-university-wrapper">
      <div class="Find-university-text-block">
        <h2>Найди учебное<br> заведение мечты</h2>
        <p>Подбери вуз и специальность, <br>
          исходя из своих интересов и карьерных целей. <br>
          Мы поможем сделать осознанный выбор!</p>
        <button @click="$router.push('/Universities')" class="action-button">
          Смотреть
          <div class="hover-box">
            <img src="@/components/img/Лупа.png" alt="Лупа" class="magnifier-icon">
          </div>
        </button>
      </div>
      <div class="Find-university-image-block">
        <img src="@/components/img/UniImg.png" alt="Учебное заведение мечты">
      </div>
    </div>
  </div>

  <div class="scroll-footer-wrapper">
    <div class="scroll-footer-text">
      BERUFSBERATUNG
    </div>
  </div>
  <div class="MainPageFooter-container">
    <footer class="MainPageFooter">
      <div class="row">
        <div class="col-6 col-md-2 mb-3">
          <h5>Section</h5>
          <ul class="nav flex-column">
            <li class="nav-item mb-2"><a href="#" class="nav-link p-0 text-light">Home</a></li>
            <li class="nav-item mb-2"><a href="#" class="nav-link p-0 text-light">Features</a></li>
            <li class="nav-item mb-2"><a href="#" class="nav-link p-0 text-light">Pricing</a></li>
            <li class="nav-item mb-2"><a href="#" class="nav-link p-0 text-light">FAQs</a></li>
            <li class="nav-item mb-2"><a href="#" class="nav-link p-0 text-light">About</a></li>
          </ul>
        </div>

        <div class="col-6 col-md-2 mb-3">
          <h5>Section</h5>
          <ul class="nav flex-column">
            <li class="nav-item mb-2"><a href="#" class="nav-link p-0 text-light">Home</a></li>
            <li class="nav-item mb-2"><a href="#" class="nav-link p-0 text-light">Features</a></li>
            <li class="nav-item mb-2"><a href="#" class="nav-link p-0 text-light">Pricing</a></li>
            <li class="nav-item mb-2"><a href="#" class="nav-link p-0 text-light">FAQs</a></li>
            <li class="nav-item mb-2"><a href="#" class="nav-link p-0 text-light">About</a></li>
          </ul>
        </div>

        <div class="col-6 col-md-2 mb-3">
          <h5>Section</h5>
          <ul class="nav flex-column">
            <li class="nav-item mb-2"><a href="#" class="nav-link p-0 text-light">Home</a></li>
            <li class="nav-item mb-2"><a href="#" class="nav-link p-0 text-light">Features</a></li>
            <li class="nav-item mb-2"><a href="#" class="nav-link p-0 text-light">Pricing</a></li>
            <li class="nav-item mb-2"><a href="#" class="nav-link p-0 text-light">FAQs</a></li>
            <li class="nav-item mb-2"><a href="#" class="nav-link p-0 text-light">About</a></li>
          </ul>
        </div>

        <div class="col-md-5 offset-md-1 mb-3">
          <form>
            <h5>Subscribe to our newsletter</h5>
            <p>Monthly digest of what's new and exciting from us.</p>
            <div class="d-flex flex-column flex-sm-row w-100 gap-2">
              <label for="newsletter1" class="visually-hidden">Email address</label>
              <input id="newsletter1" type="text" class="form-control" placeholder="Email address">
              <button class="btn btn-primary" type="button">Subscribe</button>
            </div>
          </form>
        </div>
      </div>

      <div class="d-flex flex-column flex-sm-row justify-content-between py-4 my-4 border-top">
        <p>© 2024 Company, Inc. All rights reserved.</p>
        <ul class="list-unstyled d-flex">
          <li class="ms-3"><a class="link-body-emphasis" href="#"><svg class="bi" width="24" height="24">
                <use xlink:href="#twitter"></use>
              </svg></a></li>
          <li class="ms-3"><a class="link-body-emphasis" href="#"><svg class="bi" width="24" height="24">
                <use xlink:href="#instagram"></use>
              </svg></a></li>
          <li class="ms-3"><a class="link-body-emphasis" href="#"><svg class="bi" width="24" height="24">
                <use xlink:href="#facebook"></use>
              </svg></a></li>
        </ul>
      </div>

    </footer>


  </div>
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

let hasScrolledToEnd = false;

window.addEventListener('scroll', () => {
  const footerText = document.querySelector('.scroll-footer-text');
  const scrollPosition = window.innerHeight + window.scrollY;
  const documentHeight = document.documentElement.offsetHeight;

  if (scrollPosition >= documentHeight - 1) {
    footerText.classList.remove('hidden');
    footerText.classList.add('visible');
    hasScrolledToEnd = true;
  } else if (hasScrolledToEnd) {
    footerText.classList.remove('visible');
    footerText.classList.add('hidden');
    hasScrolledToEnd = false;
  }
});
</script>

<style scoped>
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

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
  background: url('@/components/img/HeadImgFon.png') no-repeat;
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

h1 {
  font-size: 9rem;
  margin-bottom: 10px;
  text-align: left;
  font-weight: bold;
}

p {
  font-size: 1.9rem;
  margin-bottom: 1.5rem;
  text-align: left;
}

h2 {
  font-size: 1.9rem;
  font-weight: bold;

}

.header-button {
  transition: transform 0.3s ease, background-color 0.3s ease, color 0.3s ease;
  background-color: #f8f9fa;
  color: #000;
  border-radius: 10px;
}

.header-button:hover {
  transform: scale(1.1);
  background-color: #04202D;
  color: #fff;
}

.text-block {
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  background-color: #04202D;
  color: white;
  height: 300px;
}

.text-block:hover {
  transform: scale(1.02);
}

.text-block h3 {
  font-size: 1.9rem;
  font-weight: bold;
}

.text-block p {
  font-size: 1.5rem;
  font-weight: lighter;
}

.fade-in {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}

.Specialties_feed {
  margin: 0 auto;
  padding: 20px 0;
  max-width: 100%;
  overflow: hidden;
  display: flex;

  >* {
    flex: 0 0 100%;
  }
}

.Specialties_feed:has(.card:hover) .group {
  animation-play-state: paused;
}

.card {
  position: relative;
  background-color: #3E5879;
  color: white;
  width: 400px;
  height: 500px;
  margin: 20px;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, background 0.3s ease;
}

.card.card-1 {
  background-color: #04202D;
}

.card.card-2 {
  background-color: #10222E;
}

.card.card-3 {
  background-color: #253745;
}

.card.card-4 {
  background-color: #495B69;
}

.card:hover {
  transform: scale(1.1);
}

.card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
}

.card:hover::before {
  opacity: 0.7;
}

.card-content {
  position: relative;
  z-index: 2;
  text-align: left;
  margin-left: 10%;
}

.card h2 {
  font-size: 2em;
  margin-bottom: 80%;
  font-weight: bold;
}

.card ul {
  list-style: none;
  padding: 0;
}

.card ul li {
  margin: 5px 0;
  font-size: 18px;
  font-weight: lighter;
}

hr {
  border: none;
  border-top: 2px solid #ffffff;
  margin: 10px 0;
  width: 60%;
}


.card.card-1::before {
  background-image: url('@/components/img/CardImg.png');
}

.card.card-2::before {
  background-image: url('@/components/img/CardImgTwo.png');
}

.card.card-3::before {
  background-image: url('@/components/img/CardImgThree.png');
}

.card.card-4::before {
  background-image: url('@/components/img/CardImgFour.png');
}

.card-button {
  position: absolute;
  bottom: 5%;
  left: 95%;
  transform: translateX(-50%);
  padding: 10px 20px;
  background-color: #CCD0CF;
  color: rgb(0, 0, 0);
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
  z-index: 3;
  font-weight: bold;
}

.card:hover .card-button {
  opacity: 1;
  visibility: visible;
}

.card-button:hover {
  background-color: #CCD0CF;
  transform: translateX(-50%) scale(1.1);
}


.group {
  display: flex;
  gap: 20px;
  padding-right: 20px;
  will-change: transform;
  animation: scrolling 40s linear infinite;
}

@keyframes scrolling {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(-100%);
  }
}

.Find-university-container {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 20px;
  align-items: center;
  padding: 20px;
}

.Find-university-wrapper {
  grid-column: 2 / 12;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 20px;
  align-items: center;
}

.Find-university-text-block {
  grid-column: 2 / 7;
  text-align: center;
  align-items: center
}

.Find-university-text-block h2 {
  font-size: 2.9rem;
  margin-bottom: 10px;
  color: #577C8E;
  font-weight: bold;

}

.Find-university-text-block p {
  font-size: 1.2rem;
  margin-bottom: 20px;
  line-height: 1.5;
  color: #577C8E;
  text-align: center
}

.Find-university-text-block .action-button {
  padding: 10px 20px;
  background-color: #607d8b;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.5s ease;
}

.Find-university-text-block .action-button:hover {
  background-color: #455a64;
}

.Find-university-image-block {
  grid-column: 7 / 12;
}

.Find-university-image-block img {
  max-width: 100%;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.action-button {
  position: relative;
  width: 100px;
  height: 50px;
  background-color: #607d8b;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.5rem;
  cursor: pointer;
  transition: width 1s ease-in-out, background-color 1s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-left: 35%;
}

.action-button::after {
  content: "🔍";
  font-size: 1.5rem;
  opacity: 0;
  transform: scale(0);
  transition: opacity 1s ease-in-out, transform 1s ease-in-out;
  margin-left: -25px;
}

.action-button:hover {
  width: 170px;
  background-color: #455a64;
}


.hover-box {
  position: absolute;
  top: 50%;
  right: 10px;
  width: 30px;
  height: 30px;
  background-color: #ffffff;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translateY(-50%) scale(0.3);
  opacity: 0;
  transition: all 0.8s cubic-bezier(0.25, 1, 0.5, 1);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.magnifier-icon {
  width: 20px;
  height: 20px;
  transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
}

.action-button:hover .hover-box {
  transform: translateY(-50%) scale(1);
  opacity: 1;
}

.action-button .hover-box {
  transform: translateY(-50%) scale(0.3);
  opacity: 0;
}

.action-button {
  transition: all 5s cubic-bezier(0.25, 1, 0.5, 1);
}

.MainPageFooter-container {
  margin: 10% 10% 0 10%;
  color: white;
}

.MainPageFooter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10% 10% 5% 10%;
  background-color: #04202D;
  border-radius: 12px;

}

.MainPageFooter-container {
  margin: 50px 50px 50px 50px;

  position: relative;
}

.scroll-footer-wrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -1;
  pointer-events: none;
}

.scroll-footer-text {
  position: absolute;
  bottom: -25px;
  left: 0;
  width: 100%;
  font-family: 'Oswald', sans-serif;
  font-size: 15em;
  font-weight: 600;
  color: #BC0404;
  text-transform: uppercase;
  line-height: 100px;
  text-align: center;
  transition: bottom 0.5s ease, opacity 0.5s ease;
  opacity: 0;
}

.scroll-footer-text.visible {
  bottom: 0;
  opacity: 1;
}

.scroll-footer-text.hidden {
  bottom: -50px;
  opacity: 0;
}
</style>
