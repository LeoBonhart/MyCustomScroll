import { TestBed, inject } from '@angular/core/testing';
import { ScrollConfig } from './scroll.config';
import { ScrollService } from './scroll.service';

const st = document.createElement('style');
st.innerHTML = `
  .test-div{
    padding: 20px 10px;
  }
`;
document.head.appendChild(st);

const elem = document.createElement('div');
elem.classList.add('test-div');
elem.style.height = '10px';
elem.style.width = '10px';
elem.style.paddingTop = '5px';
elem.style.paddingBottom = '5px';
elem.style.paddingLeft = '6px';
elem.style.paddingRight = '6px';
document.body.append(elem);

const elemCss = document.createElement('div');
elemCss.classList.add('test-div');
elemCss.style.height = '10px';
elemCss.style.width = '10px';
document.body.append(elemCss);

function createMouseEvent(): MouseEvent {
  const event = { pageY: 10 };
  return event as MouseEvent;
}

function createTouchEvent(): TouchEvent {
  const event = new TouchEvent('', {
    changedTouches: [new Touch({
      pageY: 10,
      identifier: 555,
      target: elem
    })]
  });
  return event as TouchEvent;
}

describe('ScrollService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScrollService]
    });
  });

  it('should be created', inject([ScrollService], (service: ScrollService) => {
    expect(service).toBeTruthy();
  }));

  it('should call getFullSizeElementPadding by style', inject([ScrollService], (service: ScrollService) => {
    expect(service.getFullSizeElementPadding(elem)).toEqual({
      width: 12,
      height: 10
    });
  }));

  it('should call getFullSizeElementPadding by css', inject([ScrollService], (service: ScrollService) => {
    expect(service.getFullSizeElementPadding(elemCss)).toEqual({
      width: 20,
      height: 40
    });
  }));

  it('should call getMaxSizePadding by style', inject([ScrollService], (service: ScrollService) => {
    expect(service.getMaxSizePadding(elem, 'bottom')).toEqual(5);
    expect(service.getMaxSizePadding(elem, 'top')).toEqual(5);
    expect(service.getMaxSizePadding(elem, 'left')).toEqual(6);
    expect(service.getMaxSizePadding(elem, 'right')).toEqual(6);
  }));

  it('should call getMaxSizePadding by css', inject([ScrollService], (service: ScrollService) => {
    expect(service.getMaxSizePadding(elemCss, 'bottom')).toEqual(20);
    expect(service.getMaxSizePadding(elemCss, 'top')).toEqual(20);
    expect(service.getMaxSizePadding(elemCss, 'left')).toEqual(10);
    expect(service.getMaxSizePadding(elemCss, 'right')).toEqual(10);
  }));

  it('should call getMaxSize by style', inject([ScrollService], (service: ScrollService) => {
    expect(service.getMaxSize('padding', elem, 'bottom')).toEqual(5);
  }));

  it('should call getMaxSize by css', inject([ScrollService], (service: ScrollService) => {
    expect(service.getMaxSize('padding', elemCss, 'bottom')).toEqual(20);
  }));

  it('should call capitalWord', inject([ScrollService], (service: ScrollService) => {
    expect(service.capitalWord('test')).toBe('Test');
  }));

  it('should call getBool', inject([ScrollService], (service: ScrollService) => {
    expect(service.getBool('1')).toBe(true);
    expect(service.getBool('0')).toBe(false);
    expect(service.getBool('true')).toBe(true);
    expect(service.getBool('false')).toBe(false);
    expect(service.getBool('test')).toBe(false);
    expect(service.getBool('')).toBe(false);
  }));

  it('should call cloneObject', inject([ScrollService], (service: ScrollService) => {
    const obj =  new ScrollConfig();
    const copy = service.cloneObject(obj);
    expect(copy).toEqual(obj);
    expect(obj === copy).toBeFalse();
  }));

  it('should call getPagePosition by mouse event', inject([ScrollService], (service: ScrollService) => {
    expect(service.getPagePosition(createMouseEvent())).toEqual(10);
  }));

  it('should call getPagePosition by touch event', inject([ScrollService], (service: ScrollService) => {
    expect(service.getPagePosition(createTouchEvent())).toEqual(10);
  }));
});

