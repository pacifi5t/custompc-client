import MainLayout from './components/MainLayout.svelte';
import HeaderlessLayout from './components/HeaderlessLayout.svelte';
import SignIn from './views/SignIn.svelte';
import SignUp from './views/SignUp.svelte';
import Builds from './views/Builds.svelte';
import Cabinet from './views/Cabinet.svelte';
import Configurator from './views/Configurator.svelte';
import CustomBuilds from './views/CustomBuilds.svelte';

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
