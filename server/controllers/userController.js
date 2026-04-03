import User from '../models/User.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Government)
export const getAllUsers = async (req, res, next) => {
  try {
    const { role, page = 1, limit = 10 } = req.query;

    const query = {};
    if (role) query.role = role;

    const users = await User.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort('-createdAt')
      .exec();

    const count = await User.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: {
        users,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        total: count
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Users can only view their own profile unless they're government
    if (req.user.role !== 'government' && req.user.id !== req.params.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to view this user'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
export const updateUser = async (req, res, next) => {
  try {
    // Users can only update their own profile
    if (req.user.id !== req.params.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to update this user'
      });
    }

    // Fields that can be updated
    const { fullName, phoneNumber, address } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { fullName, phoneNumber, address },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Government)
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Soft delete - deactivate instead of removing
    user.isActive = false;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'User deactivated successfully'
    });
  } catch (error) {
    next(error);
  }
};