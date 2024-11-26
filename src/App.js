import logo from './logo.svg';
import './App.css';
import Layout from './components/Layout/Layout';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Form from './components/Form/Form';
import Position from './components/Position/Position';
import Candidate from './components/Candidate/Candidate';
import LookupFeature from './components/Lookup/Lookup';
import CandidateViewPage from './components/CandidateViewPage/CandidateViewPage';
import Support from './components/Support/Support';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout/>}/>
        <Route path='/form' element={<Form/>}/>
        <Route path='/position/:id' element={<Position/>}/>
        <Route path='/candidate' element={<Candidate/>}/>
        <Route path='/candidate/:id' element={<CandidateViewPage/>}/>
        <Route path='/support' element={<Support/>}/>
        </Routes>
      </BrowserRouter>
      
      
    </div>
  );
}

export default App;
