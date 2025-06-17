const { deleteCloudinaryImageByUrl } = require('../middleware/Cloudupload');
const Portfolio = require('../models/portfolioModel');

const addPortfolio = async (req, res) => {
  try {
    const { title, description, category, paragraphs } = req.body;

    // Handle category as array (comma-separated string to array)
    const categories = Array.isArray(category)
      ? category
      : category?.split(',').map(c => c.trim());

    // Get main image URL
    const imageUrl = req.files['image']?.[0]?.path;
    if (!imageUrl) return res.status(400).json({ error: 'Main image is required' });

    // Parse and build paragraph data
    const parsedParagraphs = JSON.parse(paragraphs);
    const uploadedParagraphs = parsedParagraphs.map((para, index) => ({
      paragraphTitle: para.paragraphTitle,
      paragraphDescription: para.paragraphDescription,
      paragraphImage: req.files[`paragraphImage-${index}`]?.[0]?.path || null,
    }));

    const newPortfolio = new Portfolio({
      title,
      description,
      category: categories,
      image: imageUrl,
      paragraphs: uploadedParagraphs
    });

    await newPortfolio.save();

    return res.status(201).json({
      message: "Portfolio uploaded successfully",
      data: newPortfolio
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


// GET all portfolios
const getAllPortfolios = async (req, res) => {
  try {
    const portfolios = await Portfolio.find().sort({ createdAt: -1 }); // Newest first
    res.status(200).json(portfolios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET single portfolio by ID
const getSinglePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) return res.status(404).json({ error: 'Portfolio not found' });

    // Prepare case-insensitive category regex array
    const categoryRegex = portfolio.category.map(cat => new RegExp(`^${cat}$`, 'i'));

    // Find related portfolios using case-insensitive matching
    const relatedProjects = await Portfolio.find({
      _id: { $ne: portfolio._id },
      category: { $in: categoryRegex }
    }).limit(4);

    res.status(200).json({
      portfolio,
      relatedProjects
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



const updatePortfolio = async (req, res) => {
  try {
    const { title, description, category, paragraphs } = req.body;
    const portfolioId = req.params.id;

    const portfolio = await Portfolio.findById(portfolioId);
    if (!portfolio) return res.status(404).json({ error: 'Portfolio not found' });

    // Handle category as array
    const categories = Array.isArray(category)
      ? category
      : category?.split(',').map(c => c.trim());

    // Replace main image if new one uploaded
    let updatedMainImage = portfolio.image;
    const newMainImage = req.files['image']?.[0]?.path;
    if (newMainImage) {
      await deleteCloudinaryImageByUrl(portfolio.image);
      updatedMainImage = newMainImage;
    }

    // Parse incoming paragraph data
    const parsedParagraphs = JSON.parse(paragraphs);
    const updatedParagraphs = await Promise.all(parsedParagraphs.map(async (para, index) => {
      const oldPara = portfolio.paragraphs[index];
      const newImageFile = req.files[`paragraphImage-${index}`]?.[0]?.path;

      let finalImage = oldPara?.paragraphImage || null;
      if (newImageFile) {
        if (oldPara?.paragraphImage) {
          await deleteCloudinaryImageByUrl(oldPara.paragraphImage);
        }
        finalImage = newImageFile;
      }

      return {
        paragraphTitle: para.paragraphTitle,
        paragraphDescription: para.paragraphDescription,
        paragraphImage: finalImage
      };
    }));

    // Update portfolio
    portfolio.title = title;
    portfolio.description = description;
    portfolio.category = categories;
    portfolio.image = updatedMainImage;
    portfolio.paragraphs = updatedParagraphs;

    await portfolio.save();

    return res.status(200).json({
      message: 'Portfolio updated successfully',
      data: portfolio
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


const deletePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) return res.status(404).json({ error: 'Portfolio not found' });

    // Delete main image
    if (portfolio.image) {
      await deleteCloudinaryImageByUrl(portfolio.image);
    }

    // Delete paragraph images
    for (const para of portfolio.paragraphs) {
      if (para.paragraphImage) {
        await deleteCloudinaryImageByUrl(para.paragraphImage);
      }
    }

    // Delete from database
    await portfolio.deleteOne();

    return res.status(200).json({ message: 'Portfolio deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};







module.exports = {
  addPortfolio,
  updatePortfolio,
  deletePortfolio,
  getAllPortfolios,
  getSinglePortfolio


};
