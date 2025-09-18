import { Student } from "./domain/entities/Student";
import { Subject } from "./domain/entities/Subject";

const math1 = new Subject("M1", "Math 1");
const math2 = new Subject("M2", "Math 2", [math1]);
const physics1 = new Subject("P1", "Physics 1", [math2]);

const student = new Student([math1], [math2]); // aprobó Math1, cursando Math2

console.log(student.enroll(math2)); // debería ser Approved (ya tiene Math1)
console.log(student.enroll(physics1)); // debería ser Conditional (cursando Math2)
