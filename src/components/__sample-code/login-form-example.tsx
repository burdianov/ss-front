import React, { useState, ChangeEvent, FormEvent } from 'react';

interface FormData {
  email: string;
  password: string;
}

interface Errors {
  email?: string;
  password?: string;
}

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors: Errors = {};

    // Validate email
    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      // Form is valid, you can submit or process the data here
      console.log('Form data:', formData);
      setSubmitted(true); // Set a submitted flag
    } else {
      // Form is not valid, display error messages
    }
  };

  const isFormValid = Object.keys(errors).length === 0;

  return (
    <div>
      <h2>Login</h2>
      {submitted ? (
        <div className="success-message">Login successful!</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email:</label>
            <input type="text" name="email" value={formData.email} onChange={handleInputChange} />
            {errors.email && <div className="error">{errors.email}</div>}
          </div>

          <div>
            <label>Password:</label>
            <input type="password" name="password" value={formData.password} onChange={handleInputChange} />
            {errors.password && <div className="error">{errors.password}</div>}
          </div>

          <button type="submit" disabled={!isFormValid}>
            Login
          </button>
        </form>
      )}
    </div>
  );
};

export default LoginForm;
