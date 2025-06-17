// controllers/TeamController.js

const TeamMember = require('../models/TeamModel'); // Adjust path as needed
const { deleteCloudinaryImageByUrl} = require("../middleware/Cloudupload");


// CREATE
const PostTeamaMember = async (req, res) => {
  try {
    const { name, lname, role, joiningDate } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const newMember = new TeamMember({
      name,
      lname,
      role,
      joiningDate,
      imageUrl: req.file.path, // Cloudinary gives this
    });

    await newMember.save();
    res.status(201).json({ message: 'Team member created', member: newMember });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// UPDATE
const updateTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, lname, role, joiningDate } = req.body;

    const member = await TeamMember.findById(id);
    if (!member) return res.status(404).json({ message: 'Member not found' });

    if (req.file) {
      if (member.imageUrl) {
        await deleteCloudinaryImageByUrl(member.imageUrl); // ✅ delete using URL
      }

      member.imageUrl = req.file.path; // ✅ new image URL
    }

    member.name = name || member.name;
    member.lname = lname || member.lname;
    member.role = role || member.role;
    member.joiningDate = joiningDate || member.joiningDate;

    await member.save();
    res.status(200).json({ message: 'Updated successfully', member });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// DELETE
const deleteTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await TeamMember.findById(id);
    if (!member) return res.status(404).json({ message: 'Member not found' });

    if (member.imageUrl) {
      await deleteCloudinaryImageByUrl(member.imageUrl); // ✅ delete using URL
    }

    await member.deleteOne();
    res.status(200).json({ message: 'Member deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL
const getAllTeamMembers = async (req, res) => {
  try {
    const members = await TeamMember.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, members });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { PostTeamaMember ,updateTeamMember,deleteTeamMember,getAllTeamMembers};

