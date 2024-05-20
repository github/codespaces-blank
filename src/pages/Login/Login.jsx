import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup
  .object({
    email: yup.string().email().required("Please input your Email address"),
    password: yup
      .string()
      .min(10, "Password must be at least 10 characters")
      .required("Password is required"),
  })
  .required();
const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate()
  const onSubmit = (data, e) => {
    e.preventDefault();

   navigate("/dashboard")
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="LoginWidth">
          <div>
            <h1 className="is-size-2 has-text-weight-bold">Login</h1>
            <p className="mt-3">
              You can login with your registered account or quick login with
              your Google account.
            </p>
          </div>
          <div className="mt-4">
            <button className="button is-white p-3">
              <svg
                width="25"
                height="25"
                viewBox="0 0 25 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_3_65)">
                  <path
                    d="M24.4885 12.7339C24.4885 11.7096 24.4069 10.9622 24.2301 10.1871H12.739V14.81H19.484C19.3481 15.9589 18.6138 17.689 16.9819 18.8516L16.959 19.0064L20.5923 21.8712L20.844 21.8968C23.1558 19.7237 24.4885 16.5263 24.4885 12.7339Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12.739 24.9141C16.0435 24.9141 18.8177 23.8068 20.844 21.8968L16.9819 18.8516C15.9484 19.5852 14.5612 20.0973 12.739 20.0973C9.50248 20.0973 6.75551 17.9243 5.77629 14.9208L5.63276 14.9332L1.85483 17.9091L1.80542 18.0489C3.81804 22.1181 7.95214 24.9141 12.739 24.9141Z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.77634 14.9208C5.51797 14.1457 5.36844 13.3152 5.36844 12.4571C5.36844 11.5989 5.51797 10.7684 5.76275 9.99332L5.75591 9.82825L1.93062 6.80458L1.80547 6.86517C0.975969 8.55382 0.5 10.4501 0.5 12.4571C0.5 14.464 0.975969 16.3602 1.80547 18.0489L5.77634 14.9208Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12.739 4.8167C15.0372 4.8167 16.5875 5.8271 17.4714 6.67147L20.9255 3.23884C18.8042 1.23187 16.0435 0 12.739 0C7.95214 0 3.81804 2.7959 1.80542 6.86517L5.7627 9.99332C6.75551 6.98979 9.50248 4.8167 12.739 4.8167Z"
                    fill="#EB4335"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_3_65">
                    <rect
                      width="24"
                      height="25"
                      fill="white"
                      transform="translate(0.5)"
                    />
                  </clipPath>
                </defs>
              </svg>

              <span className="ml-3">Google</span>
            </button>
          </div>

          <div className="has-text-centered">
            <p className="mt-5">Or</p>
          </div>

          <div className="field mb-4">
            <label className="label">Email</label>
            <div className="control">
              <input
                className="input"
                type="email"
                placeholder="Email"
                {...register("email")}
              />
            </div>
            <p className="help is-danger">{errors.email?.message}</p>
          </div>
          <div className="field mt-5">
            
            <label className="label">Password</label>
            
          
            <div className="control">
              <input
                className="input"
                type="password"
                placeholder="Password"
                {...register("password")}
              />
            </div>
            <div className="is-flex is-justify-content-space-between">
            <p className="help is-danger">{errors.password?.message}</p>
            <Link className="mt-4" to="/forgot-password">Forgot Password?</Link>
            </div>
          
          </div>

          <div className="field mt-5 is-flex is-justify-content-center is-align-content-center">
            <div className="control">
              <button className="button is-danger" type="submit">
                Login
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5 has-text-centered">
          <p>
            Don't you have an account?{" "}
            <Link to={"/"} className="has-text-danger">
              Create one!
            </Link>
          </p>
        </div>
      </form>
    </>
  );
};

export default Login;
