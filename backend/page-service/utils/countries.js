const countries = [
    { value: "Select Country", label: "" },
    { value: "United States", label: "unitedstates" },
    { value: "Canada", label: "canada" },
    { value: "United Kingdom", label: "unitedkingdom" },
    { value: "Australia", label: "australia" },
    { value: "India", label: "india" },
    { value: "Germany", label: "germany" },
    { value: "France", label: "france" },
    { value: "Japan", label: "japan" },
    { value: "China", label: "china" },
    { value: "Brazil", label: "brazil" },
    { value: "South Africa", label: "southafrica" },
    { value: "Sri Lanka", label: "srilanka" },
    { value: "Mexico", label: "mexico" },
    { value: "Russia", label: "russia" },
    { value: "Italy", label: "italy" },
    { value: "Spain", label: "spain" },
    { value: "Netherlands", label: "netherlands" },
    { value: "New Zealand", label: "newzealand" },
    { value: "Singapore", label: "singapore" },
    { value: "South Korea", label: "southkorea" },
    { value: "United Arab Emirates", label: "unitedarabemirates" },
    { value: "Saudi Arabia", label: "saudiarabia" },
    { value: "Argentina", label: "argentina" },
    { value: "Egypt", label: "egypt" },
    { value: "Turkey", label: "turkey" },
    { value: "Sweden", label: "sweden" },
    { value: "Norway", label: "norway" },
    { value: "Switzerland", label: "switzerland" },
    { value: "Belgium", label: "belgium" },
    { value: "Thailand", label: "thailand" },
    { value: "Malaysia", label: "malaysia" },
    { value: "Vietnam", label: "vietnam" },
    { value: "Indonesia", label: "indonesia" },
    { value: "Philippines", label: "philippines" },
];

function convertCountry(labelInput) {
    if (!labelInput) return { country: "" };

    const found = countries.find(
        (c) => c.label.toLowerCase() === labelInput.toLowerCase().trim()
    );

    if (found) return { country: found.value }; 

    return { country: labelInput }; 
}


module.exports = { countries, convertCountry };
