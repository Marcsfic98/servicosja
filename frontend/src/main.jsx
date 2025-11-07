import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter , RouterProvider } from 'react-router'
import App from './App.jsx'
import Home from './pages/home/home.jsx'

const pages = createBrowserRouter([
  {
    path:'/',
    element:<App/>,
    children:[
      { path: '/' , element: <Home/> },
      { path: '/services' , element: <Home/> },
      { path: '/profile' , element: <Home/> },
      { path: '/plates' , element: <Home/> },
      { path: '/auth' , element: <Home/> },
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={pages}> </RouterProvider>
  </StrictMode>,
)
