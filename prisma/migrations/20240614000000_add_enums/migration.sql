-- Drop existing text columns and recreate with proper enums

-- 1. Create enum types
DO $$ BEGIN
    CREATE TYPE "Role" AS ENUM ('ADMIN', 'STUDENT');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE "CourseLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE "PaymentGateway" AS ENUM ('ZARINPAL');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 2. Alter User.role from TEXT to Role enum
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role" USING "role"::"Role";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'STUDENT';

-- 3. Alter Course.level from TEXT to CourseLevel enum
ALTER TABLE "Course" ALTER COLUMN "level" DROP DEFAULT;
ALTER TABLE "Course" ALTER COLUMN "level" TYPE "CourseLevel" USING "level"::"CourseLevel";

-- 4. Alter Order.status from TEXT to OrderStatus enum
ALTER TABLE "Order" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Order" ALTER COLUMN "status" TYPE "OrderStatus" USING "status"::"OrderStatus";
ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- 5. Alter Order.gateway from TEXT to PaymentGateway enum
ALTER TABLE "Order" ALTER COLUMN "gateway" DROP DEFAULT;
ALTER TABLE "Order" ALTER COLUMN "gateway" TYPE "PaymentGateway" USING "gateway"::"PaymentGateway";
ALTER TABLE "Order" ALTER COLUMN "gateway" SET DEFAULT 'ZARINPAL';

-- 6. Alter Payment.gateway from TEXT to PaymentGateway enum
ALTER TABLE "Payment" ALTER COLUMN "gateway" DROP DEFAULT;
ALTER TABLE "Payment" ALTER COLUMN "gateway" TYPE "PaymentGateway" USING "gateway"::"PaymentGateway";
ALTER TABLE "Payment" ALTER COLUMN "gateway" SET DEFAULT 'ZARINPAL';

-- 7. Alter Payment.status from TEXT to PaymentStatus enum
ALTER TABLE "Payment" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Payment" ALTER COLUMN "status" TYPE "PaymentStatus" USING "status"::"PaymentStatus";
ALTER TABLE "Payment" ALTER COLUMN "status" SET DEFAULT 'PENDING';
