import { promises as fs } from "fs"

class Cart {
  constructor(id, products) {
    this.id = id
    this.products = products
  }
}

export class CartManager {
  constructor(path) {
    this.path = path
  }

  addCart = async () => {
    try {
      const read = await fs.readFile(this.path, 'utf-8')
      let carts = JSON.parse(read)
      let newId
      carts.length > 0 ? newId = carts[carts.length - 1].id + 1 : newId = 1
      const newCart = new Cart (newId, [])
      carts.push(newCart)
      await fs.writeFile(this.path, JSON.stringify(carts))
      return newId, "Cart created succesfully"
    } catch {
      await this.createJson()
      return "Cart JSON created"
    }
  }

  getCartById = async (idCart) => {
    const carts = JSON.parse(await fs.readFile(this.path , "utf-8"))
    const cartIndex = carts.findIndex(cart => cart.id === idCart)
    if (carts[cartIndex]) {
      return carts[cartIndex]
    } else {
      return "Cart not founded"
    }
  }

  addProductToCart = async (idCart, idProduct, prodQty) => {
    const carts = JSON.parse(await fs.readFile(this.path, 'utf-8'))
    // Verify that the cart exist with this id
    if (carts.some(cart => cart.id === parseInt(idCart))) {
      // Get the index of the carts array
      const cartIndex = carts.findIndex(cart => cart.id === parseInt(idCart))
      // Get the index of the product inside the cart
      const objectCart = new Cart(idCart, carts[cartIndex].products)
      const prodIndex = objectCart.products.findIndex(obj => obj.product === parseInt(idProduct))
      if (prodIndex === -1) {
        // If dont exists push the product to the array of products inside the cart
        objectCart.products.push({product: idProduct, quantity: prodQty})
        // Update cart in the carts array
        carts[cartIndex] = objectCart
      } else {
        // If exists increase cuantity by 1
        carts[cartIndex].products[prodIndex].quantity += prodQty
      }
      // Write the JSON of the cart with the new product
      await fs.writeFile(this.path, JSON.stringify(carts), "utf-8")
      return "Product added to cart"
    } else {
      return "There was an error by adding the product to the cart"
    }
  }

  deleteCart = async (id) => {
    const carts = JSON.parse(await fs.readFile(this.path, 'utf-8'))
    if(carts.some(cart => cart.id === parseInt(id))) {
        const cartsFiltrados = carts.filter(cart => cart.id !== parseInt(id))
        await fs.writeFile(this.path, JSON.stringify(cartsFiltrados))
      return "Cart deleted"
    } else {
      return "Cart not founded"
    }
  }

  deleteProductFromCart = async (idCart, idProduct) => {
    const carts = JSON.parse(await fs.readFile(this.path, 'utf-8'))
    // Verify that the cart exists with this id
    if(carts.some(cart => cart.id === parseInt(idCart))) {
        // Get the index of the carts array
        const cartIndex = carts.findIndex(cart => cart.id === parseInt(idCart))
        //Obtenemos el índice del prdoucto dentro del carrito
        const objetoCarrito = new Cart(idCart, carts[cartIndex].products)
        const prodIndex = objetoCarrito.products.findIndex(obj => obj.product === parseInt(idProduct))
        if(prodIndex !== -1) {
            // If exists delete the product from the cart
            const prodsFiltrados = objetoCarrito.products.filter(obj => obj.product !== parseInt(idProduct))
            // Update the cart with the array of carts
            objetoCarrito.products = prodsFiltrados;
            carts[cartIndex] = objetoCarrito;
        } else {
            return "El producto no existe en el carrito y no pudo ser eliminado."
        }
        // Write the JSOn of the cart with the new product
        await fs.writeFile(this.path, JSON.stringify(carts), 'utf-8')
        return "Product deleted from cart"
    } else {
        return "There was an error by deleting the prdouct from the cart"
    }
  }

  async createJson() {
    await fs.writeFile(this.path, "[]")
  }
}