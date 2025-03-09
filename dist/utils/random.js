// Generate Random
export const randomAlphaNumeric = ({
  length = 6,
  alphanumeric = false,
  specialChar = false
} = {}) => {
  let chars = "";
  let specialChars = "";
  let result = "";
  let requiredChars = [];
  if (alphanumeric) {
    chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    requiredChars.push("ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz", "0123456789");
  } else {
    chars = "0123456789";
    requiredChars.push("0123456789");
  }
  if (specialChar) {
    specialChars = "!@#$%^&*()_+-=[]{}|;:,.<>?/";
    requiredChars.push(specialChars);
  }
  const allChars = chars + specialChars;

  // Ensure at least one of each required character type
  for (const charSet of requiredChars) {
    result += charSet.charAt(Math.floor(Math.random() * charSet.length));
  }

  // Fill the remaining length with random characters
  while (result.length < length) {
    result += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }

  // Shuffle the result to mix the characters
  result = result.split("").sort(() => Math.random() - 0.5).join("");
  return result;
};