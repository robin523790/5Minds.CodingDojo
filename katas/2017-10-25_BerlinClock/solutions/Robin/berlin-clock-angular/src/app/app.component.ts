import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeEn from '@angular/common/locales/en';
import localeIt from '@angular/common/locales/it';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private locale$ = new Subscription();

  constructor(
    private titleService: Title,
    private translate: TranslateService,
  )
  {
    // Register supported languages. Additional languages need to be added here. Create also a xx.JSON translation file in /src/assets/i18n
    translate.addLangs(['de', 'en', 'it']);
    translate.setDefaultLang('en');

    // Restore locale from session (if changed), or use the browser language
    this.useLanguage(sessionStorage.getItem('locale') || navigator.language || 'en_US');

    // Set the page title in the correct language. Use stream() to update also when lang changes during runtime.
    this.locale$.add(
      translate.stream('@@app.title').subscribe((text: string) => this.titleService.setTitle(text))
    );
  }

  ngOnInit(): void {
    this.setLocale(this.translate.currentLang);
    this.locale$.add(this.translate.onLangChange
      .subscribe((langChangeEvent: LangChangeEvent) => this.setLocale(langChangeEvent.lang))
    )
  }

  ngOnDestroy(): void {
    this.locale$.unsubscribe();
  }

  /**
   * @brief Sets the current language. Implicitly calls setLocale().
   * @param language - Locale string, e.g. 'de' or 'de_DE'. Only the first two characters are used.
   */
  useLanguage(language: string) {
    this.translate.use(language.substr(0, 2));
  }

  /**
   * @brief Registers the system's locale data, e.g. date formats, for the selected language.
   * @param language - Locale string, e.g. 'de' or 'de_DE'. Only the first two characters are used.
   */
  setLocale(language: string) {
    switch (language.substr(0, 2)) {
      default:
      case 'en':
        registerLocaleData(localeEn);
        break;
      case 'de':
        registerLocaleData(localeDe);
        break;
      case 'it':
        registerLocaleData(localeIt);
        break;
    }

    // Save current language so that it gets restored also after F5 reload
    sessionStorage.setItem('locale', language);
  }
}
