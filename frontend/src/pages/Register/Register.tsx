import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "../../api/auth";
import { useAuthStore } from "../../store/useAuthStore";
import styles from "./Register.module.scss";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { setUser, setToken } = useAuthStore();
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const password = watch("password");

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    setErrorMsg("");
    setLoading(true);

    try {
      const response = await authApi.register({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      setToken(response.access_token);
      setUser(response.user);

      navigate("/login");
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.description || "Ошибка регистрации");
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

        <h3 className={styles.title}>Создать аккаунт</h3>

        <div className={styles.form}>
          <div className={styles.inputWrapper}>
            <input
              {...register("name", {
                required: "Имя обязательно",
                minLength: { value: 2, message: "Минимум 2 символа" },
              })}
              type="text"
              placeholder="Имя"
              autoComplete="name"
            />
          </div>
          {errors.name && (
            <span className={styles.error}>{errors.name.message}</span>
          )}

          <div className={styles.inputWrapper}>
            <input
              {...register("email", {
                required: "Email обязателен",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Неверный формат email",
                },
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
                minLength: { value: 6, message: "Минимум 6 символов" },
              })}
              type="password"
              placeholder="Пароль"
              autoComplete="new-password"
            />
          </div>
          {errors.password && (
            <span className={styles.error}>{errors.password.message}</span>
          )}

          <div className={styles.inputWrapper}>
            <input
              {...register("confirmPassword", {
                required: "Подтвердите пароль",
                validate: (value) =>
                  value === password || "Пароли не совпадают",
              })}
              type="password"
              placeholder="Подтвердите пароль"
              autoComplete="new-password"
            />
          </div>
          {errors.confirmPassword && (
            <span className={styles.error}>
              {errors.confirmPassword.message}
            </span>
          )}

          {errorMsg && <span className={styles.error}>{errorMsg}</span>}

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Загрузка..." : "Зарегистрироваться"}
          </button>

          <div className={styles.linkWrapper}>
            <span>Уже есть аккаунт? </span>
            <Link to="/login" className={styles.link}>
              Войти
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;
