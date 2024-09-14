import { useCallback } from 'react';
import styled from 'styled-components';
import { DEFAULT_THEME } from '@zendeskgarden/react-theming';
import {
  Notification,
  Title,
  Close,
  ToastProvider,
  useToast
} from '@zendeskgarden/react-notifications';
import { Row, Col } from '@zendeskgarden/react-grid';
import { Button } from '@zendeskgarden/react-buttons';

const StyledRow = styled(Row)`
  & + & {
    margin-top: ${p => p.theme.space.md};
  }
`;

const Toasts = () => {
  const { addToast } = useToast();

  const handleClick = useCallback((placement) => {
    return () => {
      addToast(
        ({ close }) => (
          <Notification type="info" style={{ maxWidth: 450 }}>
            <Title>Info</Title>
            Turnip greens yarrow ricebean cauliflower sea lettuce kohlrabi amaranth water
            <Close aria-label="Close" onClick={close} />
          </Notification>
        ),
        { placement }
      );
    };
  }, [addToast]);

  return (
    <>
      <StyledRow>
        <Col size="4">
          <Button onClick={handleClick('top-start')} isStretched>
            top-start
          </Button>
        </Col>
        <Col size="4">
          <Button onClick={handleClick('top')} isStretched>
            top
          </Button>
        </Col>
        <Col size="4">
          <Button onClick={handleClick('top-end')} isStretched>
            top-end
          </Button>
        </Col>
      </StyledRow>
      <StyledRow>
        <Col size="4">
          <Button onClick={handleClick('bottom-start')} isStretched>
            bottom-start
          </Button>
        </Col>
        <Col size="4">
          <Button onClick={handleClick('bottom')} isStretched>
            bottom
          </Button>
        </Col>
        <Col size="4">
          <Button onClick={handleClick('bottom-end')} isStretched>
            bottom-end
          </Button>
        </Col>
      </StyledRow>
    </>
  );
};

const topProps = {
    style: { top: DEFAULT_THEME.space.base * 3 }
};

const bottomProps = {
    style: { bottom: DEFAULT_THEME.space.base * 3 }
};

const placementProps = {
    'top-start': topProps,
    top: topProps,
    'top-end': topProps,
    'bottom-start': bottomProps,
    bottom: bottomProps,
    'bottom-end': bottomProps
};

const Example = () => (
  <ToastProvider placementProps={placementProps} zIndex={1}>
    <Toasts />
  </ToastProvider>
);

export default Example;
