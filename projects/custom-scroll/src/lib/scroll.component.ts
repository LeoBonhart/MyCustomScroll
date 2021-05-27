import { Component, ElementRef, HostListener, OnChanges,
  OnInit, AfterViewInit, AfterViewChecked, OnDestroy,
  ViewChild, Input, SimpleChanges } from '@angular/core';
import { fromEvent, merge, Subscription } from 'rxjs';
import { filter, map, mapTo, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ScrollService } from './scroll.service';
import { ScrollSettingService } from './scroll-setting.service';
import { ScrollConfig, ScrollStyle } from './scroll.config';

interface IThumbStyle {
  height: string;
  minHeight: string;
  top: string;
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'custom-scroll',
  templateUrl: './scroll.component.html',
  styleUrls: ['./scroll.component.scss'],
  providers: [ScrollService]
})
export class ScrollComponent implements OnChanges, OnInit, AfterViewInit, AfterViewChecked, OnDestroy {

  /** Добавление стрима в список запущенных стримов */
  public set streams(v: Subscription) {
    this._streams.push(v);
  }
  /** Список запущенных стримов */
  private _streams: Array<Subscription> = new Array<Subscription>();

  /** Скролл */
  @ViewChild('scroll', {static: false})
  private scroll: ElementRef<HTMLDivElement>;
  /** Ползунок */
  @ViewChild('thumb', {static: false})
  private thumb: ElementRef<HTMLDivElement>;
  /** Глаыный контейнер */
  @ViewChild('overflow', {static: false})
  private overflow: ElementRef<HTMLDivElement>;
  /** Контейнер с данными */
  @ViewChild('content', {static: false})
  private content: ElementRef<HTMLDivElement>;
  /** Всегда показывать скролл */
  @Input() public alwaysShow: boolean;
  /** Стиль отображения скролла */
  @Input() public type: ScrollStyle;
  /** Прозрачность скролла */
  @Input() public opacity: string;
  /** Доступен скролл */
  @Input() public enable = true;

  /** Высота скролла */
  public scrollHeight: string;
  /** Если скролл не нужен */
  public notAllow: boolean;
  /** Стили ползунка */
  public thumbStyle: IThumbStyle;
  /** Стиль отображения скролла */
  public styleClass: {[prop: string]: boolean} = {};
  /** Класс если скролл начался */
  public mdown: boolean;

  /** Нижний предел скролла */
  private get maxEdge(): number {
    return this.overflow.nativeElement.scrollHeight - this.overflow.nativeElement.offsetHeight;
  }
  /** Позиция скролла */
  public get scrollPosition(): number {
    return this._scrollPosition;
  }
  /** Позиция скролла */
  public set scrollPosition(v: number) {
    this._scrollPosition = v;
    if (this._scrollPosition < 0) {
      this._scrollPosition = 0; // если новое значение ниже 0 то устанавливаю 0
    }
    if (this._scrollPosition > this.maxEdge) {
      this._scrollPosition = this.maxEdge; // если новое значение больше максимального то устанавливаю максимальное
    }
  }
  /** Позиция скролла */
  private _scrollPosition: number;


  /** Высота скролла */
  private scrollH: number;
  /** Высота контейнера с данными */
  private contentH: number;
  /** Высота одного процента скролла */
  private onePercentH: number;
  /** Высота процента скролла */
  private percentH: number;
  /** Высота ползунка */
  private tumbH: number;
  /** Высота окна скролла */
  private scrollWindowH: number;
  /** Настройка скролла */
  private setting: ScrollConfig;

  constructor(
    private scrollService: ScrollService,
    private _scrollSetting: ScrollSettingService) {
      this.setting = this.scrollService.cloneObject(_scrollSetting.config);
    }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.fullRefresh();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getBoolSimpleChanges(changes, 'alwaysShow', x => this.setting.alwaysShow = x);
    this.getBoolSimpleChanges(changes, 'enable', x => this.enable = x);
    this.checkSimpleChanges<ScrollStyle>(changes, 'type', type => {
      this.setting.type = type;
      this.setTypeStyle();
    });
    this.checkSimpleChanges<string>(changes, 'opacity', type => {
      const opacity = parseFloat(type);
      if (typeof opacity === 'number') {
        this.setting.opacity = opacity;
      }
    });
  }

  ngOnInit(): void {
    this.alwaysShow = this.setting.alwaysShow;
    this.setTypeStyle();
    this.opacity = this.setting.opacity.toString();
  }

  ngAfterViewInit(): void {
    this.refresh();
  }

  ngAfterViewChecked(): void {
    this.fullRefresh();
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  /**
   * Отписка от стримов
   */
  private unsubscribe(): void {
    for (const stream of this._streams) {
      stream.unsubscribe();
    }
  }

  /**
   * Метод обновления скролла
   */
  public refresh(): void {
    this.setAllProperty();
    this.initScroll();
    this.setEvents();
  }

  /**
   * Полное обновление скролла
   */
  public fullRefresh(): void {
    this.scroll.nativeElement.style.position = 'fixed';
    if (this.overflow.nativeElement.scrollHeight !== this.scrollH) {
      this.scrollH = this.overflow.nativeElement.scrollHeight;
      this.refresh();
    }
    this.scroll.nativeElement.style.position = '';
  }

  /**
   * Установка всех значений
   */
  private setAllProperty(): void {
    const paddingOverflow = this.scrollService.getFullSizeElementPadding(this.overflow.nativeElement);
    this.contentH = this.content.nativeElement.offsetHeight + paddingOverflow.height; // получаю высоту скролла;
    this.scrollH = this.overflow.nativeElement.scrollHeight; // получаю высоту скролла
    this.scrollWindowH = this.overflow.nativeElement.offsetHeight; // получаю высоту окна скролла
    this.onePercentH = this.scrollWindowH / 100; // получаю писксельный эквивалент одого процента
    this.percentH = (this.scrollWindowH * 100) / this.scrollH; // расчитываю высоту ползунка в процентах
    this.tumbH = this.onePercentH * this.percentH; // расчитываю выстоу ползунка в пискселях
  }

  /**
   * Инициализация скролла
   */
  private initScroll(): void {
    setTimeout(() => {
      this.scrollHeight = this.contentH.toString() + 'px'; // устанавливаю выстоу скрола
      this.notAllow = this.scrollWindowH === this.scrollH;
      this.scrollPosition = this.overflow.nativeElement.scrollTop; // получаю начальную точку скролла
      this.thumbStyle = {
        height: this.tumbH.toString() + 'px',
        minHeight: this.setting.minThumbSize.toString() + 'px',
        top: this.getThumbTop()
      };
    }, 0);
  }

  /**
   * Установка событий
   */
  private setEvents(): void {
    this.unsubscribe();
    //#region Cтримы событий
    const mouseMove$ = fromEvent<MouseEvent>(window.document.body, 'mousemove');
    const mouseDown$ = this.setting.setMouseScrollLikeTouch ?
      fromEvent<MouseEvent>(this.overflow.nativeElement, 'mousedown') :
      fromEvent<MouseEvent>(this.thumb.nativeElement, 'mousedown');
    const mouseUp$ = fromEvent<MouseEvent>(window.document.body, 'mouseup');
    const mouseLeave$ = fromEvent<MouseEvent>(window.document.body, 'mouseleave');
    const touchMove$ = fromEvent<TouchEvent>(window.document.body, 'touchmove');
    const touchStart$ = fromEvent<TouchEvent>(this.thumb.nativeElement, 'touchstart');
    const touchEnd$ = fromEvent<TouchEvent>(window.document.body, 'touchend');
    const wheel$ = fromEvent<WheelEvent>(window.document.body, 'wheel');
    //#endregion

    /** Стрим нажатия мышки по скролу */
    const move$ = mouseDown$.pipe(
      /** Только если нажата левая кнопка мыши */
      filter(e => e instanceof MouseEvent && e.button !== undefined && e.button === 0 && e.buttons > 0),
      tap(x => this.mdown = true),
      /** Формирую нужный объект */
      map(e => (
        {
          y: this.scrollService.getPagePosition(e),
          scroll: this.overflow.nativeElement.scrollTop,
          coof: (this.scrollH / this.scrollWindowH)
        }
      )),
      /** Переключаюсь на событие движения мышки */
      switchMap(start => mouseMove$.pipe(
        /** Формирую нужный объект */
        map<MouseEvent, number>(e => (
          start.scroll + -(start.coof * (start.y - this.scrollService.getPagePosition(e)))
        )),
        /** Беру данные пока не отпустится кнопка */
        takeUntil(mouseUp$),
        /** Беру данные пока не отпустится кнопка */
        takeUntil(mouseLeave$)
      ))
    );

    /** Стрим тача по скролу */
    const touch$ = touchStart$.pipe(
      /** Беру данные пока не отпустится кнопка */
      takeUntil(move$),
      /** Только если нажата левая кнопка мыши */
      filter(e => e.isTrusted || e.targetTouches.length === 1),
      tap(x => this.mdown = true),
      /** Формирую нужный объект */
      map(e => (
        {
          y: this.scrollService.getPagePosition(e),
          scroll: this.overflow.nativeElement.scrollTop,
          coof: (this.scrollH / this.scrollWindowH)
        }
      )),
      /** Переключаюсь на событие движения мышки */
      switchMap(start => touchMove$.pipe(
        /** Формирую нужный объект */
        map<TouchEvent, number>(e => (
          start.scroll + -(start.coof * (start.y - this.scrollService.getPagePosition(e)))
        )),
        /** Беру данные пока не отпустится кнопка */
        takeUntil(touchEnd$)
      ))
    );

    /** Стрим отпускания мышки */
    const up$ = mouseUp$.pipe(
      tap(x => this.mdown = false),
      mapTo<MouseEvent, number>(null)
    );

    /** Стрим отпускания тача */
    const upTouch$ = touchEnd$.pipe(
      tap(x => this.mdown = false),
      mapTo<MouseEvent, number>(null)
    );

    /** Стрим выхода мышки за пределы экрана */
    const leave$ = mouseLeave$.pipe(
      tap(x => this.mdown = false),
      mapTo<MouseEvent, number>(null)
    );

    /**
     * ## Главный стрим
     *
     * Объеденяю стримы
     */
    const stream1$ = merge(move$, touch$, up$, upTouch$, leave$);

    this.streams = stream1$.subscribe((x) => {
      if (x) {
        this.eventScroll(() => x);
      }
    });

    const stream2$ = wheel$;

    this.streams = stream2$.subscribe((event: WheelEvent) => {
      this.wheelEvent(event);
    });
  }

  /**
   * Исполнительный метод по высоте
   * @param callback Коллбэк
   */
  private eventScroll(callback?: () => number): void {
    if (!this.enable) {
      return;
    }
    if (callback) {
      this.scrollPosition = callback();
    }
    this.thumbStyle.top = this.getThumbTop();
    this.overflow.nativeElement.scrollTop = this.scrollPosition;
  }

  /**
   * Получаю позицию ползунка на скролле
   */
  private getThumbTop(): string {
    // расчитываю пиксельный эквивалент одного процента высоты скрола с учетом размера ползунка
    const tumbSize = this.tumbH < this.setting.minThumbSize ? this.setting.minThumbSize : this.tumbH;
    this.onePercentH = (this.contentH - tumbSize) / 100;
    this.percentH = (this.scrollPosition * 100) / this.maxEdge; // расчитываю процентное значение нового значения
    // устанавливаю позицию ползунка на новую позицию расчитывая ее из процентного коофициента
    return (this.onePercentH * this.percentH).toString()  + 'px';
  }

  /**
   * Исполнительный метод на прокрутку колеса мышки
   * @param event событие прокрутки
   */
  private wheelEvent(event: WheelEvent): void {
    const size: number = 35;
    let delta: number = event.deltaY; // дельта сдвига колесика мышки
    if (Math.abs(delta) === 0) {
      return;
    }
    /** Шаг */
    let stap: number = 0;
    if (delta > 0) {
      delta = size; // если дельта положительная то устанавливаю положительный сдвиг
      stap = this.setting.wheelStep;
    } else {
      delta = 0 - size; // если дельта отрицательная то устанавливаю отрицательный сдвиг
      stap = 0 - this.setting.wheelStep;
    }
    let i = 0;
    setInterval(() => {
      i += this.setting.wheelStep;
      if ( size <= i ) {
        return true;
      }
      this.eventScroll(() => {
        return this.scrollPosition + stap;
      });
    }, 1);
  }

  /**
   * Получаем булевое значение измененного свойства
   * @param changes Данные изменения
   * @param key Свойство
   * @param callback Коллбэк с изменными данными
   */
  private getBoolSimpleChanges(changes: SimpleChanges, key: string, callback: (prop: boolean) => void) {
    this.checkSimpleChanges<boolean>(changes, key, prop => {
      if (typeof prop === 'string') {
        prop = this.scrollService.getBool(changes[key].currentValue);
      }
      if (typeof prop === 'boolean') {
        callback(prop);
      }
    });
  }

  /**
   * Проверка входных данные
   * если они заданы, то передается текущее значение
   * если не заданы, то передается значение по умолчанию
   * @param changes Данные изменения
   * @param key Свойство
   * @param callback Коллбэк с данными
   */
  private checkSimpleChanges<T>(changes: SimpleChanges, key: string, callback: (prop: T) => void) {
    if (Object.prototype.hasOwnProperty.call(changes, key)) {
      const prop = changes[key].currentValue as T;
      if (typeof prop === 'undefined' || (typeof prop === 'string' && prop === '')) {
        if (Object.prototype.hasOwnProperty.call(this._scrollSetting.config, key)) {
          callback(this._scrollSetting.config[key]);
        }
      } else {
        callback(prop);
      }
    }
  }

  /**
   * Устанавливаю тип стиля отображения
   */
  private setTypeStyle() {
    if (this.setting.type) {
      this.styleClass = {};
      this.styleClass[this.setting.type] = true;
    }
  }

}
