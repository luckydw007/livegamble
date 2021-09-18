import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-result-table',
  templateUrl: './result-table.component.html',
  styleUrls: ['./result-table.component.css']
})
export class ResultTableComponent implements OnInit, OnChanges {

  @Input('drawTimeArr')
  drawTimeArr1: string[]= [];
  
  @Input('drawResultArr')
  drawResultArr1: number[] = [];

  drawTimeArr: string[] =[];
  drawResultArr: number[] =[];
  constructor() { }

  ngOnInit(): void {
    this.drawTimeArr = this.drawTimeArr1;
    this.drawResultArr = this.drawResultArr1;
  }

  ngOnChanges(): void {
    this.drawTimeArr = this.drawTimeArr1;
    this.drawResultArr = this.drawResultArr1;
  }

}
