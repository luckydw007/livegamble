import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-result-table',
  templateUrl: './result-table.component.html',
  styleUrls: ['./result-table.component.css']
})
export class ResultTableComponent implements OnInit, OnChanges {

  @Input('drawTimeArr')
  drawTimeArrInput: string[]= [];
  
  @Input('drawResultArr')
  drawResultArrInput: number[] = [];

  drawTimeArr: string[] =[];
  drawResultArr: number[] =[];
  constructor() { }

  ngOnInit(): void {
    this.drawTimeArr = this.drawTimeArrInput;
    this.drawResultArr = this.drawResultArrInput;
  }

  ngOnChanges(): void {
    this.drawTimeArr = this.drawTimeArrInput;
    this.drawResultArr = this.drawResultArrInput;
  }

}
