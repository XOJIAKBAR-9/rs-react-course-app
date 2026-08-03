import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateCSV } from './csv';

describe('CSV Utility', () => {
  let mockCreateObjectURL: any;
  let mockRevokeObjectURL: any;
  let mockAppendChild: any;
  let mockRemoveChild: any;
  let mockClick: any;

  beforeEach(() => {
    mockCreateObjectURL = vi.fn().mockReturnValue('blob:test-url');
    mockRevokeObjectURL = vi.fn();
    window.URL.createObjectURL = mockCreateObjectURL;
    window.URL.revokeObjectURL = mockRevokeObjectURL;

    mockAppendChild = vi.spyOn(document.body, 'appendChild').mockImplementation(() => null as any);
    mockRemoveChild = vi.spyOn(document.body, 'removeChild').mockImplementation(() => null as any);
    
    // We can't easily spy on link.click() directly without mocking document.createElement
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'a') {
        const link = originalCreateElement(tagName) as HTMLAnchorElement;
        mockClick = vi.spyOn(link, 'click').mockImplementation(() => {});
        return link;
      }
      return originalCreateElement(tagName);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('does nothing if data is empty', () => {
    generateCSV([], 'test.csv');
    expect(mockCreateObjectURL).not.toHaveBeenCalled();
  });

  it('generates CSV and triggers download', () => {
    const data = [
      { name: 'Luke', age: 20 },
      { name: 'Vader, Darth', age: 45 }
    ];
    
    generateCSV(data, 'test.csv');
    
    expect(mockCreateObjectURL).toHaveBeenCalled();
    expect(mockAppendChild).toHaveBeenCalled();
    expect(mockClick).toHaveBeenCalled();
    expect(mockRemoveChild).toHaveBeenCalled();
    expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:test-url');
  });
});
