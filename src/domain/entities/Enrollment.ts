import type { EnrollmentStatus } from "./EnrollmentStatus";
import type { Subject } from "./Subject";

export class Enrollment {
  constructor(
    public subject: Subject,
    public status: EnrollmentStatus,
    public message: string
  ) {}
}
