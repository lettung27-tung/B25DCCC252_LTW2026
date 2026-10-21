import { CATEGORIES } from '../data';

const FilterBar = ({ query, category, onQueryChange, onCategoryChange }) => (
  <div className="filter-bar">
    <label>
      Tìm kiếm:{' '}
      <input
        type="text"
        placeholder="Tìm theo tên sản phẩm"
        value={query}
        onChange={onQueryChange}
      />
    </label>
    <label>
      Danh mục:{' '}
      <select value={category} onChange={onCategoryChange}>
        <option value="Tất cả">Tất cả</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
    </label>
  </div>
);

export default FilterBar;
