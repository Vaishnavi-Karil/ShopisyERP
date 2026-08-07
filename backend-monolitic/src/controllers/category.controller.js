const Category = require("../models/Category");

const createCategory = async (req, res, next) => {
    try {

        const requestBody = req.body;

        console.log(requestBody);

        const { name, parentCategory } = req.body;

        const createCategory = await Category.create({
            name,
            parentCategory
        });

        res.status(201).json({
            success: true,
            data: createCategory
        })


    } catch (error) {
        console.log(error)
        next(error);
    }
}


const getAllCategory = async (req, res, next) => {
    try {
        const categories = await Category.find({}).populate('parentCategory');

        res.status(200).json({
            success: true,
            data: categories
        })
    } catch (error) {
        next(error)
    }
}

const getCatergoriesTree = async (req, res, next) => {
    try {

        const data = await Category.aggregate([
            {
                $match:
                {
                    parentCategory: null
                }
            },
            {
                $lookup:

                {
                    from: "categories",
                    localField: "_id",
                    foreignField: "parentCategory",
                    as: "subCategories"
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    subCategories: 1
                }
            }
        ]);
        res.status(200).json({
            success: true,
            data: data
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}

module.exports = { createCategory, getAllCategory, getCatergoriesTree };