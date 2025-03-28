import './App.css'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import Hero from './Components/hero/hero'
import Navbar from './Components/Navbar/Navbar'
import Welcome from './Components/welcome text/Welcome';
import Cards from './Components/cards/Cards';
import Footer from './Components/footer/footer';
import Dropdowncourses from './Components/dropdown-courses-menus/dropdowncourses';


function App() {


  return (
    <>
    <Navbar/>
     <Hero/>
     <Welcome/>
     <Cards/>
     <Footer/>
     <Dropdowncourses/>
    </>
  )
}

export default App
