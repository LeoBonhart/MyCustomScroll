import { Inject, Injectable, InjectionToken } from '@angular/core';
import { ScrollConfig } from './scroll.config';

export const CUSTOM_SCROLL_DEFAULT_OPTIONS =
    new InjectionToken<ScrollConfig>('custom-scroll-default-options', {
      providedIn: 'root',
      factory: CUSTOM_SCROLL_DEFAULT_OPTIONS_FACTORY,
    });

export function CUSTOM_SCROLL_DEFAULT_OPTIONS_FACTORY(): ScrollConfig {
  return new ScrollConfig();
}

@Injectable({
  providedIn: 'root'
})
export class ScrollSettingService {

  constructor(@Inject(CUSTOM_SCROLL_DEFAULT_OPTIONS) public config: ScrollConfig) {
  }

}
