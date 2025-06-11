document.addEventListener('DOMContentLoaded', () => {
    const methodSelect = document.getElementById('method');
    const inputsDiv = document.getElementById('inputs');
    const resultDiv = document.getElementById('result');
    const table = document.getElementById('resultTable');
    const tableBody = table.querySelector('tbody');
    const canvas = document.getElementById('resultChart');
    let chart;

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
            inputsDiv.appendChild(createInput('maxscore', 'Maximale score'));
        } else if (method === 'nterm') {
            inputsDiv.appendChild(createInput('score', 'Behaalde score'));
            inputsDiv.appendChild(createInput('maxscore', 'Maximale score'));
            inputsDiv.appendChild(createInput('ntermvalue', 'N-term'));
        } else if (method === 'foutperpunt') {
            inputsDiv.appendChild(createInput('fouten', 'Aantal fouten'));
            inputsDiv.appendChild(createInput('punten', 'Punten per fout'));
        } else if (method === 'eigen') {
            inputsDiv.appendChild(createInput('formula', 'JavaScript-formule', 'text'));
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
        const display = (typeof result === 'number' && !isNaN(result)) ? result.toFixed(2) : result;
        resultDiv.textContent = `Resultaat: ${display}`;
        resultDiv.classList.remove('hidden');

        // Vul tabel
        tableBody.innerHTML = '';
        inputsDiv.querySelectorAll('div').forEach(div => {
            const label = div.querySelector('label').textContent.replace(':','');
            const value = div.querySelector('input').value;
            const row = document.createElement('tr');
            row.innerHTML = `<td>${label}</td><td>${value}</td>`;
            tableBody.appendChild(row);
        });
        const resultRow = document.createElement('tr');
        resultRow.innerHTML = `<td>Cijfer</td><td>${display}</td>`;
        tableBody.appendChild(resultRow);
        table.classList.remove('hidden');

        // Update chart
        const value = parseFloat(result);
        if (isNaN(value)) return;
        if (!chart) {
            chart = new Chart(canvas.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: ['Cijfer'],
                    datasets: [{
                        label: 'Cijfer',
                        data: [value],
                        backgroundColor: '#76b852'
                    }]
                },
                options: {
                    animation: false,
                    scales: { y: {min: 1, max: 10} }
                }
            });
        } else {
            chart.data.datasets[0].data = [value];
            chart.update();
        }
        canvas.classList.remove('hidden');
    }

    methodSelect.addEventListener('change', updateInputs);
    document.getElementById('calculate').addEventListener('click', calculate);
    updateInputs();
});
