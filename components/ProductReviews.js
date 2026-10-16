import styled from "styled-components";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import Button from "@/components/Button";
import Input from "@/components/Input";
import WhiteBox from "@/components/WhiteBox";

const ReviewsSection = styled.div`
  margin: 60px 0;
  padding-top: 40px;
  border-top: 1px solid var(--color-border-light, rgba(0, 0, 0, 0.08));
`;

const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
  @media screen and (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const SectionTitle = styled.h2`
  font-family: var(--font-heading);
  font-size: 1.85rem;
  color: var(--color-text, #1a1a1a);
  margin: 0;
`;

const RatingOverview = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  margin-bottom: 36px;
  background: #fdfdfd;
  padding: 24px;
  border-radius: var(--radius-md, 8px);
  border: 1px solid var(--color-border-light, #eee);

  @media screen and (min-width: 640px) {
    grid-template-columns: 200px 1fr;
    align-items: center;
  }
`;

const ScoreBox = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .big-score {
    font-size: 3.2rem;
    font-weight: 700;
    font-family: var(--font-heading);
    color: var(--color-text, #1a1a1a);
    line-height: 1;
  }

  .stars {
    color: #D4AF37;
    margin: 8px 0 4px;
    font-size: 1.25rem;
  }

  .count {
    font-size: 0.85rem;
    color: var(--color-text-muted, #767676);
  }
`;

const BarsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const BarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.85rem;
  color: var(--color-text, #1a1a1a);

  .label {
    width: 50px;
    text-align: right;
  }

  .bar-bg {
    flex-grow: 1;
    background: #e5e7eb;
    height: 8px;
    border-radius: 999px;
    overflow: hidden;
  }

  .bar-fill {
    background: #D4AF37;
    height: 100%;
    border-radius: 999px;
  }

  .bar-count {
    width: 25px;
    text-align: left;
    color: var(--color-text-muted, #767676);
  }
`;

const ReviewsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ReviewCard = styled.div`
  padding: 20px;
  border-radius: var(--radius-sm, 6px);
  border: 1px solid var(--color-border-light, #eee);
  background: #fff;
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
`;

const ReviewerName = styled.div`
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--color-text, #1a1a1a);
  display: flex;
  align-items: center;
  gap: 8px;
`;

const VerifiedBadge = styled.span`
  background: rgba(13, 61, 41, 0.1);
  color: #0D3D29;
  font-size: 0.72rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 999px;
`;

const ReviewDate = styled.span`
  font-size: 0.8rem;
  color: var(--color-text-muted, #767676);
`;

const StarRating = styled.div`
  color: #D4AF37;
  font-size: 0.95rem;
  margin-bottom: 6px;
`;

const ReviewTitle = styled.h4`
  margin: 4px 0 8px;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text, #1a1a1a);
`;

const ReviewBody = styled.p`
  margin: 0;
  font-size: 0.92rem;
  line-height: 1.6;
  color: #4b5563;
`;

const FormBox = styled.form`
  background: #fdfdfd;
  border: 1px solid var(--color-border, #ddd);
  border-radius: var(--radius-md, 8px);
  padding: 24px;
  margin-bottom: 32px;

  h3 {
    margin: 0 0 16px;
    font-size: 1.25rem;
    font-family: var(--font-heading);
  }
`;

const StarSelector = styled.div`
  display: flex;
  gap: 8px;
  font-size: 1.6rem;
  cursor: pointer;
  margin-bottom: 16px;

  span {
    color: #e5e7eb;
    transition: color 150ms ease;

    &.filled {
      color: #D4AF37;
    }

    &:hover {
      transform: scale(1.15);
    }
  }
`;

export default function ProductReviews({ productId }) {
  const { data: session } = useSession();
  const [reviewsData, setReviewsData] = useState({ reviews: [], totalReviews: 0, averageRating: 0, breakdown: {} });
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  function fetchReviews() {
    axios.get(`/api/reviews?productId=${productId}`).then(res => {
      setReviewsData(res.data);
    }).catch(() => {});
  }

  async function handleSubmitReview(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedbackMsg('');

    try {
      await axios.post('/api/reviews', {
        productId,
        rating,
        title,
        content,
        userName: session?.user?.name || guestName,
        userEmail: session?.user?.email || guestEmail,
      });
      setIsSubmitting(false);
      setShowForm(false);
      setTitle('');
      setContent('');
      setFeedbackMsg('Thank you! Your collector review has been published.');
      fetchReviews();
    } catch (err) {
      setIsSubmitting(false);
      alert(err.response?.data?.error || 'Failed to submit review');
    }
  }

  const { reviews, totalReviews, averageRating, breakdown } = reviewsData;

  return (
    <ReviewsSection id="reviews">
      <SectionHeader>
        <div>
          <SectionTitle>Client Reviews & Testimonials</SectionTitle>
          <p style={{margin: '6px 0 0', color: '#767676', fontSize: '0.9rem'}}>
            Authentic experiences from collectors and timepiece enthusiasts
          </p>
        </div>
        <Button
          primary
          outline
          onClick={() => setShowForm(!showForm)}
          type="button"
        >
          {showForm ? 'Cancel Review' : 'Write a Review'}
        </Button>
      </SectionHeader>

      {feedbackMsg && (
        <div style={{background: 'rgba(13,61,41,0.1)', color: '#0D3D29', padding: '12px 16px', borderRadius: '6px', marginBottom: '24px', fontWeight: 500}}>
          ✓ {feedbackMsg}
        </div>
      )}

      {showForm && (
        <FormBox onSubmit={handleSubmitReview}>
          <h3>Share Your Acquisition Experience</h3>
          <label style={{display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px'}}>
            Your Rating
          </label>
          <StarSelector onMouseLeave={() => setHoverRating(0)}>
            {[1, 2, 3, 4, 5].map(star => (
              <span
                key={star}
                className={(hoverRating || rating) >= star ? 'filled' : ''}
                onMouseEnter={() => setHoverRating(star)}
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
          </StarSelector>

          {!session && (
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px'}}>
              <div>
                <label style={{display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '4px'}}>Your Name</label>
                <Input
                  type="text"
                  placeholder="e.g. Arthur Pendelton"
                  value={guestName}
                  required
                  onChange={e => setGuestName(e.target.value)}
                />
              </div>
              <div>
                <label style={{display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '4px'}}>Your Email</label>
                <Input
                  type="email"
                  placeholder="e.g. arthur@collector.com"
                  value={guestEmail}
                  required
                  onChange={e => setGuestEmail(e.target.value)}
                />
              </div>
            </div>
          )}

          <div style={{marginBottom: '12px'}}>
            <label style={{display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '4px'}}>Review Headline</label>
            <Input
              type="text"
              placeholder="e.g. Exquisite hand-finishing and impeccable timekeeping"
              value={title}
              required
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          <div style={{marginBottom: '16px'}}>
            <label style={{display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '4px'}}>Your Written Assessment</label>
            <textarea
              rows={4}
              placeholder="Describe the build quality, wrist presence, precision, and aesthetics..."
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid var(--color-border, #ccc)',
                borderRadius: '5px',
                fontFamily: 'inherit',
                fontSize: '0.95rem',
                outline: 'none',
              }}
              value={content}
              required
              onChange={e => setContent(e.target.value)}
            />
          </div>

          <Button primary type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting Review...' : 'Submit Collector Review'}
          </Button>
        </FormBox>
      )}

      {/* Aggregate Score Overview */}
      <RatingOverview>
        <ScoreBox>
          <div className="big-score">{averageRating > 0 ? averageRating : '5.0'}</div>
          <div className="stars">
            {'★'.repeat(Math.round(averageRating || 5))}
            {'☆'.repeat(5 - Math.round(averageRating || 5))}
          </div>
          <div className="count">
            Based on {totalReviews} {totalReviews === 1 ? 'collector review' : 'collector reviews'}
          </div>
        </ScoreBox>

        <BarsContainer>
          {[5, 4, 3, 2, 1].map(stars => {
            const count = breakdown[stars] || 0;
            const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : (stars === 5 ? 100 : 0);
            return (
              <BarRow key={stars}>
                <span className="label">{stars} stars</span>
                <div className="bar-bg">
                  <div className="bar-fill" style={{ width: `${pct}%` }} />
                </div>
                <span className="bar-count">{count}</span>
              </BarRow>
            );
          })}
        </BarsContainer>
      </RatingOverview>

      {/* Reviews List */}
      <ReviewsList>
        {reviews.length === 0 && (
          <div style={{textAlign: 'center', padding: '30px', color: '#767676', background: '#fafafa', borderRadius: '6px'}}>
            No reviews yet for this timepiece. Be the first to share your acquisition experience!
          </div>
        )}

        {reviews.map(review => (
          <ReviewCard key={review._id}>
            <ReviewHeader>
              <div>
                <ReviewerName>
                  {review.userName}
                  {review.verifiedPurchase && (
                    <VerifiedBadge>✓ Verified Acquisition</VerifiedBadge>
                  )}
                </ReviewerName>
                <StarRating>
                  {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                </StarRating>
              </div>
              <ReviewDate>
                {new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
              </ReviewDate>
            </ReviewHeader>
            {review.title && <ReviewTitle>{review.title}</ReviewTitle>}
            <ReviewBody>{review.content}</ReviewBody>
          </ReviewCard>
        ))}
      </ReviewsList>
    </ReviewsSection>
  );
}
