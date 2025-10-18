const { executeQuery } = require('../config/database');

class User {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.role = data.role;
    this.phone = data.phone;
    this.location = data.location;
    this.profile_image_url = data.profile_image_url;
    this.bio = data.bio;
    this.rating = data.rating;
    this.total_reviews = data.total_reviews;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.is_active = data.is_active;
  }

  // Get all users with optional filtering
  static async findAll(filters = {}) {
    let sql = `
      SELECT 
        id, name, email, role, phone, location, 
        profile_image_url, bio, rating, total_reviews,
        created_at, updated_at, is_active
      FROM users 
      WHERE 1=1
    `;
    const params = [];

    if (filters.role) {
      sql += ' AND role = ?';
      params.push(filters.role);
    }

    if (filters.location) {
      sql += ' AND location LIKE ?';
      params.push(`%${filters.location}%`);
    }

    if (filters.is_active !== undefined) {
      sql += ' AND is_active = ?';
      params.push(filters.is_active);
    }

    if (filters.min_rating) {
      sql += ' AND rating >= ?';
      params.push(filters.min_rating);
    }

    sql += ' ORDER BY created_at DESC';

    if (filters.limit) {
      sql += ' LIMIT ?';
      params.push(parseInt(filters.limit));
    }

    if (filters.offset) {
      sql += ' OFFSET ?';
      params.push(parseInt(filters.offset));
    }

    return await executeQuery(sql, params);
  }

  // Get user by ID
  static async findById(id) {
    const sql = `
      SELECT 
        id, name, email, role, phone, location, 
        profile_image_url, bio, rating, total_reviews,
        created_at, updated_at, is_active
      FROM users 
      WHERE id = ? AND is_active = TRUE
    `;
    const results = await executeQuery(sql, [id]);
    return results.length > 0 ? new User(results[0]) : null;
  }

  // Get user by email
  static async findByEmail(email) {
    const sql = `
      SELECT 
        id, name, email, role, phone, location, 
        profile_image_url, bio, rating, total_reviews,
        created_at, updated_at, is_active
      FROM users 
      WHERE email = ? AND is_active = TRUE
    `;
    const results = await executeQuery(sql, [email]);
    return results.length > 0 ? new User(results[0]) : null;
  }

  // Create new user
  static async create(userData) {
    const {
      name, email, role, phone, location, 
      profile_image_url, bio
    } = userData;

    const sql = `
      INSERT INTO users (
        name, email, role, phone, location, 
        profile_image_url, bio, rating, total_reviews, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 0.00, 0, TRUE)
    `;

    const params = [
      name, email, role, phone, location, 
      profile_image_url, bio
    ];

    const result = await executeQuery(sql, params);
    return await User.findById(result.insertId);
  }

  // Update user
  async update(updateData) {
    const allowedFields = [
      'name', 'email', 'role', 'phone', 'location', 
      'profile_image_url', 'bio', 'rating', 'total_reviews'
    ];

    const updates = [];
    const params = [];

    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key) && value !== undefined) {
        updates.push(`${key} = ?`);
        params.push(value);
      }
    }

    if (updates.length === 0) {
      throw new Error('No valid fields to update');
    }

    params.push(this.id);

    const sql = `
      UPDATE users 
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    await executeQuery(sql, params);
    return await User.findById(this.id);
  }

  // Soft delete user
  async delete() {
    const sql = 'UPDATE users SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    await executeQuery(sql, [this.id]);
    return true;
  }

  // Hard delete user (for admin purposes)
  async hardDelete() {
    const sql = 'DELETE FROM users WHERE id = ?';
    await executeQuery(sql, [this.id]);
    return true;
  }

  // Get user's dogs
  async getDogs() {
    const sql = `
      SELECT 
        id, owner_id, name, breed, age, size, temperament,
        special_needs, medical_notes, profile_image_url,
        is_friendly_with_other_dogs, is_friendly_with_children,
        energy_level, created_at, updated_at, is_active
      FROM dogs 
      WHERE owner_id = ? AND is_active = TRUE
      ORDER BY created_at DESC
    `;
    return await executeQuery(sql, [this.id]);
  }

  // Get user statistics
  async getStats() {
    const sql = `
      SELECT 
        COUNT(d.id) as dog_count,
        AVG(d.energy_level = 'high') as high_energy_dogs_ratio,
        AVG(d.energy_level = 'low') as low_energy_dogs_ratio
      FROM dogs d
      WHERE d.owner_id = ? AND d.is_active = TRUE
    `;
    const results = await executeQuery(sql, [this.id]);
    return results[0];
  }

  // Search users
  static async search(searchTerm, filters = {}) {
    let sql = `
      SELECT 
        id, name, email, role, phone, location, 
        profile_image_url, bio, rating, total_reviews,
        created_at, updated_at, is_active
      FROM users 
      WHERE is_active = TRUE AND (
        name LIKE ? OR 
        email LIKE ? OR 
        location LIKE ? OR 
        bio LIKE ?
      )
    `;
    
    const searchPattern = `%${searchTerm}%`;
    const params = [searchPattern, searchPattern, searchPattern, searchPattern];

    if (filters.role) {
      sql += ' AND role = ?';
      params.push(filters.role);
    }

    sql += ' ORDER BY rating DESC, created_at DESC';

    if (filters.limit) {
      sql += ' LIMIT ?';
      params.push(parseInt(filters.limit));
    }

    return await executeQuery(sql, params);
  }

  // Convert to JSON (excluding sensitive data)
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
      phone: this.phone,
      location: this.location,
      profile_image_url: this.profile_image_url,
      bio: this.bio,
      rating: this.rating,
      total_reviews: this.total_reviews,
      created_at: this.created_at,
      updated_at: this.updated_at,
      is_active: this.is_active
    };
  }
}

module.exports = User;
