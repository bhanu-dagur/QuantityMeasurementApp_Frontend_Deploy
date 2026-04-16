import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { UNIT_CATEGORIES } from '../../shared/models/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  authService = inject(AuthService);
  categories = UNIT_CATEGORIES;

  features = [
    { icon: '🔄', title: 'Unit Conversion', desc: 'Convert between Length, Weight, Volume & Temperature units instantly.' },
    { icon: '➕', title: 'Addition', desc: 'Add two quantities — even from different sub-units of the same type.' },
    { icon: '➖', title: 'Subtraction', desc: 'Subtract quantities accurately with automatic base-unit conversion.' },
    { icon: '➗', title: 'Division', desc: 'Divide two quantities — even from different sub-units of the same type.' },
    { icon: '⚖️', title: 'Equality Check', desc: 'Check if two quantities with different units are mathematically equal.' }
  ];
}
