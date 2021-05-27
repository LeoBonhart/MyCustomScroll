# CustomScroll

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.0.14.

<img src="https://drive.google.com/uc?export=view&id=1X2RM_gl0l1d6Z-GMG0bO5-BELleu4cxF" alt="example">

### How to use

To use this library you need import `ScrollModule` in your AppModule
```ts
import { ScrollModule } from 'custom-scroll-leobonhart';
```
Then add imported module to the property `imports` in decorator `@NgModule`

```ts
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ScrollModule <---
  ],
  providers: [],
  bootstrap: [AppComponent]
})
```

After that you can be used component `ScrollComponent` to add custom scroll.

`ScrollComponent` has `@Inputs` settings:
| Name       | Description                                               |
| ---------- |:--------------------------------------------------------- |
| alwaysShow | it is a boolean state property, always show scrolling  or      only  show scrolling when hovering over an element                       |
| type       | Scroll display style, there is a two value `default` and `narrow`                                                                 |
| opacity    | Scroll transparency it is a number value                  |
| enable     | Scroll available it is a boolean value                    |
example:
```html
<custom-scroll 
   type="default | narrow" 
   opacity="1" 
   enable="false | true | 1 | 0" 
   alwaysShow="false | true | 1 | 0"
>
    ... Your content
</custom-scroll>
```

also you can config default options
Injection token that can be used to specify default options
```ts
const CUSTOM_SCROLL_DEFAULT_OPTIONS: InjectionToken<ScrollConfig>
```
or can use service `ScrollSettingService`

example
```ts
...
import { ScrollModule, ScrollSettingService } from 'custom-scroll-leobonhart';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ScrollModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(setting: ScrollSettingService) {
    setting.config.alwaysShow = true;
    setting.config.setMouseScrollLikeTouch = false;
  }

}
```
##### settings
| Name                    | Type                   | Description                    |
| ----------------------- |:---------------------- |:------------------------------ |
| alwaysShow              | boolean                | always show scrolling or only show scrolling when hovering over an element, by default `false`             |
| type                    | `default` or `narrow` | Scroll display style, by default `default`                                               |
| opacity                 | number                 | Scroll transparency, by default `1`      |
| minThumbSize            | number                 | Minimum thumb(slider) hight size, by default `40`      |
| wheelStep               | number                 | Mouse wheel scrolling step, by default `5`     |
| setMouseScrollLikeTouch | boolean                | Scrolling by mouse down on the content, the working principle is similar to touch, by default `false`     |

> It's correct work when set `body` size without margin and set `height` (if you use scroll on your content without static `height`)<br>
```css
body{
    margin: 0;
    height: 100vh;
    width: 100vw;
}
```
> or you need to set to parent element height or set height to custom-scroll selector
```html
<div style="height: 500px;">
    <custom-scroll>
        ... Your content
    </custom-scroll>
</div>

or

<custom-scroll style="height: 500px;">
        ... Your content
</custom-scroll>

```

> In custom scroll realized only rihgt side scroll

> Also realized touch events but not tested


