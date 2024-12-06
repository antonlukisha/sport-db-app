import Main from '../pages/Main';
import Athletes from '../pages/Athletes';
import Competitions from '../pages/Competitions';
import Sports from '../pages/Sports';
import Results from '../pages/Results';

const routes = [
  {
    path: '/',
    element: <Main />,
  },
  {
    path: '/athletes',
    element: <Athletes />,
  },
  {
    path: '/competitions',
    element: <Competitions />,
  },
  {
    path: '/add-sport',
    element: <Sports />,
  },
  {
    path: '/results',
    element: <Results />,
  },
];

export default routes;
