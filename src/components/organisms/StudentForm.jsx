import React, { useState, useEffect } from 'react';
import Modal from '@/components/atoms/Modal';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Button from '@/components/atoms/Button';

function StudentForm({ isOpen, onClose, onSubmit, student }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    major: '',
    year: 'Freshman',
    gpa: '',
    status: 'Active'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        email: student.email || '',
        major: student.major || '',
        year: student.year || 'Freshman',
        gpa: student.gpa?.toString() || '',
        status: student.status || 'Active'
      });
    } else {
      setFormData({
        name: '',
        email: '',
        major: '',
        year: 'Freshman',
        gpa: '',
        status: 'Active'
      });
    }
    setErrors({});
  }, [student, isOpen]);

  function validateForm() {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.major.trim()) {
      newErrors.major = 'Major is required';
    }

    if (!formData.gpa) {
      newErrors.gpa = 'GPA is required';
    } else {
      const gpaValue = parseFloat(formData.gpa);
      if (isNaN(gpaValue) || gpaValue < 0 || gpaValue > 4) {
        newErrors.gpa = 'GPA must be between 0.0 and 4.0';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData = {
      ...formData,
      gpa: parseFloat(formData.gpa)
    };

    onSubmit(submitData);
  }

  function handleChange(field, value) {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }

  const years = ['Freshman', 'Sophomore', 'Junior', 'Senior'];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={student ? 'Edit Student' : 'Add New Student'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Name *
          </label>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter student name"
            error={errors.name}
          />
          {errors.name && (
            <p className="text-sm text-error mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Email *
          </label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="student@university.edu"
            error={errors.email}
          />
          {errors.email && (
            <p className="text-sm text-error mt-1">{errors.email}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Major *
            </label>
            <Input
              type="text"
              value={formData.major}
              onChange={(e) => handleChange('major', e.target.value)}
              placeholder="e.g., Computer Science"
              error={errors.major}
            />
            {errors.major && (
              <p className="text-sm text-error mt-1">{errors.major}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Year *
            </label>
            <Select
              value={formData.year}
              onChange={(e) => handleChange('year', e.target.value)}
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              GPA *
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              max="4"
              value={formData.gpa}
              onChange={(e) => handleChange('gpa', e.target.value)}
              placeholder="0.00 - 4.00"
              error={errors.gpa}
            />
            {errors.gpa && (
              <p className="text-sm text-error mt-1">{errors.gpa}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Status *
            </label>
            <Select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </Select>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
          >
            {student ? 'Update Student' : 'Add Student'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default StudentForm;