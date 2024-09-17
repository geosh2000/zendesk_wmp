import React, { useEffect } from 'react';
import { Alert, Title, Close } from '@zendeskgarden/react-notifications';
import { useI18n } from '../hooks/useI18n'
import { Anchor } from '@zendeskgarden/react-buttons';
import { MD, Paragraph, Span, OrderedList, UnorderedList  } from '@zendeskgarden/react-typography'
import { Grid, Row, Col } from '@zendeskgarden/react-grid'
import { useClient } from '../hooks/useClient'
import 'bootstrap/dist/css/bootstrap.min.css';

const SubscriptionWarning = ( params ) => {
    const { t } = useI18n()
    const client = useClient();

    useEffect(() => {
        client.invoke('resize', { width: '100%', height: '900px' })
    }, [client])

    return (
        <div className="container">
            <Alert type="warning">
                <Title>{ t('subscription.warning.title') }</Title>
                <Grid>
                    <Row>
                        { t('subscription.warning.msg') }<br></br>
                    </Row>
                    <Row>
                        <Span>
                            <Anchor href="https://mi-sitio.com/suscripciones" target="_blank">{ t('subscription.warning.button') }</Anchor>
                        </Span>
                    </Row>
                    <Row className='mt-4'>
                        <UnorderedList>
                            { Object.entries(params.details).map(([key, value]) => (
                                    <UnorderedList.Item key={key}>{key.charAt(0).toUpperCase() + key.slice(1)}: {typeof value === 'object' ? JSON.stringify(value) : String(value)}</UnorderedList.Item>
                            ))}
                        </UnorderedList> 
                    </Row>
                </Grid>
                <Close aria-label="Close Alert" />
            </Alert>
        </div>
    );
  };
  
  export default SubscriptionWarning;