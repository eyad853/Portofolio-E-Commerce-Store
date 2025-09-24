import React, { useState } from 'react'
import { BrowserRouter as Router , Routes , Route } from 'react-router-dom'
import MainPage from './pages/MainPage/MainPage'
import ProductPage from './pages/ProductPage/ProductPage'
import Cart from './pages/CartPage/Cart'
import Modal from 'react-modal'
import Signup from './pages/Signup/Signup'
import Login from './pages/Login/Login'
import { useEffect } from 'react'
import axios from 'axios'
import DashboardLayOut from './pages/DashboardLayout/DashboardLayOut'
import Dashboard from './pages/DashboardLayout/Dashboard'
import D_Products from './pages/DashboardLayout/D_Products'
import Categories from './pages/DashboardLayout/Categories'
import Orders from './pages/DashboardLayout/Orders'
import Customers from './pages/DashboardLayout/Customers'
import Analytics from './pages/DashboardLayout/Analytics'
import Settings from './pages/DashboardLayout/Settings'
import socket from './socket'
import UserOrders from './pages/UserOrders/UserOrders'
import analyticsService from './analyticsService'
import Maintenance from './pages/Maintenance/Maintenance'
Modal.setAppElement("#root")

const App = () => {
  const [isOpen , setIsOpen]=useState(false)
  const [isCartOpen , setIsCartOpen]=useState(false)
  const [isProductPageOpen , setIsProductPageOpen]=useState(false)
  const [user ,setUser]=useState(null)
  const [customerId , setCustomerId]=useState('')
  const [isReviewModalOpen , setIsReviewModalOpen]=useState(false)
  const [darkMode , setDarkMode]=useState(false)
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [error, setError] = useState(null);
  const [trigger , setTrigger]=useState(0)
  const [dashboardError , setDashboardError]=useState('')
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingProduct, setPendingProduct] = useState(null);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
});

    socket.on('disconnect', (reason) => {
      console.log('Disconnected from server:', reason);
    });

    return () => {
      socket.off('connect');
      socket.off('connect_error');
      socket.off('disconnect');
    };
  }, []);
    

const fetchAllProducts = async () => {
  try {
        setLoadingProducts(true)
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/product/getAll`);
          if (response.data.success) {
          setProducts(response.data.products);
          }
      } catch(error) {
          console.log(error);
      }finally{
        setLoadingProducts(false)
      }
};

useEffect(() => {
    fetchAllProducts();
}, []);
  

  useEffect(() => {
    setLoadingUser(true)
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user`, { withCredentials: true })
        .then(response => {
            if (!response.data.error) {
                setUser(response.data.user);
                setCustomerId(response.data.user._id)
                console.log(response.data.user||"no data");
            }
        })
        .catch(error => {
            console.error('Error fetching user:', error);
        })
        .finally(() => {
            setLoadingUser(false);  // ✅ runs after request finishes
        });
}, [trigger]);

useEffect(() => {
  if (!customerId) return;

  const handleConnect = () => {
    console.log('Socket connected!');
    socket.emit('user-connected', customerId);
  };

  socket.on('connect', handleConnect);

  return () => {
    socket.off('connect', handleConnect);
    // do NOT disconnect socket here unless you really want to
  };
}, [customerId]);

const handleAddToCart = async(product_id)=>{
  if(user){
    const item = {
        productId:product_id,
        quantity:1
    }
    
    try{
        const response = axios.post(`${import.meta.env.VITE_BACKEND_URL}/cart/create` , item , {withCredentials: true})
    }catch(err){
        console.log(err);
    }
  }else{
    setPendingProduct(product_id);
    setShowAuthModal(true);
  }
}

const updateProductReview = async(productId, review , comment)=>{
  setProducts(prev =>
    prev.map(product =>
      product._id === productId
        ? {
            ...product,
            reviews: [
              ...product.reviews,
              {
                user: user?._id, // Replace with actual user ID if available
                review,
                createdAt: new Date().toISOString()
              }
            ]
          }
        : product
    )
  );
  try{
    const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/product/updateProductReview/${productId}/${review}` ,{comment} , {withCredentials:true})
  }catch(err){
    console.log(err);
  }
}

const [overview, setOverview] = useState(null);
  const [ordersPerDay, setOrdersPerDay] = useState([]);
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [salesDistribution, setSalesDistribution] = useState([]);
  const [monthlyOverview, setMonthlyOverview] = useState([]);
  

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoadingAnalytics(true);

        // Fetch Overview
        const overviewData = await analyticsService.getAnalyticsOverview();
        setOverview(overviewData);

        // Fetch Orders Per Day
        const ordersPerDayData = await analyticsService.getOrdersPerDay();
        setOrdersPerDay(ordersPerDayData);

        // Fetch Top Selling Products
        const topProductsData = await analyticsService.getTopSellingProducts();
        setTopSellingProducts(topProductsData);

        // Fetch Sales Distribution
        const salesDistData = await analyticsService.getSalesDistribution();
        setSalesDistribution(salesDistData);

        // Fetch Monthly Overview
        const monthlyData = await analyticsService.getMonthlyOverview();
        setMonthlyOverview(monthlyData);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingAnalytics(false);
      }
    };

    fetchAnalyticsData();
  }, []); // Empty dependency array means this runs once on component mount


// States for each setting
  const [storeName, setStoreName] = useState('');
  const [storeLogo, setStoreLogo] = useState('');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [currencySymbol, setCurrencySymbol] = useState('$');

  // Load settings on mount
  async function fetchSettings() {
    setLoadingSettings(true);
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/settings/get`);
      setStoreName(data.storeName || '');
      setStoreLogo(data.logo || '');
      setDarkMode(data.darkMode ?? false);
      setMaintenanceMode(data.maintenanceMode ?? false);
      setCurrencySymbol(data.currencySymbol || '$');
      setError(null);
    } catch (err) {
      setError('Failed to load settings');
    } finally {
      setLoadingSettings(false);
    }
  }
  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if(user){
      const pendingProduct = localStorage.getItem("pendingProduct");
      if (pendingProduct) {
        handleAddToCart(pendingProduct); // add product to cart automatically
        localStorage.removeItem("pendingProduct");
      }
    }
}, []);



  return (
    <Router>
      <Routes>
        <Route path='/signup' element={<Signup setTrigger={setTrigger} handleAddToCart={handleAddToCart}/>} />
        <Route path='/login' element={<Login setTrigger={setTrigger}/>} />
        <Route path='/' element={
          loadingProducts?
        (
          <div className='fixed inset-0 flex justify-center items-center'>
            <div className="w-80 h-80 rounded-full border-y-2 border-blue-600 animate-spin"></div>
          </div>
        ):(
        <MainPage 
        darkMode={darkMode} 
        isReviewModalOpen={isReviewModalOpen} 
        setIsReviewModalOpen={setIsReviewModalOpen} 
        products={products}
        setProducts={setProducts} 
        updateProductReview={updateProductReview} 
        handleAddToCart={handleAddToCart} 
        user={user} 
        isOpen={isOpen} 
        storeName={storeName}
        storeLogo={storeLogo}
        setIsOpen={setIsOpen} 
        currencySymbol={currencySymbol}
        showAuthModal={showAuthModal}
        setShowAuthModal={setShowAuthModal}
        pendingProduct={pendingProduct}
        />)}/>

        <Route path='/cart' element={<Cart 
        user={user} 
        isCartOpen={isCartOpen} 
        setIsCartOpen={setIsCartOpen}
        darkMode={darkMode} 
        storeLogo={storeLogo}
        storeName={storeName}
        />}/>
        <Route path='/userOrders' element={<UserOrders 
        darkMode={darkMode} 
        user={user}
        storeLogo={storeLogo}
        storeName={storeName}
        />}/>
        <Route path='/maintenance' element={<Maintenance />}/>

        <Route path='/product/:id' element={<ProductPage 
        isReviewModalOpen={isReviewModalOpen} 
        setIsReviewModalOpen={setIsReviewModalOpen} 
        setProducts={setProducts} 
        updateProductReview={updateProductReview} 
        isProductPageOpen={isProductPageOpen} 
        setIsProductPageOpen={setIsProductPageOpen}
        darkMode={darkMode} 
        user={user}
        socket={socket}
        handleAddToCart={handleAddToCart}
        showAuthModal={showAuthModal}
        setShowAuthModal={setShowAuthModal}
        pendingProduct={pendingProduct}
        />}/>

        <Route path='/admin/dashboard' element={<DashboardLayOut 
        darkMode={darkMode} 
        user={user}
        storeName={storeName}
        storeLogo={storeLogo}
        dashboardError={dashboardError}
        setDashboardError={setDashboardError}
        />}>
          <Route index element={
            loadingAnalytics?
          (
            <div className='fixed inset-0 flex justify-center items-center'>
            <div className="w-80 h-80 rounded-full border-y-2 border-blue-600 animate-spin"></div>
          </div>
          )
          :(<Dashboard 
          darkMode={darkMode} 
          overview={overview}
          monthlyOverview={monthlyOverview}
          ordersPerDay={ordersPerDay}
          topSellingProducts={topSellingProducts}
          /> )}/>
          
          <Route path='/admin/dashboard/Products' element={
          <D_Products 
          darkMode={darkMode} 
          currencySymbol={currencySymbol}
          loadingProducts={loadingProducts}
          setDashboardError={setDashboardError}
          /> }/>

          <Route path='/admin/dashboard/Categories' element={<Categories 
          darkMode={darkMode} 
          setDashboardError={setDashboardError}
          /> }/>

          <Route path='/admin/dashboard/Orders' element={<Orders 
          darkMode={darkMode} 
          /> }/>

          <Route path='/admin/dashboard/Customers' element={<Customers 
          darkMode={darkMode} 
          socket={socket}/> }/>

          <Route path='/admin/dashboard/Analytics' element={
           loadingAnalytics?
          (
            <div className='fixed inset-0 flex justify-center items-center'>
            <div className="w-80 h-80 rounded-full border-y-2 border-blue-600 animate-spin"></div>
          </div>
          )
          :
          (<Analytics 
          salesDistribution={salesDistribution}
          overview={overview}
          ordersPerDay={ordersPerDay}
          topSellingProducts={topSellingProducts}
          monthlyOverview={monthlyOverview}
          darkMode={darkMode} 
          socket={socket}
          />) }/>

          <Route path='/admin/dashboard/Settings' element={
          loadingSettings?
          (
            <div className='fixed inset-0 flex justify-center items-center'>
            <div className="w-80 h-80 rounded-full border-y-2 border-blue-600 animate-spin"></div>
          </div>
          )
          :(<Settings 
          darkMode={darkMode} 
          setDarkMode={setDarkMode}
          setStoreName={setStoreName}
          setStoreLogo={setStoreLogo}
          setMaintenanceMode={setMaintenanceMode}
          setCurrencySymbol={setCurrencySymbol}
          setDashboardError={setDashboardError}
          storeName={storeName}
          storeLogo={storeLogo}
          maintenanceMode={maintenanceMode}
          currencySymbol={currencySymbol}
          fetchSettings={fetchSettings}
          loadingSettings={loadingSettings}
          setLoadingSettings={setLoadingSettings}
          />) }/>

        </Route>
      </Routes>
    </Router>
  )
}

export default App