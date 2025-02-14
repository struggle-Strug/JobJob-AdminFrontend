import { Features, Prefectures } from "./constants/categories";
import { JobType as jobTypes } from "./constants/categories";
import { EmploymentType as employmentTypes } from "./constants/categories/employmenttype";
import { Qualifications as qualifications } from "./constants/categories/qualifications";

export const getPrefectureKeyByValue = (value) => {
  for (const region in Prefectures) {
    for (const key in Prefectures[region]) {
      if (Prefectures[region][key] === value) {
        return key; // Return the key if the value matches
      }
    }
  }
  return null; // Return null if no match is found
};

export const getJobTypeKeyByValue = (value) => {
  for (const category in jobTypes) {
    for (const job in jobTypes[category]) {
      if (jobTypes[category][job] === value) {
        return job; // Return the job key if the value matches
      }
    }
  }
  return null; // Return null if no match is found
};

export const getEmploymentTypeKeyByValue = (value) => {
  for (const type in employmentTypes) {
    if (employmentTypes[type] === value) {
      return type; // Return the employment type key if the value matches
    }
  }
  return null; // Return null if no match is found
};

export const getQualificationKeyByValue = (value) => {
  for (const category in qualifications) {
    for (const qualification in qualifications[category]) {
      if (qualifications[category][qualification] === value) {
        return qualification; // Return the qualification key if the value matches
      }
    }
  }
  return null; // Return null if no match is found
};

export const getFeatureKeyByValue = (value) => {
  for (const category in Features) {
    for (const feature in Features[category]) {
      if (Features[category][feature] === value) {
        return feature; // Return the feature key if the value matches
      }
    }
  }
  return null; // Return null if no match is found
};

export const getAllJobTypeValues = () => {
  const values = [];
  for (const category in jobTypes) {
    if (Object.hasOwnProperty.call(jobTypes, category)) {
      values.push(...Object.values(jobTypes[category]));
    }
  }
  return values;
};
