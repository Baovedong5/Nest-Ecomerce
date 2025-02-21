import { Prisma } from '@prisma/client';
import { randomInt } from 'crypto';

//Type predicate: Dự đoán kiểu dữ liệu
export function isUniqueConstraintPrismaError(error: any): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
}

export function isNotFoundPrismaError(error: any): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025';
}

//Tạo mã OTP
export const generateOTP = () => {
  return String(randomInt(100000, 1000000));
};
