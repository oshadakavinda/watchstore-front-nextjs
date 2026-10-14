import styled from "styled-components";

const StepperWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--color-border, #cccccc);
  border-radius: var(--radius-sm, 5px);
  background-color: var(--color-surface, #ffffff);
  height: ${props => props.size === 'sm' ? '34px' : '42px'};
  overflow: hidden;
  box-sizing: border-box;
  transition: border-color 200ms ease;

  &:focus-within {
    border-color: var(--color-primary, #0D3D29);
  }
`;

const StepperButton = styled.button`
  background: transparent;
  border: 0;
  width: ${props => props.size === 'sm' ? '32px' : '40px'};
  height: 100%;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  color: var(--color-text, #1a1a1a);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 150ms ease, color 150ms ease;

  &:hover:not(:disabled) {
    background-color: #f2f2f2;
    color: var(--color-primary, #0D3D29);
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;

const StepperInput = styled.input`
  width: ${props => props.size === 'sm' ? '36px' : '46px'};
  height: 100%;
  border: 0;
  text-align: center;
  font-family: var(--font-body);
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text, #1a1a1a);
  background: transparent;
  outline: none;
  -moz-appearance: textfield;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

export default function QuantitySelector({
  value = 1,
  onChange,
  min = 1,
  max = 99,
  size = 'md',
  disabled = false,
}) {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleInputChange = (e) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      if (val >= min && val <= max) {
        onChange(val);
      }
    } else if (e.target.value === '') {
      onChange(min);
    }
  };

  return (
    <StepperWrapper size={size}>
      <StepperButton
        type="button"
        size={size}
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        aria-label="Decrease quantity"
      >
        −
      </StepperButton>
      <StepperInput
        type="number"
        size={size}
        value={value}
        min={min}
        max={max}
        disabled={disabled}
        onChange={handleInputChange}
        aria-label="Quantity"
      />
      <StepperButton
        type="button"
        size={size}
        onClick={handleIncrement}
        disabled={disabled || value >= max}
        aria-label="Increase quantity"
      >
        +
      </StepperButton>
    </StepperWrapper>
  );
}
