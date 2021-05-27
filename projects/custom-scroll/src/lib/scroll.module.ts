import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollComponent } from './scroll.component';


@NgModule({
  declarations: [
    ScrollComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ScrollComponent
  ],
  bootstrap: [
    ScrollComponent
  ]
})
export class ScrollModule { }
