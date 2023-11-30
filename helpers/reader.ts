import { IReadField } from '../models';

export class Reader {
  public static field(
    input: string,
    start: number,
    uptoLast: boolean = false,
  ): IReadField<string> {
    let data = '';

    if (start < input.length) {
      data = input.slice(start);
    }

    if (data === '') {
      return {
        value: '',
        newStart: 0,
        error: new Error('Insufficient input string'),
      };
    }

    let lineIdx = 0;
    if (uptoLast) {
      lineIdx = Reader.getUptoLastIndex(data);
    } else {
      lineIdx = Reader.getIndex(data);
    }

    if (lineIdx === -1) {
      return { value: '', newStart: 0, error: new Error('Invalid delimiter') };
    }

    return { value: data.slice(0, lineIdx), newStart: lineIdx + 1, error: null };
  }

  public static fieldAsInt(input: string, start: number): IReadField<number> {
    let data = '';

    if (start < input.length) {
      data = input.slice(start);
    }

    if (data === '') {
      return {
        value: 0,
        newStart: 0,
        error: new Error('Insufficient input string'),
      };
    }

    const lineIdx = Reader.getIndex(data);
    if (lineIdx === -1) {
      return { value: 0, newStart: 0, error: new Error('Invalid delimiter') };
    }

    if (data.slice(0, lineIdx) === '') {
      return { value: 0, newStart: lineIdx + 1, error: null };
    }

    const parsedValue = parseInt(data.slice(0, lineIdx), 10);
    if (isNaN(parsedValue)) {
      return { value: 0, newStart: 0, error: new Error('Invalid value') };
    }

    return { value: parsedValue, newStart: lineIdx + 1, error: null };
  }

  private static getIndex(input: string): number {
    const idx1 = input.indexOf(',');
    const idx2 = input.indexOf('/');

    if (idx1 === -1) {
      return idx2;
    }

    if (idx2 > -1 && idx2 < idx1) {
      return idx2;
    }

    return idx1;
  }

  private static getSize(line: string): number {
    const size = line.indexOf('/');
    if (size >= 0) {
      return size + 1;
    }

    return size;
  }

  private static getUptoLastIndex(input: string): number {
    const lastIdx = input.length - 1;
    return lastIdx;
  }
}
