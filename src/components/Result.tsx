import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faUserPlus, faEdit } from '@fortawesome/free-solid-svg-icons';
import categories from '../data/categories.json';
import { Categories, Category } from '../types';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface RenderTreeProps {
  tree: Category;
  depth?: number;
}

const RenderTree = ({ tree, depth = 0 }: RenderTreeProps): JSX.Element => {
  if (!tree) return <></>;

  return (
    <ul>
      {Object.entries(tree).map(([key, value]) => (
        <li key={key}>
          <span style={depth === 0 ? { color: '#1890ff', fontWeight: 'bold' } : undefined}>
            {key}
          </span>
          {value && typeof value === 'object' && !Array.isArray(value) ? (
            <RenderTree tree={value} depth={depth + 1} />
          ) : Array.isArray(value) ? (
            <ul>
              {value.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </li>
      ))}
    </ul>
  );
};

function Result(): JSX.Element {
  const navigate = useNavigate();
  const [selectedTree, setSelectedTree] = useState<Category>({});

  useEffect(() => {
    const customerName = sessionStorage.getItem('customerName');
    const customerType = sessionStorage.getItem('customerType');
    const selectedOptions = sessionStorage.getItem('selectedOptions');

    if (!customerName || !customerType || !selectedOptions) {
      navigate('/');
      return;
    }

    const buildSelectedTree = (categories: Category, options: string[]): Category => {
      const result: Category = {};
      
      Object.entries(categories).forEach(([key, value]) => {
        if (typeof value === 'object' && !Array.isArray(value)) {
          const subtree = buildSelectedTree(value, options);
          if (Object.keys(subtree).length > 0) {
            result[key] = subtree;
          }
        } else if (Array.isArray(value)) {
          const intersectingOptions = value.filter(item => options.includes(item));
          if (intersectingOptions.length > 0) {
            result[key] = intersectingOptions;
          }
        }
      });

      return result;
    };

    const typeCategories = (categories as Categories)[customerType];
    const parsedOptions = JSON.parse(selectedOptions);
    const tree = buildSelectedTree(typeCategories, parsedOptions);
    setSelectedTree(tree);
  }, [navigate]);

  const handleDownloadPDF = async () => {
    const element = document.getElementById('pdf-content');
    if (!element) return;

    const loadingDiv = document.createElement('div');
    loadingDiv.innerHTML = '正在生成PDF，请稍候...';
    loadingDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 20px;
      background: rgba(0,0,0,0.7);
      color: white;
      border-radius: 5px;
      z-index: 9999;
    `;
    document.body.appendChild(loadingDiv);

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // 设置页面边距
      const margin = 15; // 毫米
      
      // 计算可用区域
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const availableWidth = pageWidth - (2 * margin);
      const availableHeight = pageHeight - (2 * margin);
      
      // 计算缩放比例
      const widthRatio = availableWidth / canvas.width;
      const heightRatio = availableHeight / canvas.height;
      const scale = Math.min(widthRatio, heightRatio); // 使用较小的缩放比例以适应页面
      
      // 计算居中位置
      const scaledWidth = canvas.width * scale;
      const scaledHeight = canvas.height * scale;
      const xPosition = margin + (availableWidth - scaledWidth) / 2;
      const yPosition = margin + (availableHeight - scaledHeight) / 2;

      pdf.addImage(
        canvas.toDataURL('image/jpeg', 1.0),
        'JPEG',
        xPosition,
        yPosition,
        scaledWidth,
        scaledHeight
      );

      pdf.save(`${sessionStorage.getItem('customerName')}_分类结果.pdf`);
    } catch (error) {
      console.error('PDF generation error:', error);
      alert(`生成PDF时发生错误: ${error}`);
    } finally {
      document.body.removeChild(loadingDiv);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 w-100">
      <div id="pdf-content" className="flex-grow-1 w-100">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 px-4">
              <h1 style={{ color: '#1890ff', marginBottom: '2rem' }}>分析结果</h1>
              <div style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
                <p className="mb-3">
                  <strong>客户姓名：</strong>
                  <span className="ms-2">{sessionStorage.getItem('customerName')}</span>
                </p>
                <p className="mb-3">
                  <strong>客户观念分型：</strong>
                  <span className="ms-2">{sessionStorage.getItem('customerType')}</span>
                </p>
                <p className="mb-3" style={{ textAlign: 'left', marginLeft: '-1rem', fontStyle: 'normal' }}>
                  <strong style={{ fontStyle: 'normal' }}>客户分析及策略：</strong>
                </p>
              </div>
              <div style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
                {Object.keys(selectedTree).length > 0 ? (
                  <RenderTree tree={selectedTree} depth={0} />
                ) : (
                  <p>您未选择任何选项。</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-12 px-4">
            <div className="button-group d-flex flex-column gap-3 mb-3">
              <button onClick={handleDownloadPDF} className="btn btn-success w-100">
                <FontAwesomeIcon icon={faFilePdf} /> 生成 PDF
              </button>
              <button
                onClick={() => {
                  sessionStorage.clear();
                  navigate('/');
                }}
                className="btn btn-warning w-100"
              >
                <FontAwesomeIcon icon={faUserPlus} /> 新客户
              </button>
              <button
                onClick={() => navigate('/select-options')}
                className="btn btn-primary w-100"
              >
                <FontAwesomeIcon icon={faEdit} /> 返回修改
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Result;