import { Pipe, PipeTransform } from '@angular/core';
import { Mandal } from '../core/models/mandal.model';

@Pipe({
  name: 'districtfilter',
  pure: false
})
export class DistrictfilterPipe implements PipeTransform {

  transform(items: Mandal[], id: number): Mandal[] {
    if (!items || id === undefined) {
      return items;
    }
    return items.filter(item => item.nDistrictId === id);
  }

}
