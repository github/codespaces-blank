import "./Email.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, Link } from "react-router-dom";
import * as yup from "yup";

const schema = yup
  .object({
    number: yup.number().positive().required("Please input your Email address"),
  })
  .required();

const Email = () => {
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
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="Email">
          <h1 className="is-size-4 has-text-weight-bold is-text-centered mb-4">
            Forgot Email
          </h1>
          <div className="control">
            <input
              className="input"
              type="number"
              placeholder="Phone Number"
              {...register("number")}
            />
          </div>
          <div className="is-flex is-justify-content-space-between">
            <p className="help is-danger">{errors.number?.message}</p>
            <Link className="mt-4" to="/forgot-password">
              Try using email instead?
            </Link>
          </div>

          <button className="mt-4 button is-primary">Submit</button>
        </div>
      </form>
    </>
  );
};

export default Email;
