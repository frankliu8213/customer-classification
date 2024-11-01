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
    <div className="container p-0">
      <div className="row justify-content-center mx-0">
        <div className="col-12 col-md-10 col-lg-8 px-4">
          <h1 style={{ color: '#1890ff', marginBottom: '2rem' }}>客户信息</h1>
          <form onSubmit={handleSubmit} className="d-flex flex-column align-items-start gap-4">
            <div className="w-100">
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                placeholder="请输入客户姓名"
                className="form-control form-control-lg"
                style={{ width: 'calc(100% - 30px)' }}
              />
            </div>
            <div className="button-group">
              <button type="submit" className="btn btn-primary btn-lg">
                <FontAwesomeIcon icon={faArrowRight} /> 下一步
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CustomerForm;