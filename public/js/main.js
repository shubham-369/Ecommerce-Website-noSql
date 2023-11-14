"use strict";

const form = document.getElementById('form');

if(form){
    const urlParams = new URLSearchParams(window.location.search);

    const updateID = urlParams.get('updateID');

    form.addEventListener('submit', async(e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const jsondata = {};

        formData.forEach((value, key) => {
            jsondata[key] = value;
        });
        try{                
            const response = await axios.post('/admin/add-product', jsondata);
            console.log('Data saved! ', response.data);
            if(updateID){
                window.location.href = '/admin/admin-product';
            }
            form.reset();
        }
        catch(error){
            console.log('error while saving data', error);
        }
    });
}

const adminList = document.getElementById('admin-list');

if(adminList){
    adminList.addEventListener('click', async(e) => {
        try{      
            if(e.target.classList.contains('delete')){
                const id = e.target.getAttribute('data-id');
                const response = await axios.delete(`/admin/admin-product?deleteID=${id}`);
                console.log('Data deleted', response.data);
    
                e.target.parentElement.parentElement.parentElement.remove();
            }
        }
        catch(error) {
            console.log('error while deleting data', error);
        }
    });
}

const cartBtns = document.getElementsByClassName('cart');
if (cartBtns){
    for (const cartBtn of cartBtns) {
        cartBtn.addEventListener('click', async (e) => {
          e.preventDefault();
      
          const id = e.target.getAttribute('data-id');
          try{
              const response = await axios.post('/shop/cart', { productID: id });
              console.log('product added to cart', response.data);
      
              window.location.href= '/shop/cart';
          }
          catch(error) {
              console.log('error while adding product to cart', error);
          }
        });
      }      
}

const deleteCarts = document.getElementsByClassName('deleteCartItem');
if(deleteCarts){
    for(const deleteCart of deleteCarts){
        deleteCart.addEventListener('click', async(e) => {
            const id = e.target.getAttribute('data-id');
            try{
                const response = await axios.delete(`/shop/deleteCart?id=${id}`);
                console.log('data deleted', response.data);
                e.target.parentElement.parentElement.parentElement.remove();
            }
            catch(error){
                console.log('error while deleting cart item : ', error);
            }
        });
    }

    const order = document.getElementById('order');
    if(order){
        order.addEventListener('click', async(e) => {
            try{
                const response = await axios.get('/shop/buy');
                console.log('Ordered successfully :', response.data);
    
                window.location.href='/shop/orders';
            }
            catch(error) {
                console.log('error while ordering products :', error);
            }
        });
    }

}