import express from "express"
import { AddCategory,
    addToCart,
    clearUserCart,
    createAnOrder,
    createProduct,
    decreaseQuantity,
    deleteCategory,
    deleteProduct,
    firstGithubRoute,
    firstGoogleRoute,
    getAllCategories,
    getAllOrders,
    getAllProducts,
    getAllUsers,
    getAnalyticsOverview,
    getCart,
    getMonthlyOverview,
    getOrdersPerDay,
    getProductById,
    getProductsByCategory,
    getSalesDistribution,
    getSettingsController,
    getTopSellingProducts,
    getUserOrders,
    increaseQuantity,
    logout,
    normalLogin,
    normalSignUp,
    removeFromCart,
    searchProducts,
    secondGithubRoute,
    secondGoogleRoute,
    tryAsFakeAdmin,
    upadteUserLocation,
    updateCategory,
    updateProduct,
    updateProductReview,
    updateSettingsController,
    updateStock 
} from "../controllers/controllers.js"
import Productupload from "../utils/ProductMulter.js"
import uploadProfileImages from '../utils/userMulter.js'
import isRealAdmin from "../utils/isRealAdmin .js"




const router = express.Router()

// authentication
router.post("/signup" , uploadProfileImages ,normalSignUp)
router.post("/login" ,normalLogin)
router.post('/tryAsFakeAdmin',tryAsFakeAdmin)
router.get("/auth/google" , firstGoogleRoute)
router.get('/auth/google/callback', secondGoogleRoute)
router.get('/auth/github', firstGithubRoute);
router.get('/auth/github/callback', secondGithubRoute);
router.get('/api/user', (req, res) => {
    if (req.isAuthenticated()) {
        // Passport has put the user info on req.user
        res.json({
            error: false,
            user: req.user
        });
    } else {
        res.status(401).json({
            error: true,
            message: 'Not authenticated'
        });
    }
});


// categories
router.post('/category/add' ,isRealAdmin, AddCategory)
router.get('/category/getAll' , getAllCategories)
router.delete('/category/delete/:id' ,isRealAdmin, deleteCategory)
router.put('/category/update/:id' ,isRealAdmin, updateCategory)


// customers
router.get('/customers/getAll' , getAllUsers)
router.patch('/upadteUserLocation' , upadteUserLocation)

// products
const uploadFields = Productupload.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'extraImage1', maxCount: 1 },
  { name: 'extraImage2', maxCount: 1 },
  { name: 'extraImage3', maxCount: 1 }
]);
// Product routes
router.get('/product/getAll', getAllProducts);
router.get('/product/search', searchProducts);
router.get('/product/getByCategory/:categoryId', getProductsByCategory);
router.get('/product/getProductById/:id', getProductById);
router.post('/product/create', uploadFields , isRealAdmin, createProduct);
router.put('/product/update/:id', uploadFields , isRealAdmin, updateProduct);
router.delete('/product/delete/:id',isRealAdmin, deleteProduct);
router.patch('/product/updateStock/:id',isRealAdmin, updateStock);
router.patch('/product/updateProductReview/:productId/:review' , updateProductReview)

// carts
router.post('/cart/create', addToCart);
router.get('/cart/getAll', getCart);
router.put('/cart/increase/:productId',increaseQuantity);
router.put('/cart/decrease/:productId',decreaseQuantity);
router.delete('/cart/remove/:id',removeFromCart);
router.delete('/cart/clear', clearUserCart);

// analystics
router.get("/getAnalyticsOverview", getAnalyticsOverview);
router.get("/getOrdersPerDay", getOrdersPerDay);
router.get("/getTopSellingProducts", getTopSellingProducts);
router.get("/getSalesDistribution", getSalesDistribution);
router.get("/getMonthlyOverview", getMonthlyOverview);

// orders
router.post(`/order/create`,isRealAdmin, createAnOrder)
router.get(`/order/getUserOrders`, getUserOrders)
router.get(`/order/getAll`, getAllOrders)
router.delete(`/order/cancel/:id`,isRealAdmin, getAllOrders)

// settings
router.get('/settings/get', getSettingsController);
router.patch('/settings/update',uploadProfileImages,isRealAdmin, updateSettingsController);
router.delete("/settings/logoutAccount" , logout)




export default router