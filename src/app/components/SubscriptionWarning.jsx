import React from 'react';
import { Alert, Title, Close } from '@zendeskgarden/react-notifications';
import { useI18n } from '../hooks/useI18n'
import { Anchor } from '@zendeskgarden/react-buttons';
import { MD, Paragraph, Span } from '@zendeskgarden/react-typography'
import 'bootstrap/dist/css/bootstrap.min.css';

const SubscriptionWarning = () => {
    const { t } = useI18n()

    return (
        <div className="container">
            <Alert type="warning">
                <Title>{ t('subscription.warning.title') }</Title>
                { t('subscription.warning.msg') }<br></br>
                <Span>
                    <Anchor href="https://mi-sitio.com/suscripciones" target="_blank">{ t('subscription.warning.button') }</Anchor>
                </Span>
                <Close aria-label="Close Alert" />
            </Alert>
        </div>
    );
  };
  
  export default SubscriptionWarning;