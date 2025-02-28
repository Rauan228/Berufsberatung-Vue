import { createRouter, createWebHistory, } from 'vue-router';
import MainPage from '@/components/MainPage.vue';
import UniversitiesSpecialtiesPage  from '@/components/SpecialtiesUnListPage.vue';
import UniversitiesSpecialtiesMinorPage  from '@/components/SUMListPage.vue';
import CollegesSpecialtiesPage  from '@/components/SpecialtiesColListPage.vue';
import UniversityAboutPage  from '@/components/UniversityAboutPage.vue';
import UniversityListPage  from '@/components/UniversityListPage.vue';
import CollegesListPage  from '@/components/CollegesListPage.vue';
import TestPage  from '@/components/TestPage.vue';
import EventsPage  from '@/components/EventsPage.vue';
import UserPage  from '@/components/UserPage.vue';
import MapPage  from '@/components/MapPage.vue';

import UniversityPortal  from '@/components/UniversityPortalPage.vue';


const routes = [
  { path: '/', component: MainPage },
  { path: '/Specialties/Universities/GlobalSpecialties', component: UniversitiesSpecialtiesPage },
  { path: '/Specialties/Universities/GlobalSpecialties/Qualifications/:id', component: UniversitiesSpecialtiesMinorPage },
  { path: '/Specialties/Colleges', component: CollegesSpecialtiesPage },
  { path: '/UniversityAbout', component: UniversityAboutPage },
  { path: '/Universities', component: UniversityListPage },
  { path: '/Colleges', component: CollegesListPage },
  { path: '/Events', component: EventsPage },
  { path: '/Test', component: TestPage },
  { path: '/User', component: UserPage },
  { path: '/Map', component: MapPage },

  { path: '/UniversityPortal', component: UniversityPortal }

];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
