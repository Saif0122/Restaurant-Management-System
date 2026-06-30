import Category, { ICategory } from '../models/Category.model';
import { ApiError } from '../utils/ApiError';
import { uploadImage, deleteImage, extractPublicIdFromUrl } from '../utils/cloudinary.util';

interface CategoryQuery {
  page?: number;
  limit?: number;
  search?: string;
  active?: boolean;
  featured?: boolean;
  sort?: string;
}

const generateSlug = async (name: string, excludeId?: string): Promise<string> => {
  let slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  const exists = await Category.findOne({ slug, _id: { $ne: excludeId } });

  if (exists) {
    let counter = 1;
    let newSlug = `${slug}-${counter}`;
    while (await Category.findOne({ slug: newSlug, _id: { $ne: excludeId } })) {
      counter++;
      newSlug = `${slug}-${counter}`;
    }
    slug = newSlug;
  }

  return slug;
};

export const createCategory = async (
  data: any,
  imageFile?: Express.Multer.File,
): Promise<ICategory> => {
  const slug = await generateSlug(data.name);

  let imageUrl = 'https://via.placeholder.com/150';
  if (imageFile) {
    const uploadResult = await uploadImage(imageFile.buffer, 'restaurant/categories');
    imageUrl = uploadResult.secure_url;
  }

  const category = await Category.create({
    ...data,
    slug,
    image: imageUrl,
  });

  return category;
};

export const getCategories = async (query: CategoryQuery) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter: any = { isDeleted: false };

  if (query.search) {
    filter.name = { $regex: query.search, $options: 'i' };
  }
  if (query.active !== undefined) {
    filter.active = query.active;
  }
  if (query.featured !== undefined) {
    filter.featured = query.featured;
  }

  // Sort: e.g., 'name' or '-createdAt'
  const sortOption: any = {};
  if (query.sort) {
    const sortKey = query.sort.startsWith('-') ? query.sort.substring(1) : query.sort;
    sortOption[sortKey] = query.sort.startsWith('-') ? -1 : 1;
  } else {
    sortOption.createdAt = -1;
  }

  const [categories, total] = await Promise.all([
    Category.find(filter)
      .populate('parentCategory', 'name slug')
      .sort(sortOption)
      .skip(skip)
      .limit(limit),
    Category.countDocuments(filter),
  ]);

  return {
    categories,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    },
  };
};

export const getCategoryById = async (id: string): Promise<ICategory> => {
  const category = await Category.findOne({ _id: id, isDeleted: false }).populate(
    'parentCategory',
    'name slug',
  );
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }
  return category;
};

export const updateCategory = async (
  id: string,
  data: any,
  imageFile?: Express.Multer.File,
): Promise<ICategory> => {
  const category = await Category.findOne({ _id: id, isDeleted: false });
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  if (data.name && data.name !== category.name) {
    data.slug = await generateSlug(data.name, id);
  }

  if (imageFile) {
    const uploadResult = await uploadImage(imageFile.buffer, 'restaurant/categories');

    // Delete old image if it's not the placeholder
    if (category.image && !category.image.includes('placeholder.com')) {
      const publicId = extractPublicIdFromUrl(category.image);
      if (publicId) {
        await deleteImage(publicId);
      }
    }

    data.image = uploadResult.secure_url;
  }

  const updatedCategory = await Category.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, runValidators: true },
  ).populate('parentCategory', 'name slug');

  return updatedCategory!;
};

export const deleteCategory = async (id: string): Promise<void> => {
  const category = await Category.findOne({ _id: id, isDeleted: false });
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  // Soft delete
  category.isDeleted = true;
  category.active = false;
  await category.save();

  // If you also wanted to delete Cloudinary images upon hard delete, you would do:
  // if (category.image && !category.image.includes('placeholder.com')) { ... }
};
