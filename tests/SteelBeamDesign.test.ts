import SteelBeamDesign from "../components/SteelBeamDesign"


test("5m long beam, 1kn/m DL, 1kN/m LL, L/ 360 deflectionLimit", () => {
    expect(SteelBeamDesign(1, 1, 5, "full", "UB", 360)).toEqual({   
        ZRequired: 25.09,
        IRequired: 585.94,
        ShearAreaRequired: 34.76,
    })
})

test("5m long beam, 2kn/m DL, 2kN/m LL, L/ 500 deflectionLimit", () => {
    expect(SteelBeamDesign(2, 2, 5, "full", "UB", 500)).toEqual({        
        ZRequired: 50.18,
        IRequired: 1627.60,
        ShearAreaRequired: 69.53,
    })
})