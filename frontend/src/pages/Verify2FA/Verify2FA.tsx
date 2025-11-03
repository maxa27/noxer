import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authApi } from "../../api/auth";
import { useAuthStore } from "../../store/useAuthStore";
import styles from "./Verify2FA.module.scss";

const Verify2FA: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser, setToken } = useAuthStore();

  const userId = location.state?.userId;

  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    inputsRef.current[0]?.focus();
  }, [userId, navigate]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);

    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);

    if (digit && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }

    if (newCode.every((d) => d !== "") && newCode.join("").length === 6) {
      handleSubmit(newCode.join(""));
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      const newCode = [...code];
      if (code[index]) {
        newCode[index] = "";
        setCode(newCode);
      } else if (index > 0) {
        newCode[index - 1] = "";
        setCode(newCode);
        inputsRef.current[index - 1]?.focus();
      }
    }
  };

  const handleSubmit = async (codeValue?: string) => {
    const finalCode = codeValue || code.join("");

    if (finalCode.length !== 6) {
      setErrorMsg("Введите полный код");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const response = await authApi.verify2fa({
        userId: parseInt(userId),
        code: finalCode,
      });

      setToken(response.access_token);
      setUser(response.user);

      navigate("/");
    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.description || "Неверный код"
      );
      setCode(["", "", "", "", "", ""]);
      inputsRef.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setTimer(30);
    setCanResend(false);
    setErrorMsg("");
    // тут блять нужен эндпоинт для отправки кода повторно сука, но его нету ПЛАТИТЕ
    // await authApi.send2faCode(userId);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.header}>
          <img src="/logo.png" alt="Yamal" className={styles.logo} />
        </div>

        <h3 className={styles.title}>Двухфакторная аутентификация</h3>
        <p className={styles.description}>
          Введите 6-значный код, отправленный на вашу почту
        </p>

        <div className={styles.codeContainer}>
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={styles.codeInput}
              disabled={loading}
            />
          ))}
        </div>

        {errorMsg && <span className={styles.error}>{errorMsg}</span>}

        {loading && <p className={styles.info}>Проверка кода...</p>}

        {!canResend && timer > 0 && (
          <p className={styles.info}>
            Запросить новый код можно через {timer}с
          </p>
        )}

        {canResend && (
          <button
            type="button"
            onClick={handleResend}
            className={styles.resendButton}
          >
            Отправить код повторно
          </button>
        )}
      </div>
    </div>
  );
};

export default Verify2FA;