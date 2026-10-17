const express = require('express');
const router = express.Router();
const {
  getApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
  seedApplications,
} = require('../controllers/applicationController');

/**
 * Route: /api/applications
 * GET  - Fetch all applications (supports ?search= and ?status=)
 * POST - Create a new job application
 */
router.route('/')
  .get(getApplications)
  .post(createApplication);

/**
 * Route: /api/applications/seed
 * POST - Populate database with initial realistic sample data
 */
router.post('/seed', seedApplications);

/**
 * Route: /api/applications/:id
 * GET    - Fetch single application by ID
 * PUT    - Update application fields or status by ID
 * DELETE - Remove application by ID
 */
router.route('/:id')
  .get(getApplicationById)
  .put(updateApplication)
  .delete(deleteApplication);

module.exports = router;
