  <template>
    <div class="portal-container">
      <div class="portal-background">
        <div class="portal-background-title">
          <h1>
            Привлекайте новых студентов и <br>
            делитесь возможностями вашего университета
          </h1>
          <p>
            “Регистрируйте свой университет, <br />
            управляйте заявками и находите новых студентов”
          </p>
          <button @click="$router.push('/TestPage')" class="btn btn-light btn-lg header-button">
            <h2>Register</h2>
          </button>
        </div>
        <img src="@/components/img/PortalBackground.png" class="portal-background-img"
          :style="{ filter: 'brightness(' + scrollOpacity + ')' }" />

        <div ref="portalBlock" :class="{ 'visible': isVisible }" class="portal-block">

          <div class="portal-block-title">
            <h1>
              Привлекайте абитуриентов и <br>
              управляйте мероприятиями легко
            </h1>
            <p>
              “Регистрируйте свой университет, <br />
              управляйте заявками и находите новых студентов”
            </p>
          </div>

          <div class="portal-block-content">
            <div class="portal-block-card">
              <div class="portal-card-img">
                <img src="@/components/img/Calendar.png" class="portal-card-icon">
              </div>
              <div class="portal-card-content">
                <h3>Календарь мероприятий</h3>
                <p>
                  Выбирайте дату, время и
                  формат мероприятия
                  — онлайн или <br> офлайн
                </p>
              </div>
            </div>

            <div class="portal-block-card">
              <div class="portal-card-img">
                <img src="@/components/img/Checklist.png" class="portal-card-icon">
              </div>
              <div class="portal-card-content">
                <h3>Управление заявками</h3>
                <p>
                  Принимайте и обрабатывайте <br>
                  заявки от абитуриентов прямо<br>
                  в системе
                </p>
              </div>
            </div>

            <div class="portal-block-card">
              <div class="portal-card-img">
                <img src="@/components/img/Bell.png" class="portal-card-icon">
              </div>
              <div class="portal-card-content">
                <h3>Автоматические уведомления</h3>
                <p>
                  Абитуриенты получат<br>
                  напоминания о мероприятиях<br>
                  и статусе заявки
                </p>
              </div>
            </div>
          </div>



        </div>
      </div>

      <div class="portal-footer">
        <footer class="site-footer">
          <div class="container">
            <div class="row">
              <div class="col-sm-12 col-md-6">
                <h6>About</h6>
                <p class="text-justify">
                  Scanfcode.com <i>CODE WANTS TO BE SIMPLE </i> is an initiative
                  to help the upcoming programmers with the code. Scanfcode
                  focuses on providing the most efficient code or snippets as the
                  code wants to be simple. We will help programmers build up
                  concepts in different programming languages that include C, C++,
                  Java, HTML, CSS, Bootstrap, JavaScript, PHP, Android, SQL and
                  Algorithm.
                </p>
              </div>

              <div class="col-xs-6 col-md-3">
                <h6>Categories</h6>
                <ul class="footer-links">
                  <li>
                    <a href="http://scanfcode.com/category/c-language/">C</a>
                  </li>
                  <li>
                    <a href="http://scanfcode.com/category/front-end-development/">UI Design</a>
                  </li>
                  <li>
                    <a href="http://scanfcode.com/category/back-end-development/">PHP</a>
                  </li>
                  <li>
                    <a href="http://scanfcode.com/category/java-programming-language/">Java</a>
                  </li>
                  <li>
                    <a href="http://scanfcode.com/category/android/">Android</a>
                  </li>
                  <li>
                    <a href="http://scanfcode.com/category/templates/">Templates</a>
                  </li>
                </ul>
              </div>

              <div class="col-xs-6 col-md-3">
                <h6>Quick Links</h6>
                <ul class="footer-links">
                  <li><a href="http://scanfcode.com/about/">About Us</a></li>
                  <li><a href="http://scanfcode.com/contact/">Contact Us</a></li>
                  <li>
                    <a href="http://scanfcode.com/contribute-at-scanfcode/">Contribute</a>
                  </li>
                  <li>
                    <a href="http://scanfcode.com/privacy-policy/">Privacy Policy</a>
                  </li>
                  <li><a href="http://scanfcode.com/sitemap/">Sitemap</a></li>
                </ul>
              </div>
            </div>
            <hr />
          </div>
          <div class="container">
            <div class="row">
              <div class="col-md-8 col-sm-6 col-xs-12">
                <p class="copyright-text">
                  Copyright &copy; 2017 All Rights Reserved by
                  <a href="#">Scanfcode</a>.
                </p>
              </div>

              <div class="col-md-4 col-sm-6 col-xs-12">
                <ul class="social-icons">
                  <li>
                    <a class="facebook" href="#"><i class="fa fa-facebook"></i></a>
                  </li>
                  <li>
                    <a class="twitter" href="#"><i class="fa fa-twitter"></i></a>
                  </li>
                  <li>
                    <a class="dribbble" href="#"><i class="fa fa-dribbble"></i></a>
                  </li>
                  <li>
                    <a class="linkedin" href="#"><i class="fa fa-linkedin"></i></a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  </template>

<script>
import { ref, onMounted, onUnmounted } from "vue";

export default {
  setup() {
    const scrollOpacity = ref(1);
    const portalBlock = ref(null);
    const isVisible = ref(false);
    let observer = null;
    let lastScrollTop = 0;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const maxScroll = 700;
      scrollOpacity.value = Math.max(1 - scrollTop / maxScroll, 0.4);

      // Проверяем направление прокрутки
      if (scrollTop > lastScrollTop) {
        // Прокрутка вниз — показываем блок
        isVisible.value = true;
      } else {
        // Прокрутка вверх — скрываем блок
        isVisible.value = false;
      }
      lastScrollTop = scrollTop;
    };

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        isVisible.value = entry.isIntersecting;
      });
    };

    onMounted(() => {
      window.addEventListener("scroll", handleScroll);

      observer = new IntersectionObserver(handleIntersection, {
        threshold: 0.3, // Когда 30% блока будет видно, сработает анимация
      });

      if (portalBlock.value) {
        observer.observe(portalBlock.value);
      }
    });

    onUnmounted(() => {
      window.removeEventListener("scroll", handleScroll);
      if (observer) {
        observer.disconnect();
      }
    });

    return { scrollOpacity, portalBlock, isVisible };
  },
};
</script>

<style scoped>
.portal-container {
  width: 100%;
  height: 100vh;
}

.portal-background {
  overflow: hidden;
  background-image: url("@/components/img/PortalFon.png");
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 4.5%;
}

.portal-background-title {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-top: 7%;
}

.portal-background-img {
  margin-top: 0%;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

h1 {
  font-size: 3.5em;
  color: white;
  font-weight: bold;
}

p {
  font-size: 1.5em;
  color: white;
  font-weight: lighter;
}

.header-button {
  transition: transform 0.3s ease, background-color 0.3s ease, color 0.3s ease;
  background-color: #f8f9fa;
  color: #000;
  border-radius: 10px;
  margin-top: 20px;
}

.header-button:hover {
  transform: scale(1.1);
  background-color: #04202d;
  color: #fff;
}

.portal-block {
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  margin: 20px;
  border-radius: 10px;
  width: 100%;
  height: 90%;
  margin-top: 23%;

  transform: translateY(100px);
  opacity: 0;
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;

}

.portal-block.visible {
  transform: translateY(0);
  opacity: 1;
}

.portal-block:not(.visible) {
  transform: translateY(100px);
  opacity: 0;
}


.portal-block-title {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;

}

.portal-block-content {
  display: flex;
  justify-content: space-around;
  width: 100%;
  height: 20%;
  margin-top: 5%;
}

.portal-block-card {
  background-color: #00080E;
  background: rgba(0, 0, 0, 0.45);
  border-radius: 12px;
  padding: 20px;
  width: 23%;
  height: 360px;
}

.portal-card-icon {
  width: 100px
}

.portal-card-img {
  display: flex;
  justify-content: flex-end
}

h3 {
  font-size: 2em;
  color: white;
  font-weight: bold;
}

p {
  font-size: 1.2em;
  color: white;
  font-weight: lighter;
}

.portal-card-content {
  padding: 4%;
  width: 100%;
}





.site-footer {
  background-color: #26272b;
  padding: 45px 0 20px;
  font-size: 15px;
  line-height: 24px;
  color: #737373;
}

.site-footer hr {
  border-top-color: #bbb;
  opacity: 0.5;
}

.site-footer hr.small {
  margin: 20px 0;
}

.site-footer h6 {
  color: #fff;
  font-size: 16px;
  text-transform: uppercase;
  margin-top: 5px;
  letter-spacing: 2px;
}

.site-footer a {
  color: #737373;
}

.site-footer a:hover {
  color: #3366cc;
  text-decoration: none;
}

.footer-links {
  padding-left: 0;
  list-style: none;
}

.footer-links li {
  display: block;
}

.footer-links a {
  color: #737373;
}

.footer-links a:active,
.footer-links a:focus,
.footer-links a:hover {
  color: #3366cc;
  text-decoration: none;
}

.footer-links.inline li {
  display: inline-block;
}

.site-footer .social-icons {
  text-align: right;
}

.site-footer .social-icons a {
  width: 40px;
  height: 40px;
  line-height: 40px;
  margin-left: 6px;
  margin-right: 0;
  border-radius: 100%;
  background-color: #33353d;
}

.copyright-text {
  margin: 0;
}

@media (max-width: 991px) {
  .site-footer [class^="col-"] {
    margin-bottom: 30px;
  }
}

@media (max-width: 767px) {
  .site-footer {
    padding-bottom: 0;
  }

  .site-footer .copyright-text,
  .site-footer .social-icons {
    text-align: center;
  }
}

.social-icons {
  padding-left: 0;
  margin-bottom: 0;
  list-style: none;
}

.social-icons li {
  display: inline-block;
  margin-bottom: 4px;
}

.social-icons li.title {
  margin-right: 15px;
  text-transform: uppercase;
  color: #96a2b2;
  font-weight: 700;
  font-size: 13px;
}

.social-icons a {
  background-color: #eceeef;
  color: #818a91;
  font-size: 16px;
  display: inline-block;
  line-height: 44px;
  width: 44px;
  height: 44px;
  text-align: center;
  margin-right: 8px;
  border-radius: 100%;
  -webkit-transition: all 0.2s linear;
  -o-transition: all 0.2s linear;
  transition: all 0.2s linear;
}

.social-icons a:active,
.social-icons a:focus,
.social-icons a:hover {
  color: #fff;
  background-color: #29aafe;
}

.social-icons.size-sm a {
  line-height: 34px;
  height: 34px;
  width: 34px;
  font-size: 14px;
}

.social-icons a.facebook:hover {
  background-color: #3b5998;
}

.social-icons a.twitter:hover {
  background-color: #00aced;
}

.social-icons a.linkedin:hover {
  background-color: #007bb6;
}

.social-icons a.dribbble:hover {
  background-color: #ea4c89;
}

@media (max-width: 767px) {
  .social-icons li.title {
    display: block;
    margin-right: 0;
    font-weight: 600;
  }
}
</style>
