import { lazy, Suspense, useEffect, useState } from 'react'
import { useLocation, useClient } from './hooks/useClient'
import { TranslationProvider } from './contexts/TranslationProvider'
import { DEFAULT_THEME, ThemeProvider } from '@zendeskgarden/react-theming'
import SubscriptionWarning from './components/SubscriptionWarning' // Componente que muestra el mensaje de suscripción

// Carga diferida de los componentes
const TicketSideBar = lazy(() => import('./locations/TicketSideBar'))
const Modal = lazy(() => import('./locations/Modal'))

// Definimos las ubicaciones posibles
const LOCATIONS = {
  ticket_sidebar: TicketSideBar,
  modal: Modal,
  default: () => null
}

function App() {
  const location = useLocation()
  const client = useClient();
  const Location = LOCATIONS[location] || LOCATIONS.default

  // Estados para manejar la validación de la suscripción
  const [isSubscriptionValid, setIsSubscriptionValid] = useState(null); // null indica que aún no se ha hecho la validación
  const [loading, setLoading] = useState(true); // Para mostrar un loading mientras valida

  // Efecto para realizar la validación de la suscripción al cargar
  useEffect(() => {
    // Llamar a Zendesk para obtener el contexto y el subdominio
    client.context().then(context => {
      const subdomain = context.account.subdomain;

      // Llamada a tu API para validar la suscripción
      fetch(`https://mi-api.com/validar-suscripcion/${subdomain}`)
        .then(response => response.json())
        .then(data => {
          if (data.isValid) {
            setIsSubscriptionValid(true); // Suscripción válida
          } else {
            setIsSubscriptionValid(false); // Suscripción no válida
          }
        })
        .catch(error => {
          console.error("Error al validar la suscripción:", error);
          setIsSubscriptionValid(false); // En caso de error, asumimos que no es válida
        })
        .finally(() => {
          setLoading(false); // Terminamos la carga
        });
    });
  }, []);

  // Si está cargando la validación, mostramos un indicador de carga
  if (loading) {
    return <span>Cargando...</span>; // Mostrar un indicador de carga mientras se valida la suscripción
  }


  // Si la suscripción es válida, renderizamos la aplicación normalmente
  return (
    <ThemeProvider theme={{ ...DEFAULT_THEME }}>
      <TranslationProvider>
        <Suspense fallback={<span>Loading...</span>}>
          { !isSubscriptionValid && (
            <SubscriptionWarning />
          )}
          { isSubscriptionValid && (
            <Location />
          )}
        </Suspense>
      </TranslationProvider>
    </ThemeProvider>
  )
}

export default App