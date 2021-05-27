/**
 * Стиль скролла
 *
 * по умолчанию пустое значение - скролл с увеличением размера при наведении
 * narrow - Узкий скрол без увеличения размера при наведении
 */
export type ScrollStyle = 'default' | 'narrow';

/** Интерфейс настройки скролла */
interface IScrollSetting {
  /** Стиль скролла */
  type?: ScrollStyle;
  /** Всегда отображать скролл */
  alwaysShow?: boolean;
  /** Добавить скролл мышки как для тачпада */
  setMouseScrollLikeTouch?: boolean;
  /** Прозрачность */
  opacity?: number;
  /** Минимальный размер ползукна */
  minThumbSize?: number;
  /** Шаг прокрутки колеса мышки */
  wheelStep?: number;
}

export class ScrollConfig implements IScrollSetting{
  /** Стиль скролла */
  type: ScrollStyle = 'default';
  /** Всегда отображать скролл */
  alwaysShow: boolean = false;
  /** Добавить скролл мышки как для тачпада */
  setMouseScrollLikeTouch: boolean =  false;

  /** Прозрачность */
  public get opacity(): number {
    return this._opacity;
  }
  /** Прозрачность */
  public set opacity(v: number) {
    if (v < 0) {
      v = 0;
    }
    if (v > 1) {
      v = 1;
    }
    this._opacity = v;
  }
  /** Прозрачность */
  private _opacity: number = 1;

  /** Минимальный размер ползукна */
  minThumbSize: number = 40;
  /** Шаг прокрутки колеса мышки */
  wheelStep: number = 5;
}
