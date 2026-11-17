// Julio Ovalle - Bootstrap shopping cart assignment
// Product objects and a simple array-based shopping cart.
const products = [
  { id: 0, name: 'Necro SpellBook', price: 49.99 },
  { id: 1, name: 'Palantir', price: 99.99 },
  { id: 2, name: 'Mandrake Root', price: 14.99 },
  { id: 3, name: 'Tarot Cards', price: 49.99 },
  { id: 4, name: 'Ouija Board', price: 99.99 },
  { id: 5, name: 'Scrying Mirror', price: 14.99 }
];

let cart = [];
const TAX_RATE = 0.0825; // Demo tax rate for this class project.
const money = amount => '$' + amount.toFixed(2);

function showCart() {
  const list = document.getElementById('cartItems');
  list.innerHTML = '';
  let subtotal = 0;
  let itemCount = 0;

  cart.forEach(item => {
    const product = products.find(p => p.id === item.id);
    if (!product) return;
    const total = product.price * item.quantity;
    subtotal += total;
    itemCount += item.quantity;

    const row = document.createElement('div');
    row.className = 'cart-row';
    const title = document.createElement('div');
    title.className = 'cart-name';
    title.textContent = product.name + ' (' + money(product.price) + ' each)';
    const controls = document.createElement('div');
    controls.className = 'cart-controls';
    const qty = document.createElement('input');
    qty.type = 'number';
    qty.min = '1'; qty.max = '99'; qty.value = item.quantity;
    qty.className = 'form-control cart-quantity';
    qty.setAttribute('aria-label', 'Quantity for ' + product.name);
    qty.addEventListener('change', () => {
      const value = Number(qty.value);
      if (!Number.isInteger(value) || value < 1 || value > 99) {
        qty.value = item.quantity;
        return;
      }
      item.quantity = value;
      showCart();
    });
    const price = document.createElement('strong');
    price.textContent = money(total);
    const remove = document.createElement('button');
    remove.type = 'button'; remove.className = 'btn btn-sm btn-outline-danger';
    remove.textContent = 'Remove';
    remove.addEventListener('click', () => {
      cart = cart.filter(entry => entry.id !== item.id);
      showCart();
    });
    controls.append(qty, price, remove);
    row.append(title, controls);
    list.append(row);
  });

  document.getElementById('emptyCart').classList.toggle('d-none', cart.length > 0);
  document.getElementById('cartTotals').classList.toggle('d-none', cart.length === 0);
  document.getElementById('cartCount').textContent = itemCount;
  document.getElementById('navCount').textContent = itemCount;
  document.getElementById('subtotal').textContent = money(subtotal);
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  document.getElementById('salesTax').textContent = money(tax);
  document.getElementById('grandTotal').textContent = money(subtotal + tax);
}

document.querySelectorAll('.buy-button').forEach(button => {
  button.addEventListener('click', () => {
    const id = Number(button.dataset.id);
    const product = products.find(p => p.id === id);
    const qtyInput = document.getElementById('qty' + id);
    const quantity = Number(qtyInput.value);
    const notice = document.getElementById('cartNotice');
    if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      notice.textContent = 'Enter a quantity between 1 and 99.';
      return;
    }
    const existing = cart.find(entry => entry.id === id);
    if (existing && existing.quantity + quantity > 99) {
      notice.textContent = 'Maximum quantity is 99 per item.';
      return;
    }
    if (existing) existing.quantity += quantity;
    else cart.push({ id, quantity });
    notice.textContent = 'Added ' + quantity + ' ' + product.name + ' to your cart.';
    showCart();
    document.getElementById('cart').scrollIntoView({behavior: 'smooth'});
  });
});

document.getElementById('clearCart').addEventListener('click', () => {
  cart = [];
  showCart();
  document.getElementById('cartNotice').textContent = 'Cart cleared.';
});

document.getElementById('checkoutButton').addEventListener('click', () => {
  document.getElementById('cartNotice').textContent = 'This is a school demo. No real orders or payments are processed.';
});
showCart();
