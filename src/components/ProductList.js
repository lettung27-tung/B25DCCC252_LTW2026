import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import FilterBar from './FilterBar';
import ProductTable from './ProductTable';

const ProductList = ({ products, onDelete, onChangeStock }) => {
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Tất cả');
  const [message, setMessage] = useState(location.state?.message || '');

  // Tự ẩn thông báo sau 3 giây; cleanup để không lỗi khi rời trang sớm
  useEffect(() => {
    if (!message) return undefined;
    const timer = setTimeout(() => setMessage(''), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  const handleQueryShift = (e) => setQuery(e.target.value);
  const handleCategoryChange = (e) => setCategory(e.target.value);

  const keyword = query.trim().toLowerCase();
  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(keyword) &&
      (category === 'Tất cả' || p.category === category)
  );

  return (
    <div>
      {message && (
        <div className="toast">
          <span>{message}</span>
          <button onClick={() => setMessage('')}>×</button>
        </div>
      )}
      <h2>Danh sách sản phẩm</h2>
      <FilterBar
        query={query}
        category={category}
        onQueryChange={handleQueryShift}
        onCategoryChange={handleCategoryChange}
      />
      <p>Tìm thấy {filtered.length} sản phẩm</p>
      <ProductTable
        products={filtered}
        onDelete={onDelete}
        onChangeStock={onChangeStock}
      />
    </div>
  );
};

export default ProductList;
