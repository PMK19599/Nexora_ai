import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('App', () => {
  it('renders without crashing', () => {
    const qc = new QueryClient();
    const { container } = render(
      <QueryClientProvider client={qc}><BrowserRouter><div>Nexora AI</div></BrowserRouter></QueryClientProvider>
    );
    expect(container).toBeTruthy();
  });

  it('calculates mastery labels', () => {
    const f = (m: number) => m >= 80 ? 'Mastered' : m >= 60 ? 'Proficient' : m >= 40 ? 'Learning' : m >= 20 ? 'Beginner' : 'New';
    expect(f(90)).toBe('Mastered');
    expect(f(70)).toBe('Proficient');
    expect(f(45)).toBe('Learning');
    expect(f(5)).toBe('New');
  });
});
