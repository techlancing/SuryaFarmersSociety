import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NarrationstringService {

  constructor() { }

  fnNarrationModification(Narration){
    let narrationArray = Narration.split(" ");
    let narrationString ='';
    narrationArray.map((part) => {
      narrationString += part.charAt(0).toUpperCase() + part.slice(1)+'_';
    })
   narrationString = narrationString.slice(0,-1);
    console.log('narrationString',narrationString);
   return narrationString;
  }
}
