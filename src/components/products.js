import React, { useEffect, useState } from "react";



export function Products() {
       //create a state to handle the content of a page, switching between list of products and creating a product
       const [content, setContent] = useState(<ProductList showForm={showForm}/>);

       //create functions that allow us to switch between the two actions
       function showList(){
              setContent(<ProductList showForm={showForm}/>);
       }

       function showForm(product) {
              setContent(<ProductForm product={product} showList={showList}/>);
       }

       return (
              <div className="container my-5">
                     {content}
              </div>
       );
}

//This components are to be used inside the Product component
function ProductList(props) {

       //create a new state(products) for fetching the data from the server
       const [products, setProducts] = useState([]);

       //create a function to read the data from the server using fetch api
       //useEffect enables the function to be executed one time.
       async function fetchProducts() {
              try{
                     const response = await fetch("https://inventory-api-hd6r.onrender.com/products");
                     if(!response.ok) {
                            throw new Error("Unexpected Server Response");
                     }

                     const data = await response.json();
                     setProducts(data);
                     } catch (error) {
                            console.log("Error: ", error);
                     };
              }

              useEffect(()=>{
                     fetchProducts();
              }, []);

              function deleteProduct(id) {
                     fetch('https://inventory-api-hd6r.onrender.com/products/' + id, {
                            method: 'DELETE'
                     })
                            .then((response) => response.json())
                            .then((data) => fetchProducts());
              }

       return(
              <>
              <h2 className="text-center mb-3">List of Products</h2>
              <button onClick={()=> props.showForm({})} type="button" className="btn btn-primary me-2">Create</button>
              <button onClick={()=> fetchProducts()} type="button" className="btn btn-outline-primary me-2">Refresh</button>
              <table className="table">
                     <thead>
                            <tr>
                                   <th>ID</th>
                                   <th>Name</th>
                                   <th>Brand</th>
                                   <th>Category</th>
                                   <th>Price</th>
                                   <th>Created At</th>
                                   <th>Action</th>
                            </tr>
                     </thead>
                     <tbody> 
                            {
                                   products.map((product, index)=> {
                                          return(
                                                 <tr key={index}>
                                                        <td>{product.id}</td>
                                                        <td>{product.name}</td>
                                                        <td>{product.brand}</td>
                                                        <td>{product.category}</td>
                                                        <td>{product.price}$</td>
                                                        <td>{product.createdAt}</td>
                                                        <td style={{width: "10px", whiteSpace: "nowrap"}}>
                                                               <button onClick={()=> props.showForm(product)} type="button" className="btn btn-primary btn-sm me-2">Edit</button>
                                                               <button onClick={()=> deleteProduct(product.id)} type="button" className="btn btn-danger btn-sm ">Delete</button>
                                                        </td>
                                                 </tr>
                                          );
                                   })
                            }
                     </tbody>
              </table>
              </>
       );
}

function ProductForm(props){
       const [errorMessage, setErrorMessage] = useState("");

       function handleSubmit(event) {
              event.preventDefault();

              // read form data
              const formData = new FormData(event.target);

              //convert formDta to an object
              const product = Object.fromEntries(formData.entries());

              //form validation
              if (!product.name || !product.brand || !product.category || !product.price){
                     console.log("Please provide all the required fields");
                     setErrorMessage(
                            <div className="alert alert-warning" role="alert">
                                   Please provide all the required fields
                            </div>
                     )
                     return;
              }

              if (props.product.id) {
                     //update the product
                     fetch("https://inventory-api-hd6r.onrender.com/products/" + props.product.id,{
                            method: "PATCH",
                            headers: {
                                   "content-Type": "application/json",
                            },
                            body: JSON.stringify(product)
                     })
                            .then((response) => {
                                   if (!response.ok){
                                          throw new Error("Network response was not OK");
                                   }
                                   return response.json()
                            })
                            .then((data) => props.showList())
                            .catch((error) => {
                                   console.error("Error:", error);
                            });
              }
              else{
                     //Create a new product 
                     product.createdAt = new Date().toISOString().slice(0, 10);
                     fetch("https://inventory-api-hd6r.onrender.com/products",{
                            method: "POST",
                            headers: {
                                   "content-Type": "application/json",
                            },
                            body: JSON.stringify(product)
                     })
                            .then((response) => {
                                   if (!response.ok){
                                          throw new Error("Network response was not OK");
                                   }
                                   return response.json()
                            })
                            .then((data) => props.showList())
                            .catch((error) => {
                                   console.error("Error:", error);
                            });
              }
       }


       return (
              <>
              <h2 className="text-center mb-3">{props.product.id ? "Edit Product" : "Create New Product"}</h2>

              <div className="row">
                     <div className="col-lg-6 mx-auto">
                            {errorMessage}

                            <form onSubmit={(event) => handleSubmit(event)}>
                                   
                                   {props.product.id && <div className="row mb-3">
                                          <label className="col-sm-4 col-form-label">ID</label>
                                          <div className="col-sm-8">
                                                 <input readOnly  className="form-control-plaintext"
                                                 name="name"
                                                 defaultValue={props.product.id}
                                                 />
                                          </div>
                                   </div>}
                                   
                                   <div className="row mb-3">
                                          <label className="col-sm-4 col-form-label">Name</label>
                                          <div className="col-sm-8">
                                                 <input className="form-control"
                                                 name="name"
                                                 defaultValue={props.product.name}
                                                 />
                                          </div>
                                   </div>
                                   {/* 
                                   {props.product.id && <div className="row mb-3">
                                          <label className="col-sm-4 col-form-label">ID</label>
                                          <div className="col-sm-8">
                                                 <input readOnly  className="form-control-plaintext"
                                                 name="name"
                                                 defaultValue={props.product.id}
                                                 />
                                          </div>
                                   </div>}
                                    */}
                                   <div className="row mb-3">
                                          <label className="col-sm-4 col-form-label">Brand</label>
                                          <div className="col-sm-8">
                                                 <input className="form-control"
                                                 name="brand"
                                                 defaultValue={props.product.brand}
                                                 />
                                          </div>
                                   </div>
                                   
                                   <div className="row mb-3">
                                          <label className="col-sm-4 col-form-label">category</label>
                                          <div className="col-sm-8">
                                                 <select className="form-select"
                                                 name="category"
                                                 defaultValue={props.product.category} >
                                                 <option value="other">Other</option>
                                                 <option value="other">Phones</option>
                                                 <option value="other">Computers</option>
                                                 <option value="other">Accessories</option>
                                                 <option value="other">GPS</option>
                                                 <option value="other">Cameras</option>
                                                 </select>
                                          </div>
                                   </div>
                                   
                                   <div className="row mb-3">
                                          <label className="col-sm-4 col-form-label">Price</label>
                                          <div className="col-sm-8">
                                                 <input className="form-control"
                                                 name="price"
                                                 defaultValue={props.product.price}
                                                 />
                                          </div>
                                   </div>
                                   
                                   <div className="row mb-3">
                                          <label className="col-sm-4 col-form-label">Description</label>
                                          <div className="col-sm-8">
                                                 <textarea className="form-control"
                                                 name="describtion"
                                                 defaultValue={props.product.description}
                                                 />
                                          </div>
                                   </div>
                                   
                                   <div className="row">
                                          <div className="offset-sm-4 col-sm-4 d-grid">
                                                 <button type="submit" className="btn btn-primary btn-sm me-3">
                                                        Save
                                                 </button>
                                          </div>
                                          <div className="col-sm-4 d-grid">
                                                 <button onClick={()=> props.showList()} type="button" className="btn btn-secondary me-2">Cancel</button>
                                          </div>
                                   </div>
                            </form>
                     </div>
              </div>
              </>
       )
}