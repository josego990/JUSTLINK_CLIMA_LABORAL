import { Subject } from 'rxjs';

export class GlobalDataSelectItems extends Subject<{ label: string; value: string }[]> {
  private lastValue: { label: string; value: string }[] = [];

  constructor() {
    super();
  }

  // Sobrescribir el método next para almacenar el último valor emitido
  override next(value?: { label: string; value: string }[]): void {
    this.lastValue = value || [];
    super.next(this.lastValue);
  }

  // Obtener el último valor emitido
  getLastValue(): { label: string; value: string }[] {
    return this.lastValue;
  }
}

// Crear una instancia única para usar en toda la aplicación
export const globalDataSelectItems = new GlobalDataSelectItems();


