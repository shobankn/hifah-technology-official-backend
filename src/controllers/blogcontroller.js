const { deleteCloudinaryImageByUrl } = require('../middleware/Cloudupload');
const Blog = require('../models/blogModel');
const fs = require('fs');

const createBlog = async (req, res) => {
  try {
    const { title, author, shortDescription, content, tags } = req.body;

    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: 'Thumbnail image is required' });
    }

    const blog = new Blog({
      title,
      author,
      shortDescription,
      content,
      tags: JSON.parse(tags),
      thumbnailUrl: req.file.path // Cloudinary URL is available here
    });

    await blog.save();

    res.status(201).json({
      message: 'Blog created successfully',
      blog,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all blogs with pagination
const getAllBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const [blogs, total] = await Promise.all([
      Blog.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Blog.countDocuments()
    ]);

    res.status(200).json({
      blogs,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalBlogs: total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single blog
const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Helper to extract Cloudinary image URLs from HTML
const extractCloudinaryImageUrls = (html) => {
  const regex = /https:\/\/res\.cloudinary\.com\/[^"]+\.(jpg|jpeg|png|gif|webp)/g;
  return html.match(regex) || [];
};

const updateBlog = async (req, res) => {
  try {
    const { title, author, shortDescription, content, tags } = req.body;
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });

    // Step 1: Handle thumbnail image update
    if (req.file) {
      // Delete old thumbnail from Cloudinary
      await deleteCloudinaryImageByUrl(blog.thumbnailUrl);

      // Save new thumbnail (uploaded via multer to Cloudinary)
      blog.thumbnailUrl = req.file.path; // `path` will be Cloudinary URL via multer-storage-cloudinary
    }

    // Step 2: Handle content image cleanup (compare old vs new rich text images)
    if (content && content !== blog.content) {
      const oldImages = extractCloudinaryImageUrls(blog.content);
      const newImages = extractCloudinaryImageUrls(content);

      // Find and delete images no longer used
      const imagesToDelete = oldImages.filter(url => !newImages.includes(url));
      for (const imgUrl of imagesToDelete) {
        await deleteCloudinaryImageByUrl(imgUrl);
      }

      blog.content = content;
    }

    // Step 3: Update other fields
    blog.title = title || blog.title;
    blog.author = author || blog.author;
    blog.shortDescription = shortDescription || blog.shortDescription;
    if (tags) blog.tags = JSON.parse(tags); // tags expected as JSON string

    await blog.save();

    res.status(200).json({ message: 'Blog updated successfully', blog });
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({ error: error.message });
  }
};


const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) return res.status(404).json({ error: 'Blog not found' });

    // ✅ Delete thumbnail
    if (blog.thumbnailUrl) {
      await deleteCloudinaryImageByUrl(blog.thumbnailUrl);
    }

    // ✅ Extract & delete images from content HTML
    const imageUrls = extractCloudinaryImageUrls(blog.content);
    for (const url of imageUrls) {
      await deleteCloudinaryImageByUrl(url);
    }

    // ✅ Delete blog from MongoDB
    await Blog.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Blog and all images deleted successfully' });
  } catch (error) {
    console.error('Delete Blog Error:', error);
    res.status(500).json({ error: 'Server error while deleting blog' });
  }
};



const getRecentBlogs = async (req, res) => {
  try {
    const recentBlogs = await Blog.find()
      .sort({ createdAt: -1 }) // newest first
      .limit(6); // fetch latest 6 blogs

    res.status(200).json({
      success: true,
      count: recentBlogs.length,
      blogs: recentBlogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent blogs',
      error: error.message,
    });
  }
};




module.exports = { createBlog, getAllBlogs ,getBlogById,updateBlog,deleteBlog,getRecentBlogs};