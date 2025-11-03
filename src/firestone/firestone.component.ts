import { Component, Inject, OnInit } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { MatCard, MatCardTitle, MatCardContent} from '@angular/material/card';
import { MatFormField, MatLabel} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatButton } from '@angular/material/button';
import { MatDialog,MAT_DIALOG_DATA}from "@angular/material/dialog"

@Component({
  standalone: true,
  selector: 'app-firestone',
  templateUrl: './firestone.component.html',
  imports: [FormsModule,
            MatCard,
            MatCardTitle,
            MatCardContent,
            MatFormField,
            MatLabel,
            MatInput,
            MatSelect,
            MatOption,
            MatButton
          ],
  styleUrls: ['./firestone.component.css']
})
export class FirestoneComponent implements OnInit {

get objfirestone(){return this.data.reffirestore}

  constructor(@Inject(MAT_DIALOG_DATA)
    private data:any
  ) { }
  strcourseId:string = ''; //課程代碼
  strcategory:string = ''; //課程類別(必/選)
  strcredit:string = ''; //學分
  strcourseName:string = ''; //課程名稱
  strdepartment:string = ''; //開課系所
  strdescription:string = ''; //課程說明
  strenrolled:string = ''; //目前已選人數
  strinstructor:string = ''; //授課教師
  strmaxStudents:string = ''; //修課人數上限
  strschedule:string = ''; //上課時段與教室資訊
  strschoolsystem:string = ''; //學制
  strweek:string = '';//時間
  strcoursetime:string = '';//節次
  strroom:string  = ""//教室

  ngOnInit() {
  }

  async btnAdd(){
    try {
    const ref = collection(this.objfirestone, 'courses'); // 指向集合
    await addDoc(ref, {
      courseId: this.strcourseId,
      courseName: this.strcourseName,
      category: this.strcategory,
      credit: this.strcredit,
      department: this.strdepartment,
      instructor: this.strinstructor,
      description: this.strdescription,
      maxStudents: this.strmaxStudents,
      enrolled: this.strenrolled,
      schedule: this.strschedule,
      schoolsystem: this.strschoolsystem,
      room : this.strroom,
      coursetime:this.strcoursetime,
      week:this.strweek,
      createdAt: new Date()
    });
    alert('✅ 已成功寫入 Firestore！');
  } catch (err) {
    console.error('❌ 寫入失敗:', err);
  }
  }

}
