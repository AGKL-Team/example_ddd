export class SubjectId {
  constructor(private readonly value: string) {
    if (!value || value.trim() === "") {
      throw new Error("SubjectId no puede ser vacío");
    }
  }

  get id() {
    return this.value;
  }

  equals(other: SubjectId): boolean {
    return this.value === other.value;
  }
}
