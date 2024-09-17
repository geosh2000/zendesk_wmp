import { useEffect, useState } from 'react'
import { useClient } from '../hooks/useClient'
import { useI18n } from '../hooks/useI18n'
import 'bootstrap/dist/css/bootstrap.min.css';

// Zendesk Garden
import { Button, Anchor } from '@zendeskgarden/react-buttons'
import { Grid, Row, Col } from '@zendeskgarden/react-grid'
import { Code, LG, OrderedList, UnorderedList, Span } from '@zendeskgarden/react-typography'
import { Accordion } from '@zendeskgarden/react-accordions'
import { Dots } from '@zendeskgarden/react-loaders'
import { PALETTE} from '@zendeskgarden/react-theming'
import { Avatar } from '@zendeskgarden/react-avatars'


import styled from 'styled-components'

import { useData } from '../services/dataContext';
import ReactPlayer from 'react-player/lazy'
import ReactAudioPlayer from 'react-audio-player';

const TicketSideBar = () => {
  const client = useClient()
  const { t } = useI18n()
  const { updateData } = useData();

  const [clientData, setClientData] = useState({});
  const [ticketData, setTicketData] = useState({});
  const [attachments, setAttachments] = useState([]);
  const [media, setMedia] = useState({url: '', type: ''});
  const [loading, setLoading] = useState(false);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);

    // Opciones para el formato deseado
    const options = {
      day: '2-digit',         // Día en dos dígitos
      month: 'short',         // Mes abreviado (Ene, Feb, Mar, etc.)
      hour: '2-digit',        // Hora en dos dígitos
      minute: '2-digit',      // Minutos en dos dígitos
    };

    // Formatear fecha y hora
    return date.toLocaleString('es-ES', options).replace(',', '');
  };

  const getTicketData = async () => {

      setLoading(true);

      await client.get(["ticket", "currentUser"]).then(function(data) {
        setClientData( data.currentUser );
        setTicketData( data.ticket );
        setLoading(false);
      });

      client.on('ticket.changed', function (event) {
        // Tu lógica aquí
        console.log('El ticket ha cambiado', event);
      });

      return true;
    }

    // Usamos useEffect para llamar a ticketData una sola vez al montar el componente
    useEffect(() => {
      getTicketData();
    }, []);

    // Actualiza arreglo de adjuntos
    useEffect(() => {
      console.log( 'conversations', ticketData.conversation );
      // Verifica si ticketData tiene la estructura esperada
      if (ticketData && ticketData.conversation) {
        const newAttachments = ticketData.conversation
          .map(item => {
            const attach = (item.attachments[0]?.contentType?.includes("video") || item.attachments[0]?.contentType?.includes("audio")) ? item.attachments : []

            if( attach.length > 0 ){
              attach[0].timestamp = formatDate(item.timestamp)
              attach[0].avatar = item.author?.avatar || ""
            }

            return attach
          }) // Extrae attachments o devuelve un array vacío
          .flat(); // Aplana el array de arrays en un solo array

        setAttachments(newAttachments);
        console.log(newAttachments);
      }
    }, [ticketData]);

  const handleMediaSelect = ( url, type ) => {
    setMedia({ url, type})
  }

  const handleNewInstance = () => {

    updateData({
      modal: true,
      url: '',
      name: 'Jorge'
    });

    client.invoke('instances.create', {
      location: 'modal',
      url: import.meta.env.VITE_ZENDESK_LOCATION,
      size: {
        width: '650px',
        height: '400px'
      }
    })
  }

  useEffect(() => {
    client.invoke('resize', { width: '100%', height: '900px' })
  }, [client])

  return (
    <div className="p-0">

      { loading && (
        <GridContainer>
          <Row justifyContent="center">
            <Col textAlign="center">
              <Dots size={32} color={PALETTE.blue[600]} />
            </Col>
          </Row>
        </GridContainer>
      )}

      <Grid style={{width: "100%"}}>
          { !attachments[0]?.contentUrl && (
            <Row justifyContent="center">
                <Code size="medium" hue="red">No se encontraron archivos multimedia</Code>
            </Row>
          )}
          { attachments[0]?.contentUrl && (
            <>
              <Row className="pb-3">
                <LG isBold>Archivos multimedia ({ attachments.length })</LG>
              </Row>
              <Row>
                      { attachments.map( ( item, index ) => {
                        return (
                          <div key={index} className="mb-4" style={{width: "100%"}}>
                            <GridContainer>
                              <Row>
                                <Col size={3}>
                                    <Avatar backgroundColor={PALETTE.grey[600]} size="small" className="me-2" >
                                      <img src={item.avatar} />
                                    </Avatar>
                                    <Row>
                                      <Span hue={PALETTE.grey[600]}>{ item.timestamp } </Span>
                                    </Row>
                                </Col>
                                <Col>
                                  { (item.contentType.split("/")[0] === 'video') && (
                                    <Row>
                                      <Accordion level={4} isCompact isExpandable className='' style={{width: "100%"}}>
                                        <Accordion.Section>
                                          <Accordion.Header>
                                            <Accordion.Label>Video</Accordion.Label>
                                          </Accordion.Header>
                                          <Accordion.Panel>
                                          <ReactPlayer url={ item.contentUrl }
                                            controls={true}
                                            width='200px'
                                          />
                                          </Accordion.Panel>
                                        </Accordion.Section>
                                      </Accordion>
                                      {/* <Anchor space="sm" onClick={ () => { handleMediaSelect(item.contentUrl, item.contentType.split("/")[0]) }}>{item.contentType.split("/")[0] === "audio" ? "Escuchar" : "Ver"} {item.contentType.split("/")[0]}</Anchor> */}
                                      
                                    </Row>
                                  )}
                                  { (item.contentType.split("/")[0] === 'audio') && (
                                    <Row>
                                      <ReactAudioPlayer src={item.contentUrl} controls />
                                    </Row>
                                  )}
                                </Col>
                              </Row>
                            </GridContainer>

                          </div>
                        );
                      })}
              </Row>
            </>
          )}
      </Grid>
    </div>
  )
}

const GridContainer = styled(Grid)`
  display: grid;
  gap: ${(props) => props.theme.space.sm};
`

export default TicketSideBar
