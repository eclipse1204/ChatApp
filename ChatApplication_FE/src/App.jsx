import { Route, Routes } from "react-router"
import SignIn from "./pages/SignIn"
import Home from "./pages/Home"
import PrivateRoute from "./components/PrivateRoute"

function App() {
  return (
    <Routes>
      <Route path="/" element={<SignIn/>}/>
      <Route path="/login" element={<SignIn/>}/>
      <Route path="/home/*" element={<PrivateRoute><Home/></PrivateRoute>} />
    </Routes>
  )
}

export default App
