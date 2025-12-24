const BlogPost = require('../models/blogPost');
const Project = require('../models/project');
const Contact = require('../models/contact');
const User = require('../models/user');

exports.getDashboardStats = async (req, res) => {
    try {
        const [blogCount, projectCount, contactCount, userCount] = await Promise.all([
            BlogPost.countDocuments(),
            Project.countDocuments(),
            Contact.countDocuments(),
            User.countDocuments()
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                blogs: blogCount,
                projects: projectCount,
                contacts: contactCount,
                users: userCount
            }
        });
    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        res.status(500).json({ message: "Error fetching dashboard stats", error: error.message });
    }
};
