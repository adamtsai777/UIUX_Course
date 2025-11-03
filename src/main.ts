
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.component.routes';
import { importProvidersFrom } from '@angular/core';
import { NbThemeModule, NbLayoutModule ,NbButtonModule} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { provideAnimations } from '@angular/platform-browser/animations';

// ✅ Firebase 初始化
import { initializeApp } from 'firebase/app';
import { provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

import { environment } from './environment/environment';
bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes),
    provideAnimations(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    importProvidersFrom(
      NbThemeModule.forRoot({ name: 'default' }), // 初始化主題
      NbLayoutModule,                    // 提供版面元件
      NbButtonModule,                    // 按鈕模組
      NbEvaIconsModule                   // Nebular 圖示支援
    )
  ],
});
