import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import App from './App'
import './index.css'
import About from './pages/about/about'
import Home from './pages/home/home'
import Login from './pages/login/login'
import Plans from './pages/plans/plans'
import ProviderDatails from './pages/providerDatails/providerDatails'
import ProviderPerfil from './pages/providerPerfil/providerPerfil'
import ProviderRegistration from './pages/providerRegistration/providerRegistration'
import Services from './pages/services/services'
import UserPerfil from './pages/userPerfil/userPerfil'
import UserRegistration from './pages/userRegistration/userRegistration'

const router = createBrowserRouter([
  {
    path:'/',
    element:<App/>,
    children:[
      { path: '/' , element: <Home/> },
      { path: '/services' , element: <Services/> },
      { path: '/login' , element: <Login/> },
      { path: '/plans' , element: <Plans/> },
      { path: '/about' , element: <About/> },
      { path: '/userRegistration' , element: <UserRegistration/> },
      { path: '/providerRegistration' , element: <ProviderRegistration/> },
      { path: '/providerDatails' , element: <ProviderDatails/> },
      { path: '/userPerfil' , element: <UserPerfil/> },
      { path: '/providerPerfil' , element: <ProviderPerfil/> },
    ]
  }
])

const rootElement = document.getElementById('root');

if(rootElement){
  createRoot(rootElement).render(
      <StrictMode>
        <RouterProvider router={router}/> 
     </StrictMode>,
  )
}


