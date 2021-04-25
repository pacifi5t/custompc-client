import MainLayout from './layouts/MainLayout.svelte';
import HeaderlessLayout from './layouts/HeaderlessLayout.svelte';
import SignIn from './components/SignIn.svelte';
import SignUp from './components/SignUp.svelte';
import Builds from './components/Builds.svelte';
import Cabinet from './components/Cabinet.svelte';
import Configurator from './components/Configurator.svelte';
import CustomBuilds from './components/CustomBuilds.svelte';

const routes = [
  { name: '/', component: Builds, layout: MainLayout },
  { name: 'signin', component: SignIn, layout: HeaderlessLayout },
  { name: 'signup', component: SignUp, layout: HeaderlessLayout },
  { name: 'custom', component: CustomBuilds, layout: MainLayout },
  { name: 'configurator', component: Configurator, layout: MainLayout }
  /*{
    name: 'signup',
    component: SignUp,
    onlyIf: { guard: userIsAdmin, redirect: '/login' },
    nestedRoutes: [
      { name: 'index', component: AdminIndex },
      {
        name: 'employees',
        component: '',
        nestedRoutes: [
          { name: 'index', component: EmployeesIndex },
          { name: 'show/:id', component: EmployeesShow }
        ]
      }
    ]
  }*/
];

export { routes };
