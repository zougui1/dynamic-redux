// @ts-nocheck
import { splitWords } from './splitWords';

const phrase = 'This is a simple phrase';
const word = 'something';
const phraseWithWhitespaces = '   a phrase    with  useless spaces       ';

describe('splitWords()', () => {

  it('should execute without crashing', () => {
    splitWords(phrase);
    splitWords(word);
    splitWords(phrase);
  });

  it('should return an array with a length of 5', () => {
    const words = splitWords(phrase);

    expect(words.length).toBe(5);
  });

  it('should return `["this", "is", "a", "simple", "phrase"]`', () => {
    const words = splitWords(phrase);

    expect(words[0]).toBe('This');
    expect(words[1]).toBe('is');
    expect(words[2]).toBe('a');
    expect(words[3]).toBe('simple');
    expect(words[4]).toBe('phrase');
  });

  it('should return an array with a length of 1', () => {
    const words = splitWords(word);

    expect(words.length).toBe(1);
  });

  it('should return `["something"]`', () => {
    const words = splitWords(word);

    expect(words[0]).toBe('something');
  });

  it('should return an array with a length of 5', () => {
    const words = splitWords(phraseWithWhitespaces);

    expect(words.length).toBe(5);
  });

  it('should return `["a", "phrase", "with", "useless", "spaces"]`', () => {
    const words = splitWords(phraseWithWhitespaces);

    expect(words[0]).toBe('a');
    expect(words[1]).toBe('phrase');
    expect(words[2]).toBe('with');
    expect(words[3]).toBe('useless');
    expect(words[4]).toBe('spaces');
  });
});
