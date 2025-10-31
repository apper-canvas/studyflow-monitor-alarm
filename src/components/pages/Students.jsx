import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { studentService } from '@/services/api/studentService';
import StudentCard from '@/components/molecules/StudentCard';
import StudentForm from '@/components/organisms/StudentForm';
import FloatingActionButton from '@/components/organisms/FloatingActionButton';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import ApperIcon from '@/components/ApperIcon';

function Students() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [majorFilter, setMajorFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, searchTerm, majorFilter, yearFilter, statusFilter]);

  async function loadStudents() {
    try {
      setLoading(true);
      setError(null);
      const data = await studentService.getAll();
      setStudents(data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  }

  function filterStudents() {
    let filtered = [...students];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(term) ||
        student.email.toLowerCase().includes(term) ||
        student.major.toLowerCase().includes(term)
      );
    }

    if (majorFilter !== 'all') {
      filtered = filtered.filter(student => student.major === majorFilter);
    }

    if (yearFilter !== 'all') {
      filtered = filtered.filter(student => student.year === yearFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(student => student.status === statusFilter);
    }

    setFilteredStudents(filtered);
  }

  function handleCreate() {
    setEditingStudent(null);
    setIsFormOpen(true);
  }

  function handleEdit(student) {
    setEditingStudent(student);
    setIsFormOpen(true);
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      return;
    }

    try {
      await studentService.delete(id);
      setStudents(prev => prev.filter(s => s.Id !== id));
      toast.success('Student deleted successfully');
    } catch (err) {
      toast.error('Failed to delete student');
    }
  }

  async function handleSubmit(studentData) {
    try {
      if (editingStudent) {
        const updated = await studentService.update(editingStudent.Id, studentData);
        setStudents(prev => prev.map(s => s.Id === updated.Id ? updated : s));
        toast.success('Student updated successfully');
      } else {
        const created = await studentService.create(studentData);
        setStudents(prev => [...prev, created]);
        toast.success('Student created successfully');
      }
      setIsFormOpen(false);
      setEditingStudent(null);
    } catch (err) {
      toast.error(editingStudent ? 'Failed to update student' : 'Failed to create student');
    }
  }

  function handleCloseForm() {
    setIsFormOpen(false);
    setEditingStudent(null);
  }

  const majors = [...new Set(students.map(s => s.major))];
  const years = ['Freshman', 'Sophomore', 'Junior', 'Senior'];

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadStudents} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900">Students</h1>
          <p className="text-slate-600 mt-1">
            Manage student information and enrollment
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <ApperIcon
              name="Search"
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <Input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select
            value={majorFilter}
            onChange={(e) => setMajorFilter(e.target.value)}
          >
            <option value="all">All Majors</option>
            {majors.map(major => (
              <option key={major} value={major}>{major}</option>
            ))}
          </Select>

          <Select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
          >
            <option value="all">All Years</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </Select>

          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </Select>
        </div>

        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>
            Showing {filteredStudents.length} of {students.length} students
          </span>
          {(searchTerm || majorFilter !== 'all' || yearFilter !== 'all' || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setMajorFilter('all');
                setYearFilter('all');
                setStatusFilter('all');
              }}
              className="text-primary hover:text-primary/80 font-medium"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {filteredStudents.length === 0 ? (
        <Empty
          icon="Users"
          title="No students found"
          message={
            searchTerm || majorFilter !== 'all' || yearFilter !== 'all' || statusFilter !== 'all'
              ? "Try adjusting your filters"
              : "Get started by adding your first student"
          }
          action={
            !(searchTerm || majorFilter !== 'all' || yearFilter !== 'all' || statusFilter !== 'all') && {
              label: "Add Student",
              onClick: handleCreate
            }
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredStudents.map((student) => (
              <motion.div
                key={student.Id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <StudentCard
                  student={student}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <FloatingActionButton onClick={handleCreate} />

      <StudentForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        student={editingStudent}
      />
    </div>
  );
}

export default Students;