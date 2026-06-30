import Category from '../../../models/Category.model';

class CategoryService {
  public async bulkAction(categoryIds: string[], action: 'activate' | 'deactivate' | 'delete') {
    let updateQuery = {};
    if (action === 'activate') {
      updateQuery = { active: true };
    } else if (action === 'deactivate') {
      updateQuery = { active: false };
    } else if (action === 'delete') {
      updateQuery = { isDeleted: true, active: false };
    }

    const result = await Category.updateMany({ _id: { $in: categoryIds } }, { $set: updateQuery });
    return result;
  }

  public async reorderCategories(orderedIds: string[]) {
    // orderedIds is an array of category IDs in the desired order
    const bulkOps = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { sortOrder: index } },
      },
    }));

    if (bulkOps.length > 0) {
      await Category.bulkWrite(bulkOps);
    }
    return true;
  }
}

export default new CategoryService();
