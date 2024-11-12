const endpoint = 'https://retoolapi.dev/oUtAL5/productos';
const tbody = document.querySelector('#tbody');
const btnAdd = document.querySelector('#add-btn');
const addContainer = document.querySelector('#add-container');
const btnCancelar = document.querySelector('#can-btn-forms');
const btnAgregar = document.querySelector('#add-btn-forms');
const limpiarFiltrosBtn = document.querySelector('#limpiar-filtros');

function mostrarArticulos() {
    const main = document.querySelector('#main');
    main.classList.toggle('active');
}

getArticulos = async () => {
    try {
        const response = await fetch(endpoint);
        const data = await response.json();
        tbody.innerHTML = '';
        data.forEach((articulo) => {
            if (isNaN(articulo.image) && isNaN(articulo.title) && isNaN(articulo.category) && isNaN(articulo.description)) {
                const tr = document.createElement('tr');
                tr.innerHTML = `
            <tr>
                <td class="container-img"><img src="${articulo.image}" alt="${articulo.title}-img"></td>
                <td>${articulo.title}</td>
                <td>$${articulo.price}</td>
                <td>${articulo.category}</td>
                <td>${articulo.description}</td>
                <td class="container-img"><span class="eliminar-texto" onclick="obtenerId(this)" data-info="${articulo.id}">Eliminar</span></td>
            <tr>
            `;
                tbody.appendChild(tr);
            }
        });
    } catch (error) {
        console.log('Error: ', error);
    }
}

btnAgregar.addEventListener('click', () => {
    let image = document.querySelector('#product-image').value
    let title = document.querySelector('#product-title').value
    let price = document.querySelector('#product-price').value
    let category = document.querySelector('#product-category').value
    let description = document.querySelector('#product-description').value
    if (image.trim() !== '' && title.trim() !== '' && price.trim() !== '' && category.trim() !== '' && description.trim() !== '') {
        const articulo = {
            image: image,
            title: title,
            price: price,
            category: category,
            description: description
        }
        colocarArticulo(articulo).then((result) => {
            getArticulos();
        });
        limpiarCampos();
        addContainer.classList.toggle('active');
    }
    else {
        alert('Por favor, ingrese los datos correctamente')
    }
});

function limpiarCampos() {
    document.querySelector('#product-image').value = ''
    document.querySelector('#product-title').value = ''
    document.querySelector('#product-price').value = ''
    document.querySelector('#product-category').value = ''
    document.querySelector('#product-description').value = ''
}

colocarArticulo = async (articulo) => {
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(articulo)
        });
        const data = await response.json();
    } catch (error) {
        console.log('Error: ', error);
    }
}

btnAdd.addEventListener('click', () => {
    addContainer.classList.toggle('active');
});

btnCancelar.addEventListener('click', () => {
    addContainer.classList.toggle('active');
    limpiarCampos();
});

let articulos = getArticulos();

function obtenerId(button) {
    const contenido = button.getAttribute('data-info');
    eliminarArticulo(contenido).then((result) => {
        filtrarArticulos();
    });
}

eliminarArticulo = async (id) => {
    try {
        const response = await fetch(`${endpoint}/${id}`, {
            method: 'DELETE'
        });
        const data = await response.json();
    } catch (error) {
        console.log('Error: ', error);
    }
}

filtrarArticulos = async () => {
    try {
        const filtroCategory = document.querySelector('#filtro-category').value;
        const filtroPrice = document.querySelector('#filtro-price').value;
        let buscar = ``;
        if (filtroCategory !== '') {
            buscar = `/?category=${filtroCategory}`;
        }else{
            buscar = ``;
        }
        const response = await fetch(`${endpoint}${buscar}`);
        let data = await response.json();
        tbody.innerHTML = '';
        if (filtroPrice === 'asc') {
            data = ordenarAscendente(data);
        } else if (filtroPrice === 'desc') {
            data = ordenarDescendente(data);
        }
        console.log(data);
        data.forEach((articulo) => {
            if (isNaN(articulo.image) && isNaN(articulo.title) && isNaN(articulo.category) && isNaN(articulo.description)) {
                const tr = document.createElement('tr');
                tr.innerHTML = `
            <tr>
                <td class="container-img"><img src="${articulo.image}" alt="${articulo.title}-img"></td>
                <td>${articulo.title}</td>
                <td>$${articulo.price}</td>
                <td>${articulo.category}</td>
                <td>${articulo.description}</td>
                <td class="container-img"><button id="btn-eliminar" onclick="obtenerId(this)" data-info="${articulo.id}">Eliminar</button></td> 
            <tr>
            `;
                tbody.appendChild(tr);
            }
        });
    } catch (error) {
        console.log('Error: ', error);
    }
}

function ordenarAscendente(data) {
    return data.sort((a, b) => a.price - b.price);
}
function ordenarDescendente(data) {
    return data.sort((a, b) => b.price - a.price);
}

limpiarFiltrosBtn.addEventListener('click', () => {
    getArticulos();
    document.querySelector('#filtro-category').querySelector('option').selected = true;
    document.querySelector('#filtro-price').querySelector('option').selected = true;
});
