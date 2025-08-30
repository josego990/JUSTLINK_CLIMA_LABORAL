import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

//jjg esto hace que la clase pueda ser observable desde otro componente
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  public languages: string[] = ['en', 'es', 'de'];


  //jjg
  private languageChangeSubject = new Subject<string>();

  constructor(public translate: TranslateService) {
    let browserLang: string;
    translate.addLangs(this.languages);

    if (localStorage.getItem('lang')) {
      browserLang = localStorage.getItem('lang') as string;
    } else {
      browserLang = translate.getBrowserLang() as string;
    }
    translate.use(browserLang.match(/en|es|de/) ? browserLang : 'en');
  }

  public setLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
      //jjg
    this.languageChangeSubject.next(lang);
  }
  //jjg
  getLanguageChangeSubject() {
    return this.languageChangeSubject.asObservable(); 
  }
}
