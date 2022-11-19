// Essentials
import { useState } from "react";

// Style
import "./Panel_AddProduct.scss";


/* 
Title"
Description"
Materials"
Details"

Images
Sizes

Category"
Subcategory"

Max Quantity
Price
*/

const PANEL_ADDPRODUCT = () => {

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        materials: "",
        details: [],

        images: {},
        sizes: {},

        category: "",
        subCategory: [],

        maxQuantity: 0,
        basePrice: 0
    });


    const handleSubmit = (e) => {
        e.preventDefault();
        
    }

    const handleInput = (e) => {
        const name = e.target.name;
        const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;

        // Set Data
        setFormData({ ...formData, [name]: value })

    }



  return (
    <div className="p-addProduct">
        <form onSubmit={handleSubmit} className="formS1">

            <div className="section">
                <div className="fRow">
                    <h2>Information</h2>
                </div>

                <div className="fRow">
                    <div className={`fColumn`}>
                        <label htmlFor="title" className="fInput">
                        <span>Title</span>
                        <input
                            type="text"
                            name='title'
                            id="title"
                            value={formData.title}
                            onChange={handleInput}
                            autoComplete="off"
                            spellCheck="false"
                        />
                        </label>
                    </div>
                </div>

                <div className="fRow">
                    <div className={`fColumn`}>
                        <label htmlFor="description" className="fInput">
                        <span>Description</span>
                        <input
                            type="text"
                            name='description'
                            id="description"
                            value={formData.description}
                            onChange={handleInput}
                            autoComplete="off"
                            spellCheck="false"
                        />
                        </label>
                    </div>
                </div>

                <div className="fRow">
                    <div className={`fColumn`}>
                        <label htmlFor="materials" className="fInput">
                        <span>Materials</span>
                        <input
                            type="text"
                            name='materials'
                            id="materials"
                            value={formData.materials}
                            onChange={handleInput}
                            autoComplete="off"
                            spellCheck="false"
                        />
                        </label>
                    </div>
                </div>

                <div className="fRow">
                    <div className={`fColumn`}>
                        <label htmlFor="details" className="fInput">
                        <span>Details (use "," to saperate)</span>
                        <input
                            type="text"
                            name='details'
                            id="details"
                            value={formData.details}
                            onChange={handleInput}
                            autoComplete="off"
                            spellCheck="false"
                        />
                        </label>
                    </div>
                </div>
            </div>


            <div className="section">
                <div className="fRow">
                    <h2>Category</h2>
                </div>

                <div className="fRow">
                    <div className={`fColumn`}>
                        <label htmlFor="category" className="fInput">
                        <span>Category</span>
                        <input
                            type="text"
                            name='category'
                            id="category"
                            value={formData.category}
                            onChange={handleInput}
                            autoComplete="off"
                            spellCheck="false"
                        />
                        </label>
                    </div>
                </div>

                <div className="fRow">
                    <div className={`fColumn`}>
                        <label htmlFor="subCategory" className="fInput">
                        <span>Sub Category (use "," to saperate)</span>
                        <input
                            type="text"
                            name='subCategory'
                            id="subCategory"
                            value={formData.subCategory}
                            onChange={handleInput}
                            autoComplete="off"
                            spellCheck="false"
                        />
                        </label>
                    </div>
                </div>
            </div>


            <div className="section">
                <div className="fRow">
                    <h2>Purchase</h2>
                </div>

                <div className="fRow">
                    <div className={`fColumn`}>
                        <label htmlFor="maxQuantity" className="fInput">
                        <span>Max Quantity</span>
                        <input
                            type="number"
                            name='maxQuantity'
                            id="maxQuantity"
                            value={formData.maxQuantity}
                            onChange={handleInput}
                            autoComplete="off"
                            spellCheck="false"
                        />
                        </label>
                    </div>
                </div>

                <div className="fRow">
                    <div className={`fColumn`}>
                        <label htmlFor="basePrice" className="fInput">
                        <span>Price ($)</span>
                        <input
                            type="number"
                            name='basePrice'
                            id="basePrice"
                            value={formData.basePrice}
                            onChange={handleInput}
                            autoComplete="off"
                            spellCheck="false"
                        />
                        </label>
                    </div>
                </div>
            </div>


            <div className="section">
                <div className="fRow">
                    <h2>Visuals</h2>
                </div>

                <div className="fRow">
                    <div className={`fColumn`}>
                        <label htmlFor="color" className="fInput">
                            <span>Max Quantity</span>
                            <input
                                type="number"
                                name='color'
                                id="color"
                                autoComplete="off"
                                spellCheck="false"
                            />
                        </label>
                    </div>                    
                    <div className={`fColumn`}>
                        <label htmlFor="maxQuantity" className="fInput">
                            <span>Max Quantity</span>
                            <input
                                type="number"
                                name='maxQuantity'
                                id="maxQuantity"
                                value={formData.maxQuantity}
                                onChange={handleInput}
                                autoComplete="off"
                                spellCheck="false"
                            />
                        </label>
                    </div>
                </div>

                <div className="fRow">
                    <div className={`fColumn`}>
                        <label htmlFor="basePrice" className="fInput">
                        <span>Price ($)</span>
                        <input
                            type="number"
                            name='basePrice'
                            id="basePrice"
                            value={formData.basePrice}
                            onChange={handleInput}
                            autoComplete="off"
                            spellCheck="false"
                        />
                        </label>
                    </div>
                </div>
            </div>
        </form>
    </div>
  )
}

export default PANEL_ADDPRODUCT