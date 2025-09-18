export class Subject {
  constructor(
    public id: string,
    public name: string,
    public prerequisites: Subject[] = []
  ) {}
}
