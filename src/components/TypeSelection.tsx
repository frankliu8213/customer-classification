import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import categories from '../data/categories.json';
import { Categories } from '../types';

function TypeSelection(): JSX.Element {
  const [customerType, setCustomerType] = useState<string>('');
  const navigate = useNavigate();
  const customerTypes = Object.keys(categories as Categories);

  useEffect(() => {
    if (!sessionStorage.getItem('customerName')) {
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (customerType) {
      sessionStorage.setItem('customerType', customerType);
      navigate('/select-options');
    }
  };

  return (
    <div className="container">
      <h1 style={{ color: '#1890ff' }}>选择客户类型</h1>
      <form onSubmit={handleSubmit}>
        <div className="radio-group">
          {customerTypes.map((type) => (
            <div className="radio-item" key={type}>
              <label>
                <input
                  type="radio"
                  name="customerType"
                  value={type}
                  checked={customerType === type}
                  onChange={(e) => setCustomerType(e.target.value)}
                  required
                />
                {type}
              </label>
            </div>
          ))}
        </div>
        <div className="button-group">
          <button type="submit" className="btn btn-primary">
            <FontAwesomeIcon icon={faArrowRight} /> 下一步
          </button>
        </div>
      </form>
    </div>
  );
}

export default TypeSelection;