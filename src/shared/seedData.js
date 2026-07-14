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

const gallery = [
  { id: 1, url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80', category: 'academics', caption: 'Students engaged in classroom learning', event_id: null },
  { id: 2, url: 'https://images.unsplash.com/photo-1532094349884-543559244dee?w=600&q=80', category: 'academics', caption: 'Biology laboratory session', event_id: null },
  { id: 3, url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80', category: 'academics', caption: 'Library and reading sessions', event_id: null },
  { id: 4, url: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=600&q=80', category: 'academics', caption: 'Computer lab and ICT lessons', event_id: null },
  { id: 5, url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80', category: 'sports', caption: 'Athletics and field events', event_id: null },
  { id: 6, url: 'https://images.unsplash.com/photo-1546519638405-a9f9c4e4cddb?w=600&q=80', category: 'sports', caption: 'Netball tournament 2024', event_id: null },
  { id: 7, url: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=600&q=80', category: 'sports', caption: 'Inter-school football competition', event_id: null },
  { id: 8, url: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=600&q=80', category: 'sports', caption: 'Swimming gala event', event_id: null },
  { id: 9, url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80', category: 'events', caption: 'Annual Prize Giving Day ceremony', event_id: 5 },
  { id: 10, url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&q=80', category: 'events', caption: 'School parade and march past', event_id: null },
  { id: 11, url: 'https://images.unsplash.com/photo-1522158637959-30385a09e0da?w=600&q=80', category: 'events', caption: 'Cultural and music festival', event_id: null },
  { id: 12, url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&q=80', category: 'events', caption: 'Graduation and KCSE celebration', event_id: 5 },
  { id: 13, url: 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&q=80', category: 'campus', caption: 'Main school building and entrance', event_id: null },
  { id: 14, url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80', category: 'campus', caption: 'School chapel and prayer grounds', event_id: null },
  { id: 15, url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=80', category: 'campus', caption: 'Dormitories and boarding facilities', event_id: null },
  { id: 16, url: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=600&q=80', category: 'campus', caption: 'Sports fields and recreation area', event_id: null },
  { id: 17, url: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=600&q=80', category: 'scouts', caption: 'Kenya Girl Guides activities', event_id: null },
  { id: 18, url: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=600&q=80', category: 'scouts', caption: 'Drama club performance', event_id: null },
  { id: 19, url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&q=80', category: 'scouts', caption: 'Debate and public speaking club', event_id: 3 },
  { id: 20, url: 'https://images.unsplash.com/photo-1542601906897-d4be9c57ef56?w=600&q=80', category: 'scouts', caption: 'Environmental and conservation club', event_id: null },
  { id: 21, url: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=600&q=80', category: 'academics', caption: 'Chemistry practical experiment', event_id: null },
  { id: 22, url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80', category: 'events', caption: 'Sports day opening ceremony', event_id: null },
  { id: 23, url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80', category: 'campus', caption: 'School garden and agriculture', event_id: null },
  { id: 24, url: 'https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=600&q=80', category: 'sports', caption: 'Basketball practice session', event_id: null },
];

module.exports = { news, notices, events, analytics, gallery, users: [] };
