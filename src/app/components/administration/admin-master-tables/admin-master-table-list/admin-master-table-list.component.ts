import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GCatalogRecord } from '../../../../models/administration/admin-master-tables/GCatalogRecord';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-admin-master-table-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-master-table-list.component.html',
  styleUrl: './admin-master-table-list.component.css',
})
export class AdminMasterTableListComponent {
  @Input() records: GCatalogRecord[] = [];
  @Input() catalogName: string = 'Seleccione un catálogo';
  @Input() isLoading: boolean = false;

  @Output() search = new EventEmitter<string>();

  @Output() editRecord = new EventEmitter<GCatalogRecord>();
  @Output() createRecord = new EventEmitter<void>();

  searchControl = new FormControl('');

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(200),
      distinctUntilChanged()
    ).subscribe(text => {
      this.search.emit(text || '');
    });
  }

  onEditClick(record: GCatalogRecord) {
    this.editRecord.emit(record);
  }

  onCreateClick() {
    this.createRecord.emit();
  }
}
