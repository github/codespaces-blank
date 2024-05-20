import { Link, redirect, useNavigate } from "react-router-dom";
import "./SignUp.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";

const schema = yup
  .object({
    name: yup
      .string(20, "Name must be at least 20 characters")
      .required("Name must not be empty"),
    email: yup.string().email().required("Email must not be empty"),
    password: yup
      .string()
      .min(10, "Password must be at least 10 characters")
      .required("Password is required"),
  })
  .required();

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();

  const onSubmit = (data, e) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="SignWidth">
          <div>
            <h1 className="is-size-2 has-text-weight-bold">Register</h1>
            <p className="mt-3">Enter your user details below.</p>
          </div>

          <div className="mt-5">
            <div class="field mb-5">
              <label class="label">Name</label>
              <div class="control">
                <input
                  class="input"
                  type="text"
                  placeholder="Name"
                  {...register("name")}
                />
              </div>
              <p className="help is-danger">{errors.name?.message}</p>
            </div>
            <div class="field mb-5">
              <label class="label">Email</label>
              <div className="control">
                <input
                  class="input"
                  type="email"
                  placeholder="Email"
                  {...register("email")}
                />
              </div>
              <p className="help is-danger">{errors.email?.message}</p>
            </div>
            <div class="field mb-5">
              <label class="label">Password</label>
              <div className="control">
                <input
                  class="input"
                  type="password"
                  placeholder="Password"
                  {...register("password")}
                />
              </div>
              <p className="help is-danger">{errors.password?.message}</p>
            </div>
            <div class="field mb-5 is-flex is-justify-content-center is-align-content-center">
              <div class="control">
                <button class="button is-danger" type="submit">
                  Submit
                </button>
              </div>
            </div>
          </div>

          <div className="mt-5 has-text-centered">
            <p>
              Have an account?{" "}
              <Link className="has-text-danger" to={"/login"}>
                Login!
              </Link>
            </p>
          </div>
        </div>
      </form>
    </>
  );
};

export default SignUp;
