# AI Workflow

Used Claude Code for scaffolding, styling, and test generation. Core logic and components were written by hand.

## Backend scaffolding

Prompted Claude Code to generate an empty layered folder structure (`models`, `services`, `routes`, `middleware`) with TODO comments only, no logic.

## Backend logic

Wrote the map parser, path-tile orientation logic, and booking validation rules by hand.

The path-tile logic checks each `#` tile's four neighbors, counts how many are also `#`, and picks the matching directional asset and rotation. Two of the five assets' default orientations were wrong on the first pass. Prompted Claude Code to help identify the issue and suggest a fix, checked the suggested fix against the actual PNGs and the rendered map, and applied the correct one (one of the two suggested fixes turned out to be wrong and was reverted after rendering).

## Frontend

Prompted Claude Code for an empty component/hook/type folder structure with TODOs only. Wrote `ResortMap`, `MapTile`, `BookingModal`, `useResortMap`, and the API client by hand.


## Styling

Prompted Claude Code to write the CSS, then reviewed and adjusted it (spacing, pool background, booked-cabana treatment).

## Entrypoint

Prompted Claude Code to generate a `run.sh` script that installs dependencies on first run and starts both the backend and frontend with a single command, accepting `--map` and `--bookings` flags.

## Tests

Prompted Claude Code to write the Vitest/Supertest/React Testing Library test suites against the finished, working source files. Instructed it not to alter the implementation to make tests pass, and to flag any real bug rather than fix it silently.

Reviewed the generated tests, particularly the booking service tests, against the actual validation rules.

## Documentation

Used Claude Code to help draft this file and the README, then reviewed and edited both.

## Summary

**Used for:** folder scaffolding, styling, test generation, documentation drafts, and help debugging the path-tile orientation logic.

**Written by hand:** map parser, path-tile orientation algorithm, booking validation logic, React components.