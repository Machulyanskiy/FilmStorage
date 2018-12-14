import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.css']
})
export class SiteLayoutComponent  {
  constructor() { }

  scroll(id){
    let el = document.getElementById(id);
    el.scrollIntoView({behavior: "smooth"});
  }
}
