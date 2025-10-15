import React from "react";
import { useForm, useWatch, SubmitHandler } from "react-hook-form";
import { useState, useRef, useEffect } from "react";
import styles from "./LoginForm.module.css";
import {
  loginApi,
  verifyCodeApi,
  generateNew2FACodeApi,
} from "../api/apiForTwoFactor";

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginFormData>();

  const [step, setStep] = useState<"login" | "2fa">("login");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const inputsRef = useRef<HTMLInputElement[]>([]);
  const [verifying, setVerifying] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(30);
  const [showGetNew, setShowGetNew] = useState<boolean>(false);
  const [codeValid, setCodeValid] = useState<boolean>(false);
  const [hideTimer, setHideTimer] = useState<boolean>(false);

  const email = useWatch({ control, name: "email" });
  const password = useWatch({ control, name: "password" });
  const isActive = Boolean(email && password);


  useEffect(() => {
    if (step === "2fa") {
      setTimeout(() => inputsRef.current?.[0]?.focus?.(), 50);
    }
  }, [step]);


  useEffect(() => {
    if (step !== "2fa") return;
    setTimer(30);
    setShowGetNew(false);

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setShowGetNew(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [step]);


  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setErrorMsg("");
    try {
      const res = await loginApi(data);
      setUserId(res.userId || "");
      setStep("2fa");
    } catch (err: any) {
      setErrorMsg(err?.message || "Unknown error");
    }
  };


  const handleSubmitCode = async (showError = true) => {
    const joined = code.join("");
    if (joined.length !== 6) {
      if (showError) setErrorMsg("Enter the full 6-digit code");
      return;
    }

    setVerifying(true);
    setErrorMsg("");

    try {
      const res = await verifyCodeApi({ userId, code: joined });
      if (res.success) {
        console.log("2FA прошла успешно, код верный");
        setCodeValid(true);
        setHideTimer(true);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Invalid code");
      setCode(["", "", "", "", "", ""]);
      setCodeValid(false);
      setHideTimer(false);
      setTimeout(() => inputsRef.current?.[0]?.focus?.(), 50);
    } finally {
      setVerifying(false);
    }
  };


  const handleGetNewCode = async () => {
    setCode(["", "", "", "", "", ""]);
    setTimer(30);
    setShowGetNew(false);
    setHideTimer(true);
    setCodeValid(false);
    inputsRef.current?.[0]?.focus?.();
    if (userId) await generateNew2FACodeApi(userId);
  };


  const handleChange = (index: number, rawValue: string) => {
    const value = rawValue.replace(/\D/g, "").slice(-1);
    if (!value && rawValue !== "") return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) inputsRef.current[index + 1]?.focus();
    if (newCode.join("").length === 6 && !verifying) handleSubmitCode(false);
  };


  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    const key = e.key;

    if (key === "Backspace") {
      const newCode = [...code];
      if (code[index]) {
        newCode[index] = "";
        setCode(newCode);
      } else if (index > 0) {
        newCode[index - 1] = "";
        setCode(newCode);
        inputsRef.current[index - 1]?.focus();
      }
    } else if (key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (key === "ArrowRight" && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.header}>
          <img className={styles.logo} src="logo.png" alt="logo" />
        </div>

        {step === "login" ? (
          <>
            <h3 className={styles.title}>Sign in to your account to continue</h3>
            <div className={styles.form}>
              <div className={styles.inputWrapper}>
                <img className={styles.icon} src="UserOutlined.svg" alt="email" />
                <input
                  {...register("email", { required: true })}
                  type="email"
                  placeholder="Email"
                  autoComplete="off"
                />
              </div>

              <div className={styles.inputWrapper}>
                <img className={styles.icon} src="LockOutlined.svg" alt="password" />
                <input
                  {...register("password", { required: true })}
                  type="password"
                  placeholder="Password"
                  autoComplete="new-password"
                />
              </div>

              <button
                type="submit"
                className={`${styles.button} ${isActive ? styles.active : ""}`}
                disabled={!isActive}
              >
                Log in
              </button>

              {(errors.email || errors.password || errorMsg) && (
                <span className={styles.error}>
                  {errorMsg || "All fields are required"}
                </span>
              )}
            </div>
          </>
        ) : (
          <div className={styles.twofactorWrapper}>
            <h3 className={styles.title}>Two-Factor Authentication</h3>
            <p className={styles.twofactorAuthenfication}>
              Enter the 6-digit code from the Google Authenticator app
            </p>

            <div className={styles.codeContainer}>
              {code.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    if (el) inputsRef.current[i] = el;
                  }}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className={`${styles.codeInput} ${
                    codeValid ? styles.codeValid : ""
                  }`}
                  aria-label={`Digit ${i + 1}`}
                />
              ))}
            </div>

            {verifying && <div className={styles.info}>Проверка кода 2FA…</div>}
            {errorMsg && !verifying && (
              <span className={styles.error}>{errorMsg}</span>
            )}

            {showGetNew ? (
              <button
                type="button"
                className={`${styles.button} ${styles.active}`}
                onClick={handleGetNewCode}
              >
                Get new code
              </button>
            ) : (
              <button
                type="button"
                className={`${styles.button} ${
                  code.join("").length === 6 && !codeValid ? styles.active : ""
                }`}
                disabled={code.join("").length !== 6 || verifying || codeValid}
                onClick={() => handleSubmitCode(true)}
              >
                Continue
              </button>
            )}

            {!showGetNew && timer > 0 && !hideTimer && (
              <div className={styles.info}>
                You can request a new code in {timer}s
              </div>
            )}
          </div>
        )}
      </div>
    </form>
  );
}
