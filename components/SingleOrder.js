import styled from "styled-components";

const StyledOrder = styled.div`
  margin: 20px 0;
  padding: 24px;
  background: #ffffff;
  border: 1px solid var(--color-border-light, rgba(0, 0, 0, 0.08));
  border-radius: var(--radius-md, 8px);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 12px;
  border-bottom: 1px solid var(--color-border-light, #eee);
  padding-bottom: 14px;
  margin-bottom: 18px;

  time {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--color-text, #1a1a1a);
  }

  .order-id {
    font-family: monospace;
    color: #64748b;
    font-size: 0.82rem;
  }
`;

const StatusStepper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin: 16px 0 20px;
  position: relative;
`;

const StepItem = styled.div`
  text-align: center;
  position: relative;

  .step-icon {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    margin: 0 auto 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: bold;
    background: ${props => props.$active ? 'var(--color-primary, #0D3D29)' : '#e2e8f0'};
    color: ${props => props.$active ? '#ffffff' : '#64748b'};
    transition: all 200ms ease;
  }

  .step-label {
    font-size: 0.78rem;
    font-weight: ${props => props.$active ? '600' : '400'};
    color: ${props => props.$active ? 'var(--color-text, #1a1a1a)' : '#94a3b8'};
  }
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  @media screen and (min-width: 640px) {
    grid-template-columns: 1.2fr 1fr;
  }
`;

const ProductRow = styled.div`
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--color-text, #1a1a1a);
  margin-bottom: 6px;
  display: flex;
  justify-content: space-between;

  .name {
    span {
      color: var(--color-primary, #0D3D29);
      font-weight: 600;
      margin-right: 4px;
    }
  }

  .price {
    font-weight: 600;
    font-family: monospace;
  }
`;

const AddressBox = styled.div`
  font-size: 0.85rem;
  line-height: 1.5;
  color: #4b5563;
  background: #f8faf9;
  padding: 12px 16px;
  border-radius: 6px;

  strong {
    color: var(--color-text, #1a1a1a);
    display: block;
    margin-bottom: 4px;
  }
`;

const TrackingBanner = styled.div`
  margin-top: 14px;
  padding: 8px 12px;
  background: rgba(13, 61, 41, 0.08);
  border: 1px solid rgba(13, 61, 41, 0.2);
  border-radius: 6px;
  font-size: 0.82rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .label {
    font-weight: 600;
    color: var(--color-primary, #0D3D29);
  }

  .number {
    font-family: monospace;
    font-weight: 700;
    color: #1e293b;
  }
`;

export default function SingleOrder({ _id, line_items = [], createdAt, paid, status = 'processing', trackingNumber, coupon, discount, ...rest }) {
  const isShipped = status === 'shipped' || status === 'delivered';
  const isDelivered = status === 'delivered';

  let orderTotal = 0;
  if (Array.isArray(line_items)) {
    line_items.forEach(item => {
      orderTotal += ((item.quantity || 1) * (item.price_data?.unit_amount || 0)) / 100;
    });
  }

  return (
    <StyledOrder>
      <OrderHeader>
        <div>
          <time>{new Date(createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</time>
          {_id && <div className="order-id">Order Ref: #{_id.slice(-8).toUpperCase()}</div>}
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            padding: '2px 8px',
            borderRadius: '999px',
            backgroundColor: paid ? 'rgba(46, 125, 79, 0.12)' : 'rgba(200, 71, 43, 0.12)',
            color: paid ? '#2E7D4F' : '#C8472B',
          }}>
            {paid ? 'PAID' : 'PAYMENT PENDING'}
          </span>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            padding: '2px 8px',
            borderRadius: '999px',
            backgroundColor: status === 'delivered' ? '#dcfce7' : status === 'shipped' ? '#dbeafe' : '#fef3c7',
            color: status === 'delivered' ? '#166534' : status === 'shipped' ? '#1e40af' : '#92400e',
            textTransform: 'capitalize',
          }}>
            {status}
          </span>
        </div>
      </OrderHeader>

      {/* Fulfillment Status Progress Stepper */}
      <StatusStepper>
        <StepItem $active={true}>
          <div className="step-icon">1</div>
          <div className="step-label">Order Confirmed</div>
        </StepItem>
        <StepItem $active={isShipped}>
          <div className="step-icon">2</div>
          <div className="step-label">Courier In Transit</div>
        </StepItem>
        <StepItem $active={isDelivered}>
          <div className="step-icon">3</div>
          <div className="step-label">Delivered</div>
        </StepItem>
      </StatusStepper>

      {trackingNumber && (
        <TrackingBanner>
          <span className="label">Priority Courier Tracking Number:</span>
          <span className="number">{trackingNumber}</span>
        </TrackingBanner>
      )}

      <DetailsGrid style={{ marginTop: '16px' }}>
        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', color: '#1a1a1a' }}>Acquired Items</div>
          {line_items.map((item, index) => (
            <ProductRow key={index}>
              <div className="name">
                <span>{item.quantity}x</span>
                {item?.price_data?.product_data?.name || "Product name unavailable"}
              </div>
              <div className="price">
                Rs. {(((item.quantity || 1) * (item.price_data?.unit_amount || 0)) / 100).toLocaleString()}
              </div>
            </ProductRow>
          ))}
          {coupon && (
            <div style={{ fontSize: '0.82rem', color: '#2E7D4F', marginTop: '6px' }}>
              Promo code {coupon} applied {discount ? `(-Rs. ${discount.toLocaleString()})` : ''}
            </div>
          )}
          <div style={{ borderTop: '1px solid #eee', paddingTop: '8px', marginTop: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '0.95rem' }}>
            <span>Order Value</span>
            <span>Rs. {orderTotal.toLocaleString()}</span>
          </div>
        </div>

        <AddressBox>
          <strong>Delivery Destination</strong>
          {rest.name}
          <br />
          {rest.email}
          <br />
          {rest.streetAddress}
          <br />
          {rest.postalCode} {rest.city}, {rest.country}
        </AddressBox>
      </DetailsGrid>
    </StyledOrder>
  );
}
