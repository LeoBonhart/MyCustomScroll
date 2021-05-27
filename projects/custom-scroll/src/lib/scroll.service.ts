import { Injectable } from '@angular/core';

export interface IWH {
  height: number;
  width: number;
}

@Injectable()
export class ScrollService {

  constructor() { }

  /**
   * Метод получения полного отступа элемента
   * @param elem Элемент
   */
  public getFullSizeElementPadding(elem: HTMLElement): IWH {
    const result: IWH = {
      height: this.getMaxSizePadding(elem, 'top') + this.getMaxSizePadding(elem, 'bottom'),
      width: this.getMaxSizePadding(elem, 'left') + this.getMaxSizePadding(elem, 'right')
    };
    return result;
  }

  /**
   * Метод получения максимального значения стиля
   * @param type Тип стиля
   * @param elem Елемент
   * @param prop Позиция стиля
   */
  public getMaxSize(type: string, elem: HTMLElement, prop: string): number {
    let _css = this.getCss(elem, type + '-' + prop, true);
    let _style = parseInt(elem.style[type +  this.capitalWord(prop)], 10);
    _css = isNaN(_css) ? 0 : _css;
    _style = isNaN(_style) ? 0 : _style;
    return Math.max( _css, _style);
  }

  /**
   * Метод получения значения значения CSS стиля
   * @param element Элемент у которого нужно узнать значение
   * @param property Свойство которое нужно узнать
   * @param number Выводить число (по умолчанию строка)
   */
  // tslint:disable-next-line:variable-name
  public getCss(element: HTMLElement, property: string, number: boolean = false): any {
    const rez: string = window.getComputedStyle(element, null).getPropertyValue(property);
    if (number) {
        let nRez: number;
        try {
          nRez = parseInt(rez, 10);
        } catch (error) {
          nRez = 0;
        }
        return nRez;
    } else {
      return rez;
    }
  }

  /**
   * Слово с заглавной буквы, применяется для перевода в CamelCase
   * @param word Слово
   */
  public capitalWord(word: string): string {
    if (!word) {
        return word;
    }
    return word[0].toUpperCase() + word.slice(1);
  }

  /**
   * Метод получения максимального внутреннего отступа
   * @param elem Елемент
   * @param prop Позиция
   */
  public getMaxSizePadding(elem: HTMLElement, prop: string): number {
    return this.getMaxSize('padding', elem, prop);
  }

  /**
   * Метод получения актуального значения позиции
   * @param e Событие
   */
  public getPagePosition(e: MouseEvent | TouchEvent): number {
    let top: number = 0;
    if ('pageY' in e) {
      top = e.pageY;
    }
    if ('changedTouches' in e) {
      top = e.changedTouches[0].pageY;
    }
    return top;
  }

  /**
   * Метод получение булевого значения от строки или числа
   * @param value Значение
   */
  public getBool(value: string | number) {
    if (typeof value === 'string') {
        switch (value.toLowerCase()) {
            case 'true':
                return true;
            case 'false':
                return false;
            default:
                return Boolean(parseInt(value, 10));
        }
    } else {
        return Boolean(value);
    }
  }

  /**
   * Копирование объекта
   * @param source Объект
   */
  public cloneObject<T extends object>(source: T): T {
    const clone = Object.create(source);
    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        const value = source[key];
        if (value !== null && typeof value === 'object') {
          clone[key] = this.cloneObject(value as any);
        } else {
          clone[key] = value;
        }
      }
    }
    return clone;
  }

}
