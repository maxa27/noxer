import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "../../api/auth";
import styles from "./Login.module.scss";

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setErrorMsg("");
    setLoading(true);

    try {
      const response = await authApi.login(data);

      if (response.requires2fa) {
        setUserId(response.userId);
        navigate("/verify-2fa", { state: { userId: response.userId } });
      }
    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.description || "Ошибка входа"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.card}>
        <div className={styles.header}>
          <img src="/logo.png" alt="Yamal" className={styles.logo} />
        </div>

        <h3 className={styles.title}>Войти в аккаунт</h3>

        <div className={styles.form}>
          <div className={styles.inputWrapper}>
            <input
              {...register("email", {
                required: "Email обязателен",
              })}
              type="email"
              placeholder="Email"
              autoComplete="email"
            />
          </div>
          {errors.email && (
            <span className={styles.error}>{errors.email.message}</span>
          )}

          <div className={styles.inputWrapper}>
            <input
              {...register("password", {
                required: "Пароль обязателен",
              })}
              type="password"
              placeholder="Пароль"
              autoComplete="current-password"
            />
          </div>
          {errors.password && (
            <span className={styles.error}>{errors.password.message}</span>
          )}

          {errorMsg && <span className={styles.error}>{errorMsg}</span>}

          <button
            type="submit"
            className={styles.button}
            disabled={loading}
          >
            {loading ? "Загрузка..." : "Войти"}
          </button>

          <div className={styles.linkWrapper}>
            <span>Нет аккаунта? </span>
            <Link to="/register" className={styles.link}>
              Зарегистрироваться
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;