import { formatMoney } from '../data';

const Home = ({ products }) => {
  const total = products.length;
  const lowCount = products.filter((p) => p.stock < 5).length;
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);

  return (
    <div>
      <h1>Kho hàng</h1>
      <p>Chào mừng bạn đến với ứng dụng quản lý kho hàng.</p>
      <p>Tổng số sản phẩm: {total}</p>
      <p>Số sản phẩm sắp hết hàng: {lowCount}</p>
      <p>Tổng giá trị kho: {formatMoney(totalValue)}</p>
    </div>
  );
};

export default Home;
