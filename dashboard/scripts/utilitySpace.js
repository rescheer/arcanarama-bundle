//--Replicants
const currentUtility = nodecg.Replicant('currentUtility', {defaultValue: "#utilSpindles", persistent: false});

const moreFunButton = document.querySelector("#moreFunButton");
const defaultButton = document.querySelector("#defaultButton");

moreFunButton.onclick = () => {
    currentUtility.value = "#moreFunLogo";
}

defaultButton.onclick = () => {
    currentUtility.value = "#utilSpindles"
}