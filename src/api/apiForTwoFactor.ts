interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  userId: string;
}

interface VerifyPayload {
  userId: string;
  code: string;
}

interface VerifyResponse {
  success: boolean;
}

interface GenericResponse {
  success: boolean;
}

const user2FACodes: Record<string, string> = {};

function generate2FACode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateUserId(email: string): string {
  return `user-${email.replace(/[@.]/g, "-")}`;
}

export async function loginApi(
  payload: LoginPayload
): Promise<LoginResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { email, password } = payload;
      const userId = generateUserId(email);
      const code = generate2FACode();

      user2FACodes[userId] = code;

      console.log(
        `Сгенерирован код 2FA для:\nEmail: ${email}\nPassword: ${password}\nКод 2FA: ${code}`
      );

      resolve({ success: true, userId });
    }, 1000);
  });
}

export async function verifyCodeApi(
  payload: VerifyPayload
): Promise<VerifyResponse> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const { userId, code } = payload;

      if (user2FACodes[userId] !== code) {
        reject({ status: 400, message: "Неправильный код" });
      } else {
        resolve({ success: true });
        delete user2FACodes[userId];
      }
    }, 1000);
  });
}

export async function generateNew2FACodeApi(
  userId: string
): Promise<GenericResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newCode = generate2FACode();
      user2FACodes[userId] = newCode;

      console.log(`Сгенерирован новый код 2FA для ${userId}!\nКод 2FA: ${newCode}`);

      resolve({ success: true });
    }, 500);
  });
}
