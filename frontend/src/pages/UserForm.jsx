import { useState } from 'react';
import { Link } from 'react-router-dom';
import StarRating from '../components/StarRating.jsx';
import { submitFeedback } from '../api/feedback.js';
import { CATEGORIES, ACCENT, RATING_LABELS } from '../lib/constants.js';

const surface = '#17181d';
const field =
  'bg-[#101114] border border-[rgba(255,255,255,0.1)] rounded-[10px] px-[14px] py-[12px] text-[15px] text-[#ebecf0] font-[inherit] box-border';

export default function UserForm() {
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Mirrors the server contract: category + rating + comment required, email optional.
  const emailValid = !email.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const canSubmit = category && rating > 0 && comment.trim() && emailValid;

  async function handleSubmit() {
    if (!canSubmit) {
      setError(
        !emailValid
          ? 'That email address does not look valid.'
          : 'Please pick a category, a rating, and add a comment.',
      );
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await submitFeedback({
        email: email.trim() || undefined,
        category,
        rating,
        comment: comment.trim(),
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setSubmitted(false);
    setEmail('');
    setCategory('');
    setRating(0);
    setComment('');
    setError('');
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-5 pb-24 box-border">
      <header className="w-full max-w-[640px] flex items-center justify-between pt-7">
        <div className="flex items-center gap-[10px]">
          <div
            className="w-[30px] h-[30px] rounded-[8px] flex items-center justify-center font-bold text-[16px] text-[#141414]"
            style={{ background: ACCENT }}
          >
            A
          </div>
          <span className="font-semibold text-[16px] tracking-[0.2px]">Acowale</span>
        </div>
        <span className="text-[12px] text-[rgba(235,236,240,0.45)]">Customer feedback</span>
      </header>

      {!submitted ? (
        <div className="w-full max-w-[640px] mt-[52px] animate-fade-up">
          <h1 className="m-0 text-[34px] font-bold tracking-[-0.5px] leading-[1.15] text-pretty">
            Tell us what you think
          </h1>
          <p className="mt-3 text-[15px] leading-[1.55] text-[rgba(235,236,240,0.55)] max-w-[46ch]">
            Your feedback goes straight to the team building Acowale. It takes under a minute.
          </p>

          <div
            className="mt-9 border border-[rgba(255,255,255,0.07)] rounded-[16px] p-7 flex flex-col gap-[26px] box-border"
            style={{ background: surface }}
          >
            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-semibold text-[rgba(235,236,240,0.8)]">
                Your email <span className="font-normal text-[rgba(235,236,240,0.4)]">(optional)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="you@company.com"
                className={`${field} min-h-[44px]`}
              />
            </div>

            {/* Category */}
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-semibold text-[rgba(235,236,240,0.8)]">
                What is it about?
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => {
                  const active = category === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        setCategory(c);
                        setError('');
                      }}
                      className="min-h-[44px] px-4 rounded-full text-[14px] font-medium cursor-pointer transition-colors"
                      style={{
                        border: `1px solid ${active ? ACCENT : 'rgba(255,255,255,0.14)'}`,
                        background: active ? ACCENT : 'transparent',
                        color: active ? '#141414' : 'rgba(235,236,240,0.75)',
                      }}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Rating */}
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-semibold text-[rgba(235,236,240,0.8)]">
                How was your experience?
              </label>
              <div className="flex items-center">
                <StarRating
                  value={rating}
                  onChange={(n) => {
                    setRating(n);
                    setError('');
                  }}
                />
                <span className="ml-2 text-[13px] text-[rgba(235,236,240,0.45)]">
                  {RATING_LABELS[rating]}
                </span>
              </div>
            </div>

            {/* Comment */}
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-semibold text-[rgba(235,236,240,0.8)]">
                Comments
              </label>
              <textarea
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                  setError('');
                }}
                placeholder="What went well? What could be better?"
                rows={4}
                className={`${field} leading-[1.5] resize-y`}
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <span
                className="text-[12px]"
                style={{ color: error ? '#FB7185' : 'rgba(52,211,153,0.8)' }}
              >
                {error || (canSubmit ? 'Ready to send' : '')}
              </span>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="min-h-[46px] px-[26px] rounded-[10px] border-0 text-[15px] font-semibold text-[#141414] cursor-pointer transition hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: ACCENT }}
              >
                {submitting ? 'Sending…' : 'Send feedback'}
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link to="/admin/login" className="text-[13px] text-[rgba(235,236,240,0.4)] hover:text-[#FF6B2C]">
              Admin console →
            </Link>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-[640px] mt-[110px] text-center animate-fade-up">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto text-[28px] text-[#34D399] bg-[rgba(52,211,153,0.12)] border border-[rgba(52,211,153,0.4)]">
            ✓
          </div>
          <h1 className="mt-6 text-[28px] font-bold">Thanks — got it.</h1>
          <p className="mt-[10px] mx-auto text-[15px] text-[rgba(235,236,240,0.55)] max-w-[40ch] leading-[1.55]">
            Your feedback was sent to the team. We read every single one.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-7 min-h-[44px] px-[22px] rounded-[10px] border border-[rgba(255,255,255,0.15)] bg-transparent text-[#ebecf0] text-[14px] font-medium cursor-pointer transition-colors hover:border-[rgba(255,255,255,0.4)]"
          >
            Submit another
          </button>
        </div>
      )}
    </div>
  );
}
