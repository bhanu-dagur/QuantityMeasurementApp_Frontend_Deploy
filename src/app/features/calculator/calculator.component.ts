import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuantityService } from '../../core/services/quantity.service';
import {
  UNIT_CATEGORIES, UnitCategory, QuantityDTO,
  ArithmeticDTO, ConversionResult, OperationType
} from '../../shared/models/models';


@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent {
  private qtyService = inject(QuantityService);

  categories = UNIT_CATEGORIES;
  selectedCategory: UnitCategory = this.categories[0];
  operation: OperationType = 'conversion';

  // Quantity 1
  value1 = 0;
  unit1 = this.selectedCategory.units[0];

  // Quantity 2 (for arithmetic)
  value2 = 0;
  unit2 = this.selectedCategory.units[0];

  // Target unit
  targetUnit = this.selectedCategory.units[1];

  // Result
  result = signal<ConversionResult | null>(null);
  equalityResult = signal<boolean | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  // History (in-memory)
  history: Array<{ label: string; result: string; time: Date }> = [];

  operations: { key: OperationType; label: string; icon: string }[] = [
    { key: 'conversion', label: 'Convert', icon: '🔄' },
    { key: 'addition', label: 'Add', icon: '➕' },
    { key: 'subtraction', label: 'Subtract', icon: '➖' },
    { key: 'division',label: 'Divide', icon: '➗' },
    { key: 'equality', label: 'Equality', icon: '⚖️' }
  ];

  selectCategory(cat: UnitCategory) {
    this.selectedCategory = cat;
    this.unit1 = cat.units[0];
    this.unit2 = cat.units[0];
    this.targetUnit = cat.units[1] || cat.units[0];
    this.result.set(null);
    this.equalityResult.set(false);
    this.error.set(null);

    // Reset operation if arithmetic not supported
    if (!cat.supportsArithmetic && (this.operation === 'addition' || this.operation === 'subtraction'|| this.operation==='division')) {
      this.operation = 'conversion';
    }
  }

  selectOperation(op: OperationType) {
    if (!this.selectedCategory.supportsArithmetic && (op === 'addition' || op === 'subtraction'|| op==='division')) {
      this.error.set(`${this.selectedCategory.name} does not support arithmetic operations.`);
      return;
    }
    this.operation = op;
    this.result.set(null);
    this.equalityResult.set(false);
    this.error.set(null);
  }

  calculate() {
    this.loading.set(true);
    this.error.set(null);
    this.result.set(null);
    this.equalityResult.set(false);

    const q1: QuantityDTO = {
      value: this.value1,
      unit: this.unit1.toUpperCase(),
      enumIndex: this.selectedCategory.enumIndex
    };

    const q2: QuantityDTO = {
      value: this.value2,
      unit: this.unit2.toUpperCase(),
      enumIndex: this.selectedCategory.enumIndex
    };

    const toUnit = this.targetUnit.toUpperCase();

    if (this.operation === 'conversion') {
      this.qtyService.convert(q1, toUnit).subscribe({
        next: (res) => {
          this.result.set(res);
          this.addHistory(`${this.value1} ${this.unit1} → ${toUnit}`, `${res.resultValue} ${res.resultUnit}`);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(err.error?.message || 'Conversion failed. Check your inputs.');
          console.log(err);
          this.loading.set(false);
        }
      });
    } else if (this.operation === 'addition') {
      const dto: ArithmeticDTO = { quantity1: q1, quantity2: q2 };
      this.qtyService.add(dto, toUnit).subscribe({
        next: (res) => {
          this.result.set(res);
          this.addHistory(`${this.value1} ${this.unit1} + ${this.value2} ${this.unit2}`, `${res.resultValue} ${res.resultUnit}`);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(err.error?.message || 'Addition failed.');
          this.loading.set(false);
        }
      });
    } else if (this.operation === 'subtraction') {
      const dto: ArithmeticDTO = { quantity1: q1, quantity2: q2 };
      this.qtyService.subtract(dto, toUnit).subscribe({
        next: (res) => {
          this.result.set(res);
          this.addHistory(`${this.value1} ${this.unit1} - ${this.value2} ${this.unit2}`, `${res.resultValue} ${res.resultUnit}`);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(err.error?.message || 'Subtraction failed.');
          this.loading.set(false);
        }
      });
    }
    else if(this.operation === 'division' ){
      const dto: ArithmeticDTO = { quantity1: q1, quantity2: q2 };
      this.qtyService.divide(dto, toUnit).subscribe({
        next: (res) => {
          this.result.set(res);
          this.addHistory(`${this.value1} ${this.unit1} / ${this.value2} ${this.unit2}`, `${res.resultValue} ${res.resultUnit}`);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(err.error?.message || 'Division failed.');
          this.loading.set(false);
        }
      });
    } else if (this.operation === 'equality') {
      const dto: ArithmeticDTO = { quantity1: q1, quantity2: q2 };
      this.qtyService.checkEquality(dto).subscribe({
        next: (res:any) => {
          this.equalityResult.set(res.result);
          this.addHistory(
            `${this.value1} ${this.unit1} == ${this.value2} ${this.unit2}`,
            this.equalityResult() ? '✅ Equal' : '❌ Not Equal'
          );
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(err.error?.message || 'Equality check failed.');
          this.loading.set(false);
        }
      });
    }
  }

  private addHistory(label: string, result: string) {
    this.history.unshift({ label, result, time: new Date() });
    if (this.history.length > 10) this.history.pop();
  }

  clearHistory() { this.history = []; }

  isArithmetic(): boolean {
    return this.operation === 'addition' || this.operation === 'subtraction' || this.operation === 'division' ||this.operation === 'equality';
  }

  needsTargetUnit(): boolean {
    return this.operation !== 'equality';
  }
}
