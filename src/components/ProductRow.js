import { Link } from 'react-router-dom';
import { formatMoney } from '../data';

const ProductRow = ({ product, onDelete, onChangeStock }) => {
  const { id, name, category, price, stock } = product;

  return (
    <tr className={stock < 5 ? 'low-stock' : ''}>
      <td><Link to={`/products/${id}`}>{name}</Link></td>
      <td>{category}</td>
      <td>{formatMoney(price)}</td>
      <td>{stock}</td>
      <td>
        <button onClick={() => onChangeStock(id, 1)}>+</button>
        <button onClick={() => onChangeStock(id, -1)} disabled={stock === 0}>-</button>
        <button onClick={() => onDelete(id)}>Xóa</button>
      </td>
    </tr>
  );
};

export default ProductRow;
