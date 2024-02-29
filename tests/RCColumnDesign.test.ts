import RCColumnDesign from "../components/RCColumnDesign";

test("RCColumnDesign Test Case 1: ", () => {
  expect(RCColumnDesign(4000, 2000, 1000, 5, "5", "1%")).toEqual({
    internalColumn: { size: 475, material: "RC" },
    edgeColumn: { size: 400, material: "RC" },
    cornerColumn: { size: 400, material: "RC" },
  });
});
