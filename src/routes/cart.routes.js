import { Router } from "express"
import { CartManager } from "../controllers/CartManager.js"
import { ProductManager } from "../controllers/ProductManager.js"

const routerCart = Router()
const cartManager = new CartManager('src/models/carts.json')
const prodManager = new ProductManager('src/models/products.json')

routerCart.get('/:cid', async (req, res) => {
  try {
    const cart = await cartManager.getCartById(parseInt(req.params.cid))
    res.send(cart)
  } catch {
    res.send("Something wen't wrong, cannot get cart")
  }
})

routerCart.post('/', async (req, res) => {
  try {
    const cart = await cartManager.addCart()
    res.send(cart)
  } catch {
    res.send("Something wen't wrong, cannot create cart")
  }
})

routerCart.post('/:cid/product/:pid', async (req, res) => { 
  const prodQty = 1;
  const productData = await prodManager.getProductsById(parseInt(req.params.pid));
  if (productData) {
      const data = await cartManager.addProductToCart(parseInt(req.params.cid), parseInt(req.params.pid), prodQty)
      res.send(data)
  } else {
      res.send("Something wen't wrong, cannot add product to the cart")
  }

})

routerCart.delete('/:cid',  async (req, res) => {
  try {
    const cart = await cartManager.deleteCart(req.params.cid)
    res.send(cart)
  } catch {
    res.send("Cannot delete the cart")
  }
})

routerCart.delete('/:cid/product/:pid',  async (req, res) => {
  try {
    const cartData = await cartManager.getCartById(parseInt(req.params.cid))
    if (cartData) {
      const data = await cartManager.deleteProductFromCart(parseInt(req.params.cid), parseInt(req.params.pid))
      res.send(data)
    } else {
      res.send("The product cannot be delete")
    }
  } catch {
    res.send("There was an error removing the product from the cart")
  }
})


export default routerCart