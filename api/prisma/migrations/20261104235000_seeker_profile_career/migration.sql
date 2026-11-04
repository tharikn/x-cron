-- Extend SeekerProfile for personal / location / career fields (Profile tab).
ALTER TABLE "xcron"."SeekerProfile" ADD COLUMN "mobile" TEXT;
ALTER TABLE "xcron"."SeekerProfile" ADD COLUMN "email" TEXT;
ALTER TABLE "xcron"."SeekerProfile" ADD COLUMN "showContact" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "xcron"."SeekerProfile" ADD COLUMN "address" TEXT;
ALTER TABLE "xcron"."SeekerProfile" ADD COLUMN "pincode" TEXT;
ALTER TABLE "xcron"."SeekerProfile" ADD COLUMN "careerStage" TEXT;
ALTER TABLE "xcron"."SeekerProfile" ADD COLUMN "educationStatus" TEXT;
ALTER TABLE "xcron"."SeekerProfile" ADD COLUMN "openToInternship" BOOLEAN;
ALTER TABLE "xcron"."SeekerProfile" ADD COLUMN "courseDetails" TEXT;
ALTER TABLE "xcron"."SeekerProfile" ADD COLUMN "branchStudied" TEXT;
ALTER TABLE "xcron"."SeekerProfile" ADD COLUMN "academicScore" TEXT;
ALTER TABLE "xcron"."SeekerProfile" ADD COLUMN "experienceYears" INTEGER;
ALTER TABLE "xcron"."SeekerProfile" ADD COLUMN "experienceMonths" INTEGER;
ALTER TABLE "xcron"."SeekerProfile" ADD COLUMN "companyName" TEXT;
ALTER TABLE "xcron"."SeekerProfile" ADD COLUMN "companyArea" TEXT;
ALTER TABLE "xcron"."SeekerProfile" ADD COLUMN "currentSalary" TEXT;
ALTER TABLE "xcron"."SeekerProfile" ADD COLUMN "expectedSalary" TEXT;
ALTER TABLE "xcron"."SeekerProfile" ADD COLUMN "noticePeriod" TEXT;
