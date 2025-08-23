import './App.css'
import Navbar from './components/navbar'
import Footer from './components/footer'

function App() {
  return (
    <div className='flex flex-col justify-between items-center w-screen overflow-x-hidden bg-green-900'>
      <Navbar />
      <Footer />
    </div>
  )
}

export default App
