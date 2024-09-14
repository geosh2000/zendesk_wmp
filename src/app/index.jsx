import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ClientProvider } from './contexts/ClientProvider.jsx'
import '@zendeskgarden/css-bedrock'
import './index.css'
import { DataProvider } from './services/dataContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <DataProvider>
    <ClientProvider>
      <App />
    </ClientProvider>
  </DataProvider>
)
