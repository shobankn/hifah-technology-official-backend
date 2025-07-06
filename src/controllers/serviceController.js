const { deleteCloudinaryImageByUrl } = require("../middleware/Cloudupload");
const portfolioModel = require("../models/portfolioModel");
const serviceModel = require("../models/serviceModel");



const createservice = async (req, res) => {
  try {
    const { title, description, categoryKey, exploreCards } = req.body;

    const iconUrl = req.files.icon?.[0]?.path;
    const thumbnailUrl = req.files.thumbnail?.[0]?.path;
    const exploreIcons = req.files.exploreIcons || [];
    const headerIconsFiles = req.files.headerIcons || [];

    if (!title || !description || !iconUrl || !thumbnailUrl) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, icon, and thumbnail are required.'
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
    const { id } = req.params;
    const { title, description, categoryKey, exploreCards } = req.body;

    const iconFile = req.files.icon?.[0];
    const thumbnailFile = req.files.thumbnail?.[0];
    const exploreIcons = req.files.exploreIcons || [];
    const headerIconsFiles = req.files.headerIcons || [];

    const service = await serviceModel.findById(id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }

    // ✅ Update icon
    if (iconFile) {
      if (service.iconUrl) await deleteCloudinaryImageByUrl(service.iconUrl);
      service.iconUrl = iconFile.path;
    }

    // ✅ Update thumbnail
    if (thumbnailFile) {
      if (service.thumbnailUrl) await deleteCloudinaryImageByUrl(service.thumbnailUrl);
      service.thumbnailUrl = thumbnailFile.path;
    }

    // ✅ Update headerIcons
    if (headerIconsFiles.length > 0) {
      for (const oldIcon of service.headerIcons || []) {
        await deleteCloudinaryImageByUrl(oldIcon);
      }
      service.headerIcons = headerIconsFiles.map(file => file.path);
    }

    // ✅ Update exploreCards (full replacement)
    if (exploreCards) {
      let parsedExploreCards;
      try {
        parsedExploreCards = JSON.parse(exploreCards);
        if (!Array.isArray(parsedExploreCards)) throw new Error();
      } catch {
        return res.status(400).json({ success: false, message: 'Invalid exploreCards format' });
      }

      // Delete old icons
      for (const oldCard of service.exploreCards || []) {
        if (oldCard.exploriconUrl) await deleteCloudinaryImageByUrl(oldCard.exploriconUrl);
      }

      // Combine new cards with optional new icons
      const updatedExploreCards = parsedExploreCards.map((card, index) => ({
        name: card.name,
        description: card.description,
        exploriconUrl: exploreIcons[index]?.path || ''
      }));

      service.exploreCards = updatedExploreCards;
    }

    // ✅ Update text fields
    if (title) service.title = title;
    if (description) service.description = description;
    if (categoryKey) service.categoryKey = categoryKey;

    await service.save();

    return res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      service
    });

  } catch (err) {
    console.error('Update Service Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update service'
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

    console.log('Service Category Key:', service.categoryKey);

    const relatedProjects = await portfolioModel.find({
      category: {
        $elemMatch: {
          $regex: new RegExp(service.categoryKey, 'i') // partial + case-insensitive
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
