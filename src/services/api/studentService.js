import studentsData from '../mockData/students.json';

const STORAGE_KEY = 'studyflow_students';

function getStoredStudents() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(studentsData));
  return studentsData;
}

function saveStudents(students) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

function delay() {
  return new Promise(resolve => setTimeout(resolve, 500));
}

export const studentService = {
  async getAll() {
    await delay();
    const students = getStoredStudents();
    return [...students];
  },

  async getById(id) {
    await delay();
    const students = getStoredStudents();
    const student = students.find(s => s.Id === parseInt(id));
    if (!student) {
      throw new Error('Student not found');
    }
    return { ...student };
  },

  async create(studentData) {
    await delay();
    const students = getStoredStudents();
    const maxId = students.length > 0 ? Math.max(...students.map(s => s.Id)) : 0;
    const newStudent = {
      ...studentData,
      Id: maxId + 1,
      enrollmentDate: new Date().toISOString().split('T')[0]
    };
    students.push(newStudent);
    saveStudents(students);
    return { ...newStudent };
  },

  async update(id, studentData) {
    await delay();
    const students = getStoredStudents();
    const index = students.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Student not found');
    }
    students[index] = {
      ...students[index],
      ...studentData,
      Id: students[index].Id
    };
    saveStudents(students);
    return { ...students[index] };
  },

  async delete(id) {
    await delay();
    const students = getStoredStudents();
    const index = students.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Student not found');
    }
    students.splice(index, 1);
    saveStudents(students);
    return true;
  }
};