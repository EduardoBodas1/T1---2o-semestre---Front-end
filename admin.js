const baseURL = 'http://192.168.15.6:8080';

function logout() {
    localStorage.removeItem('token');
    alert("Você saiu com sucesso!");
    window.location.href = 'login.html';
}

async function loadContent() {
    const sections = ['index', 'sociais', 'corporativos', 'oficinas', 'saude', 'doacao'];
    try {
        for (const section of sections) {
            const response = await fetch(`${baseURL}/content/${section}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            });

            if (!response.ok) throw new Error(`Erro ao carregar a seção: ${section}`);
            
            const data = await response.json();

            Object.keys(data.content).forEach((key) => {
                const input = document.getElementById(`${key.toLowerCase()}-${section}-inpt`);
                if (input) input.value = data.content[key];
            });
        }
    } catch (error) {
        console.error("Erro ao carregar os dados:", error);
    }
}

document.addEventListener('DOMContentLoaded', loadContent);

async function updateContent() {
    const sections = ['index', 'sociais', 'corporativos', 'oficinas', 'saude', 'doacao'];
    try {
        for (const section of sections) {
            const inputs = document.querySelectorAll(`[id*='-${section}-inpt']`);
            const content = {};

            inputs.forEach(input => {
                const key = input.id.split('-')[0].toLowerCase();
                content[key] = input.value;
            });

            const response = await fetch(`/content/${section}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ content }),
            });

            if (!response.ok) throw new Error(`Erro ao atualizar ${section}`);
        }
        alert("Atualizado com sucesso!");
    } catch (error) {
        console.error("Erro ao atualizar os dados:", error);
        alert("Erro ao atualizar os dados no servidor.");
    }
}

document.addEventListener('DOMContentLoaded', loadContent);
document.querySelector('button.btn-primary').addEventListener('click', updateContent);