-- 1. Keep createdAt (optional, remove if you really want to drop it)
-- ALTER TABLE "Department" DROP COLUMN "createdAt"; -- ❌ Optional: Comment this if not needed

-- 2. Add departmentId as nullable for now
ALTER TABLE "Employee" ADD COLUMN "departmentId" INTEGER;

-- 3. Create departments from existing employee department values (if needed)
INSERT INTO "Department" ("departmentName")
SELECT DISTINCT "department"
FROM "Employee"
WHERE "department" IS NOT NULL
ON CONFLICT DO NOTHING;

-- 4. Backfill departmentId based on employee.department
UPDATE "Employee" SET "departmentId" = (
  SELECT "id" FROM "Department"
  WHERE "Department"."departmentName" = "Employee"."department"
);

-- 5. Now make departmentId NOT NULL
ALTER TABLE "Employee" ALTER COLUMN "departmentId" SET NOT NULL;

-- 6. Drop the old 'department' column now
ALTER TABLE "Employee" DROP COLUMN "department";

-- 7. Add the foreign key constraint
ALTER TABLE "Employee"
ADD CONSTRAINT "Employee_departmentId_fkey"
FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
