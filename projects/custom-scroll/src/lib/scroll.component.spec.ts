import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { ScrollSettingService } from './scroll-setting.service';
import { ScrollComponent } from './scroll.component';
import { ScrollService, IWH } from './scroll.service';
import { ElementRef } from '@angular/core';

describe('ScrollComponent', () => {
  let component: ScrollComponent;
  let fixture: ComponentFixture<ScrollComponent>;
  let scrollService: ScrollService;
  let scrollSettingService: ScrollSettingService;
  let scroll: ElementRef<HTMLDivElement>;
  let thumb: ElementRef<HTMLDivElement>;
  let overflow: ElementRef<HTMLDivElement>;
  let content: ElementRef<HTMLDivElement>;

  const callMethod = (method: string) => {
    const methodSpy = spyOn<any>(component, method);
    component[method]();
    expect(methodSpy).toHaveBeenCalled();
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [ScrollComponent],
      providers: [ScrollSettingService, ScrollService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScrollComponent);
    component = fixture.componentInstance;
    scrollService = fixture.debugElement.injector.get(ScrollService);
    scrollSettingService = fixture.debugElement.injector.get(ScrollSettingService);
    fixture.detectChanges();
  });

  beforeEach(() => {
    scroll = component['scroll'];
    thumb = component['thumb'];
    overflow = component['overflow'];
    content = component['content'];
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('will have all the `ViewChild`s defined', () => {
    expect(scroll).toBeDefined();
    expect(thumb).toBeDefined();
    expect(overflow).toBeDefined();
    expect(content).toBeDefined();
  });

  it('should call setAllProperty', () => {
    const getFullSizeElementPadding = spyOn(scrollService, 'getFullSizeElementPadding').withArgs(overflow.nativeElement);
    callMethod('setAllProperty');
    expect(getFullSizeElementPadding).toBeTruthy();
  });

});

