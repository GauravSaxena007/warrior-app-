import './App.css'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import Hero from './Components/hero/hero'
import Navbar from './Components/Navbar/Navbar'
import Welcome from './Components/welcome text/Welcome';
import Cards from './Components/cards/Cards';

function App() {


  return (
    <>
    <Navbar/>
     <Hero/>
     <Welcome/>
     <Cards/>
    </>
  )
}

export default App
