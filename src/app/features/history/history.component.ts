import {Component,OnInit, signal} from '@angular/core';
import { QuantityService } from "../../core/services/quantity.service";
import { ConversionResult } from "../../shared/models/models";
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
@Component({
    selector: 'app-history',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.css']
})

export class HistoryComponent implements OnInit{
    historyData = signal<any[]>([]);
    isLoading = false;

    constructor(private quantityService: QuantityService,
        private cdr:ChangeDetectorRef 
    ) {}

    ngOnInit() {
        this.loadHistory();
    }

    loadHistory() {
        this.isLoading = true;
        this.quantityService.getHistory().subscribe({
            next: (res:any)=>{
                this.historyData.set(res.history);
                this.isLoading = false;
                this.cdr.detectChanges(); 
                console.log(this.historyData());
            },
            error: (err) => {
                console.log("Error Fetching History",err);
            }
        });
    }
}