import { useState } from 'react';
import type { FormEvent } from 'react';
import { bookCabana } from '../api/client';
import type { Cabana } from '../types/resortMap';

interface BookingModalProps {
  cabana: Cabana;
  onClose: () => void;
  onSuccess: (cabanaId: string) => void;
}

function BookingModal({ cabana, onClose, onSuccess }: BookingModalProps) {
  const [room, setRoom] = useState('');
  const [guestName, setGuestName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await bookCabana(cabana.id, room.trim(), guestName.trim());
      setConfirmed(true);
      onSuccess(cabana.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Booking failed.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        {confirmed ? (
          <>
            <h2>You're booked!</h2>
            <p>
              Cabana confirmed for {guestName}, room {room}.
            </p>
            <button type="button" onClick={onClose}>
              Back to map
            </button>
          </>
        ) : (
          <>
            <h2>Book this cabana</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Room number
                <input value={room} onChange={(e) => setRoom(e.target.value)} required />
              </label>
              <label>
                Guest name
                <input value={guestName} onChange={(e) => setGuestName(e.target.value)} required />
              </label>

              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}

              <div className="modal-actions">
                <button type="button" onClick={onClose} disabled={submitting}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting}>
                  {submitting ? 'Booking...' : 'Book cabana'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default BookingModal;
