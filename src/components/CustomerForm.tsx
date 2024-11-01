import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

function CustomerForm(): JSX.Element {
  const [customerName, setCustomerName] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (customerName.trim()) {
      sessionStorage.setItem('customerName', customerName);
      navigate('/select-type');
    }
  };

  return (
    <div className="container">
      <h1 style={{ color: '#1890ff' }}>客户信息</h1>
      <form onSubmit={handleSubmit} className="d-flex flex-column align-items-center">
        <div style={{ width: '100%', maxWidth: '770px' }}>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
            placeholder="请输入客户姓名"
            className="form-control"
          />
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

export default CustomerForm;