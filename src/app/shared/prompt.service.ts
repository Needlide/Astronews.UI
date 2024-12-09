import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PromptService {
  // LIBRARY
  private _libraryNext: string = '';
  public get LibraryNext(): string {
    return this._libraryNext;
  }
  public set LibraryNext(value: string) {
    this._libraryNext = value;
  }

  private _libraryPrev: string = '';
  public get LibraryPrev(): string {
    return this._libraryPrev;
  }
  public set LibraryPrev(value: string) {
    this._libraryPrev = value;
  }

  private _isDataAvailable: boolean = false;
  public get isDataAvailable(): boolean {
    return this._isDataAvailable;
  }
  public set isDataAvailable(value: boolean) {
    this._isDataAvailable = value;
  }
  // ---------------------------

  // NEWS
  private _newsNext: string = '';
  public get NewsNext(): string {
    return this._newsNext;
  }
  public set NewsNext(value: string) {
    this._newsNext = value;
  }

  private _newsPrev: string = '';
  public get NewsPrev(): string {
    return this._newsPrev;
  }
  public set NewsPrev(value: string) {
    this._newsPrev = value;
  }
  // ----------------------------

  // MARS CURIOSITY
  private _marsCuriosityNext: string = '';
  public get MarsCuriosityNext(): string {
    return this._marsCuriosityNext;
  }
  public set MarsCuriosityNext(value: string) {
    this._marsCuriosityNext = value;
  }

  private _marsCuriosityPrev: string = '';
  public get MarsCuriosityPrev(): string {
    return this._marsCuriosityPrev;
  }
  public set MarsCuriosityPrev(value: string) {
    this._marsCuriosityPrev = value;
  }

  private _marsCuriosityCurrentSol: number = 0;
  public get MarsCuriosityCurrentSol(): number {
    return this._marsCuriosityCurrentSol;
  }
  public set MarsCuriosityCurrentSol(value: number) {
    this._marsCuriosityCurrentSol = value;
  }
  // ----------------------------

  // MARS OPPORTUNITY
  private _marsOpportunityNext: string = '';
  public get MarsOpportunityNext(): string {
    return this._marsOpportunityNext;
  }
  public set MarsOpportunityNext(value: string) {
    this._marsOpportunityNext = value;
  }

  private _marsOpportunityPrev: string = '';
  public get MarsOpportunityPrev(): string {
    return this._marsOpportunityPrev;
  }
  public set MarsOpportunityPrev(value: string) {
    this._marsOpportunityPrev = value;
  }
  // -----------------------------

  // MARS SPIRIT
  private _marsSpiritNext: string = '';
  public get MarsSpiritNext(): string {
    return this._marsSpiritNext;
  }
  public set MarsSpiritNext(value: string) {
    this._marsSpiritNext = value;
  }

  private _marsSpiritPrev: string = '';
  public get MarsSpiritPrev(): string {
    return this._marsSpiritPrev;
  }
  public set MarsSpiritPrev(value: string) {
    this._marsSpiritPrev = value;
  }
  // ------------------------------

  constructor() {}
}
