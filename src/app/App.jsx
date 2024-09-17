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
  const apiServer = import.meta.env.MODE === "development" ? "/geoshGlobal" : "https://zd.geoshglobal.com"

  // Estados para manejar la validación de la suscripción
  const [isSubscriptionValid, setIsSubscriptionValid] = useState(true); // true por default
  const [subscriptionDetails, setIsSubscriptionDetails] = useState({}); // null indica que aún no se ha hecho la validación
  const [loading, setLoading] = useState(false); // Para mostrar un loading mientras valida

  // Eliminacion de validacion de suscripcion externa
  // // Efecto para realizar la validación de la suscripción al cargar
  // useEffect(() => {
  //   // Llamar a Zendesk para obtener el contexto y el subdominio
  //   client.context().then(context => {
  //     const subdomain = context.account.subdomain;

  //     // Primero, obtener la cantidad de usuarios activos
  //     return client.request('/api/v2/users.json?role=agent&active=true').then(response => {
  //       const numAgents = response.users.length;

  //       // Validar la suscripción con la cantidad de agentes
  //       return fetch(`${apiServer}/subscription/validate/${subdomain}/1/${numAgents}`, {
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         }
  //       });
  //     });
  //   })
  //   .then(response => response.json())
  //   .then(data => {
  //     if (data.active) {
  //       setIsSubscriptionValid(true); // Suscripción válida
  //     } else {
  //       setIsSubscriptionValid(false); // Suscripción no válida
  //     }

  //     setIsSubscriptionDetails( data );
  //   })
  //   .catch(error => {
  //     console.error("Error al validar la suscripción:", error);
  //     setIsSubscriptionValid(false); // En caso de error, asumimos que no es válida
  //   })
  //   .finally(() => {
  //     setLoading(false); // Terminamos la carga
  //   });
  // }, []);

  // Si está cargando la validación, mostramos un indicador de carga
  if (loading) {
    return <span>Loading...</span>; // Mostrar un indicador de carga mientras se valida la suscripción
  }


  // Si la suscripción es válida, renderizamos la aplicación normalmente
  return (
    <ThemeProvider theme={{ ...DEFAULT_THEME }}>
      <TranslationProvider>
        <Suspense fallback={<span>Loading...</span>}>
          {/* { !isSubscriptionValid && (
            <SubscriptionWarning details={subscriptionDetails} />
          )} */}
          { isSubscriptionValid && (
            <Location />
          )}
        </Suspense>
      </TranslationProvider>
    </ThemeProvider>
  )
}

export default App