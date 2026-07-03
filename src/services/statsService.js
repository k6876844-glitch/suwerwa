'use strict';

const { readAll } = require('../shared/jsonStore');
const newsService = require('./newsService');

function getAnalytics() {
  const data = readAll('analytics');
  return {
    kcseHistory: data.kcseHistory,
    enrollmentTrend: data.enrollmentTrend,
    staffByDept: data.staffByDept,
  };
}

function getStats() {
  const data = readAll('analytics');
  const latestEnrollment = data.enrollmentTrend[data.enrollmentTrend.length - 1];
  const totalStaff = data.staffByDept.reduce((sum, d) => sum + d.count, 0);

  return {
    total_students: latestEnrollment ? latestEnrollment.students : 0,
    total_staff: totalStaff,
    kcse_mean_grade: data.kcse_mean_grade,
    total_clubs: data.total_clubs,
    applications: data.applications,
    news_count: newsService.list().length,
  };
}

module.exports = { getStats, getAnalytics };
