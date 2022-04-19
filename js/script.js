// El orden en el código es
// 1. Constructores de clase
// 2. Inicialización de variables
// 3. Construcción de funciones
// 4. Invocación de funciones

class Articulos {
  constructor(collar, cantidad) {
    this.id = collar.id;
    this.marca = collar.marca;
    this.precio = collar.precio;
    this.cantidad = cantidad;
    this.precioTotal = collar.precio;
  }

  agregarUnidad() {
    this.cantidad++;
  }

  quitarUnidad() {
    this.cantidad--;
  }

  actualizarPrecioTotal() {
    this.precioTotal = this.precio * this.cantidad;
  }
}

// Constantes y variables
let collares = "api.json";
let arrayCollares = [];

let carrito;

// ----- Declaración de funciones ----- //
function obtenerDatosDelJson(collares) {
  fetch(collares)
    .then((res) => res.json())
    .then((json) => {
      arrayCollares = json;
      imprimirProductosEnHTML(json);
      carrito = chequearCarritoEnStorage();
      dibujarTabla(carrito);
    });
}

function bienvenidaSweet() {
  Swal.fire({
    title: "BIENVENIDO HUMANO",
    text: "En esta sección podrás encontrar collares GPS para que puedas ver en tiempo real la ubicación exacta de tu mascota, pero más allá de la utilidad y efectividad de estos dispositivos de rastreo, seamos responsables con nuestras mascotas, evitemos extravios innecesarios. (USO EXCLUSIVAMENTE PARA MASCOTAS, ANIMALWANTED NO SE HACE RESPONSABLE POR EL MAL USO DE ESTOS DISPOSITIVOS)",
    icon: "info",
    showCancelButton: true,
    confirmButtonText: "Estoy de acuerdo 👍",
    cancelButtonText: "No estoy de acuerdo 👎",
    imageUrl: "https://miro.medium.com/max/1050/1*0W96bS7rcZSYI530_e0XXQ.png",
    imageWidth: "250px",
  });
}
bienvenidaSweet();

function chequearCarritoEnStorage() {
  let contenidoEnStorage = JSON.parse(localStorage.getItem("carritoEnStorage"));
  console.table("contenido en chequear Carrito en ls ", contenidoEnStorage);

  // Si existe el array del carrito, lo retornará
  if (contenidoEnStorage) {
    let array = [];
    for (let i = 0; i < contenidoEnStorage.length; i++) {
      let collar = new Articulos(
        contenidoEnStorage[i],
        contenidoEnStorage[i].cantidad
      );
      collar.actualizarPrecioTotal();
      array.push(collar);
    }

    return array;
  }
  // Si no existe ese array en el LS, esta función devolverá un array vacío
  return [];
}

// verificacion de datos de los articulos
collares ?? console.log("Collares es null");

// Imprime catálogo de collares en el HTML
// Recibimos por parámetro el array
function imprimirProductosEnHTML(collares) {
  // Obtenemos el div que contendrá nuestras cards
  let contenedor = document.getElementById("contenedor");

  // Recorremos el array y por cada item imprimimos una card
  for (const collar of collares) {
    // Creamos el contendor individual para cada card
    let card = document.createElement("div");

    // Agregamos el contenido a la card
    // Se utilizan clases de bootstrap
    card.innerHTML = `
        <div class="card text-center" style="width: 18rem;">
            <div class="card-body">
                <img src="${collar.img}" id="" class="card-img-top img-fluid" alt="">
                <h2 class="card-title">${collar.marca}</h2>
                <h5 class="card-subtitle mb-2 text-muted">${collar.descripcion}</h5>
                <p class="card-text">$${collar.precio}</p>
                <div class="btn-group" role="group" aria-label="Basic mixed styles example">
                    <button id="agregar${collar.id}" type="button" onclick="" class="btn btn-dark"> Agregar </button>
                </div>
            </div>
        </div>      
        `;

    // Una vez que tenemos creada la card, la agregamos al contenedor
    // que obtuvimos desde el HTML
    contenedor.appendChild(card);

    // Se agrega el evento al botón
    let boton = document.getElementById(`agregar${collar.id}`);

    // Al botón le pasamos dos parámetros:
    // el evento click seguido de la función que queremos que se ejecute
    // al disparar el evento
    boton.onclick = () => agregarAlCarrito(collar.id);
  }
}

// Recibe el contenido del carrito y lo imprime en el html
// en una tabla
function dibujarTabla(array) {
  let contenedor = document.getElementById("carrito");
  contenedor.innerHTML = "";

  let precioTotal = obtenerPrecioTotal(array);

  // Creamos el div que contendrá la tabla
  let tabla = document.createElement("div");

  // A ese div le agregaremos todos los datos de la tabla
  tabla.innerHTML = `
        <table id="tablaCarrito" class="table">
            <thead>
                <tr>
                    <th scope="col">Articulo</th>
                    <th scope="col">Talle</th>
                    <th scope="col">Cantidad</th>
                    <th scope="col">Precio Parcial</th>
                </tr>
            </thead>
            <tbody id="bodyTabla">
                <tr>
                    <td>Total: ${precioTotal}</td>
                    <td> </td>
                    <td> </td>
                    <td> </td>
                </tr>
            </tbody>
        </table>
    `;

  contenedor.appendChild(tabla);

  let btnVaciar = document.getElementById("btnVaciar");
  btnVaciar.addEventListener("click", vaciarCarrito);

  // Una vez que dibujamos la tabla, obtenemos el id del body de la tabla
  // donde imprimiremos los datos del array
  let bodyTabla = document.getElementById("bodyTabla");
  for (let collar of array) {
    let datos = document.createElement("div");
    datos.innerHTML = `
            <tr>
                <th scope="row"></th>
                <td>${collar.marca}</td>
                <td>${collar.cantidad}</td>
                <td>$${collar.precioTotal}</td>
                <td><button id="eliminar${collar.id}" type="button" class="btn btn-warning"> Eliminar </button> </td>
            </tr>
      `;

    bodyTabla.appendChild(datos);

    // Asignamos el evento click al botón para eliminar un producto del carrito
    $(`#eliminar${collar.id}`).on("click", () => {
      eliminarDelCarrito(collar.id);
    });
  }
}

function agregarAlCarrito(idProducto) {
  // Verificamos si ese tipo de collar ya se encuentra en el array
  // con el método find()
  // Este método en caso de dar true, nos devuelve el primer elemento del array
  // que cumple con la condición de búsqueda
  let collarEnCarrito = carrito.find((elemento) => {
    if (elemento.id == idProducto) {
      return true;
    }
  });

  if (collarEnCarrito) {
    // Si el collar se encuentra en el carrito, collarEnCarrito devolverá
    // true, por lo cual se ejecutará este bloque de código
    // y se le sumará uno a la cantidad de esa marca en el carrito

    // Primero debemos hallar el index donde se encuentra
    // el collar en el carrito (ya que no va a ser el mismo que el del array collares);
    let index = carrito.findIndex((elemento) => {
      if (elemento.id === collarEnCarrito.id) {
        return true;
      }
    });

    carrito[index].agregarUnidad();
    carrito[index].actualizarPrecioTotal();
  } else {
    // El collar no se encuentra en el carrito, así que
    // lo pusheamos al array asignándole la clase Articulos
    // para poder acceder a sus métodos
    carrito.push(new Articulos(arrayCollares[idProducto], 1));
  }

  // Una vez que actualizamos el carrito, guardamos el carrito actualizado
  // en el Storage.
  // Volvemos a traernos ese array del storage para poder imprimirlo y
  // Luego llamamos a la función
  // que dibuja la tabla en el html para visualizar los productos
  localStorage.setItem("carritoEnStorage", JSON.stringify(carrito));
  dibujarTabla(carrito);
}

function eliminarDelCarrito(id) {
  // Buscamos el item en el carrito
  let collar = carrito.find((collar) => collar.id === id);

  let index = carrito.findIndex((element) => {
    if (element.id === collar.id) {
      return true;
    }
  });

  // Primero chequeamos el stock para saber si hay que restarle 1
  // o quitar el elemento del array
  if (collar.cantidad > 1) {
    // Obtenemos el índice donde se encuentra el collar
    // en el carrito de compras
    carrito[index].quitarUnidad();
    carrito[index].actualizarPrecioTotal();
  } else {
    // Si queda solo una unidad, se elimina del array
    // Para esto utilizamos el método splice
    // Este método sobreescribe el array original
    // Con collar id indicamos el índice del elemento en el array
    // a eliminar. El 1 es la cantidad de elementos a eliminar, es este caso, 1 solo
    carrito.splice(index, 1);

    if (carrito.lenght === 0) {
      carrito = [];
    }
  }

  localStorage.setItem("carritoEnStorage", JSON.stringify(carrito));
  dibujarTabla(carrito);
}

// Vaciar carrito
function vaciarCarrito() {
  carrito = [];
  dibujarTabla(carrito);
}

// Recorremos el array para obtener el precio total de la compra
function obtenerPrecioTotal(array) {
  let precioTotal = 0;

  for (const producto of array) {
    precioTotal += producto.precioTotal;
  }

  return precioTotal;
}

// --- Invocación de funciones ---
//imprimirProductosEnHTML(collares);

// Consulta al Storage para saber si hay información almacenada
// Si hay datos, se imprimen en el HTML al refrescar la página
obtenerDatosDelJson(collares);
