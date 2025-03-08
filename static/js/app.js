// Cargar creditos y actualizar tabla
function loadCredits() {
    fetch('/api/credits')
        .then(response => response.json())
        .then(data => updateTable(data.credits));
}

// Actualizar la tabla de creditos
function updateTable(credits) {
    const tableBody = document.getElementById('creditsTable');
    // Limpiar la tabla antes de actualizarla
    tableBody.innerHTML = '';
    
    // Iterar sobre cada credito y crear una fila en la tabla
    credits.forEach(credit => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${credit.cliente}</td>
            <td>${formatCurrency(credit.monto)}</td>
            <td>${credit.tasa_intereses}</td>
            <td>${credit.plazo}</td>
            <td>${credit.fecha_otorgamiento}</td>
            <td>
                <button onclick="deleteCredit(${credit.id})">Eliminar</button>
                <button onclick="editCredit(${credit.id})">Editar</button>
            </td>
        `;
        // Agregar la fila a la tabla
        tableBody.appendChild(row); 
    });
}

// Buscar credito por cliente
async function searchCredit() {
    const cliente = document.getElementById('searchInput').value.trim();
    if (cliente) {
        try {
            // Realizar la busqueda en la API
            const response = await fetch(`/api/credits/search?cliente=${cliente}`);
            const data = await response.json();

            // Verificar si no se encontraron
            if (data.credits.length === 0) {
                alert("Este cliente no se encuentra en la base de datos.");
                return;
            }

            // Actualizar la tabla y la grafica con los resultados
            updateTable(data.credits);
            updateChart(data.credits);
        } catch (error) {
            console.error("Error al buscar créditos:", error);
            alert("Hubo un error al buscar el cliente.");
        }
    } else {
        alert('Por favor, ingresa un nombre de cliente.');
    }
}

// Boton de cancelar busqueda
function cancelSearch() {
    document.getElementById('searchInput').value = '';
    loadCredits();
    loadChart();
}

// Formatear moneda
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

// Funcion para crear o actualizar la grafica
function renderChart(data, totalMonto, datasetLabel = "Monto Total por Cliente") {
    // Actualizar el total de creditos en la interfaz
    document.getElementById("totalMonto").textContent = totalMonto;

    const ctx = document.getElementById("graficaCreditos").getContext("2d");

    // Destruir la grafica anterior si existe
    if (window.myChart) window.myChart.destroy();

    // Crear una nueva grafica
    window.myChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: data.map(c => c.cliente),
            datasets: [{
                label: datasetLabel,
                data: data.map(c => c.monto || c.total_monto),
                backgroundColor: "rgba(54, 162, 235, 0.8)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1
            }]
        },
        // Opciones de la grafica
        options: chartOptions(data)
    });
}

// Actualizar grafica con los datos
function updateChart(credits) {
    console.log("Datos recibidos para la gráfica:", credits);
    const totalMonto = formatCurrency(credits.reduce((sum, credit) => sum + credit.monto, 0));
    renderChart(credits, totalMonto);
}

// Cargar grafica general
function loadChart() {
    fetch("/api/creditos_estadisticas")
        .then(response => response.json())
        .then(data => {
            const totalMonto = formatCurrency(data.total_creditos);
            renderChart(data.creditos_por_cliente, totalMonto, "Monto Total por Cliente");
        });
}

// Opciones de la grafica
function chartOptions(data) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                ticks: {
                    display: false 
                },
                grid: {
                    drawTicks: false
                }
            },
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return formatCurrency(value);
                    }
                }
            }
        },
        plugins: {
            tooltip: {
                enabled: true,
                callbacks: {
                    label: function(tooltipItem) {
                        const cliente = tooltipItem.label;
                        const cantidadCreditos = data.find(c => c.cliente === cliente)?.cantidad || 
                                               data.filter(c => c.cliente === cliente).length;
                        const montoTotal = tooltipItem.raw;
                        
                        return [
                            `Cantidad de Créditos: ${cantidadCreditos}`, 
                            `Crédito: ${formatCurrency(montoTotal)}`
                        ];
                    }
                }
            },
            legend: {
                display: false
            }
        }
    };
}

// Agregar credito
function addCredit(event) {
    event.preventDefault();

    const isConfirmed = window.confirm("¿Estás seguro de que quieres guardar este crédito?");
    
    if (!isConfirmed) {
        return;
    }

    const newCredit = {
        cliente: document.getElementById('cliente').value,
        monto: parseFloat(document.getElementById('monto').value),
        tasa_intereses: document.getElementById('tasa_intereses').value,
        plazo: document.getElementById('plazo').value,
        fecha_otorgamiento: document.getElementById('fecha_otorgamiento').value
    };

    // Validar que el monto sea un numero valido
    if (!isNaN(newCredit.monto)) {
        newCredit.monto = newCredit.monto.toFixed(2);
    } else {
        alert('El monto debe ser un número válido');
        return;
    }

    // Enviar el nuevo credito a la API
    fetch('/api/credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCredit)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message); 
        window.location.href = '/';
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Hubo un error al guardar el crédito');
    });
}

// Eliminar credito
function deleteCredit(id) {
    if (!confirm("¿Estás seguro de que quieres eliminar este crédito?")) return;
    
    // Enviar la solicitud de eliminacion a la API
    fetch(`/api/credits/${id}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            location.reload();
        });
}

// Editar credito
function editCredit(id) {
    window.location.href = `/edit_credit/${id}`;
}

// Actualizar credito
function updateCredit() {
    const creditId = document.getElementById('credit_id').value;
    const updatedCredit = {
        cliente: document.getElementById('cliente').value,
        monto: document.getElementById('monto').value,
        tasa_intereses: document.getElementById('tasa_intereses').value,
        plazo: document.getElementById('plazo').value,
        fecha_otorgamiento: document.getElementById('fecha_otorgamiento').value
    };
    
    // Enviar la solicitud de actualizacion a la API
    fetch(`/api/credits/${creditId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCredit)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        window.location.href = '/';
    });
}

// Cargar creditos al iniciar la página
window.onload = loadCredits;

// Cargar la grafica al cargar el DOM
document.addEventListener("DOMContentLoaded", loadChart);

// Convertir el nombre del cliente a mayusculas al escribir
document.addEventListener("DOMContentLoaded", function() {
    const clienteInput = document.getElementById("cliente");
    
    clienteInput.addEventListener("input", function() {
        this.value = this.value.toUpperCase();
    });
});

// Asignar el evento de envio al formulario de agregar credito
if (document.getElementById('addCreditForm')) {
    document.getElementById('addCreditForm').addEventListener('submit', addCredit);
}

// Asignar el evento de envio al formulario de editar credito
if (document.getElementById('editCreditForm')) {
    document.getElementById('editCreditForm').addEventListener('submit', function(event) {
        event.preventDefault();
        updateCredit();
    });
}