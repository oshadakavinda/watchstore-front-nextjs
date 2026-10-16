import React from "react";
import styled from "styled-components";
import Button from "@/components/Button";

const ErrorBox = styled.div`
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px 20px;

  h2 {
    font-family: var(--font-heading);
    font-size: 2rem;
    color: var(--color-text, #1a1a1a);
    margin-bottom: 12px;
  }

  p {
    color: var(--color-text-muted, #767676);
    max-width: 480px;
    margin-bottom: 24px;
    line-height: 1.6;
  }
`;

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an exception:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorBox>
          <div style={{ fontSize: '3rem', color: '#D4AF37', marginBottom: '12px' }}>⚙️</div>
          <h2>Horological Calibration Anomaly</h2>
          <p>
            An unexpected error occurred while rendering this timepiece display. Our engineering watchmakers have been alerted.
          </p>
          <Button primary onClick={() => window.location.reload()} type="button">
            Reload Page
          </Button>
        </ErrorBox>
      );
    }
    return this.props.children;
  }
}
