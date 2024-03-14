const { Blogs, BlogsCategory, BlogsMain } = require('../models/Blogs');
const Products = require('../models/Products');
const Category = require('../models/Category');
const { upload, makePublicRead } = require('../config/multer');
const MainCategory = require('../models/MainCategory');
require('dotenv').config();

// Admin Controllers
const adminControllers = {
  createCategory: async (req, res) => {
    try {
      const { category } = req.body;
      const newCategory = await BlogsCategory.create({ blog_category: category });
      res.status(201).json(newCategory);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  createBlog: async (req, res) => {
    try {
      const { blogTitle, category, blogSections: blogSectionsJSON, blogCoverPhoto, blogSummary } = req.body; // Extract blogCoverPhoto here
      const blogSections = JSON.parse(blogSectionsJSON);

      let coverPhotoPath = blogCoverPhoto; // Use the extracted blogCoverPhoto

      // Check if a file is uploaded for the cover photo, assuming the field name is 'blogCoverPhoto'
      const coverPhotoFile = req.files?.find(file => file.fieldname === 'blogCoverPhoto');
      if (coverPhotoFile) {
        coverPhotoPath = coverPhotoFile.location; // Use the file location if a file was uploaded
        await makePublicRead(process.env.AWS_BUCKET_NAME, coverPhotoFile.key);
      }

      const [newMainBlog, created] = await BlogsMain.findOrCreate({
        where: { blog: blogTitle },
        defaults: { blog: blogTitle, blog_category: category, blogCoverPhoto: coverPhotoPath, blogSummary: blogSummary }
      });

      // Process each section in sequence
      for (const [index, section] of blogSections.entries()) {
        let blog_pic;

        // Find the matching file based on the index
        const fileKey = `blogSections[${index}][blogPhotos]`;
        const matchingFile = req.files?.find(file => file.fieldname === fileKey);

        if (matchingFile) {
          blog_pic = matchingFile.location; // Assuming this is the correct path
          await makePublicRead(process.env.AWS_BUCKET_NAME, matchingFile.key);
        } else if (section.blogPhotos && typeof section.blogPhotos === 'string') {
          blog_pic = section.blogPhotos;
        } else {
          console.log('No photo provided for section', index);
        }

        await Blogs.create({
          blogName: section.blogName,
          blogBody: section.blogBody,
          blog: newMainBlog.blog,
          blogPhotos: blog_pic
        });
      }

      res.status(201).json({ message: "Blog created successfully", blog: newMainBlog });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  },





  // Read all blog posts
  getAllBlogs: async (req, res) => {
    try {
      const blogs = await BlogsMain.findAll();
      res.status(200).json(blogs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  // // Read all blog posts
  // getAllBlogs: async (req, res) => {
  //   try {
  //     const blogs = await Blogs.findAll();
  //     res.status(200).json(blogs);
  //   } catch (error) {
  //     res.status(500).json({ error: error.message });
  //   }
  // },

  // Update a blog post
  updateBlog: async (req, res) => {
    try {
      const { id } = req.params;
      const { blogName, blogBody, blogPhotos } = req.body;
      const updated = await Blogs.update({ blogName, blogBody, blogPhotos }, { where: { id } });
      if (updated) {
        const updatedBlog = await Blogs.findByPk(id);
        res.status(200).json(updatedBlog);
      } else {
        res.status(404).json({ message: 'Blog not found' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Delete a blog post
  deleteBlog: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Blogs.destroy({ where: { id } });
      if (deleted) {
        res.status(200).json({ message: 'Blog deleted' });
      } else {
        res.status(404).json({ message: 'Blog not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteMainBlog: async (req, res) => {
    try {
      const { blog } = req.params;
      const deleted = await BlogsMain.destroy({ where: { blog } });
      if (deleted) {
        res.status(200).json({ message: 'Blog deleted' });
      } else {
        res.status(404).json({ message: 'Blog not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

// User Controllers
const userControllers = {
  // Read a single blog post
  getBlog: async (req, res) => {
    try {
      const { blogTitle } = req.params;
      const blog = await Blogs.findAll({ where: { blog: blogTitle } });
      if (blog) {
        // Increment the blog views
        const mainBlog = await BlogsMain.findByPk(blogTitle);
        mainBlog.blogViews += 1;
        await mainBlog.save();

        res.status(200).json(blog);
      } else {
        res.status(404).json({ message: 'Blog not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Read all blog posts
  getAllBlogs: adminControllers.getAllBlogs,

  getBlogsByCategory: async (req, res) => {
    try {
      const { category } = req.params;
      const blogs = await BlogsMain.findAll({ where: { blog_category: category } });
      res.status(200).json(blogs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = { adminControllers, userControllers };
