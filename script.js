document.addEventListener('DOMContentLoaded', () => {
    const methodSelect = document.getElementById('method');
    const inputsDiv = document.getElementById('inputs');
    const resultDiv = document.getElementById('result');

    function createInput(id, label, type='number') {
        const wrapper = document.createElement('div');
        const labelElem = document.createElement('label');
        const input = document.createElement('input');
        labelElem.textContent = label + ':';
        labelElem.htmlFor = id;
        input.id = id;
        input.type = type;
        wrapper.appendChild(labelElem);
        wrapper.appendChild(input);
        return wrapper;
    }

    function updateInputs() {
        inputsDiv.innerHTML = '';
        const method = methodSelect.value;
        if (method === 'lineair' || method === 'nonlineair') {
            inputsDiv.appendChild(createInput('score', 'Behaalde score'));
            inputsDiv.appendChild(createInput('maxscore', 'Max score'));
        } else if (method === 'nterm') {
            inputsDiv.appendChild(createInput('score', 'Behaalde score'));
            inputsDiv.appendChild(createInput('maxscore', 'Max score'));
            inputsDiv.appendChild(createInput('ntermvalue', 'N-term'));
        } else if (method === 'foutperpunt') {
            inputsDiv.appendChild(createInput('fouten', 'Aantal fouten'));
            inputsDiv.appendChild(createInput('punten', 'Punten per fout'));
        } else if (method === 'eigen') {
            inputsDiv.appendChild(createInput('formula', 'JavaScript formule', 'text'));
            inputsDiv.appendChild(createInput('variables', 'Waarden (JSON)', 'text'));
        }
    }

    function calculate() {
        const method = methodSelect.value;
        let result = 0;
        if (method === 'lineair') {
            const s = parseFloat(document.getElementById('score').value);
            const m = parseFloat(document.getElementById('maxscore').value);
            if (m) result = 1 + 9 * (s / m);
        } else if (method === 'nonlineair') {
            const s = parseFloat(document.getElementById('score').value);
            const m = parseFloat(document.getElementById('maxscore').value);
            if (m) result = Math.max(1, 1 + 9 * Math.pow(s / m, 2));
        } else if (method === 'nterm') {
            const s = parseFloat(document.getElementById('score').value);
            const m = parseFloat(document.getElementById('maxscore').value);
            const n = parseFloat(document.getElementById('ntermvalue').value);
            if (m) result = (9 / m) * s + n;
        } else if (method === 'foutperpunt') {
            const fouten = parseFloat(document.getElementById('fouten').value);
            const punten = parseFloat(document.getElementById('punten').value);
            result = 10 - fouten * punten;
        } else if (method === 'eigen') {
            try {
                const formula = document.getElementById('formula').value;
                const variables = JSON.parse(document.getElementById('variables').value || '{}');
                result = new Function(...Object.keys(variables), `return ${formula}`)(...Object.values(variables));
            } catch (err) {
                result = 'Error in formule';
            }
        }
        resultDiv.textContent = `Resultaat: ${result}`;
        resultDiv.classList.remove('hidden');
    }

    methodSelect.addEventListener('change', updateInputs);
    document.getElementById('calculate').addEventListener('click', calculate);
    updateInputs();
});
