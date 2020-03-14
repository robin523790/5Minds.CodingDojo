import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';

describe('AppComponent', () => {
  let translate: TranslateService;
  let titleService: Title;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        TranslateTestingModule.withTranslations({ en: require('src/assets/i18n/en.json'), de: require('src/assets/i18n/de.json') }),
      ],
      declarations: [AppComponent],
    }).compileComponents();
    translate = TestBed.inject(TranslateService);
    titleService = TestBed.inject(Title);
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have title in English`, () => {
    TestBed.createComponent(AppComponent);
    translate.use('en');
    expect(titleService.getTitle()).toEqual('Berlin Clock');
  });

  it(`should have German title after switching to German`, () => {
    TestBed.createComponent(AppComponent);
    translate.use('de');
    expect(titleService.getTitle()).toEqual('Berlin-Uhr');
  });
});
