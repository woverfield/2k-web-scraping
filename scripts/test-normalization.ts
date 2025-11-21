/**
 * Test Script: Attribute Normalization
 *
 * This script tests the attribute normalization module to ensure
 * it correctly maps legacy attribute names to standardized names.
 */

import {
  normalizeAttributeName,
  normalizeAttributes,
  getAttributeCategory,
  getAttributeDisplayName,
  isValidAttribute,
  getUnmappedAttributes,
} from "../lib/attribute-normalizer";

console.log("🧪 Testing Attribute Normalization Module\n");
console.log("=".repeat(60));

// Test 1: Individual attribute name normalization
console.log("\n📝 Test 1: Individual Attribute Name Normalization");
console.log("-".repeat(60));

const testCases = [
  { input: "layup", expected: "drivingLayup" },
  { input: "overallDurability", expected: "durability" },
  { input: "threePointShot", expected: "threePointShot" }, // Already correct
  { input: "closeShot", expected: "closeShot" }, // Already correct
];

let test1Passed = 0;
for (const test of testCases) {
  const result = normalizeAttributeName(test.input);
  const passed = result === test.expected;
  console.log(
    `${passed ? "✅" : "❌"} "${test.input}" → "${result}" ${
      !passed ? `(expected: "${test.expected}")` : ""
    }`
  );
  if (passed) test1Passed++;
}

console.log(`\nResult: ${test1Passed}/${testCases.length} passed`);

// Test 2: Full attributes object normalization
console.log("\n📝 Test 2: Full Attributes Object Normalization");
console.log("-".repeat(60));

const legacyAttributes = {
  layup: 95,
  closeShot: 88,
  midRangeShot: 85,
  threePointShot: 82,
  overallDurability: 90,
  speed: 85,
  agility: 88,
  strength: 75,
};

const normalized = normalizeAttributes(legacyAttributes);

console.log("Input attributes:");
console.log(JSON.stringify(legacyAttributes, null, 2));
console.log("\nNormalized attributes:");
console.log(JSON.stringify(normalized, null, 2));

const test2Checks = [
  { key: "drivingLayup", shouldExist: true, value: 95 },
  { key: "layup", shouldExist: false },
  { key: "durability", shouldExist: true, value: 90 },
  { key: "overallDurability", shouldExist: false },
];

let test2Passed = 0;
console.log("\nValidation:");
for (const check of test2Checks) {
  const exists = check.key in normalized;
  const valueMatches = check.value ? normalized[check.key] === check.value : true;
  const passed = exists === check.shouldExist && valueMatches;

  console.log(
    `${passed ? "✅" : "❌"} "${check.key}" ${
      check.shouldExist ? "exists" : "doesn't exist"
    }${check.value ? ` with value ${check.value}` : ""}`
  );
  if (passed) test2Passed++;
}

console.log(`\nResult: ${test2Passed}/${test2Checks.length} passed`);

// Test 3: Category assignment
console.log("\n📝 Test 3: Category Assignment");
console.log("-".repeat(60));

const categoryTests = [
  { attr: "drivingLayup", expected: "insideScoring" },
  { attr: "layup", expected: "insideScoring" }, // Should normalize first
  { attr: "durability", expected: "athleticism" },
  { attr: "overallDurability", expected: "athleticism" }, // Should normalize first
  { attr: "threePointShot", expected: "outsideScoring" },
  { attr: "passPerception", expected: "defending" },
  { attr: "agility", expected: "athleticism" },
];

let test3Passed = 0;
for (const test of categoryTests) {
  const category = getAttributeCategory(test.attr);
  const passed = category === test.expected;
  console.log(
    `${passed ? "✅" : "❌"} "${test.attr}" → category: "${category}" ${
      !passed ? `(expected: "${test.expected}")` : ""
    }`
  );
  if (passed) test3Passed++;
}

console.log(`\nResult: ${test3Passed}/${categoryTests.length} passed`);

// Test 4: Display name formatting
console.log("\n📝 Test 4: Display Name Formatting");
console.log("-".repeat(60));

const displayNameTests = [
  { attr: "drivingLayup", expected: "Driving Layup" },
  { attr: "layup", expected: "Driving Layup" }, // Should normalize first
  { attr: "threePointShot", expected: "Three-Point Shot" },
  { attr: "shotIQ", expected: "Shot IQ" },
  { attr: "passPerception", expected: "Pass Perception" },
];

let test4Passed = 0;
for (const test of displayNameTests) {
  const displayName = getAttributeDisplayName(test.attr);
  const passed = displayName === test.expected;
  console.log(
    `${passed ? "✅" : "❌"} "${test.attr}" → "${displayName}" ${
      !passed ? `(expected: "${test.expected}")` : ""
    }`
  );
  if (passed) test4Passed++;
}

console.log(`\nResult: ${test4Passed}/${displayNameTests.length} passed`);

// Test 5: Validation
console.log("\n📝 Test 5: Attribute Validation");
console.log("-".repeat(60));

const validationTests = [
  { attr: "drivingLayup", expected: true },
  { attr: "layup", expected: true }, // Should normalize and validate
  { attr: "overallDurability", expected: true }, // Should normalize and validate
  { attr: "unknownAttribute", expected: false },
  { attr: "randomStat", expected: false },
];

let test5Passed = 0;
for (const test of validationTests) {
  const isValid = isValidAttribute(test.attr);
  const passed = isValid === test.expected;
  console.log(
    `${passed ? "✅" : "❌"} "${test.attr}" is ${
      isValid ? "valid" : "invalid"
    } ${!passed ? `(expected: ${test.expected ? "valid" : "invalid"})` : ""}`
  );
  if (passed) test5Passed++;
}

console.log(`\nResult: ${test5Passed}/${validationTests.length} passed`);

// Test 6: Unmapped attribute detection
console.log("\n📝 Test 6: Unmapped Attribute Detection");
console.log("-".repeat(60));

const mixedAttributes = {
  drivingLayup: 95,
  closeShot: 88,
  unknownStat1: 70,
  threePointShot: 82,
  randomAttribute: 65,
  speed: 85,
};

const unmapped = getUnmappedAttributes(mixedAttributes);
console.log("Input attributes with some invalid:");
console.log(JSON.stringify(mixedAttributes, null, 2));
console.log("\nUnmapped attributes found:");
console.log(JSON.stringify(unmapped, null, 2));

const test6Passed =
  unmapped.length === 2 &&
  unmapped.includes("unknownStat1") &&
  unmapped.includes("randomAttribute");

console.log(
  `\n${
    test6Passed ? "✅" : "❌"
  } Correctly identified 2 unmapped attributes`
);

// Final summary
console.log("\n" + "=".repeat(60));
console.log("📊 FINAL SUMMARY");
console.log("=".repeat(60));

const totalTests = 6;
const passedTests =
  (test1Passed === testCases.length ? 1 : 0) +
  (test2Passed === test2Checks.length ? 1 : 0) +
  (test3Passed === categoryTests.length ? 1 : 0) +
  (test4Passed === displayNameTests.length ? 1 : 0) +
  (test5Passed === validationTests.length ? 1 : 0) +
  (test6Passed ? 1 : 0);

console.log(`\nTests Passed: ${passedTests}/${totalTests}`);

if (passedTests === totalTests) {
  console.log("\n✅ All tests passed! Normalization module is working correctly.");
} else {
  console.log(
    `\n⚠️  ${totalTests - passedTests} test(s) failed. Please review the output above.`
  );
  process.exit(1);
}
