import { useParams, useNavigate } from 'react-router-dom';
import { formatMoney } from '../data';

const ProductDetail = ({ products }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === Number(id));

  return (
    <div>
      <button onClick={() => navigate(-1)}>Quay lại</button>
      {product ? (
        <div>
          <h2>Chi tiết sản phẩm</h2>
          <p>Tên sản phẩm: {product.name}</p>
          <p>Danh mục: {product.category}</p>
          <p>Giá: {formatMoney(product.price)}</p>
          <p>Tồn kho: {product.stock}</p>
        </div>
      ) : (
        <p>Không tìm thấy sản phẩm</p>
      )}
    </div>
  );
};

export default ProductDetail;
