import { createRouter, createWebHistory, } from 'vue-router';
import MainPage from '@/components/MainPage.vue';
import UniversitiesSpecialtiesPage  from '@/components/SpecialtiesUnListPage.vue';
import UniversitiesSpecialtiesMinorPage  from '@/components/SUMListPage.vue';
import CollegesSpecialtiesPage  from '@/components/SpecialtiesColListPage.vue';
import CollegeQualificationsPage from '@/components/CollegeQualificationsPage.vue';
import UniversityAboutPage  from '@/components/UniversityAboutPage.vue';
import CollegeAboutPage  from '@/components/CollegeAboutPage.vue';
import UniversityListPage  from '@/components/UniversityListPage.vue';
import CollegesListPage  from '@/components/CollegesListPage.vue';
import TestPage  from '@/components/TestPage.vue';
import EventsPage  from '@/components/EventsPage.vue';
import UserPage  from '@/components/UserPage.vue';
import MapPage  from '@/components/MapPage.vue';
import RegisterInstitution from '@/components/RegisterInstitution.vue';
import LoginForm from '@/components/LoginForm.vue';
import { authStore } from '@/store/authStore';
import UniversityPortal  from '@/components/UniversityPortalPage.vue';
import InctitutionsMain from '@/components/institutions/InctitutionsMain.vue';
import InstitutionData from '@/components/institutions/InstitutionData.vue';
import InstitutionEvents from '@/components/institutions/InstitutionEvents.vue';
import InstitutionApplications from '@/components/institutions/InstitutionApplications.vue';
import InstitutionSpecialties from '@/components/institutions/InstitutionSpecialties.vue';
import LoginInstitution from '@/components/LoginInstitution.vue'; // Предполагаю, что этот компонент тоже есть
import SpecializationAboutPage from '@/components/SpecializationAboutPage.vue';
import TestInfoPage from '@/components/TestInfoPage.vue';
import TestQuestionsPage from '@/components/TestQuestionsPage.vue';
import TestResultPage from '@/components/TestResultPage.vue';


const routes = [
  { path: '/', component: MainPage },
  { path: '/Specialties/Universities/GlobalSpecialties', component: UniversitiesSpecialtiesPage },

  { path: '/login', component: LoginForm },
  { 
    path: '/user', 
    component: UserPage,
    beforeEnter: (to, from, next) => {
      if (!authStore.token) {
        next('/login');
      } else {
        next();
      }
    }
  },

  {
  path: '/test',
  name: 'TestPage',
  component: () => import('./components/TestPage.vue'),
},  

  { path: "/Specialties/Universities/GlobalSpecialties/Qualifications/:specialty_id", component: UniversitiesSpecialtiesMinorPage },
  { path: '/Specialties/Colleges', component: CollegesSpecialtiesPage },
  {
    path: '/Specialties/Colleges/Qualifications/:specialty_id', 
    name: 'CollegeQualifications',
    component: CollegeQualificationsPage 
  },
  {
    path: '/UniversityAbout/:id',
    name: 'UniversityAbout',
    component: UniversityAboutPage,
    props: true, // Передача `id` в качестве пропса
  },
  {
    path: '/CollegeAbout/:id',
    name: 'CollegeAbout',
    component: CollegeAboutPage,
    props: true,
  },
  { path: '/UniversityAbout', component: UniversityAboutPage },
  {
    path: '/InctitutionsMain',
    name: 'InctitutionsMain',
    component: InctitutionsMain,
    children: [
        {
            path: 'InstitutionData', // Убираем /institutions/, так как это дочерний маршрут
            name: 'InstitutionData',
            component: InstitutionData, // Используем импортированный компонент напрямую
        },
        {
            path: 'InstitutionEvents',
            name: 'InstitutionEvents',
            component: InstitutionEvents,
        },
        {
            path: 'InstitutionApplications',
            name: 'InstitutionApplications',
            component: InstitutionApplications,
        },
        {
            path: 'InstitutionSpecialties',
            name: 'InstitutionSpecialties',
            component: InstitutionSpecialties,
        },
    ],
},

  { path: '/LoginInstitution', component: LoginInstitution},
  { path: '/Universities', component: UniversityListPage },
  { path: '/Colleges', component: CollegesListPage },
  { path: '/Events', component: EventsPage },
  { path: '/Test', component: TestPage },
  { path: '/User', component: UserPage },
  { path: '/Map', component: MapPage },
  { path: '/register-institution', component:RegisterInstitution  },
  { path: '/UniversityPortal', component: UniversityPortal },
  {
    path: '/specialization/:id/about',
    name: 'SpecializationAbout',
    component: SpecializationAboutPage
  },
  { path: '/Test/Info', name: 'TestInfo', component: TestInfoPage },
  { path: '/Test/Questions', name: 'TestQuestions', component: TestQuestionsPage, props: true },
  { path: '/Test/Result/:id', name: 'TestResult', component: TestResultPage, props: true },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
