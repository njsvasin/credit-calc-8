import { IParser } from '../../interface/interface';

export class RcParsers {
  static notAllowed(notAllowed: string | RegExp): IParser {
    return RcParsers.replace(notAllowed, '');
  }

  // maxLength должен идти после notAllowed в массиве парсеров
  static maxLength(maxLength: number): IParser {
    return (value: string, selection: number) => {
      return RcParsers.getResult(value.substr(0, maxLength), selection);
    };
  }

  static number() {
    return RcParsers.notAllowed(/[^0-9]/ig);
  }

  static decimal() {
    return RcParsers.notAllowed(/[^0-9\.0-9$]/ig);
  }

  static replace(notAllowed: string | RegExp, replace: string | ((substring: string, ...args: any[]) => string)): IParser {
    return (value: string, selection: number) => {
      const newValue = value.replace(notAllowed, replace as any);

      return RcParsers.getResult(newValue, selection, value.length - newValue.length);
    };
  }

  /**
   *
   * @param newValue значение после запуска парсера
   * @param prevSelectionEnd позиция каретки до запуска парсера
   * @param countRemoved количество убранных символов ДО prevSelectionEnd после работы парсера
   */
  static getResult(newValue: string, prevSelectionEnd: number, countRemoved = 0) {
    console.log('newValue', newValue);
    console.log('prevSelectionEnd', prevSelectionEnd);
    console.log('countRemoved', countRemoved);
    return {
      selection: prevSelectionEnd - countRemoved,
      value: newValue
    };
  }
}
