const express = require('express');
const { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog, getRecentBlogs } = require('../controllers/blogcontroller');
const { upload } = require('../middleware/Cloudupload');
const authentication = require('../middleware/authentication');
let blogroute = express.Router();

blogroute.route('/create-blog').post(upload.single('thumbnail'),authentication,createBlog);
blogroute.route('/get-all-blog').get(getAllBlogs);
blogroute.route('/get-single-blog/:id').get(getBlogById);
blogroute.route('/update-blog/:id').put(upload.single('thumbnail'),authentication, updateBlog);
blogroute.route('/delete-blog/:id').delete(authentication,deleteBlog);
blogroute.route('/get-recent-blog').get(getRecentBlogs);

module.exports = blogroute;