import { assertIsDefined, getDelta } from '../../src/Zeus/helpers';

describe('Zeus service', () => {
  it('should test assertIsDefined', () => {
    expect(function () {
      assertIsDefined(null, 'msg');
    }).toThrow(new Error('msg'));

    expect(function () {
      assertIsDefined(null);
    }).toThrow(new Error('Variable not defined'));
  });

  describe('getDelta', () => {
    describe('field type === primitive', () => {
      it('should find differense with primitive fields', () => {
        const oldValue = { name: 'bob', age: 2 };
        const newValue = { name: 'sam', age: 2 };
        const result = getDelta(newValue, oldValue);
        expect(result).toEqual({ name: 'sam' });
      });
    });
    describe('field type === object', () => {
      it('should find differense with nested objects', () => {
        const oldValue = { user: { name: 'bob', age: 2 } };
        const newValue = { user: { name: 'sam', age: 2 } };
        const result = getDelta(newValue, oldValue);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect(result).toEqual({ user: { name: 'sam', age: 2 } as any });
      });
    });
    describe('field type === array', () => {
      describe('array of primitives', () => {
        it('should find differense when added new value', () => {
          const oldValue = { ids: ['1', '2'] };
          const newValue = { ids: ['1', '2', '3'] };
          const result = getDelta(newValue, oldValue);
          expect(result).toEqual({ ids: ['1', '2', '3'] });
        });
        it('should find differense when removed value', () => {
          const oldValue = { ids: ['1', '2'] };
          const newValue = { ids: ['1'] };
          const result = getDelta(newValue, oldValue);
          expect(result).toEqual({ ids: ['1'] });
        });
        it('should find differense when one of values changed', () => {
          const oldValue = { ids: ['1', '1'] };
          const newValue = { ids: ['1', '2'] };
          const result = getDelta(newValue, oldValue);
          expect(result).toEqual({ ids: ['1', '2'] });
        });
        it('should find differense when values equal but in defferent order', () => {
          const oldValue = { ids: ['1', '2'] };
          const newValue = { ids: ['2', '1'] };
          const result = getDelta(newValue, oldValue);
          expect(result).toEqual({ ids: ['2', '1'] });
        });
      });
      describe('array of objects', () => {
        it('should not find differense when objects equal', () => {
          const oldValue = {
            users: [
              { name: 'sam', age: 2 },
              { name: 'bob', age: 2 },
            ],
          };
          const newValue = {
            users: [
              { name: 'sam', age: 2 },
              { name: 'bob', age: 2 },
            ],
          };
          const result = getDelta(newValue, oldValue);
          expect(result).toEqual({});
        });
        it('should find differense if order changed + avoid title', () => {
          const oldValue = {
            users: [
              { name: 'bob', age: 2 },
              { name: 'sam', age: 2 },
            ],
            title: 'title',
          };
          const newValue = {
            users: [
              { name: 'sam', age: 2 },
              { name: 'bob', age: 2 },
            ],
            title: 'title',
          };
          const result = getDelta(newValue, oldValue);
          expect(result).toEqual({
            users: [
              { name: 'sam', age: 2 },
              { name: 'bob', age: 2 },
            ],
          });
        });
        it('should find differense when object changed + avoid title', () => {
          const oldValue = {
            users: [
              { name: 'sam', age: 2 },
              { name: 'bob', age: 2 },
            ],
            title: 'title',
          };
          const newValue = {
            users: [
              { name: 'sam', age: 2 },
              { name: 'bob', age: 22222 },
            ],
            title: 'title',
          };
          const result = getDelta(newValue, oldValue);
          expect(result).toEqual({
            users: [
              { name: 'sam', age: 2 },
              { name: 'bob', age: 22222 },
            ],
          });
        });
        it('should find differense when object field removed + avoid title', () => {
          const oldValue = {
            users: [
              { name: 'sam', age: 2 },
              { name: 'bob', age: 2 },
            ],
            title: 'title',
          };
          const newValue = {
            users: [{ name: 'sam', age: 2 }, { name: 'bob' }],
            title: 'title',
          };
          const result = getDelta(newValue, oldValue);
          expect(result).toEqual({
            users: [{ name: 'sam', age: 2 }, { name: 'bob' }],
          });
        });
        it('should find differense when object field added + avoid title', () => {
          const oldValue = {
            users: [
              { name: 'sam', age: 2 },
              { name: 'bob', age: 2 },
            ],
            title: 'title',
          };
          const newValue = {
            users: [
              { name: 'sam', age: 2 },
              { name: 'bob', age: 2, surname: 'doe' },
            ],
            title: 'title',
          };
          const result = getDelta(newValue, oldValue);
          expect(result).toEqual({
            users: [
              { name: 'sam', age: 2 },
              { name: 'bob', age: 2, surname: 'doe' },
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ] as any[],
          });
        });
        it('should find differense when nested object changed + avoid title', () => {
          const oldValue = {
            users: [{ name: { first: 'jon', last: 'doe' }, age: 2 }],
            title: 'title',
          };
          const newValue = {
            users: [{ name: { first: 'ben', last: 'doe' }, age: 2 }],
            title: 'title',
          };
          const result = getDelta(newValue, oldValue);
          expect(result).toEqual({
            users: [
              { name: { first: 'ben', last: 'doe' }, age: 2 },
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ] as any[],
          });
        });
      });
    });
  });
});
