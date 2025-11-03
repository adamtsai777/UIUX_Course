import { Component, OnInit,Inject } from '@angular/core';
import * as XLSX from 'xlsx';
import { Firestore, collection, addDoc ,getDocs,collectionData } from '@angular/fire/firestore';
import { MatDialog,MAT_DIALOG_DATA,MatDialogRef}from "@angular/material/dialog"
import { MatInput } from '@angular/material/input';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardTitle, MatCardContent} from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel} from '@angular/material/form-field';

@Component({
  selector: 'app-ExcelImport',
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
  templateUrl: './ExcelImport.component.html',
  styleUrls: ['./ExcelImport.component.css']
})
export class ExcelImportComponent implements OnInit {


  Exceldata: any[] = [];

  constructor(@Inject(MAT_DIALOG_DATA)
    private data:any,
    private firestore: Firestore,
    private dialogRef: MatDialogRef<ExcelImportComponent>) {}

    get objfirestone(){return this.data.reffirestore}

  ngOnInit() {
  }

  onFileChange(event: any) {
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) throw new Error('只能上傳一個 Excel 檔案！');

    const file = target.files[0];
    const reader = new FileReader();

    reader.onload = async (e: any) => {
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const jsonData = XLSX.utils.sheet_to_json(ws, { defval: '' });

      this.Exceldata = jsonData;
      console.log('Excel 內容：', this.Exceldata);

      // 寫入 Firestore
      const ref = collection(this.firestore, 'courses');
      for (const row of this.Exceldata) {

        if (!row['courseName'] || row['courseName'].trim() === '') {
          continue;
        }

        await addDoc(ref, {
          courseId: row['courseId'],
          courseName: row['courseName'],
          category:row['category'],
          instructor: row['instructor'],
          department: row['department'],
          credit: row['credit'],
          schoolsystem: row['schoolsystem'],
          coursetime: row['coursetime'],
          week: row['week'],
          room: row['room'],
          maxStudents:row['maxStudents'],
          description:row['description']
        });
      }

      alert('已成功寫入 Firestore!');
    };

    reader.readAsBinaryString(file);
  }

  closeDialog(result?: any) {
    this.dialogRef.close(result); //關閉 dialog，並可回傳資料
  }

}
