import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, ArrowLeft } from 'lucide-react';
import { activateAccount } from '../../services/authService';
import useMessage from '../../hooks/useMessage.jsx';

/**
 * Component hiển thị kết quả kích hoạt tài khoản
 */
const AccountActivation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const message = useMessage();
  const token = searchParams.get('token');

  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const processedTokenRef = useRef(undefined);

  useEffect(() => {
    // Prevent double execution in Strict Mode or re-runs with same token
    if (processedTokenRef.current === token) return;
    processedTokenRef.current = token;

    const triggerActivation = async () => {
      if (!token) {
        setStatus('error');
        setErrorMessage('Mã kích hoạt không tồn tại hoặc đường dẫn không hợp lệ.');
        return;
      }

      try {
        await activateAccount(token);
        setStatus('success');
        message.success('Tài khoản của bạn đã được kích hoạt thành công!');
      } catch (err) {
        setStatus('error');
        const msg = err?.response?.data?.message || 'Kích hoạt tài khoản thất bại. Liên kết có thể đã hết hạn.';
        setErrorMessage(msg);
        message.error(msg);
      }
    };

    triggerActivation();
  }, [token, message]);

  // Hàm helper để render giao diện dựa trên trạng thái
  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <StatusCard 
            icon={<Loader2 className="w-8 h-8 text-blue-500 animate-spin" />}
            title="Đang xác thực..."
            description="Vui lòng chờ trong giây lát, chúng tôi đang kích hoạt tài khoản của bạn."
            bgColor="bg-blue-100"
          />
        );
      case 'success':
        return (
          <StatusCard 
            icon={<CheckCircle className="w-8 h-8 text-green-500" />}
            title="Kích hoạt thành công!"
            description="Chúc mừng! Tài khoản TekBook của bạn đã sẵn sàng. Bây giờ bạn có thể đăng nhập và trải nghiệm."
            bgColor="bg-green-100"
            showButton
            buttonText="Đăng nhập ngay"
            onButtonClick={() => navigate('/login')}
          />
        );
      case 'error':
        return (
          <StatusCard 
            icon={<XCircle className="w-8 h-8 text-red-500" />}
            title="Kích hoạt thất bại"
            description={errorMessage}
            bgColor="bg-red-100"
            showButton
            buttonText="Về trang chủ"
            onButtonClick={() => navigate('/')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8 text-center">
        {renderContent()}
      </div>
    </div>
  );
};

/**
 * Component con hiển thị Card trạng thái (Dễ bảo trì và tái sử dụng)
 */
const StatusCard = ({ icon, title, description, bgColor, showButton, buttonText, onButtonClick }) => (
  <div className="flex flex-col items-center">
    <div className={`mx-auto w-16 h-16 ${bgColor} rounded-full flex items-center justify-center mb-4`}>
      {icon}
    </div>
    <h2 className="text-2xl font-bold mb-2 text-gray-800">{title}</h2>
    <p className="text-gray-500 mb-8 leading-relaxed">
      {description}
    </p>
    {showButton && (
      <button
        onClick={onButtonClick}
        className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition flex items-center justify-center gap-2"
      >
        <ArrowLeft size={18} />
        {buttonText}
      </button>
    )}
  </div>
);

export default AccountActivation;