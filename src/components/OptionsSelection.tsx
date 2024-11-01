import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import categories from '../data/categories.json';
import { Category, Categories } from '../types';

interface RenderCategoriesProps {
  categories: Category;
  parentId?: string;
  level?: number;
  selectedOptions: string[];
  onOptionChange: (option: string) => void;
}

const RenderCategories = ({
  categories,
  parentId = '',
  level = 1,
  selectedOptions,
  onOptionChange
}: RenderCategoriesProps): JSX.Element => {
  const levelId = `level${level}`;

  return (
    <>
      {Object.entries(categories).map(([key, value], index) => {
        const currentId = `${parentId}${parentId ? '-' : ''}${levelId}-${index}`;

        if (typeof value === 'object' && !Array.isArray(value)) {
          return (
            <div className={`accordion-item ${level > 1 ? 'ms-10 me-10' : ''}`} key={currentId}>
              <h2 className="accordion-header" id={`heading${currentId}`}>
                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse${currentId}`}
                  aria-expanded="true"
                  aria-controls={`collapse${currentId}`}
                >
                  {key}
                </button>
              </h2>
              <div
                id={`collapse${currentId}`}
                className="accordion-collapse show"
                aria-labelledby={`heading${currentId}`}
                data-bs-parent={`#accordion-${levelId}-${parentId}`}
              >
                <div className="accordion-body">
                  <div className="accordion" id={`accordion-${levelId}-${currentId}`}>
                    <RenderCategories
                      categories={value}
                      parentId={currentId}
                      level={level + 1}
                      selectedOptions={selectedOptions}
                      onOptionChange={onOptionChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        }

        if (Array.isArray(value)) {
          return (
            <div className={`ms-3 ${level > 1 ? 'ms-2' : ''}`} key={currentId}>
              <strong className={level > 1 ? 'ms-2' : ''}>{key}</strong>
              <div className="ms-3">
                {value.map((item) => (
                  <div key={item}>
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedOptions.includes(item)}
                        onChange={() => onOptionChange(item)}
                        value={item}
                      />
                      {item}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          );
        }

        return null;
      })}
    </>
  );
};

function OptionsSelection(): JSX.Element {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const navigate = useNavigate();
  const customerType = sessionStorage.getItem('customerType');

  useEffect(() => {
    if (!customerType || !sessionStorage.getItem('customerName')) {
      navigate('/');
    }
  }, [navigate, customerType]);

  useEffect(() => {
    if (customerType) {
      const typeCategories = (categories as Categories)[customerType];
      const singleOptions: string[] = [];

      const findSingleOptions = (obj: Category) => {
        Object.entries(obj).forEach(([_, value]) => {
          if (Array.isArray(value) && value.length === 1) {
            singleOptions.push(value[0]);
          } else if (typeof value === 'object' && !Array.isArray(value)) {
            findSingleOptions(value);
          }
        });
      };

      findSingleOptions(typeCategories);
      setSelectedOptions(singleOptions);
    }
  }, [customerType]);

  const handleOptionChange = (option: string) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOptions.length > 0) {
      sessionStorage.setItem('selectedOptions', JSON.stringify(selectedOptions));
      navigate('/result');
    }
  };

  if (!customerType) return <></>;

  const typeCategories = (categories as Categories)[customerType];
  
  return (
    <div className="container">
      <h1 style={{ color: '#1890ff' }}>请匹配针对性选项</h1>
      <form onSubmit={handleSubmit}>
        <div className="accordion" id="accordion-root">
          <RenderCategories
            categories={typeCategories}
            selectedOptions={selectedOptions}
            onOptionChange={handleOptionChange}
          />
        </div>
        <div className="button-group">
          <button type="submit" className="btn btn-primary">
            <FontAwesomeIcon icon={faCheck} /> 提交
          </button>
        </div>
      </form>
    </div>
  );
}

export default OptionsSelection;