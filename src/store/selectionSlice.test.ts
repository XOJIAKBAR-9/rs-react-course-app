import { describe, it, expect } from 'vitest';
import selectionReducer, { toggleSelection, unselectAll } from './selectionSlice';
import type { SelectionState } from './selectionSlice';

describe('selectionSlice', () => {
  const initialState: SelectionState = { items: [] };
  const mockItem = { id: '1', name: 'Luke', birth_year: '19BBY', url: 'http://swapi.dev/api/people/1/' };

  it('should handle initial state', () => {
    expect(selectionReducer(undefined, { type: 'unknown' })).toEqual({ items: [] });
  });

  it('should handle toggleSelection (add)', () => {
    const actual = selectionReducer(initialState, toggleSelection(mockItem));
    expect(actual.items).toHaveLength(1);
    expect(actual.items[0]).toEqual(mockItem);
  });

  it('should handle toggleSelection (remove)', () => {
    const stateWithItem = { items: [mockItem] };
    const actual = selectionReducer(stateWithItem, toggleSelection(mockItem));
    expect(actual.items).toHaveLength(0);
  });

  it('should handle unselectAll', () => {
    const stateWithItems = { items: [mockItem, { ...mockItem, id: '2' }] };
    const actual = selectionReducer(stateWithItems, unselectAll());
    expect(actual.items).toHaveLength(0);
  });
});
