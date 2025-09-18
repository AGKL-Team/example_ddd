import { SubjectId } from "../valueObjects/MateriaId";

export class Subject {
  constructor(
    public subjectId: SubjectId,
    public name: string,
    public prerequisites: Subject[] = []
  ) {}
}
