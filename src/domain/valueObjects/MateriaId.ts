export class MateriaId {
  constructor(private readonly value: string) {
    if (!value || value.trim() === "") {
      throw new Error("MateriaId no puede ser vacío");
    }
  }

  get id() {
    return this.value;
  }

  equals(other: MateriaId): boolean {
    return this.value === other.value;
  }
}
