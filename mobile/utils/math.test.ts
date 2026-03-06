import { add } from './math';

jest.useFakeTimers();

describe('Math utilities', () => {
    it('adds two numbers correctly', () => {
        expect(add(2, 3)).toBe(5);
    });
});
