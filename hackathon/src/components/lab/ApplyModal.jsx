import React, { useState, useEffect } from 'react';
import { Send, User, Mail, BookOpen, Award, Clock, FileText } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { student } from '../../data/student';

const ApplyModal = ({ isOpen, onClose, lab }) => {
  const [emailBody, setEmailBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && lab) {
      // Generate personalized email using student data
      const generatedEmail = generateEmail(student, lab);
      setEmailBody(generatedEmail);
    }
  }, [isOpen, lab]);

  const generateEmail = (student, lab) => {
    const relevantCoursework = student.coursework.filter(course =>
      lab.researchAreas.some(area =>
        course.toLowerCase().includes(area.toLowerCase()) ||
        area.toLowerCase().includes('machine learning') && course.toLowerCase().includes('machine learning') ||
        area.toLowerCase().includes('computer vision') && course.toLowerCase().includes('computer vision')
      )
    ).slice(0, 2);

    const relevantSkills = student.skills.filter(skill =>
      lab.requirements.some(req =>
        req.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(req.toLowerCase())
      )
    ).slice(0, 3);

    return `Dear Dr. ${lab.pi.split(' ').pop()},

I hope this email finds you well. My name is ${student.name}, and I am a ${student.year.toLowerCase()} studying ${student.major} at the University of Michigan. I came across your lab's work on ${lab.researchAreas[0]} and was immediately drawn to the innovative research being conducted at the ${lab.name}.

I am particularly interested in ${lab.researchAreas.slice(0, 2).join(' and ')}. My academic background includes ${relevantCoursework.join(' and ')}, which has given me a solid foundation in the theoretical and practical aspects of this field.

${relevantSkills.length > 0 ? `I have hands-on experience with ${relevantSkills.join(', ')}, which I believe would be valuable for the research projects in your lab.` : 'I am eager to learn and contribute to your research projects.'} ${student.experience[0] ? `Additionally, I have worked as a ${student.experience[0].title} where ${student.experience[0].description.toLowerCase()}.` : ''}

I am looking for a research opportunity that would allow me to contribute ${student.availability.toLowerCase()} starting ${student.startDate}. I am particularly excited about the possibility of ${lab.credit && lab.paid ? 'earning course credit while gaining paid research experience' : lab.credit ? 'earning course credit' : lab.paid ? 'gaining paid research experience' : 'contributing to meaningful research'}.

I have attached my resume for your review. I would welcome the opportunity to discuss how I can contribute to your lab's research. Thank you for your time and consideration.

Best regards,
${student.name}
${student.email}
${student.linkedIn}`;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    onClose();
    // In a real app, you'd show a success toast here
  };

  if (!lab) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Apply to ${lab.name}`}
      size="lg"
    >
      <div className="space-y-6">
        {/* Student Profile Preview */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <User className="w-4 h-4" />
            Your Profile (Auto-filled)
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{student.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{student.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{student.major}, {student.year}</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">GPA: {student.gpa}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{student.availability}</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Resume on file</span>
            </div>
          </div>
        </div>

        {/* Generated Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Application Email
          </label>
          <div className="relative">
            <textarea
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              rows={16}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00274C] focus:border-[#00274C] resize-none font-mono text-sm leading-relaxed"
              placeholder="Your personalized application email will appear here..."
            />
          </div>
          <p className="mt-2 text-xs text-gray-500">
            This email was auto-generated based on your profile. Feel free to edit it before sending.
          </p>
        </div>

        {/* Lab Info */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div>
            <p className="text-sm text-gray-600">Sending to:</p>
            <p className="font-medium text-[#00274C]">{lab.pi} &lt;{lab.piEmail}&gt;</p>
          </div>
          <div className="flex gap-2">
            {lab.paid && <Badge variant="green" size="sm">Paid</Badge>}
            {lab.credit && <Badge variant="blue" size="sm">Credit</Badge>}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            {isSubmitting ? 'Sending...' : 'Send Application'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ApplyModal;
