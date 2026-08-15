import Property from '../models/Property.js';
import fs from 'fs';
import path from 'path';

/**
 * @desc   Get all properties with filtering, searching, sorting, and pagination
 * @route  GET /api/properties
 * @access Public
 */
export const getProperties = async (req, res) => {
  try {
    const {
      keyword,
      type,
      category,
      city,
      minPrice,
      maxPrice,
      bedrooms,
      sort,
      page = 1,
      limit = 9,
    } = req.query;

    const query = {};

    // Keyword search (title, description, location)
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { location: { $regex: keyword, $options: 'i' } },
      ];
    }

    // Direct filters
    if (type) query.type = type;
    if (category) query.category = category;
    if (city) query.city = { $regex: city, $options: 'i' };
    if (bedrooms) query.bedrooms = { $gte: Number(bedrooms) };

    // Price range filtering
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Sorting logic
    let sortOptions = { createdAt: -1 }; // default newest
    if (sort === 'price-asc') sortOptions = { price: 1 };
    if (sort === 'price-desc') sortOptions = { price: -1 };
    if (sort === 'views') sortOptions = { views: -1 };

    const pageNumber = Number(page);
    const pageSize = Number(limit);
    const skip = (pageNumber - 1) * pageSize;

    const total = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);

    res.json({
      properties,
      page: pageNumber,
      pages: Math.ceil(total / pageSize),
      totalProperties: total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc   Get featured properties for homepage
 * @route  GET /api/properties/featured
 * @access Public
 */
export const getFeaturedProperties = async (req, res) => {
  try {
    const featured = await Property.find({ isFeatured: true, status: 'Available' })
      .sort({ createdAt: -1 })
      .limit(6);
    res.json(featured);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc   Get single property by slug and increment view count
 * @route  GET /api/properties/:slug
 * @access Public
 */
export const getPropertyBySlug = async (req, res) => {
  try {
    const property = await Property.findOneAndUpdate(
      { slug: req.params.slug },
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc   Create new property (with multiple uploaded image paths)
 * @route  POST /api/properties
 * @access Private/Admin
 */
export const createProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      type,
      category,
      location,
      city,
      bedrooms,
      bathrooms,
      area,
      status,
      isFeatured,
    } = req.body;

    // Process uploaded files if any
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => `/uploads/${file.filename}`);
    }

    const property = new Property({
      title,
      description,
      price: Number(price),
      type,
      category,
      location,
      city,
      bedrooms: Number(bedrooms) || 0,
      bathrooms: Number(bathrooms) || 0,
      area: Number(area),
      images,
      status: status || 'Available',
      isFeatured: isFeatured === 'true' || isFeatured === true,
    });

    const createdProperty = await property.save();
    res.status(201).json(createdProperty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc   Update property
 * @route  PUT /api/properties/:id
 * @access Private/Admin
 */
export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Retain existing images or append newly uploaded files
    let updatedImages = property.images;
    if (req.body.existingImages) {
      updatedImages = Array.isArray(req.body.existingImages)
        ? req.body.existingImages
        : [req.body.existingImages];
    }

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => `/uploads/${file.filename}`);
      updatedImages = [...updatedImages, ...newImages];
    }

    property.title = req.body.title || property.title;
    property.description = req.body.description || property.description;
    property.price = req.body.price ? Number(req.body.price) : property.price;
    property.type = req.body.type || property.type;
    property.category = req.body.category || property.category;
    property.location = req.body.location || property.location;
    property.city = req.body.city || property.city;
    property.bedrooms = req.body.bedrooms !== undefined ? Number(req.body.bedrooms) : property.bedrooms;
    property.bathrooms = req.body.bathrooms !== undefined ? Number(req.body.bathrooms) : property.bathrooms;
    property.area = req.body.area ? Number(req.body.area) : property.area;
    property.images = updatedImages;
    property.status = req.body.status || property.status;
    property.isFeatured = req.body.isFeatured !== undefined 
      ? (req.body.isFeatured === 'true' || req.body.isFeatured === true) 
      : property.isFeatured;

    const updated = await property.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc   Delete property and associated images
 * @route  DELETE /api/properties/:id
 * @access Private/Admin
 */
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Clean up local images
    property.images.forEach((img) => {
      const fullPath = path.join(process.cwd(), img);
      if (fs.existsSync(fullPath)) {
        fs.unlink(fullPath, (err) => {
          if (err) console.error(`Failed to delete local image: ${fullPath}`);
        });
      }
    });

    await property.deleteOne();
    res.json({ message: 'Property and associated media removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc   Toggle property featured status
 * @route  PATCH /api/properties/:id/featured
 * @access Private/Admin
 */
export const toggleFeatured = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    property.isFeatured = !property.isFeatured;
    await property.save();

    res.json({ message: 'Featured status updated', isFeatured: property.isFeatured });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};