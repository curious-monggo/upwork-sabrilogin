import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
@Pipe({
  name: 'youtube'
})
export class YoutubePipe implements PipeTransform {
  /*
  * Pipes are 'pipes' that when put beside data, 
  * converts it to the desired state.
  * Here,
  * Ionic does not allow us to embed yt videos as it may 
  * cause a vulnerability. 
  * See link: https://angular.io/api/platform-browser/DomSanitizer
  * Used this pipe on questions card to allow yt vid to play
  */

  constructor(private dom: DomSanitizer){

  }
  transform(value, args) {
    return this.dom.bypassSecurityTrustResourceUrl(value);
  }

}
