import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NbLayoutModule } from '@nebular/theme';
import {MatCard, MatCardTitle, MatCardContent} from '@angular/material/card';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatButton } from '@angular/material/button';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet,
            NbLayoutModule,
            MatCard,
            MatCardTitle,
            MatCardContent,
            MatFormField,
            MatLabel,
            MatInput,
            MatSelect,
            MatOption,
            MatButton],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
})
export class AppComponent {}
