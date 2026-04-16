// ============================================================
// MODELS - Quantity Management App
// ============================================================

export interface QuantityDTO {
  value: number;
  unit: string;
  enumIndex: number;
}

export interface ArithmeticDTO {
  quantity1: QuantityDTO;
  quantity2: QuantityDTO;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  fullName: string;
  phone: string;
  email: string;
  password: string;
}

export interface ConversionResult {
  resultValue: number;
  resultUnit: string;
}

export interface AuthResponse {
  token: string;
  email?: string;
  fullName?: string;
}

export interface UnitCategory {
  name: string;
  enumIndex: number;
  units: string[];
  icon: string;
  supportsArithmetic: boolean;
}

export const UNIT_CATEGORIES: UnitCategory[] = [
  {
    name: 'Length',
    enumIndex: 1,
    units: ['FEET', 'INCH', 'YARD', 'CENTIMETER'],
    icon: '📏',
    supportsArithmetic: true
  },
  {
    name: 'Weight',
    enumIndex: 2,
    units: ['KILOGRAM', 'GRAM', 'POUND'],
    icon: '⚖️',
    supportsArithmetic: true
  },
  {
    name: 'Volume',
    enumIndex: 3,
    units: ['LITRE', 'MILLILITRE', 'GALLON'],
    icon: '🧪',
    supportsArithmetic: true
  },
  {
    name: 'Temperature',
    enumIndex: 4,
    units: ['CELSIUS', 'FAHRENHEIT'],
    icon: '🌡️',
    supportsArithmetic: false
  }
];

export type OperationType = 'conversion' | 'addition' | 'subtraction' | 'division' |'equality';
