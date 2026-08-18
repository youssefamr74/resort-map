import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BookingModal from '../../src/components/BookingModal';
import { bookCabana } from '../../src/api/client';
import type { Cabana } from '../../src/types/resortMap';

vi.mock('../../src/api/client', () => ({
  getMap: vi.fn(),
  bookCabana: vi.fn(),
}));

const cabana: Cabana = {
  id: 'cabana-r0-c2',
  row: 0,
  col: 2,
  status: 'available',
};

beforeEach(() => {
  vi.mocked(bookCabana).mockReset();
});

describe('BookingModal', () => {
  it('renders the room number and guest name inputs', () => {
    render(<BookingModal cabana={cabana} onClose={vi.fn()} onSuccess={vi.fn()} />);

    expect(screen.getByLabelText('Room number')).toBeInTheDocument();
    expect(screen.getByLabelText('Guest name')).toBeInTheDocument();
  });

  it('calls bookCabana with the correct arguments and shows a confirmation on success', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    vi.mocked(bookCabana).mockResolvedValue({
      success: true,
      cabana: { ...cabana, status: 'booked' },
    });

    render(<BookingModal cabana={cabana} onClose={vi.fn()} onSuccess={onSuccess} />);

    await user.type(screen.getByLabelText('Room number'), '101');
    await user.type(screen.getByLabelText('Guest name'), 'Violet Cruz');
    await user.click(screen.getByRole('button', { name: 'Book cabana' }));

    expect(bookCabana).toHaveBeenCalledWith('cabana-r0-c2', '101', 'Violet Cruz');
    expect(await screen.findByRole('heading', { name: "You're booked!" })).toBeInTheDocument();
    expect(onSuccess).toHaveBeenCalledWith('cabana-r0-c2');
  });

  it('shows an error message instead of a confirmation when bookCabana rejects', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    vi.mocked(bookCabana).mockRejectedValue(new Error('This cabana is already booked.'));

    render(<BookingModal cabana={cabana} onClose={vi.fn()} onSuccess={onSuccess} />);

    await user.type(screen.getByLabelText('Room number'), '101');
    await user.type(screen.getByLabelText('Guest name'), 'Violet Cruz');
    await user.click(screen.getByRole('button', { name: 'Book cabana' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('This cabana is already booked.');
    expect(screen.queryByRole('heading', { name: "You're booked!" })).not.toBeInTheDocument();
    expect(onSuccess).not.toHaveBeenCalled();
  });
});
