import { Route, Routes } from "react-router"
import SignIn from "./pages/SignIn"
import Home from "./pages/Home"
import Connection from "./pages/Connection"
import PrivateRoute from "./components/PrivateRoute"
import useConnectionHook from "./hooks/useConnectionHook"

function App() {
  const connection = useConnectionHook();
  if (connection?.loading) {
    return <Connection />;
  }

  return (
    <Routes>
      <Route path="/" element={<SignIn/>}/>
      <Route path="/login" element={<SignIn/>}/>
      <Route path="/home/*" element={<PrivateRoute><Home/></PrivateRoute>} />
    </Routes>
  )
}

export default App
