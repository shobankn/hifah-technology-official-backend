const Portfolio = require('../models/portfolioModel');
const Blog = require('../models/blogModel');
const Service = require('../models/serviceModel');
const TeamMember = require('../models/TeamModel');

const getSummaryCounts = async (req, res) => {
  try {
    const [portfolioCount, blogCount, serviceCount, teamMemberCount] = await Promise.all([
      Portfolio.countDocuments(),
      Blog.countDocuments(),
      Service.countDocuments(),
      TeamMember.countDocuments()
    ]);

    res.status(200).json({
      success: true,
      summary: {
        portfolios: portfolioCount,
        blogs: blogCount,
        services: serviceCount,
        teamMembers: teamMemberCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get summary counts',
      error: error.message
    });
  }
};



const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);

const getRecentActivity = async (req, res) => {
  try {
    // Fetch recent entries (limit to latest 5 each)
    const [portfolios, blogs, services, teamMembers] = await Promise.all([
      Portfolio.find().sort({ updatedAt: -1 }).limit(5),
      Blog.find().sort({ createdAt: -1 }).limit(5),
      Service.find().sort({ updatedAt: -1 }).limit(5),
      TeamMember.find().sort({ updatedAt: -1 }).limit(5),
    ]);

    const activities = [];

    portfolios.forEach(p => {
      activities.push({
        user: "System",
        action: p.createdAt.getTime() === p.updatedAt.getTime() ? "added project" : "updated project",
        item: p.title,
        time: dayjs(p.updatedAt).fromNow()
      });
    });

    blogs.forEach(b => {
      activities.push({
        user: b.author || "Admin",
        action: "published blog post",
        item: b.title,
        time: dayjs(b.createdAt).fromNow()
      });
    });

    services.forEach(s => {
      activities.push({
        user: "Admin",
        action: s.createdAt.getTime() === s.updatedAt.getTime() ? "added new service" : "updated service",
        item: s.title,
        time: dayjs(s.updatedAt).fromNow()
      });
    });

    teamMembers.forEach(t => {
      activities.push({
        user: t.name + ' ' + t.lname,
        action: "updated team profile",
        item: "",
        time: dayjs(t.updatedAt).fromNow()
      });
    });

    // Sort all activities by time (newest first)
    activities.sort((a, b) => dayjs(b.time).unix() - dayjs(a.time).unix());

    // Return limited (e.g. 10 most recent)
    res.status(200).json({
      success: true,
      activities: activities.slice(0, 10)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get recent activities', error: error.message });
  }
};


module.exports = { getSummaryCounts,getRecentActivity }