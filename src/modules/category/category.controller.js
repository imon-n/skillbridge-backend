import * as CategoryService from "./category.service";
export const createCategories = async (req, res) => {
    try {
        const result = await CategoryService.createCategory(req.body);
        res.status(201).json({
            status: true,
            message: "Categories created successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
export const getCategories = async (req, res) => {
    try {
        const categories = await CategoryService.getCategories();
        res.status(200).json({
            status: true,
            message: "Categories fetched successfully",
            data: categories,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
