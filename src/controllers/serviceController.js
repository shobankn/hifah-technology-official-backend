const { deleteCloudinaryImageByUrl } = require("../middleware/Cloudupload");
const portfolioModel = require("../models/portfolioModel");
const serviceModel = require("../models/serviceModel");



const createservice = async (req, res) => {
  try {
    const { title, description, categoryKey, exploreCards } = req.body;

    // Uploaded by CloudinaryStorage
    const iconUrl = req.files.icon?.[0]?.path;
    const thumbnailUrl = req.files.thumbnail?.[0]?.path;
    const exploreIcons = req.files.exploreIcons || [];

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

    // Save service to DB
    const service = await serviceModel.create({
      title,
      description,
      iconUrl,
      thumbnailUrl,
      categoryKey,
      exploreCards: finalExploreCards
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

    const existing = await serviceModel.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    let iconUrl = existing.iconUrl;
    let thumbnailUrl = existing.thumbnailUrl;

    // Replace icon if new file is uploaded
    if (req.files.icon) {
      await deleteCloudinaryImageByUrl(iconUrl);
      iconUrl = req.files.icon[0].path;
    }

    // Replace thumbnail if new file is uploaded
    if (req.files.thumbnail) {
      await deleteCloudinaryImageByUrl(thumbnailUrl);
      thumbnailUrl = req.files.thumbnail[0].path;
    }

    // Explore cards update (optional)
    let finalExploreCards = existing.exploreCards;

    if (exploreCards) {
      let parsedExploreCards = [];
      try {
        parsedExploreCards = JSON.parse(exploreCards);
        if (!Array.isArray(parsedExploreCards)) throw new Error();
      } catch {
        return res.status(400).json({
          success: false,
          message: 'Invalid exploreCards format. Must be a JSON array.'
        });
      }

      const exploreIcons = req.files.exploreIcons || [];
      console.log('Parsed exploreCards:', parsedExploreCards);
      console.log('exploreIcons:', exploreIcons);

      // Map exploreCards to combine with existing or new icon URLs
      finalExploreCards = parsedExploreCards.map((card, index) => {
        const existingCard = existing.exploreCards[index] || null;
        if (card.hasNewIcon && index < exploreIcons.length) {
          // New icon provided, delete old icon if it exists
          if (existingCard && existingCard.exploriconUrl) {
            console.log(`Deleting old icon for card ${index}: ${existingCard.exploriconUrl}`);
            deleteCloudinaryImageByUrl(existingCard.exploriconUrl);
          }
          const newIconUrl = exploreIcons[index].path || '';
          console.log(`Assigning new icon for card ${index}: ${newIconUrl}`);
          return {
            name: card.name,
            description: card.description,
            exploriconUrl: newIconUrl,
          };
        } else {
          // No new icon, retain existing icon URL if available
          const retainedUrl = (existingCard && existingCard.exploriconUrl) || card.exploriconUrl || '';
          console.log(`Retaining icon for card ${index}: ${retainedUrl}`);
          return {
            name: card.name,
            description: card.description,
            exploriconUrl: retainedUrl,
          };
        }
      });

      // Log final exploreCards for debugging
      console.log('Final exploreCards:', finalExploreCards);
    }

    // Update fields
    existing.title = title ?? existing.title;
    existing.description = description ?? existing.description;
    existing.categoryKey = categoryKey ?? existing.categoryKey;
    existing.iconUrl = iconUrl;
    existing.thumbnailUrl = thumbnailUrl;
    existing.exploreCards = finalExploreCards;

    await existing.save();

    res.json({ success: true, service: existing });
  } catch (err) {
    console.error('Update Error:', err);
    res.status(500).json({ success: false, message: 'Failed to update service' });
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
