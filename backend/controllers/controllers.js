import dotenv from 'dotenv' 
dotenv.config()
import User from "../schemas/UserSchema.js";
import passport from "passport"
import bcrypt from "bcrypt";
import categoryModel from "../schemas/categorySchema.js";
import path from 'path';
import fs from 'fs';
import Product from "../schemas/ProductSchema.js";
import onlineUsers from "../index.js";
import cartModel from "../schemas/CartSchema.js";
import ordersModel from "../schemas/orders.js";
import { error } from "console";
import AdminSettings from "../schemas/Settings.js";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(__dirname);

const saltRounds = 10; // Define saltRounds for bcrypt hashing

export const normalSignUp = async (req, res) => {
    const { username, email, password } = req.body;
    const avatar = req.files?.avatar?.[0]?.filename || null;

    try {
        const isAccountExisted = await User.findOne({ email });
        if (isAccountExisted) {
            return res.status(400).json({
                error: true,
                message: "Account already exists"
            });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            username,
            email,
            password: hashedPassword, // Store the hashed password
            avatar,
            role:email==="eyadmosa853@gmail.com"?"admin":"user",
            adminType:email==="eyadmosa853@gmail.com"?"real":null
        });

        // Construct full avatar URL if avatar exists
        if (avatar) newUser.avatar = `${process.env.backendURL}/uploads/profile/avatars/${avatar}`;

        await newUser.save();

        // Log in the user right after signup using Passport's req.login
req.login(newUser, (err) => {
  if (err) {
    console.error("Login after signup failed:", err);
    return res.status(500).json({ error: true, message: "Signup succeeded but login failed" });
  }

  console.log("User logged in after signup:", req.user?._id || 'User object not available');

  // ❌ No response here → browser never gets cookie
  return res.status(200).json({ error: false, message: "Signup successful" }); // ✅ Must return JSON
});
    } catch (error) {
        console.error("Signup error:", error); // Log the actual error
        res.status(500).json({
            error: true,
            message: "Internal server problem" // Generic error for client
        });
    }
};

export const normalLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                error: true,
                message: "Account does not exist"
            });
        }

        if (!user.password) {
            return res.status(400).json({
                error: true,
                message: "This account was registered via social login. Please use Google or GitHub."
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                error: true,
                message: "Incorrect password"
            });
        }

        // If credentials are correct, log in the user using Passport's req.login
        req.login(user, (err) => {
            if (err) {
                console.error("Login failed during session establishment:", err);
                // Ensure no headers have been sent before attempting to send an error response
                if (!res.headersSent) {
                    return res.status(500).json({
                        error: true,
                        message: "Login failed due to server error"
                    });
                }
                return; // Prevent further execution if headers were sent
            }

          
            
            if (!res.headersSent) { // Defensive check
                return res.status(200).json({
                    error: false,
                    message: "User has logged in successfully"
                });
            }
        });
    } catch (error) {
        console.error("Login attempt error:", error);
        if (!res.headersSent) { // Defensive check
            res.status(500).json({
                error: true,
                message: "Internal server problem"
            });
        }
    }
};

export const tryAsFakeAdmin = async (req, res, next) => {
  try {
    // Ensure logout finishes before continuing
    await new Promise((resolve, reject) => {
      req.logout(err => {
        if (err) reject(err);
        else resolve();
      });
    });

    let user = await User.findOne({ role: 'admin', adminType: 'fake' });

    if (!user) {
      const hashedPassword = await bcrypt.hash('demo1234', 10);
      user = new User({
        username: "Fake_Admin",
        email: 'fakeadmin@demo.com',
        password: hashedPassword,
        role: 'admin',
        adminType: 'fake',
      });
      await user.save();
    }

    req.login(user, (err) => {
      if (err) return next(err);

      return res.status(200).json({
        error: false,
        message: 'Logged in as fake admin',
      });
    });
  } catch (error) {
    console.error('Try as fake admin error:', error);
    res.status(500).json({ error: true, message: 'Server error' });
  }
};

export const firstGoogleRoute = passport.authenticate("google" , {
    scope: ['profile', 'email']
})

export const secondGoogleRoute =  passport.authenticate('google', {
    successRedirect: `${process.env.frontendURL}/home`, // Redirect if authentication succeeds
    failureRedirect: `${process.env.frontendURL}/login`,    // Redirect if authentication fails
})

export const firstGithubRoute = passport.authenticate('github' ,  { scope: ['user:email'] })

export const secondGithubRoute =  passport.authenticate('github', { 
   successRedirect: `${process.env.frontendURL}/home`, // No spaces, just the URL
failureRedirect: `${process.env.frontendURL}/login`
}
)

// ________________________________________________________________________________________

// create category
export const AddCategory = async(req ,res)=>{
    const {category}=req.body

    try{
        const isCategoryExisted = await categoryModel.findOne({category})
        if(isCategoryExisted){
            return res.status(400).json({
                error:true,
                message:"Category is Already Existed"
            })
        }

        const newCategory = new categoryModel({
            category,
        })

        await newCategory.save()

        return res.status(200).json({
            error:false,
            message:'category has been successfully created',
            newCategory
        })

    }catch(error){
        return res.status(500).json({
            error:true,
            message:'internal server issue'
        })
    }
}

export const getAllCategories = async(req , res)=>{
    try{
        const allCategories = await categoryModel.find()

        if(allCategories){
            return res.status(200).json({
                error:false,
                allCategories
            })
        }

    }catch(error){
        return res.status(500).json({
            error:true,
            message:'internal server issue'
        })
    }
}

export const deleteCategory = async(req ,res)=>{
    const {id}=req.params

    try{
        const deletedCategory=await categoryModel.findByIdAndDelete(id)

        return res.status(200).json({
            error:false,
            message:'category has been successfully deleted'
        })

    }catch(error){
        return res.status(500).json({
            error:true,
            message:'internal server issue'
        })
    }
}

export const updateCategory = async(req, res) => {
    const {category} = req.body
    const {id} = req.params
    try {
        const udpatedCategory = await categoryModel.findByIdAndUpdate(
            id, 
            { category }, // Make sure to pass an object with the updated field
            { new: true } // Return the updated document
        )
        return res.status(200).json({
            error: false,
            udpatedCategory
        })
    } catch(error) {
        return res.status(500).json({
            error: true,
            message: 'internal server error'
        })
    }
}

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // never send password

    const usersWithStatus = users.map((user) => ({
      user,
      isOnline: onlineUsers.has(user._id.toString()),
    }));

    res.status(200).json({
      error: false,
      usersWithStatus,
    });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// products

// Get the current file directory


// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category');
    res.status(200).json({
        success: true,
        products
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message
    });
  }
};

// Get single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category').populate('reviews.user');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message
    });
  }
};

// Create new product
export const createProduct = async (req, res) => {
  try {
    const { name, description, category, quality, price, quantity ,inRecomendations} = req.body;
    
    // Validate required fields
    if (!name || !description || !category || !quality || !price || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields"
      });
    }

    // Check if main image was uploaded
    if (!req.files || !req.files.mainImage) {
      return res.status(400).json({
        success: false,
        message: "Main product image is required"
      });
    }

    // Create image paths
    const mainImagePath = `/uploads/products/${req.files.mainImage[0].filename}`;
    
    // Handle extra images if they exist
    const extraImages = [];
    for (let i = 0; i < 3; i++) {
      if (req.files[`extraImage${i+1}`]) {
        extraImages.push(`/uploads/products/${req.files[`extraImage${i+1}`][0].filename}`);
      }
    }
    
    // Create new product
    const product = new Product({
      name,
      description,
      category,
      quality,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      mainImage: mainImagePath,
      extraImages,
      inRecomendations
    });
    
    await product.save();
    
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message
    });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const { name, description, category, quality, price, quantity ,inRecomendations} = req.body;
    
    // Find product first
    let product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }
    
    // Update fields
    if (name) product.name = name;
    if (description) product.description = description;
    if (category) product.category = category;
    if (quality) product.quality = quality;
    if (inRecomendations) product.inRecomendations = inRecomendations;
    if (price) product.price = parseFloat(price);
    if (quantity) product.quantity = parseInt(quantity);
    
    // Handle image updates if present
    if (req.files && req.files.mainImage) {
      // Delete old image if it exists
      const oldPath = path.join(__dirname, '..', product.mainImage);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
      product.mainImage = `/uploads/products/${req.files.mainImage[0].filename}`;
    }
    
    // Handle extra images updates
    for (let i = 0; i < 3; i++) {
      if (req.files && req.files[`extraImage${i+1}`]) {
        // If there's an old image at this index, delete it
        if (product.extraImages[i]) {
          const oldPath = path.join(__dirname, '..', product.extraImages[i]);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
        
        // If extraImages array doesn't exist yet or is too small, ensure it has enough elements
        while (product.extraImages.length <= i) {
          product.extraImages.push("");
        }
        
        // Update the path
        product.extraImages[i] = `/uploads/products/${req.files[`extraImage${i+1}`][0].filename}`;
      }
    }
    
    // Save updated product
    product = await product.save();
    
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message
    });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }
    
    // Delete product images from storage
    const mainImagePath = path.join(__dirname, '..', product.mainImage);
    if (fs.existsSync(mainImagePath)) {
      fs.unlinkSync(mainImagePath);
    }
    
    // Delete extra images if they exist
    product.extraImages.forEach(imagePath => {
      if (imagePath) {
        const fullPath = path.join(__dirname, '..', imagePath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      }
    });
    
    // Remove product from database
    await product.deleteOne()
    
    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message
    });
  }
};

// Search products
export const searchProducts = async (req, res) => {
  try {
    const { keyword, category, minPrice, maxPrice, quality } = req.query;
    
    // Build query object
    const query = {};
    
    // Add search conditions if parameters are provided
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }
    
    if (category) {
      query.category = category;
    }
    
    if (quality) {
      query.quality = quality;
    }
    
    // Price range
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = parseFloat(minPrice);
      if (maxPrice !== undefined) query.price.$lte = parseFloat(maxPrice);
    }
    
    // Execute query
    const products = await Product.find(query).populate('category', 'category');
    
    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search products",
      error: error.message
    });
  }
};

// Get products by category
export const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    
    const products = await Product.find({ category: categoryId }).populate('category', 'category');
    
    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products by category",
      error: error.message
    });
  }
};

// Update product stock
export const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    
    if (quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please provide quantity"
      });
    }
    
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }
    
    product.quantity = parseInt(quantity);
    await product.save();
    
    res.status(200).json({
      success: true,
      message: "Product stock updated successfully",
      product
    });
  } catch (error) {
    console.error("Error updating product stock:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update product stock",
      error: error.message
    });
  }
};

export const updateProductReview = async (req, res) => {
  const userId = req.user.id;
  const { productId, review } = req.params;
  const {comment}=req.body

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: true, message: "Product not found" });
    }

    // Check if the user already reviewed this product
    const existingReviewIndex = product.reviews.findIndex(
      (r) => r.user.toString() === userId
    );

    if (existingReviewIndex !== -1) {
      // User has already reviewed -> update
      product.reviews[existingReviewIndex].review = review;
      product.reviews[existingReviewIndex].comment = comment;
      product.reviews[existingReviewIndex].createdAt = new Date();
    } else {
      // User has not reviewed -> add new
      product.reviews.push({
        user: userId,
        review,
        comment
      });
    }

    await product.save();

    const io = req.app.get('io')
    io.emit('newReview' , product)

    return res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      reviews: product.reviews
    });

  } catch (err) {
    return res.status(500).json({
      error: true,
      message: 'Server error',
      err
    });
  }
};


// cart
export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id; // assuming user is authenticated

  try {
    let cart = await cartModel.findOne({ userId });

    if (!cart) {
      cart = new cartModel({ userId, items: [{ productId, quantity }] });
    } else {
      const existingItem = cart.items.find(item => item.productId&&item.productId.equals(productId));
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
    }

    await cart.save();
    res.status(200).json({
      error:false,
      cart
    });
  } catch (err) {
    res.status(500).json({ message: 'Error adding to cart', error: err.message });
  }
};

// Get user cart
export const getCart = async (req, res) => {
  const userId = req.user.id;


  try {
    const cart = await cartModel.findOne({ userId }).populate('items.productId');
    res.status(200).json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cart', error: err.message });
  }
};

export const increaseQuantity = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;

  try {
    const cart = await cartModel.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.find(item => item.productId.toString() === productId);
    if (!item) return res.status(404).json({ message: 'Product not in cart' });

    item.quantity += 1;

    await cart.save();
    res.status(200).json({
      error: false,
      message: 'Quantity increased',
      cart,
    });
  } catch (err) {
    res.status(500).json({ error: true, message: 'Error increasing quantity', details: err.message });
  }
};

export const decreaseQuantity = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;

  try {
    const cart = await cartModel.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.find(item => item.productId.toString() === productId);
    if (!item) return res.status(404).json({ message: 'Product not in cart' });

    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      // Optional: remove item from cart if quantity reaches 0
      cart.items = cart.items.filter(i => i.productId.toString() !== productId);
    }

    await cart.save();
    res.status(200).json({
      error: false,
      message: 'Quantity decreased',
      cart,
    });
  } catch (err) {
    res.status(500).json({ error: true, message: 'Error decreasing quantity', details: err.message });
  }
};

export const removeFromCart = async (req, res) => {
  const userId = req.user.id; // assuming user is authenticated
  const { id } = req.params;

  try {
    const cart = await cartModel.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Filter out the item to remove it
    cart.items = cart.items.filter(item => item.productId && !item.productId.equals(id));

    await cart.save();
    res.status(200).json({
      error: false,
      message: 'Product removed from cart',
      cart,
    });
  } catch (err) {
    res.status(500).json({ error: true, message: 'Error removing item', details: err.message });
  }
};

export const clearUserCart = async (req, res) => {
  const userId = req.user.id

  try {
    // Find the cart for this user and set items to empty array
    const updatedCart = await cartModel.findOneAndUpdate(
      { userId },
      { items: [] },
      { new: true }
    );

    if (!updatedCart) {
      return res.status(404).json({ message: 'Cart not found for this user' });
    }

    res.status(200).json({ message: 'Cart cleared successfully', cart: updatedCart });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing cart', error: error.message });
  }
};

// orders
export const createAnOrder = async(req , res)=>{
  const {orderItems,shippingAddress,taxPrice,shippingPrice,totalPrice}=req.body
  const user = req.user.id
  try{
    const newOrder = new ordersModel({
      user,
      orderItems,
      shippingAddress,
      taxPrice,
      shippingPrice,
      totalPrice
    })

    newOrder.save()

    const io = req.app.get('io')
    io.emit('newOrder' , newOrder)

    return res.status(200).json({
      error:false,
      message:"order has been created succesffully"
    })
  }catch(error){
    res.status(500).json({ message: 'Error clearing cart', error: error.message });
  }
}

export const getUserOrders = async(req , res)=>{
  const userId = req.user.id
  console.log(req.user.id);
  try{
    const orders = await ordersModel.find({user:userId}).populate('user').populate('orderItems.product');
    if(!orders){
      return res.status(404).json({
        error:true,
        message:'No orders yet'
      })
    }

    return res.status(200).json({
      error:false,
      orders
    })
  }catch(error){
    res.status(500).json({ message: 'Error clearing cart', error: error.message });
  }
}

export const getAllOrders = async(req , res)=>{
  try{
    const orders = await ordersModel.find().populate('user').populate('orderItems.product');

    if(!orders){
      return res.status(404).json({
        error:true,
        message:"no order yet"
      })
    }

    return res.status(200).json({
      error:false,
      orders
    })
  }catch(err){
    res.status(500).json({ message: 'Error clearing cart', error: error.message });
  }
}

// Overview: Revenue, Orders, New Customers
export const getAnalyticsOverview = async (req, res) => {
  try {
    const revenue = await ordersModel.aggregate([
      { $match: { paidAt: { $ne: null } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalPrice" },
          totalOrders: { $sum: 1 }
        }
      }
    ]);

    const newCustomers = await User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });

    res.json({
      error:false,
      totalRevenue: revenue[0]?.totalRevenue || 0,
      totalOrders: revenue[0]?.totalOrders || 0,
      newCustomers
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching overview", error: err });
  }
};


// Orders per day (last 30 days)
export const getOrdersPerDay = async (req, res) => {
  try {
    const result = await ordersModel.aggregate([
      {
        $match: {
          paidAt: { $ne: null },
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      error:false,
      result
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders per day", error: err });
  }
};

// Top Selling Products
export const getTopSellingProducts = async (req, res) => {
  try {
    const result = await ordersModel.aggregate([
      { $unwind: "$orderItems" },
      {
        $group: {
          _id: "$orderItems.product",
          totalSold: { $sum: "$orderItems.quantity" }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 6 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      {
        $project: {
          _id: 0,
          name: "$product.name",
          totalSold: 1
        }
      }
    ]);

    res.json({
      error:false,
      result
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching top products", error: err });
  }
};

// Sales Distribution by Category
export const getSalesDistribution = async (req, res) => {
  try {
    const result = await ordersModel.aggregate([
      { $unwind: "$orderItems" },
      {
        $lookup: {
          from: "products",
          localField: "orderItems.product",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      {
        $group: {
          _id: "$product.category", // if it's string (e.g., "Electronics")
          totalSold: { $sum: "$orderItems.quantity" }
        }
      }
    ]);

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Error fetching sales distribution", error: err });
  }
};

// Monthly Overview (Revenue and Orders)
export const getMonthlyOverview = async (req, res) => {
  try {
    const result = await ordersModel.aggregate([
      { $match: { paidAt: { $ne: null } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          totalRevenue: { $sum: "$totalPrice" },
          totalOrders: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    res.json({
      error:false,
      result
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching monthly overview", error: err });
  }
};

export const upadteUserLocation = async(req , res)=>{
  const userId = req.user.id
  const {location}=req.body
  try{
    const user = await User.findOne({_id:userId})

    if(user){
      return res.status(400).json({
        error:true,
        message:'this user is not found'
      })
    }

    user.location=location

    user.save()

    return res.status(200).json({
      error:false,
      message:'user location has been updated'
    })
  }catch(err){
    return res.status(500).json({
      error:false,
      message:err
    })
  }
}

const getSettings = async () => {
  let settings = await AdminSettings.findOne();
  if (!settings) {
    settings = new AdminSettings();
    await settings.save();
  }
  return settings;
};

// GET all settings
export const getSettingsController = async (req, res) => {
  try {
    const settings = await getSettings();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH update settings (partial update)
export const updateSettingsController = async (req, res) => {
  try {
    const {
      storeName,
      darkMode,
      maintenanceMode,
      currencySymbol,
    } = req.body;

    const logoFile = req.files.logo?.[0]; // get the first logo file if exists

    const settings = await getSettings();

    if (storeName !== undefined) settings.storeName = storeName;
    if (darkMode !== undefined) settings.darkMode = darkMode // convert string to boolean
    if (maintenanceMode !== undefined) settings.maintenanceMode = maintenanceMode 
    if (currencySymbol !== undefined) settings.currencySymbol = currencySymbol;

    if (logoFile) {
      settings.logo = `${process.env.backendURL}/uploads/profile/logos/${logoFile.filename}`;
    }

    await settings.save(); // FIXED: added await

    return res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).json({ message: "Logout failed" });
    }

    res.clearCookie("connect.sid"); // Clear the session cookie
    return res.status(200).json({ message: "Logged out successfully" });
  });
};



