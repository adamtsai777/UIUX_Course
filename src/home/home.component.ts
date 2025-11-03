
import { Component ,OnInit,inject} from '@angular/core';
import { NbCardModule, NbButtonModule, NbInputModule } from '@nebular/theme';
import { NgIf,NgFor ,AsyncPipe } from '@angular/common';
import { Firestore, collection, addDoc ,getDocs,collectionData } from '@angular/fire/firestore';
import { FirestoneComponent } from "../firestone/firestone.component";
import { ExcelImportComponent } from '../ExcelImport/ExcelImport.component';
import { MatDialog}from "@angular/material/dialog"
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatCard,MatCardTitle, MatCardContent } from "@angular/material/card";
import {MatFormField, MatLabel} from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import Fuse from 'fuse.js'; //模糊搜尋

@Component({
  selector: 'app-home',
   imports: [
    MatTableModule,
    AsyncPipe,    // ✅ 修正 async pipe 問題
    NgFor, NgIf,
    MatCard,
    MatFormField,
    MatFormFieldModule,
    MatInputModule,
    MatLabel,
    FormsModule,
    MatCardTitle,
    MatCardContent
],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
})
export class HomeComponent implements OnInit {

private firestore = inject(Firestore);  //放在屬性層級，屬於 Injection Context
constructor(
  private dialog:MatDialog,
){}

searchTerm:string = ""
blnShowOperration:boolean = false
//courses$!: Observable<any[]>;
courses: any[] = [];
filteredCourses: any[] = [];
displayedColumns: string[] = [
    'courseId', 'courseName','category', 'instructor',
    'department', 'credit','week','coursetime','room',
    'schoolsystem'
  ];

private coursesSource = new BehaviorSubject<any[]>([]);
courses$: Observable<any[]> = this.coursesSource.asObservable();

private searchTerm$ = new BehaviorSubject<string>('');


fuse!: Fuse<any>;

async ngOnInit() {
    const ref = collection(this.firestore, 'courses');
    this.courses$ = collectionData(ref, { idField: 'id' });

    const snapshot = await getDocs(ref);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log('讀取結果：', data);

    this.courses = data;
    this.filteredCourses = data;

    collectionData(ref, { idField: 'id' }).subscribe((data) => {
      // 初始化 Fuse.js
      this.fuse = new Fuse(data, {
        keys: ['courseName', 'instructor', 'description'],
        threshold: 0.6,
        includeScore: true,
      });
      this.coursesSource.next(data);
    });


    // 結合搜尋關鍵字與原始資料
    this.courses$ = combineLatest([
      this.coursesSource.asObservable(),
      this.searchTerm$,
    ]).pipe(
      map(([courses, term]) => {
        if (!term.trim()) return courses;
        const result = this.fuse.search(term);
        return result.map((r) => r.item);
      })
    );
  };

  //當輸入變動時更新 BehaviorSubject
  searchCourses(term: string) {
    this.searchTerm$.next(term);
  }


  btnBaseSearch(){
    console.log('blnShowOperration' + this.blnShowOperration)
    this.blnShowOperration = !this.blnShowOperration;
  }

  //課程設定
  btnCourse(){
    const dialogref = this.dialog.open(FirestoneComponent,{
      width:'50%',
      minHeight:'500px',
      maxHeight:'500px',
      minWidth:'500px',
      maxWidth:'800px',
      data:{
        reffirestore :this.firestore
      }
    })

  }

  //課程匯入
  btnImport(){
    const dialogref = this.dialog.open(ExcelImportComponent,{
      width:'50%',
      minHeight:'500px',
      maxHeight:'500px',
      minWidth:'500px',
      maxWidth:'800px',
      data:{
        reffirestore :this.firestore
      }
    })
  }

  getSchedule(schedule: any) {
  try {
    return typeof schedule === 'string' ? JSON.parse(schedule.replace(/'/g, '"')) : schedule;
    } catch {
      return null;
    }
  }

  // searchCourses() {
  //   const term = this.searchTerm.trim();
  //   if (!term) {
  //     this.filteredCourses = this.courses;
  //     return;
  //   }

  //   const result = this.fuse.search(term);
  //   //this.filteredCourses = result.map(r => r.item);
  //   this.filteredCourses = result.map(r => r.item);
  // }
}
