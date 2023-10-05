import Canvas from './canvas/Canvas'
import Client from './client-side-canvas/Client-Canvas'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"

function App() {
  return (
  <BrowserRouter>
  <Routes>
  <Route path="/client" element={<Client/>}></Route>
  <Route path="/canvas" element={<Canvas/>}></Route>
  </Routes>
  </BrowserRouter>
  )
}

export default App
