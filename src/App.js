const BUILD_TAG = "kt-6641";
/* eslint-disable import/first */
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import Layout from './components/Layout';
import Home from './components/Home';
import ProductList from './components/ProductList';
import AddProduct from './components/AddProduct';
import ProductDetail from './components/ProductDetail';

const STORAGE_KEY = 'gk_products';

const App = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Mounting: đọc localStorage trước, nếu chưa có thì gọi API
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setProducts(JSON.parse(saved));
        setLoading(false);
        return undefined;
      } catch (e) {
        // dữ liệu lưu bị hỏng -> bỏ qua, gọi API
      }
    }

    const controller = new AbortController();
    axios
      .get('/data/products.json', { signal: controller.signal })
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (axios.isCancel(err)) return; // request bị hủy -> bỏ qua
        setError('Không tải được dữ liệu');
        setLoading(false);
      });

    // Unmounting: hủy request
    return () => controller.abort();
  }, []);

  // Updating: lưu dữ liệu sau khi đã tải xong (không ghi mảng rỗng khi lỗi/chưa tải)
  useEffect(() => {
    if (!loading && !error) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, loading]);

  const addProduct = ({ name, category, price, stock }) => {
    const newId = products.reduce((max, p) => Math.max(max, p.id), 0) + 1;
    setProducts([...products, { id: newId, name, category, price, stock }]);
  };

  const deleteProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const changeStock = (id, delta) => {
    setProducts(
      products.map((p) =>
        p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p
      )
    );
  };

  return (
    <div className="app" data-build={BUILD_TAG}>
      <Routes>
        <Route path="/" element={<Layout loading={loading} error={error} />}>
          <Route index element={<Home products={products} />} />
          <Route
            path="products"
            element={
              <ProductList
                products={products}
                onDelete={deleteProduct}
                onChangeStock={changeStock}
              />
            }
          />
          <Route path="products/new" element={<AddProduct onAdd={addProduct} />} />
          <Route path="products/:id" element={<ProductDetail products={products} />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
