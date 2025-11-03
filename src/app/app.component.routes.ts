import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';

export const routes: Routes = [
  { path: '',
    loadComponent: () =>
      import('../home/home.component').then((m) => m.HomeComponent) },       // '' 表示預設路徑
  { path: '**', redirectTo: '' }                // 其他路徑導回首頁
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
