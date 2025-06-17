// routes/TeamMemberRoute.js

const express = require('express');
const { PostTeamaMember, updateTeamMember, deleteTeamMember, getAllTeamMembers } = require('../controllers/TeamController');
const {upload} = require('../middleware/Cloudupload'); // Assuming Cloudinary upload setup is here
const { getSummaryCounts, getRecentActivity } = require('../controllers/dashboard');
const authentication = require('../middleware/authentication');

const teamRouter = express.Router();

teamRouter.post('/create-team-member', upload.single('image'),authentication,PostTeamaMember);
teamRouter.put('/update-memebr/:id',upload.single('image'),updateTeamMember);
teamRouter.delete('/delete-member/:id',authentication,deleteTeamMember);
teamRouter.get('/get-all-member',getAllTeamMembers);
teamRouter.get('/get-all-count',getSummaryCounts);
teamRouter.get('/get-recent-activity',getRecentActivity);

module.exports = teamRouter;
