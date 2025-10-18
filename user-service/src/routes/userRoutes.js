const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const {
  validateUserCreate,
  validateUserUpdate,
  validateUserQuery,
  validateUserSearch,
  validateId,
  validatePagination
} = require('../middleware/validation');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - role
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated user ID
 *         name:
 *           type: string
 *           maxLength: 100
 *           description: User's full name
 *         email:
 *           type: string
 *           format: email
 *           maxLength: 150
 *           description: User's email address
 *         role:
 *           type: string
 *           enum: [owner, walker]
 *           description: User's role in the platform
 *         phone:
 *           type: string
 *           maxLength: 20
 *           description: User's phone number
 *         location:
 *           type: string
 *           maxLength: 200
 *           description: User's location
 *         profile_image_url:
 *           type: string
 *           format: uri
 *           maxLength: 500
 *           description: URL to user's profile image
 *         bio:
 *           type: string
 *           maxLength: 1000
 *           description: User's biography
 *         rating:
 *           type: number
 *           format: float
 *           minimum: 0
 *           maximum: 5
 *           description: User's average rating
 *         total_reviews:
 *           type: integer
 *           minimum: 0
 *           description: Total number of reviews received
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: User creation timestamp
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: User last update timestamp
 *         is_active:
 *           type: boolean
 *           description: Whether the user is active
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [owner, walker]
 *         description: Filter by user role
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter by location
 *       - in: query
 *         name: min_rating
 *         schema:
 *           type: number
 *           minimum: 0
 *           maximum: 5
 *         description: Minimum rating filter
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Number of users to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Number of users to skip
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 100
 *               email:
 *                 type: string
 *                 format: email
 *                 maxLength: 150
 *               role:
 *                 type: string
 *                 enum: [owner, walker]
 *               phone:
 *                 type: string
 *                 maxLength: 20
 *               location:
 *                 type: string
 *                 maxLength: 200
 *               profile_image_url:
 *                 type: string
 *                 format: uri
 *                 maxLength: 500
 *               bio:
 *                 type: string
 *                 maxLength: 1000
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *       409:
 *         description: User with email already exists
 */

// GET /api/users - Get all users
router.get('/', validateUserQuery, validatePagination, UserController.getAllUsers);

// POST /api/users - Create new user
router.post('/', validateUserCreate, UserController.createUser);

// GET /api/users/search - Search users
router.get('/search', validateUserSearch, UserController.searchUsers);

// GET /api/users/walkers - Get all walkers
router.get('/walkers', validateUserQuery, validatePagination, UserController.getWalkers);

// GET /api/users/owners - Get all owners
router.get('/owners', validateUserQuery, validatePagination, UserController.getOwners);

// GET /api/users/top-walkers - Get top-rated walkers
router.get('/top-walkers', validatePagination, UserController.getTopWalkers);

// GET /api/users/:id - Get user by ID
router.get('/:id', validateId, UserController.getUserById);

// GET /api/users/email/:email - Get user by email
router.get('/email/:email', UserController.getUserByEmail);

// PUT /api/users/:id - Update user
router.put('/:id', validateId, validateUserUpdate, UserController.updateUser);

// DELETE /api/users/:id - Delete user (soft delete)
router.delete('/:id', validateId, UserController.deleteUser);

// DELETE /api/users/:id/hard - Hard delete user (admin only)
router.delete('/:id/hard', validateId, UserController.hardDeleteUser);

// GET /api/users/:id/dogs - Get user's dogs
router.get('/:id/dogs', validateId, UserController.getUserDogs);

// GET /api/users/:id/stats - Get user statistics
router.get('/:id/stats', validateId, UserController.getUserStats);

module.exports = router;
