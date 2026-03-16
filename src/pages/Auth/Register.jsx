import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import useAuth from "../../hooks/useAuth.jsx";
import { validateSignup } from "../../utils/validatorInput.js";
import useMessage from "../../hooks/useMessage.jsx";

const INITIAL_FORM_STATE = {
  email: "",
  username: "",
  fullName: "",
  phoneNumber: "",
  password: "",
  confirmPassword: "",
};

const Register = ({ onModeChange }) => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errorInputs, setErrorInputs] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const message = useMessage();
  // Access register function from useAuth hook
  const { register } = useAuth();

  const passwordMismatch =
    formData.password &&
    formData.confirmPassword &&
    formData.password !== formData.confirmPassword;

  const formFields = [
    {
      id: "email",
      type: "email",
      placeholder: "Email",
      autoComplete: "email",
    },
    {
      id: "username",
      type: "text",
      placeholder: "Username",
    },
    {
      id: "fullName",
      type: "text",
      placeholder: "Họ và tên",
    },
    {
      id: "phoneNumber",
      type: "text",
      placeholder: "Số điện thoại",
    },
    {
      id: "password",
      type: showPassword ? "text" : "password",
      placeholder: "Mật khẩu",
      showToggle: true,
      isVisible: showPassword,
      onToggle: () => setShowPassword(!showPassword),
    },
    {
      id: "confirmPassword",
      type: showConfirmPassword ? "text" : "password",
      placeholder: "Xác nhận mật khẩu",
      showToggle: true,
      isVisible: showConfirmPassword,
      onToggle: () => setShowConfirmPassword(!showConfirmPassword),
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorInputs({});

    const validationResult = validateSignup(formData);

    if (!validationResult.valid) {
      setErrorInputs(validationResult.errors);
      return;
    }
    console.log("Form data to submit:", formData);
    try {
      const result = await register(formData);
      if (result.success) {
        setIsSubmitted(true);
        message.success("Đăng ký thành công! Vui lòng kiểm tra email để kích hoạt tài khoản.");
        onModeChange("login");
      }
    } catch (err) {
      message.error(err.message);
    }
  };

  const getFieldError = (fieldId) => {
    if (fieldId === "confirmPassword" && passwordMismatch) {
      return "Mật khẩu không khớp.";
    }
    return errorInputs[fieldId];
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Kiểm tra email</h2>
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-600">
            Chúng tôi đã gửi một email xác nhận đến địa chỉ của bạn. Vui lòng kiểm tra hộp thư đến để kích hoạt tài khoản của bạn.
          </p>
          <p className="text-sm text-gray-400">Liên kết sẽ hết hạn sau 15 phút.</p>
        </div>
        <div className="mt-6 text-center">
          <button
            onClick={() => onModeChange('login')}
            className="text-red-500 hover:underline"
          >
            Trở lại đăng nhập
          </button>
        </div>
      </div>
    )
  }
  return (
    <div className="w-full max-w-md">
      <h2 className="text-2xl font-bold text-center mb-6">Đăng ký</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {formFields.map((field) => (
          <div key={field.id}>
            <div className="relative">
              <input
                type={field.type}
                name={field.id}
                value={formData[field.id]}
                onChange={handleInputChange}
                autoComplete={field.autoComplete}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder={field.placeholder}
                required
              />

              {field.showToggle && (
                <button
                  type="button"
                  onClick={field.onToggle}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  aria-label={
                    field.isVisible ? "Hide password" : "Show password"
                  }
                >
                  {field.isVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              )}
            </div>

            {getFieldError(field.id) && (
              <p className="mt-1 text-xs text-red-500">
                {getFieldError(field.id)}
              </p>
            )}
          </div>
        ))}

        <div className="flex items-center">
          <input
            type="checkbox"
            id="terms"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="mr-2"
            required
          />
          <label htmlFor="terms" className="text-sm text-gray-600">
            Đồng ý với điều khoản & chính sách
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition"
        >
          Đăng ký
        </button>
      </form>

      <p className="mt-6 text-center text-gray-600">
        Bạn đã có tài khoản /{" "}
        <button
          onClick={() => onModeChange("login")}
          className="text-red-500 font-semibold hover:underline"
        >
          Đăng nhập
        </button>
      </p>
    </div>
  );
};

export default Register;
