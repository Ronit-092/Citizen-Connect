import Complaint from '../models/Complaint.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';

// @desc    Create new complaint
// @route   POST /api/complaints
// @access  Private (Citizen)
export const createComplaint = async (req, res, next) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    
    const { 
      title, 
      description, 
      category, 
      priority, 
      latitude, 
      longitude, 
      locationAddress,
      area,
      city,
      state,
      pincode,
      landmark
    } = req.body;

    // Validate required fields
    if (!title || !description || !category || !latitude || !longitude || !locationAddress) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide all required fields',
        received: { title, description, category, latitude, longitude, locationAddress }
      });
    }

    // Handle image upload - make it non-blocking
    let imageData = null;
    if (req.file) {
      try {
        console.log('File received:', {
          filename: req.file.filename,
          path: req.file.path,
          mimetype: req.file.mimetype,
          size: req.file.size
        });
        
        // Try to upload to Cloudinary
        const result = await uploadToCloudinary(req.file.path);
        imageData = {
          url: result.secure_url,
          publicId: result.public_id
        };
        console.log('Image uploaded successfully:', imageData.url);
      } catch (uploadError) {
        console.error('Cloudinary upload failed, but continuing without image:', uploadError.message);
        // Don't fail the entire request, just log the error and continue without image
        imageData = null;
      }
    } else {
      console.log('No file uploaded');
    }

    // Create complaint with all fields
    const complaint = await Complaint.create({
      title,
      description,
      category,
      priority: priority || 'medium',
      location: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        address: locationAddress,
        area: area || undefined,
        city: city || undefined,
        state: state || undefined,
        pincode: pincode || undefined,
        landmark: landmark || undefined
      },
      images: imageData ? [imageData] : [],
      citizen: req.user.id
    });

    console.log('Complaint created successfully:', complaint._id);

    // Populate citizen info
    await complaint.populate('citizen', 'fullName email username');

    res.status(201).json({
      status: 'success',
      data: { complaint }
    });
  } catch (error) {
    console.error('Error creating complaint:', error);
    console.error('Error stack:', error.stack);
    next(error);
  }
};

// @desc    Get all complaints
// @route   GET /api/complaints
// @route   GET /api/complaints/public (no auth)
// @access  Private / Public
export const getAllComplaints = async (req, res, next) => {
  try {
    const { status, category, page = 1, limit = 10, sort = '-createdAt' } = req.query;

    // Build query
    const query = {};
    if (status) query.status = status;
    if (category) query.category = category;

    // For citizens with auth, only show their complaints (unless it's public route)
    // Check if user exists and is a citizen (not public route)
    if (req.user && req.user.role === 'citizen') {
      query.citizen = req.user.id;
    }

    // Execute query with pagination
    const complaints = await Complaint.find(query)
      .populate('citizen', 'fullName email username')
      .populate('assignedTo', 'fullName department')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // Get total count
    const count = await Complaint.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: {
        complaints,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        total: count
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single complaint
// @route   GET /api/complaints/:id
// @access  Private
export const getComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('citizen', 'fullName email username phoneNumber')
      .populate('assignedTo', 'fullName department email')
      .populate('remarks.addedBy', 'fullName role');

    if (!complaint) {
      return res.status(404).json({
        status: 'error',
        message: 'Complaint not found'
      });
    }

    // Check authorization (citizens can only see their own complaints)
    if (req.user.role === 'citizen' && complaint.citizen._id.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to access this complaint'
      });
    }

    // Increment view count
    complaint.viewCount += 1;
    await complaint.save();

    res.status(200).json({
      status: 'success',
      data: { complaint }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update complaint
// @route   PUT /api/complaints/:id
// @access  Private
export const updateComplaint = async (req, res, next) => {
  try {
    let complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        status: 'error',
        message: 'Complaint not found'
      });
    }

    // Check authorization
    if (req.user.role === 'citizen' && complaint.citizen.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to update this complaint'
      });
    }

    // Citizens can only update if status is pending
    if (req.user.role === 'citizen' && complaint.status !== 'pending') {
      return res.status(403).json({
        status: 'error',
        message: 'Cannot update complaint after it has been processed'
      });
    }

    // Update complaint
    complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('citizen', 'fullName email username');

    res.status(200).json({
      status: 'success',
      data: { complaint }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete complaint
// @route   DELETE /api/complaints/:id
// @access  Private
export const deleteComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        status: 'error',
        message: 'Complaint not found'
      });
    }

    // Check authorization
    if (req.user.role === 'citizen' && complaint.citizen.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to delete this complaint'
      });
    }

    // Delete images from cloudinary
    if (complaint.images.length > 0) {
      for (const image of complaint.images) {
        await deleteFromCloudinary(image.publicId);
      }
    }

    await complaint.deleteOne();

    res.status(200).json({
      status: 'success',
      message: 'Complaint deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update complaint status
// @route   PUT /api/complaints/:id/status
// @access  Private (Government)
export const updateComplaintStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['pending', 'in-progress', 'resolved'].includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid status value'
      });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        status: 'error',
        message: 'Complaint not found'
      });
    }

    // Update status using method
    await complaint.updateStatus(status, req.user.id);

    // Assign to current user if moving to in-progress
    if (status === 'in-progress' && !complaint.assignedTo) {
      complaint.assignedTo = req.user.id;
      await complaint.save();
    }

    await complaint.populate('citizen', 'fullName email');
    await complaint.populate('assignedTo', 'fullName department');

    res.status(200).json({
      status: 'success',
      data: { complaint }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add remark to complaint
// @route   POST /api/complaints/:id/remarks
// @access  Private (Government)
export const addRemark = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        status: 'error',
        message: 'Remark text is required'
      });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        status: 'error',
        message: 'Complaint not found'
      });
    }

    await complaint.addRemark(text, req.user.id);
    await complaint.populate('remarks.addedBy', 'fullName role');

    res.status(200).json({
      status: 'success',
      data: { complaint }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my complaints
// @route   GET /api/complaints/my-complaints
// @access  Private (Citizen)
export const getMyComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find({ citizen: req.user.id })
      .populate('citizen', 'fullName email username')
      .populate('assignedTo', 'fullName department')
      .sort('-createdAt');

    // Format complaints with proper structure
    const formattedComplaints = complaints.map(complaint => ({
      ...complaint.toObject(),
      id: complaint._id.toString(),
      upvoteCount: complaint.upvotes?.length || 0
    }));

    res.status(200).json({
      status: 'success',
      data: { 
        complaints: formattedComplaints, 
        total: complaints.length,
        totalPages: 1,
        currentPage: 1
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get complaints by status
// @route   GET /api/complaints/status/:status
// @access  Private (Government)
export const getComplaintsByStatus = async (req, res, next) => {
  try {
    const { status } = req.params;
    const { category } = req.query;

    const query = { status };
    if (category) query.category = category;

    const complaints = await Complaint.find(query)
      .populate('citizen', 'fullName email username')
      .populate('assignedTo', 'fullName department')
      .sort('-createdAt');

    // Add upvoteCount to each complaint
    const complaintsWithCount = complaints.map(complaint => ({
      ...complaint.toObject(),
      id: complaint._id.toString(),
      upvoteCount: complaint.upvotes?.length || 0
    }));

    res.status(200).json({
      status: 'success',
      data: { complaints: complaintsWithCount, total: complaints.length }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get complaint statistics
// @route   GET /api/complaints/statistics
// @access  Private (Government)
export const getComplaintStatistics = async (req, res, next) => {
  try {
    const stats = await Complaint.getStatistics();
    
    const totalComplaints = await Complaint.countDocuments();
    const resolvedComplaints = await Complaint.countDocuments({ status: 'resolved' });
    const pendingComplaints = await Complaint.countDocuments({ status: 'pending' });
    const inProgressComplaints = await Complaint.countDocuments({ status: 'in-progress' });

    res.status(200).json({
      status: 'success',
      data: {
        total: totalComplaints,
        resolved: resolvedComplaints,
        pending: pendingComplaints,
        inProgress: inProgressComplaints,
        ...stats
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle upvote on complaint
// @route   POST /api/complaints/:id/upvote
// @access  Private (Citizen)
export const toggleUpvote = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        status: 'error',
        message: 'Complaint not found'
      });
    }

    await complaint.toggleUpvote(req.user._id);

    res.status(200).json({
      status: 'success',
      data: {
        upvoteCount: complaint.upvotes.length,
        hasUpvoted: complaint.upvotes.some(id => id.toString() === req.user._id.toString())
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update complaint priority
// @route   PATCH /api/complaints/:id/priority
// @access  Private (Government)
export const updatePriority = async (req, res, next) => {
  try {
    const { priority } = req.body;

    if (!['low', 'medium', 'high', 'urgent'].includes(priority)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid priority value'
      });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { priority },
      { new: true, runValidators: true }
    ).populate('citizen', 'fullName email username');

    if (!complaint) {
      return res.status(404).json({
        status: 'error',
        message: 'Complaint not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { complaint }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign complaint to officer
// @route   PATCH /api/complaints/:id/assign
// @access  Private (Government)
export const assignComplaint = async (req, res, next) => {
  try {
    const { assignedTo } = req.body;

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { assignedTo: assignedTo || null },
      { new: true, runValidators: true }
    )
      .populate('citizen', 'fullName email username')
      .populate('assignedTo', 'fullName department');

    if (!complaint) {
      return res.status(404).json({
        status: 'error',
        message: 'Complaint not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { complaint }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search complaints
// @route   GET /api/complaints/search
// @access  Private
export const searchComplaints = async (req, res, next) => {
  try {
    const { 
      q, 
      status, 
      category, 
      priority, 
      dateFrom, 
      dateTo,
      department,
      page = 1, 
      limit = 20 
    } = req.query;

    // Build query
    const query = {};

    // Text search
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { 'location.address': { $regex: q, $options: 'i' } }
      ];
    }

    // Filters
    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;
    
    // Date range
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }

    // For citizens, only show their complaints
    if (req.user.role === 'citizen') {
      query.citizen = req.user.id;
    }

    // Department filter for government users
    if (req.user.role === 'government' && department) {
      query.category = department;
    }

    const complaints = await Complaint.find(query)
      .populate('citizen', 'fullName email username')
      .populate('assignedTo', 'fullName department')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Complaint.countDocuments(query);

    // Add upvoteCount to each complaint
    const complaintsWithCount = complaints.map(complaint => ({
      ...complaint.toObject(),
      id: complaint._id.toString(),
      upvoteCount: complaint.upvotes?.length || 0
    }));

    res.status(200).json({
      status: 'success',
      data: {
        complaints: complaintsWithCount,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        total: count
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk update complaints
// @route   PATCH /api/complaints/bulk
// @access  Private (Government)
export const bulkUpdateComplaints = async (req, res, next) => {
  try {
    const { complaintIds, updates } = req.body;

    if (!complaintIds || !Array.isArray(complaintIds) || complaintIds.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide complaint IDs'
      });
    }

    // Validate updates
    const allowedUpdates = ['status', 'priority', 'assignedTo'];
    const updateKeys = Object.keys(updates);
    const isValidUpdate = updateKeys.every(key => allowedUpdates.includes(key));

    if (!isValidUpdate) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid update fields'
      });
    }

    // Perform bulk update
    const result = await Complaint.updateMany(
      { _id: { $in: complaintIds } },
      { $set: updates }
    );

    res.status(200).json({
      status: 'success',
      data: {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get analytics data
// @route   GET /api/complaints/analytics
// @access  Private (Government)
export const getAnalytics = async (req, res, next) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Trend data - complaints over time
    const trendData = await Complaint.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Category distribution
    const categoryData = await Complaint.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    // Priority distribution
    const priorityData = await Complaint.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    // Status distribution
    const statusData = await Complaint.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Average resolution time
    const resolutionTime = await Complaint.aggregate([
      {
        $match: {
          status: 'resolved',
          resolvedAt: { $exists: true }
        }
      },
      {
        $project: {
          resolutionTime: {
            $subtract: ['$resolvedAt', '$createdAt']
          }
        }
      },
      {
        $group: {
          _id: null,
          avgTime: { $avg: '$resolutionTime' }
        }
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        trend: trendData,
        categories: categoryData,
        priorities: priorityData,
        statuses: statusData,
        avgResolutionTime: resolutionTime[0]?.avgTime || 0
      }
    });
  } catch (error) {
    next(error);
  }
};