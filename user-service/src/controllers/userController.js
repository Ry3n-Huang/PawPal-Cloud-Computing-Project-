const User = require('../models/User');
const { asyncHandler } = require('../middleware/errorHandler');

class UserController {
  // Get all users
  static getAllUsers = asyncHandler(async (req, res) => {
    const filters = req.query;
    const users = await User.findAll(filters);
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  });

  // Get user by ID
  static getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user.toJSON()
    });
  });

  // Get user by email
  static getUserByEmail = asyncHandler(async (req, res) => {
    const { email } = req.params;
    const user = await User.findByEmail(email);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user.toJSON()
    });
  });

  // Create new user
  static createUser = asyncHandler(async (req, res) => {
    const userData = req.body;
    
    // Check if user with email already exists
    const existingUser = await User.findByEmail(userData.email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }
    
    const user = await User.create(userData);
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user.toJSON()
    });
  });

  // Update user
  static updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if email is being updated and if it already exists
    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await User.findByEmail(updateData.email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'User with this email already exists'
        });
      }
    }
    
    const updatedUser = await user.update(updateData);
    
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser.toJSON()
    });
  });

  // Delete user (soft delete)
  static deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    await user.delete();
    
    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  });

  // Hard delete user (admin only)
  static hardDeleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    await user.hardDelete();
    
    res.status(200).json({
      success: true,
      message: 'User permanently deleted'
    });
  });

  // Get user's dogs
  static getUserDogs = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const dogs = await user.getDogs();
    
    res.status(200).json({
      success: true,
      count: dogs.length,
      data: dogs
    });
  });

  // Get user statistics
  static getUserStats = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const stats = await user.getStats();
    
    res.status(200).json({
      success: true,
      data: {
        user: user.toJSON(),
        stats
      }
    });
  });

  // Search users
  static searchUsers = asyncHandler(async (req, res) => {
    const { q, ...filters } = req.query;
    
    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }
    
    const users = await User.search(q, filters);
    
    res.status(200).json({
      success: true,
      count: users.length,
      query: q,
      data: users
    });
  });

  // Get walkers (users with role 'walker')
  static getWalkers = asyncHandler(async (req, res) => {
    const filters = { ...req.query, role: 'walker' };
    const walkers = await User.findAll(filters);
    
    res.status(200).json({
      success: true,
      count: walkers.length,
      data: walkers
    });
  });

  // Get owners (users with role 'owner')
  static getOwners = asyncHandler(async (req, res) => {
    const filters = { ...req.query, role: 'owner' };
    const owners = await User.findAll(filters);
    
    res.status(200).json({
      success: true,
      count: owners.length,
      data: owners
    });
  });

  // Get top-rated walkers
  static getTopWalkers = asyncHandler(async (req, res) => {
    const { limit = 10 } = req.query;
    
    const walkers = await User.findAll({
      role: 'walker',
      min_rating: 4.0,
      limit: parseInt(limit)
    });
    
    res.status(200).json({
      success: true,
      count: walkers.length,
      data: walkers
    });
  });
}

module.exports = UserController;
