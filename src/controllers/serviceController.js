const { deleteCloudinaryImageByUrl } = require("../middleware/Cloudupload");
const portfolioModel = require("../models/portfolioModel");
const serviceModel = require("../models/serviceModel");



const createservice = async (req, res) => {
  try {
    const { title, description, categoryKey, exploreCards,category } = req.body;

    const iconUrl = req.files.icon?.[0]?.path;
    const thumbnailUrl = req.files.thumbnail?.[0]?.path;
    const exploreIcons = req.files.exploreIcons || [];
    const headerIconsFiles = req.files.headerIcons || [];

    if (!title || !description || !iconUrl || !thumbnailUrl || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, icon, category and thumbnail  are required.'
      });
    }


     const allowedCategories = ['App Development','Web Development', 'Design', 'Marketing','Ai Solution','Other'];
    if (!allowedCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `Invalid category. Must be one of: ${allowedCategories.join(', ')}`
      });
    }
    

    // Parse exploreCards JSON
    let parsedExploreCards = [];
    if (exploreCards) {
      try {
        parsedExploreCards = JSON.parse(exploreCards);
        if (!Array.isArray(parsedExploreCards)) throw new Error();
      } catch {
        return res.status(400).json({
          success: false,
          message: 'Invalid exploreCards format. Must be a JSON array.'
        });
      }
    }

    // Validate exploreCards length matches uploaded icons
    if (parsedExploreCards.length !== exploreIcons.length) {
      return res.status(400).json({
        success: false,
        message: 'Number of exploreIcons must match exploreCards.'
      });
    }

    // Combine exploreCard data with Cloudinary icon URLs
    const finalExploreCards = parsedExploreCards.map((card, index) => ({
      name: card.name,
      description: card.description,
      exploriconUrl: exploreIcons[index]?.path || ''
    }));

    // ✅ Extract headerIcons URLs
    const headerIcons = headerIconsFiles.map(file => file.path);

    // Save service to DB
    const service = await serviceModel.create({
      title,
      description,
      iconUrl,
      category,
      thumbnailUrl,
      categoryKey,
      exploreCards: finalExploreCards,
      headerIcons // ✅ Include in create call
    });

    res.status(201).json({ success: true, service });

  } catch (err) {
    console.error('Create Service Error:', err);
    res.status(500).json({ success: false, message: 'Failed to create service' });
  }
};



const updateservice = async (req, res) => {
  try {
    const { id } = req.params; // Service ID from URL
    const { title, description, category, exploreCards, headerIcons } = req.body;

    // Extract file paths from uploaded files (if any)
    const iconUrl = req.files?.icon?.[0]?.path;
    const thumbnailUrl = req.files?.thumbnail?.[0]?.path;
    const exploreIcons = req.files?.exploreIcons || [];
    const headerIconsFiles = req.files?.headerIcons || [];

    // Validate serviceId
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Service ID is required.',
      });
    }


    // Find existing service
    const service = await serviceModel.findById(id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found.',
      });
    }

    // Validate input fields if provided
    if (title && typeof title !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Title must be a string.',
      });
    }
    if (description && typeof description !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Description must be a string.',
      });
    }
    if (category && typeof category !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Category key must be a string.',
      });
    }

     // ✅ Validate category against enum if provided
    const allowedCategories = ['App Development', 'Web Development', 'Design', 'Marketing', 'Ai Solution', 'Other'];
    if (category && !allowedCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `Invalid category. Must be one of: ${allowedCategories.join(', ')}`,
      });
    }


    // Parse and validate exploreCards if provided
    let parsedExploreCards = [];
    if (exploreCards) {
      try {
        parsedExploreCards = JSON.parse(exploreCards);
        if (!Array.isArray(parsedExploreCards)) {
          throw new Error();
        }
      } catch {
        return res.status(400).json({
          success: false,
          message: 'Invalid exploreCards format. Must be a JSON array.',
        });
      }

      // Validate that the number of new exploreIcons matches exploreCards with hasNewIcon: true
      const newIconCards = parsedExploreCards.filter(card => card.hasNewIcon);
      if (newIconCards.length !== exploreIcons.length) {
        return res.status(400).json({
          success: false,
          message: `Number of exploreIcons (${exploreIcons.length}) must match number of exploreCards with new icons (${newIconCards.length}).`,
        });
      }
    }

    // Parse and validate headerIcons if provided
    let parsedHeaderIcons = [];
    if (headerIcons) {
      try {
        parsedHeaderIcons = JSON.parse(headerIcons);
        if (!Array.isArray(parsedHeaderIcons)) {
          throw new Error();
        }
      } catch {
        return res.status(400).json({
          success: false,
          message: 'Invalid headerIcons format. Must be a JSON array.',
        });
      }

      // Validate that the number of new headerIcons matches headerIcons with hasNewIcon: true
      const newHeaderIconCards = parsedHeaderIcons.filter(icon => icon.hasNewIcon);
      if (newHeaderIconCards.length !== headerIconsFiles.length) {
        return res.status(400).json({
          success: false,
          message: `Number of headerIcons (${headerIconsFiles.length}) must match number of headerIcons with new icons (${newHeaderIconCards.length}).`,
        });
      }
    }

    // Prepare update data
    const updateData = {
      ...(title && { title }),
      ...(description && { description }),
      ...(category && { category }),
      ...(iconUrl && { iconUrl }),
      ...(thumbnailUrl && { thumbnailUrl }),
    };

    // Combine exploreCard data with icon URLs
    if (parsedExploreCards.length > 0) {
      let exploreIconIndex = 0;
      updateData.exploreCards = parsedExploreCards.map(card => ({
        name: card.name,
        description: card.description,
        exploriconUrl: card.hasNewIcon ? exploreIcons[exploreIconIndex++].path : card.exploriconUrl || '',
      }));
    }

    // Combine headerIcons data with icon URLs
    if (parsedHeaderIcons.length > 0) {
      let headerIconIndex = 0;
      updateData.headerIcons = parsedHeaderIcons.map(icon => (
        icon.hasNewIcon ? headerIconsFiles[headerIconIndex++].path : icon.iconUrl || ''
      ));
    }

    // Update service in DB
    const updatedService = await serviceModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedService) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update service.',
      });
    }

    res.status(200).json({
      success: true,
      service: updatedService,
    });

  } catch (err) {
    console.error('Update Service Error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to update service.',
    });
  }
};









const deleteservice = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await serviceModel.findById(id);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    await deleteCloudinaryImageByUrl(service.iconUrl);
    await deleteCloudinaryImageByUrl(service.thumbnailUrl);
    await service.deleteOne();

    res.json({ success: true, message: 'Service deleted successfully' });
  } catch (err) {
    console.error('Delete Error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete service' });
  }
}

const getAllService = async (req, res) => {
  try {
    const services = await serviceModel.find().sort({ createdAt: -1 });
    res.json({ success: true, services });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching services' });
  }
}

const getsingleservice = async (req, res) => {
  try {
    const service = await serviceModel.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    console.log('Service Category Key:', service.category);

    const relatedProjects = await portfolioModel.find({
      category: {
        $elemMatch: {
          $regex: new RegExp(service.category, 'i') // partial + case-insensitive
        }
      }
    }).limit(6);

    res.status(200).json({
      success: true,
      service,
      relatedProjects,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};



module.exports = {createservice,updateservice,deleteservice,getAllService,getsingleservice}
