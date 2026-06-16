import { Degree } from "../models/Degree.js";
import { DegreeRequest } from "../models/DegreeRequest.js";
import { University } from "../models/University.js";
import { createDegreeHash } from "./hashDegree.js";

export async function repairMismatchedDegreeHashes() {
  try {
    const degrees = await Degree.find({}).populate("university");
    let repairedCount = 0;

    for (const degree of degrees) {
      const computedHash = createDegreeHash({
        studentName: degree.studentName,
        studentEmail: degree.studentEmail,
        studentWallet: degree.studentWallet,
        degreeTitle: degree.degreeTitle,
        department: degree.department,
        graduationYear: degree.graduationYear,
        universityId: degree.university._id,
        ipfsCID: degree.ipfsCID,
        issueDate: degree.issueDate.toISOString(),
      });

      if (computedHash === degree.degreeHash) {
        continue;
      }

      console.log(`[Hash Repair] Mismatch found for degree ${degree._id}. Attempting repair...`);

      // Find the request
      const request = await DegreeRequest.findOne({ degreeHash: degree.degreeHash });
      if (!request) {
        console.log(`[Hash Repair] No request found for hash ${degree.degreeHash}`);
        continue;
      }

      const baseTime = request.createdAt.getTime();
      let found = false;

      // Brute force back to 10 seconds before request creation (10000ms)
      for (let offset = 0; offset <= 10000; offset++) {
        const testDate = new Date(baseTime - offset);
        const testHash = createDegreeHash({
          studentName: degree.studentName,
          studentEmail: degree.studentEmail,
          studentWallet: degree.studentWallet,
          degreeTitle: degree.degreeTitle,
          department: degree.department,
          graduationYear: degree.graduationYear,
          universityId: degree.university._id,
          ipfsCID: degree.ipfsCID,
          issueDate: testDate.toISOString(),
        });

        if (testHash === degree.degreeHash) {
          degree.issueDate = testDate;
          await degree.save();
          console.log(`[Hash Repair] Fixed degree ${degree._id}. Offset: -${offset}ms, Date: ${testDate.toISOString()}`);
          found = true;
          repairedCount++;
          break;
        }
      }

      if (!found) {
        console.log(`[Hash Repair] Could not repair degree ${degree._id} automatically.`);
      }
    }

    if (repairedCount > 0) {
      console.log(`[Hash Repair] Completed. Repaired ${repairedCount} degrees.`);
    }
  } catch (error) {
    console.error("[Hash Repair] Error running repair:", error);
  }
}
