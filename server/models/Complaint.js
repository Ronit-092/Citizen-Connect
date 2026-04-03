import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Complaint title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['road', 'water', 'utilities', 'health', 'other']
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'resolved'],
    default: 'pending'
  },
  location: {
    latitude: {
      type: Number,
      required: [true, 'Latitude is required'],
      min: -90,
      max: 90
    },
    longitude: {
      type: Number,
      required: [true, 'Longitude is required'],
      min: -180,
      max: 180
    },
    address: {
      type: String,
      required: [true, 'Location address is required'],
      trim: true
    },
    area: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    state: {
      type: String,
      trim: true
    },
    pincode: {
      type: String,
      trim: true
    },
    landmark: {
      type: String,
      trim: true
    }
  },
  images: [{
    url: String,
    publicId: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  citizen: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  remarks: [{
    text: {
      type: String,
      required: true,
      trim: true
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  upvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  resolvedAt: {
    type: Date,
    default: null
  },
  viewCount: {
    type: Number,
    default: 0
  },
  upvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
complaintSchema.index({ citizen: 1, createdAt: -1 });
complaintSchema.index({ status: 1, category: 1 });
complaintSchema.index({ 'location.latitude': 1, 'location.longitude': 1 });
complaintSchema.index({ assignedTo: 1, status: 1 });

// Virtual for time since creation
complaintSchema.virtual('age').get(function() {
  return Date.now() - this.createdAt.getTime();
});

// Method to update status
complaintSchema.methods.updateStatus = async function(newStatus, userId) {
  this.status = newStatus;
  
  if (newStatus === 'resolved') {
    this.resolvedAt = new Date();
  }
  
  return await this.save();
};

// Method to add remark
complaintSchema.methods.addRemark = async function(text, userId) {
  this.remarks.push({
    text,
    addedBy: userId
  });
  
  return await this.save();
};

// Method to toggle upvote
complaintSchema.methods.toggleUpvote = async function(userId) {
  const userIdStr = userId.toString();
  const index = this.upvotes.findIndex(id => id.toString() === userIdStr);
  
  if (index > -1) {
    // User already upvoted, remove upvote
    this.upvotes.splice(index, 1);
  } else {
    // Add upvote
    this.upvotes.push(userId);
  }
  
  return await this.save();
};

// Static method to get statistics
complaintSchema.statics.getStatistics = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const categoryStats = await this.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    }
  ]);
  
  return { statusStats: stats, categoryStats };
};

const Complaint = mongoose.model('Complaint', complaintSchema);

export default Complaint;