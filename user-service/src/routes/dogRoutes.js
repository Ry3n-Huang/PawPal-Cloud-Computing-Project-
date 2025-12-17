const express = require('express');
const router = express.Router();
const DogController = require('../controllers/dogController');
const {
  validateDogCreate,
  validateDogUpdate,
  validateDogQuery,
  validateDogSearch,
  validateId,
  validatePagination
} = require('../middleware/validation');

/**
 * @swagger
 * components:
 *   schemas:
 *     Dog:
 *       type: object
 *       required:
 *         - owner_id
 *         - name
 *         - size
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated dog ID
 *         owner_id:
 *           type: integer
 *           description: ID of the dog's owner
 *         name:
 *           type: string
 *           maxLength: 50
 *           description: Dog's name
 *         breed:
 *           type: string
 *           maxLength: 50
 *           description: Dog's breed
 *         age:
 *           type: integer
 *           minimum: 0
 *           maximum: 30
 *           description: Dog's age in years
 *         size:
 *           type: string
 *           enum: [small, medium, large, extra_large]
 *           description: Dog's size category
 *         temperament:
 *           type: string
 *           maxLength: 200
 *           description: Dog's temperament description
 *         special_needs:
 *           type: string
 *           maxLength: 1000
 *           description: Special care requirements
 *         medical_notes:
 *           type: string
 *           maxLength: 1000
 *           description: Medical information
 *         profile_image_url:
 *           type: string
 *           format: uri
 *           maxLength: 500
 *           description: URL to dog's profile image
 *         is_friendly_with_other_dogs:
 *           type: boolean
 *           description: Whether dog is friendly with other dogs
 *         is_friendly_with_children:
 *           type: boolean
 *           description: Whether dog is friendly with children
 *         energy_level:
 *           type: string
 *           enum: [low, medium, high]
 *           description: Dog's energy level
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Dog creation timestamp
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Dog last update timestamp
 *         is_active:
 *           type: boolean
 *           description: Whether the dog is active
 */

/**
 * @swagger
 * /api/dogs:
 *   get:
 *     summary: Get all dogs
 *     tags: [Dogs]
 *     parameters:
 *       - in: query
 *         name: owner_id
 *         schema:
 *           type: integer
 *         description: Filter by owner ID
 *       - in: query
 *         name: size
 *         schema:
 *           type: string
 *           enum: [small, medium, large, extra_large]
 *         description: Filter by dog size
 *       - in: query
 *         name: breed
 *         schema:
 *           type: string
 *         description: Filter by breed
 *       - in: query
 *         name: energy_level
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *         description: Filter by energy level
 *       - in: query
 *         name: is_friendly_with_other_dogs
 *         schema:
 *           type: boolean
 *         description: Filter by friendliness with other dogs
 *       - in: query
 *         name: is_friendly_with_children
 *         schema:
 *           type: boolean
 *         description: Filter by friendliness with children
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Number of dogs to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Number of dogs to skip
 *     responses:
 *       200:
 *         description: List of dogs
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
 *                     $ref: '#/components/schemas/Dog'
 *   post:
 *     summary: Create a new dog
 *     tags: [Dogs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - owner_id
 *               - name
 *               - size
 *             properties:
 *               owner_id:
 *                 type: integer
 *               name:
 *                 type: string
 *                 maxLength: 50
 *               breed:
 *                 type: string
 *                 maxLength: 50
 *               age:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 30
 *               size:
 *                 type: string
 *                 enum: [small, medium, large, extra_large]
 *               temperament:
 *                 type: string
 *                 maxLength: 200
 *               special_needs:
 *                 type: string
 *                 maxLength: 1000
 *               medical_notes:
 *                 type: string
 *                 maxLength: 1000
 *               profile_image_url:
 *                 type: string
 *                 format: uri
 *                 maxLength: 500
 *               is_friendly_with_other_dogs:
 *                 type: boolean
 *                 default: true
 *               is_friendly_with_children:
 *                 type: boolean
 *                 default: true
 *               energy_level:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 default: medium
 *     responses:
 *       201:
 *         description: Dog created successfully
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
 *                   $ref: '#/components/schemas/Dog'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Owner not found
 */

/**
 * @swagger
 * /api/dogs/search:
 *   get:
 *     summary: Search dogs by various criteria
 *     tags: [Dogs]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search term (searches in name, breed, temperament)
 *       - in: query
 *         name: owner_id
 *         schema:
 *           type: integer
 *         description: Filter by owner ID
 *       - in: query
 *         name: size
 *         schema:
 *           type: string
 *           enum: [small, medium, large, extra_large]
 *         description: Filter by dog size
 *       - in: query
 *         name: energy_level
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *         description: Filter by energy level
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Number of results to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Number of results to skip
 *     responses:
 *       200:
 *         description: Search results
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
 *                     $ref: '#/components/schemas/Dog'
 */

/**
 * @swagger
 * /api/dogs/friendly:
 *   get:
 *     summary: Get friendly dogs
 *     description: Returns dogs that are friendly with other dogs and children
 *     tags: [Dogs]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Number of dogs to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Number of dogs to skip
 *     responses:
 *       200:
 *         description: List of friendly dogs
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
 *                     $ref: '#/components/schemas/Dog'
 */

/**
 * @swagger
 * /api/dogs/high-energy:
 *   get:
 *     summary: Get high energy dogs
 *     description: Returns dogs with high energy level
 *     tags: [Dogs]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Number of dogs to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Number of dogs to skip
 *     responses:
 *       200:
 *         description: List of high energy dogs
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
 *                     $ref: '#/components/schemas/Dog'
 */

/**
 * @swagger
 * /api/dogs/senior:
 *   get:
 *     summary: Get senior dogs
 *     description: Returns dogs that are 7 years or older
 *     tags: [Dogs]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Number of dogs to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Number of dogs to skip
 *     responses:
 *       200:
 *         description: List of senior dogs
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
 *                     $ref: '#/components/schemas/Dog'
 */

/**
 * @swagger
 * /api/dogs/stats/breeds:
 *   get:
 *     summary: Get breed statistics
 *     description: Returns aggregated statistics of dogs by breed
 *     tags: [Dogs]
 *     responses:
 *       200:
 *         description: Breed statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   additionalProperties:
 *                     type: integer
 *                     description: Count of dogs for each breed
 */

/**
 * @swagger
 * /api/dogs/stats/sizes:
 *   get:
 *     summary: Get size statistics
 *     description: Returns aggregated statistics of dogs by size
 *     tags: [Dogs]
 *     responses:
 *       200:
 *         description: Size statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   additionalProperties:
 *                     type: integer
 *                     description: Count of dogs for each size category
 */

/**
 * @swagger
 * /api/dogs/size/{size}:
 *   get:
 *     summary: Get dogs by size
 *     tags: [Dogs]
 *     parameters:
 *       - in: path
 *         name: size
 *         required: true
 *         schema:
 *           type: string
 *           enum: [small, medium, large, extra_large]
 *         description: Dog size category
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Number of dogs to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Number of dogs to skip
 *     responses:
 *       200:
 *         description: List of dogs with specified size
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
 *                     $ref: '#/components/schemas/Dog'
 *       400:
 *         description: Invalid size parameter
 */

/**
 * @swagger
 * /api/dogs/energy/{energyLevel}:
 *   get:
 *     summary: Get dogs by energy level
 *     tags: [Dogs]
 *     parameters:
 *       - in: path
 *         name: energyLevel
 *         required: true
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *         description: Dog energy level
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Number of dogs to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Number of dogs to skip
 *     responses:
 *       200:
 *         description: List of dogs with specified energy level
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
 *                     $ref: '#/components/schemas/Dog'
 *       400:
 *         description: Invalid energy level parameter
 */

/**
 * @swagger
 * /api/dogs/breed/{breed}:
 *   get:
 *     summary: Get dogs by breed
 *     tags: [Dogs]
 *     parameters:
 *       - in: path
 *         name: breed
 *         required: true
 *         schema:
 *           type: string
 *         description: Dog breed (partial match supported)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Number of dogs to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Number of dogs to skip
 *     responses:
 *       200:
 *         description: List of dogs matching the breed
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
 *                     $ref: '#/components/schemas/Dog'
 */

/**
 * @swagger
 * /api/dogs/owner/{ownerId}:
 *   get:
 *     summary: Get dogs by owner ID
 *     tags: [Dogs]
 *     parameters:
 *       - in: path
 *         name: ownerId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the dog owner
 *     responses:
 *       200:
 *         description: List of dogs owned by the specified owner
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 owner:
 *                   type: object
 *                   description: Owner information
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Dog'
 *       404:
 *         description: Owner not found
 */

/**
 * @swagger
 * /api/dogs/{id}:
 *   get:
 *     summary: Get dog by ID
 *     tags: [Dogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Dog ID
 *     responses:
 *       200:
 *         description: Dog details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Dog'
 *       404:
 *         description: Dog not found
 *   put:
 *     summary: Update dog
 *     tags: [Dogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Dog ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 50
 *               breed:
 *                 type: string
 *                 maxLength: 50
 *               age:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 30
 *               size:
 *                 type: string
 *                 enum: [small, medium, large, extra_large]
 *               temperament:
 *                 type: string
 *                 maxLength: 200
 *               special_needs:
 *                 type: string
 *                 maxLength: 1000
 *               medical_notes:
 *                 type: string
 *                 maxLength: 1000
 *               profile_image_url:
 *                 type: string
 *                 format: uri
 *                 maxLength: 500
 *               is_friendly_with_other_dogs:
 *                 type: boolean
 *               is_friendly_with_children:
 *                 type: boolean
 *               energy_level:
 *                 type: string
 *                 enum: [low, medium, high]
 *               owner_id:
 *                 type: integer
 *                 description: New owner ID (if changing owner)
 *     responses:
 *       200:
 *         description: Dog updated successfully
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
 *                   $ref: '#/components/schemas/Dog'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Dog not found or Owner not found (if owner_id is being updated)
 *   delete:
 *     summary: Delete dog (soft delete)
 *     description: Soft deletes a dog by setting is_active to false
 *     tags: [Dogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Dog ID
 *     responses:
 *       200:
 *         description: Dog deleted successfully
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
 *                   $ref: '#/components/schemas/Dog'
 *       404:
 *         description: Dog not found
 */

/**
 * @swagger
 * /api/dogs/{id}/hard:
 *   delete:
 *     summary: Hard delete dog
 *     description: Permanently deletes a dog from the database (admin only)
 *     tags: [Dogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Dog ID
 *     responses:
 *       200:
 *         description: Dog permanently deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Dog not found
 */

/**
 * @swagger
 * /api/dogs/{id}/owner:
 *   get:
 *     summary: Get dog's owner
 *     description: Returns the owner information for a specific dog
 *     tags: [Dogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Dog ID
 *     responses:
 *       200:
 *         description: Owner information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   description: Owner user information
 *       404:
 *         description: Dog not found
 */

// GET /api/dogs - Get all dogs
router.get('/', validateDogQuery, validatePagination, DogController.getAllDogs);

// POST /api/dogs - Create new dog
router.post('/', validateDogCreate, DogController.createDog);

// GET /api/dogs/search - Search dogs
router.get('/search', validateDogSearch, DogController.searchDogs);

// GET /api/dogs/friendly - Get friendly dogs
router.get('/friendly', validateDogQuery, validatePagination, DogController.getFriendlyDogs);

// GET /api/dogs/high-energy - Get high energy dogs
router.get('/high-energy', validateDogQuery, validatePagination, DogController.getHighEnergyDogs);

// GET /api/dogs/senior - Get senior dogs (age 7+)
router.get('/senior', validateDogQuery, validatePagination, DogController.getSeniorDogs);

// GET /api/dogs/stats/breeds - Get breed statistics
router.get('/stats/breeds', DogController.getBreedStats);

// GET /api/dogs/stats/sizes - Get size statistics
router.get('/stats/sizes', DogController.getSizeStats);

// GET /api/dogs/size/:size - Get dogs by size
router.get('/size/:size', validateDogQuery, validatePagination, DogController.getDogsBySize);

// GET /api/dogs/energy/:energyLevel - Get dogs by energy level
router.get('/energy/:energyLevel', validateDogQuery, validatePagination, DogController.getDogsByEnergyLevel);

// GET /api/dogs/breed/:breed - Get dogs by breed
router.get('/breed/:breed', validateDogQuery, validatePagination, DogController.getDogsByBreed);

// GET /api/dogs/owner/:ownerId - Get dogs by owner
router.get('/owner/:ownerId', validateId, DogController.getDogsByOwner);

// GET /api/dogs/:id - Get dog by ID
router.get('/:id', validateId, DogController.getDogById);

// PUT /api/dogs/:id - Update dog
router.put('/:id', validateId, validateDogUpdate, DogController.updateDog);

// DELETE /api/dogs/:id - Delete dog (soft delete)
router.delete('/:id', validateId, DogController.deleteDog);

// DELETE /api/dogs/:id/hard - Hard delete dog (admin only)
router.delete('/:id/hard', validateId, DogController.hardDeleteDog);

// GET /api/dogs/:id/owner - Get dog's owner
router.get('/:id/owner', validateId, DogController.getDogOwner);

module.exports = router;
