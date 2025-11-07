import { Outlet } from "react-router"
import Navbar from "./components/navbar/navbar"


export default function App() {

  return (
    <>
        <Navbar/>
        <Outlet/>
    </>
  )
}


