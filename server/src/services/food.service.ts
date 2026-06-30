import { Types } from 'mongoose';
import Food, { IFood } from '../models/Food.model';
import Category from '../models/Category.model';
import { ApiError } from '../utils/ApiError';
import { uploadImage, deleteImage, extractPublicIdFromUrl } from '../utils/cloudinary.util';

interface FoodQuery {
  page?: number;
  limit?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  dietaryTags?: string | string[];
  availability?: string | boolean;
  minRating?: number;
  featured?: string | boolean;
  maxPrepTime?: number;
  sort?: string;
  search?: string;
}

const generateSlug = async (name: string, excludeId?: string): Promise<string> => {
  let slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  const exists = await Food.findOne({ slug, _id: { $ne: excludeId } });

  if (exists) {
    let counter = 1;
    let newSlug = `${slug}-${counter}`;
    while (await Food.findOne({ slug: newSlug, _id: { $ne: excludeId } })) {
      counter++;
      newSlug = `${slug}-${counter}`;
    }
    slug = newSlug;
  }

  return slug;
};

export const createFood = async (data: any, imageFiles?: Express.Multer.File[]): Promise<IFood> => {
  const slug = await generateSlug(data.name);

  let images: string[] = ['https://via.placeholder.com/300'];
  if (imageFiles && imageFiles.length > 0) {
    const uploadPromises = imageFiles.map((file) => uploadImage(file.buffer, 'restaurant/foods'));
    const uploadResults = await Promise.all(uploadPromises);
    images = uploadResults.map((result) => result.secure_url);
  }

  const food = await Food.create({
    ...data,
    slug,
    images,
  });

  return food;
};

export const getFoods = async (query: FoodQuery) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter: any = { isDeleted: false, active: true };

  if (query.search) {
    filter.$text = { $search: query.search };
  }

  if (query.category) {
    // Attempt to find category by slug first, otherwise assume ID
    const categoryDoc = await Category.findOne({ slug: query.category, isDeleted: false });
    if (categoryDoc) {
      filter.category = categoryDoc._id;
    } else if (Types.ObjectId.isValid(query.category)) {
      filter.category = query.category;
    } else {
      // Force empty result if category slug not found
      filter.category = new Types.ObjectId();
    }
  }

  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    filter.price = {};
    if (query.minPrice !== undefined) {
      filter.price.$gte = Number(query.minPrice);
    }
    if (query.maxPrice !== undefined) {
      filter.price.$lte = Number(query.maxPrice);
    }
  }

  if (query.dietaryTags) {
    const tags = Array.isArray(query.dietaryTags)
      ? query.dietaryTags
      : query.dietaryTags.split(',');
    filter.dietaryTags = { $in: tags };
  }

  if (query.availability !== undefined) {
    filter.availability = query.availability === 'true' || query.availability === true;
  }

  if (query.minRating !== undefined) {
    filter.averageRating = { $gte: Number(query.minRating) };
  }

  if (query.featured !== undefined) {
    filter.featured = query.featured === 'true' || query.featured === true;
  }

  if (query.maxPrepTime !== undefined) {
    filter.preparationTime = { $lte: Number(query.maxPrepTime) };
  }

  // Sort
  const sortOption: any = {};
  if (query.sort) {
    const sortKey = query.sort.startsWith('-') ? query.sort.substring(1) : query.sort;
    // Map custom sort names to DB fields
    let dbSortKey = sortKey;
    if (sortKey === 'newest') {
      dbSortKey = 'createdAt';
    } else if (sortKey === 'rating') {
      dbSortKey = 'averageRating';
    } else if (sortKey === 'popularity') {
      dbSortKey = 'totalReviews';
    } // Simplified popularity metric

    sortOption[dbSortKey] = query.sort.startsWith('-') ? -1 : 1;

    // For popularity, usually descending
    if (sortKey === 'popularity' && !query.sort.startsWith('-') && !query.sort.startsWith('+')) {
      sortOption[dbSortKey] = -1;
    }
  } else if (query.search) {
    // If text search and no sort provided, sort by text score
    sortOption.score = { $meta: 'textScore' };
  } else {
    sortOption.createdAt = -1;
  }

  const findQuery = Food.find(filter);
  if (query.search && !query.sort) {
    findQuery.select({ score: { $meta: 'textScore' } });
  }

  const [foods, total] = await Promise.all([
    findQuery.populate('category', 'name slug').sort(sortOption).skip(skip).limit(limit),
    Food.countDocuments(filter),
  ]);

  return {
    foods,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    },
  };
};

export const getFoodById = async (id: string): Promise<IFood> => {
  const food = await Food.findOne({ _id: id, isDeleted: false }).populate('category', 'name slug');
  if (!food) {
    throw new ApiError(404, 'Food item not found');
  }
  return food;
};

export const getFoodBySlug = async (slug: string): Promise<IFood> => {
  const food = await Food.findOne({ slug, isDeleted: false }).populate('category', 'name slug');
  if (!food) {
    throw new ApiError(404, 'Food item not found');
  }
  return food;
};

export const updateFood = async (
  id: string,
  data: any,
  imageFiles?: Express.Multer.File[],
): Promise<IFood> => {
  const food = await Food.findOne({ _id: id, isDeleted: false });
  if (!food) {
    throw new ApiError(404, 'Food item not found');
  }

  if (data.name && data.name !== food.name) {
    data.slug = await generateSlug(data.name, id);
  }

  let images = [...food.images];

  // Handle deletions of old images if requested
  if (data.imagesToDelete && Array.isArray(data.imagesToDelete)) {
    for (const urlToDelete of data.imagesToDelete) {
      if (urlToDelete.includes('placeholder.com')) {
        continue;
      }

      const publicId = extractPublicIdFromUrl(urlToDelete);
      if (publicId) {
        await deleteImage(publicId);
      }

      images = images.filter((img) => img !== urlToDelete);
    }
    delete data.imagesToDelete;
  }

  // Handle new uploads
  if (imageFiles && imageFiles.length > 0) {
    const uploadPromises = imageFiles.map((file) => uploadImage(file.buffer, 'restaurant/foods'));
    const uploadResults = await Promise.all(uploadPromises);
    const newImageUrls = uploadResults.map((result) => result.secure_url);

    // Remove placeholder if it's the only image
    if (images.length === 1 && images[0].includes('placeholder.com')) {
      images = [];
    }

    images = [...images, ...newImageUrls];
  }

  data.images = images;

  const updatedFood = await Food.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, runValidators: true },
  ).populate('category', 'name slug');

  return updatedFood!;
};

export const deleteFood = async (id: string): Promise<void> => {
  const food = await Food.findOne({ _id: id, isDeleted: false });
  if (!food) {
    throw new ApiError(404, 'Food item not found');
  }

  // Soft delete
  food.isDeleted = true;
  food.active = false;
  await food.save();
};

export const getSpecialCategoryFoods = async (
  type: 'featured' | 'popular' | 'new' | 'today-special',
) => {
  const filter: any = { isDeleted: false, active: true };
  const sortOption: any = {};
  let limit = 10;

  switch (type) {
    case 'featured':
      filter.featured = true;
      sortOption.createdAt = -1;
      break;
    case 'popular':
      sortOption.totalReviews = -1;
      sortOption.averageRating = -1;
      break;
    case 'new':
      sortOption.createdAt = -1;
      break;
    case 'today-special':
      // Simplified: Just returning highly rated, featured ones as today's special, or pick randomly if MongoDB supports aggregation here easily.
      // Let's use featured + highly rated
      filter.featured = true;
      sortOption.averageRating = -1;
      limit = 5;
      break;
  }

  const foods = await Food.find(filter)
    .populate('category', 'name slug')
    .sort(sortOption)
    .limit(limit);

  return foods;
};

export const getRelatedFoods = async (slug: string) => {
  const food = await Food.findOne({ slug, isDeleted: false });
  if (!food) {
    throw new ApiError(404, 'Food item not found');
  }

  // Find foods in same category, exclude current food
  const relatedFoods = await Food.find({
    category: food.category,
    _id: { $ne: food._id },
    isDeleted: false,
    active: true,
  })
    .populate('category', 'name slug')
    .limit(5);

  return relatedFoods;
};
