import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../data';

const AddProduct = ({ onAdd }) => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. Kiểm tra ô trống
    if (name.trim() === '' || price === '' || stock === '') {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    // 2. Kiểm tra giá trị số
    const priceNum = Number(price);
    const stockNum = Number(stock);
    if (!(priceNum > 0) || !Number.isInteger(stockNum) || stockNum < 0) {
      setError('Giá phải lớn hơn 0, số lượng là số nguyên không âm');
      return;
    }

    const cleanName = name.trim();
    onAdd({ name: cleanName, category, price: priceNum, stock: stockNum });
    const message = `Đã thêm sản phẩm ${cleanName}`;
    navigate('/products', { replace: true, state: { message } });
  };

  return (
    <div>
      <h2>Thêm sản phẩm</h2>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Tên sản phẩm
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Danh mục
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
        <label>
          Giá
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        </label>
        <label>
          Số lượng tồn
          <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
        </label>
        <button type="submit">Thêm</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default AddProduct;
