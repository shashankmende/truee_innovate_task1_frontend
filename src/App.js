import logo from './logo.svg';
import './App.css';
import Layout from './components/Layout/Layout';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Form from './components/Form/Form';
import Position from './components/Position/Position';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout/>}/>
        <Route path='/form' element={<Form/>}/>
        <Route path='/position/:id' element={<Position/>}/>
        </Routes>
      </BrowserRouter>
      
      
    </div>
  );
}

export default App;
