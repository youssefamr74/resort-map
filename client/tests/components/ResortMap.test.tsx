import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ResortMap from '../../src/components/ResortMap';
import { getMap, bookCabana } from '../../src/api/client';
import type { ResortMapResponse } from '../../src/types/resortMap';

vi.mock('../../src/api/client', () => ({
  getMap: vi.fn(),
  bookCabana: vi.fn(),
}));

// c p W(available)
// . # W(booked)
const mockMap: ResortMapResponse = {
  width: 3,
  height: 2,
  tiles: [
    [{ type: 'chalet' }, { type: 'pool' }, { type: 'cabana', cabanaId: 'cabana-r0-c2' }],
    [
      { type: 'empty' },
      { type: 'path', asset: 'arrowEnd', rotation: 0 },
      { type: 'cabana', cabanaId: 'cabana-r1-c2' },
    ],
  ],
  cabanas: [
    { id: 'cabana-r0-c2', row: 0, col: 2, status: 'available' },
    { id: 'cabana-r1-c2', row: 1, col: 2, status: 'booked' },
  ],
  poolBounds: { row: 0, col: 1, rowSpan: 1, colSpan: 1 },
};

beforeEach(() => {
  vi.mocked(getMap).mockReset();
  vi.mocked(bookCabana).mockReset();
});

describe('ResortMap', () => {
  it('renders a loading state initially', () => {
    vi.mocked(getMap).mockReturnValue(new Promise(() => {}));

    render(<ResortMap />);

    expect(screen.getByText('Loading resort map...')).toBeInTheDocument();
  });

  it('renders the grid once getMap resolves', async () => {
    vi.mocked(getMap).mockResolvedValue(mockMap);

    render(<ResortMap />);

    expect(await screen.findByRole('button', { name: 'Cabana available' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cabana booked' })).toBeInTheDocument();
  });

  it('opens the BookingModal when an available cabana is clicked', async () => {
    const user = userEvent.setup();
    vi.mocked(getMap).mockResolvedValue(mockMap);

    render(<ResortMap />);

    const availableCabana = await screen.findByRole('button', { name: 'Cabana available' });
    await user.click(availableCabana);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Book this cabana' })).toBeInTheDocument();
  });

  it('shows an "already booked" message instead of opening the modal when a booked cabana is clicked', async () => {
    const user = userEvent.setup();
    vi.mocked(getMap).mockResolvedValue(mockMap);

    render(<ResortMap />);

    const bookedCabana = await screen.findByRole('button', { name: 'Cabana booked' });
    await user.click(bookedCabana);

    expect(screen.getByRole('alert')).toHaveTextContent('This cabana is already booked.');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
