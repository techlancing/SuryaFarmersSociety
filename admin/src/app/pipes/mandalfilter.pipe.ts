import { Pipe, PipeTransform } from '@angular/core';
import { Village } from '../core/models/village.model';
@Pipe({
  name: 'mandalfilter',
  pure: false
})
export class MandalfilterPipe implements PipeTransform {

  transform(items: Village[], id: number): Village[]{
    if (!items || id=== undefined) {
      return items;
  }
    return items.filter( item=>item.nMandalId === id);
  }

}
