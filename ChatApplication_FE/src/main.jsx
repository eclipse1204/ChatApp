import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import {store} from './redux/store.js'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor } from './redux/store.js'
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <App/>
        <Toaster/>
      </BrowserRouter>
    </PersistGate>
  </Provider>
)
