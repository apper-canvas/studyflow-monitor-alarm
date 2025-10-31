import React from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

function StudentCard({ student, onEdit, onDelete }) {
  const getStatusVariant = (status) => {
    return status === 'Active' ? 'success' : 'secondary';
  };

  const getYearColor = (year) => {
    const colors = {
      'Freshman': 'text-blue-600 bg-blue-50',
      'Sophomore': 'text-green-600 bg-green-50',
      'Junior': 'text-orange-600 bg-orange-50',
      'Senior': 'text-purple-600 bg-purple-50'
    };
    return colors[year] || 'text-slate-600 bg-slate-50';
  };

  const getGPAColor = (gpa) => {
    if (gpa >= 3.7) return 'text-green-600';
    if (gpa >= 3.0) return 'text-blue-600';
    if (gpa >= 2.5) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300">
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-display font-semibold text-slate-900 group-hover:text-primary transition-colors">
{student.name_c || student.Name}
            </h3>
            <p className="text-sm text-slate-600 mt-1">{student.email_c}</p>
          </div>
          <Badge variant={getStatusVariant(student.status)}>
            {student.status}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <ApperIcon name="GraduationCap" size={16} className="text-slate-400" />
<span className="font-medium text-slate-700">{student.major_c}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ApperIcon name="Calendar" size={16} className="text-slate-400" />
<span className={`text-sm font-medium px-2 py-1 rounded-md ${getYearColor(student.year_c)}`}>
                {student.year_c}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <ApperIcon name="Award" size={16} className="text-slate-400" />
              <span className={`text-sm font-semibold ${getGPAColor(student.gpa_c)}`}>
                {student.gpa_c?.toFixed(2)} GPA
              </span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(student)}
            className="flex-1 group-hover:border-primary group-hover:text-primary transition-colors"
          >
            <ApperIcon name="Edit2" size={16} />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(student.Id)}
            className="flex-1 hover:border-error hover:text-error hover:bg-error/5 transition-colors"
          >
            <ApperIcon name="Trash2" size={16} />
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default StudentCard;