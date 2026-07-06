import React, { useState, useEffect } from 'react';
import { Form, FormGroup, Label, Input, Button, FormFeedback } from 'reactstrap';
import { useHistory } from 'react-router-dom';
//Login project
import axios from 'axios';

const initialForm = {
  email: '',
  password: '',
  terms: false,
};

const errorMessages = {
  email: 'Please enter a valid email address',
  password: 'Password must be at least 4 characters long',
};

export default function Login() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [isValid, setIsValid] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    const isPasswordValid = form.password.length >= 4;

    setErrors({
      email: isEmailValid ? '' : errorMessages.email,
      password: isPasswordValid ? '' : errorMessages.password,
    });

    setIsValid(isEmailValid && isPasswordValid && form.terms);
  }, [form]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isValid) return;

    axios
      .get('https://6540a96145bedb25bfc247b4.mockapi.io/api/login')
      .then((res) => {
        const user = res.data.find(
          (item) => item.password === form.password && item.email === form.email
        );
        if (user) {
          history.push('/success');
        } else {
          history.push('/error');
        }
      });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label for="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          invalid={!!errors.email && form.email.length > 0}
        />
        <FormFeedback>{errors.email}</FormFeedback>
      </FormGroup>

      <FormGroup>
        <Label for="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          invalid={!!errors.password && form.password.length > 0}
        />
        <FormFeedback>{errors.password}</FormFeedback>
      </FormGroup>

      <FormGroup check>
        <Label check>
          <Input
            id="terms"
            name="terms"
            type="checkbox"
            checked={form.terms}
            onChange={handleChange}
          />{' '}
          I agree to terms of service and privacy policy
        </Label>
      </FormGroup>

      <FormGroup className="text-center p-4">
        <Button color="primary" disabled={!isValid} type="submit">
          Sign In
        </Button>
      </FormGroup>
    </Form>
  );
}
