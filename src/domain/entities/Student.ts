import { Enrollment } from "./Enrollment";
import { EnrollmentStatus } from "./EnrollmentStatus";
import { Subject } from "./Subject";

export class Student {
  constructor(
    public approvedSubjects: Subject[] = [],
    public currentSubjects: Subject[] = []
  ) {}

  /**
   * Enrolls the student in a subject based on their approved and current subjects.
   * @param subject Subject to enroll in
   * @returns
   */
  enroll(subject: Subject): Enrollment {
    const approvedIds = this.approvedSubjects.map((s) => s.subjectId.id);
    const currentIds = this.currentSubjects.map((s) => s.subjectId.id);

    const missingPrerequisites = subject.prerequisites.filter(
      (prereq) => !approvedIds.includes(prereq.subjectId.id)
    );

    // All prerequisites approved
    if (missingPrerequisites.length === 0) {
      return new Enrollment(
        subject,
        EnrollmentStatus.Approved,
        "Enrollment approved: all prerequisites met."
      );
    }

    // Allow conditional enrollment if only one prerequisite is missing and it's currently being taken
    if (
      missingPrerequisites.length === 1 &&
      currentIds.includes(missingPrerequisites[0]!.subjectId.id)
    ) {
      return new Enrollment(
        subject,
        EnrollmentStatus.Conditional,
        `Conditional enrollment: must pass "${
          missingPrerequisites[0]!.name
        }" to complete "${subject.name}".`
      );
    }

    // Otherwise reject enrollment
    return new Enrollment(
      subject,
      EnrollmentStatus.Rejected,
      `Enrollment rejected: missing prerequisites - ${missingPrerequisites
        .map((s) => s.name)
        .join(", ")}.`
    );
  }
}
