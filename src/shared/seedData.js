'use strict';

// Default content used to bootstrap data/*.json on a machine where they don't
// exist yet (fresh clone, or a fresh deploy on a host with ephemeral storage
// like Render's free tier). These files are intentionally gitignored so that
// content added through the live admin dashboard never gets committed as if
// it were application code — this module is what makes a from-scratch boot
// still have real starting content instead of crashing on a missing file.

const news = [
  { id: 1, title: 'Inter-School Athletics — Form 3 Team Wins Gold', content: 'Our Form 3 athletics team brought home gold at the regional inter-school meet.', category: 'Sports', author: 'Sports Dept', image_emoji: '🏅', created_at: '2025-05-28' },
  { id: 2, title: '2025 KCSE Mock Examination Schedule Released', content: 'The mock examination timetable for all Form 4 candidates has been published.', category: 'Academic', author: 'Registrar', image_emoji: '📝', created_at: '2025-05-20' },
  { id: 3, title: 'Science Congress — SFG Wins Regional Best Project', content: 'Our science club took first place at the regional Science Congress.', category: 'Academic', author: 'Science Dept', image_emoji: '🔬', created_at: '2025-05-12' },
  { id: 4, title: 'Annual Music Festival — Choir Advances to Nationals', content: 'The school choir has qualified for the national music festival finals.', category: 'Culture', author: 'Music Dept', image_emoji: '🎵', created_at: '2025-04-30' },
  { id: 5, title: 'New Computer Laboratory Officially Opened', content: 'A new 40-station computer laboratory was officially opened this term.', category: 'Infrastructure', author: 'Principal', image_emoji: '💻', created_at: '2025-04-15' },
];

const notices = [
  { id: 1, title: 'Term 3 Fee Deadline', content: 'Fee payment deadline is July 1, 2025. Late payments attract 5% penalty.', category: 'Finance', is_urgent: true, posted_by: 'Administration', expires_at: '2025-07-01', created_at: '2025-06-01' },
  { id: 2, title: 'Form 1 Registration 2026', content: 'Opens August 15, 2025. Online portal available.', category: 'Admissions', is_urgent: false, posted_by: 'Admissions Office', expires_at: null, created_at: '2025-05-30' },
  { id: 3, title: 'Boarding Students Reporting', content: 'All boarding students to report for Term 3 by July 7, 2025.', category: 'Info', is_urgent: false, posted_by: 'Administration', expires_at: '2025-07-07', created_at: '2025-05-28' },
];

const events = [
  { id: 1, title: 'Term 3 Reopening', description: 'Students report back for Term 3.', event_date: '2025-07-07', venue: 'Main School Gate', event_type: 'School' },
  { id: 2, title: 'KCSE Mock Examination Begins', description: 'Form 4 mock examinations begin.', event_date: '2025-07-15', venue: 'Exam Halls', event_type: 'Exam' },
  { id: 3, title: 'Inter-School Debate Competition', description: 'Hosting the regional inter-school debate competition.', event_date: '2025-08-22', venue: 'Main Hall', event_type: 'Event' },
  { id: 4, title: 'Open Day — Parents & Guardians', description: 'Parents and guardians are invited to visit the school.', event_date: '2025-09-14', venue: 'School Grounds', event_type: 'Event' },
  { id: 5, title: 'Prize Giving Day & Graduation', description: 'Annual prize giving and graduation ceremony.', event_date: '2025-11-22', venue: 'School Grounds', event_type: 'School' },
];

const analytics = {
  kcse_mean_grade: 'A−',
  total_clubs: 18,
  applications: 34,
  kcseHistory: [
    { year: 2020, mean_score: 56, candidates: 210, a_plain: 5, a_minus: 12, b_plus: 30, b_plain: 55, b_minus: 60, below_b: 48 },
    { year: 2021, mean_score: 59, candidates: 225, a_plain: 8, a_minus: 18, b_plus: 40, b_plain: 60, b_minus: 58, below_b: 41 },
    { year: 2022, mean_score: 61, candidates: 238, a_plain: 12, a_minus: 24, b_plus: 48, b_plain: 62, b_minus: 55, below_b: 37 },
    { year: 2023, mean_score: 64, candidates: 250, a_plain: 18, a_minus: 32, b_plus: 55, b_plain: 65, b_minus: 50, below_b: 30 },
    { year: 2024, mean_score: 68, candidates: 265, a_plain: 26, a_minus: 40, b_plus: 62, b_plain: 68, b_minus: 45, below_b: 24 },
  ],
  enrollmentTrend: [
    { year: 2021, students: 1050 },
    { year: 2022, students: 1120 },
    { year: 2023, students: 1190 },
    { year: 2024, students: 1240 },
  ],
  staffByDept: [
    { department: 'Sciences', count: 14 },
    { department: 'Languages', count: 12 },
    { department: 'Mathematics', count: 10 },
    { department: 'Humanities', count: 10 },
    { department: 'Administration', count: 8 },
  ],
};

module.exports = { news, notices, events, analytics, users: [] };
