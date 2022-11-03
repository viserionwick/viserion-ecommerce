// Essentials
import { useState } from "react";

// Firebase
import { db } from "../../../../firebase/Config";
import { addDoc, collection, doc, setDoc, updateDoc } from "firebase/firestore";

// Style
import "./Dashboard_Products.scss"

const DASHBOARD_PRODUCTS = () => {
  

  const [formData, setFormData] = useState({
    createdAt: new Date(),
    title: "DESTROYED TURTLENECK SWEATER IN BLACK",
    description: "Destroyed Turtleneck Sweater in black viscose devore rib knit is from the look 4 of the Balenciaga's Winter 22 Collection, 360° Show.",
    materials: "90% viscose, 10% lycra",
    details: ["Viscose devore rib knit", "This item is unisex", "Oversize fit", "High neck", "Long sleeves", "Destroyed allover the fabric", "Made in Italy", "Dry cleaning", "Model is wearing a size 4"],

    images: {
      "#1c1c1e": ["https://firebasestorage.googleapis.com/v0/b/balenciaga-mockup.appspot.com/o/products%2FPzORqlpHCoOZSh3xYFnV%2Fimages%2F%235e5b58%2F1.jpg?alt=media&token=5683edc5-85a6-4cee-8d22-c9d6729f1595"],
      baseImagesColor: "#1c1c1e"
    },
    sizes: {
        "1": {
          status: 1,
          colors: [
            "#1c1c1e"
          ]
        },
        "2": {
          status: 1,
          colors: [
            "#1c1c1e"
          ]
        },
        "3": {
          status: 1,
          colors: [
            "#1c1c1e"
          ]
        },
        "4": {
          status: 0,
          colors: [
            "#1c1c1e"
          ]
        }
    },

    category: "unisex",
    subCategories: ["knitwear"],
    
    maxQuantity: 4,
    baseStatus: 1,
    basePrice: 1950
  });


  

  const handleSubmit = (e) => {
    e.preventDefault();
    const regex = /\s{2,}/g;
    
    const makeUrl = (input) => {
      const regexUrl = /[a-zA-Z]+/g;
      let step = "";
  
      input.match(regexUrl).map(word => {
        step = step + "-" + word.toLowerCase()
      })

      return step.substring(1) +"-"+ Math.floor(Math.random() * 1000000+1);
    }



    const newFormData = {
      createdAt: formData.createdAt,
      title: formData.title.replace(regex, ' ').trim(),
      url: makeUrl(formData.title),
      description: formData.description.replace(regex, ' ').trim(),
      materials: formData.materials,
      details: formData.details,

      images: formData.images,
      sizes: formData.sizes,

      category: formData.category,
      subCategories: formData.subCategories,

      maxQuantity: formData.maxQuantity,
      baseStatus: formData.baseStatus,
      basePrice: formData.basePrice
    }

    
    // Add The Order
    console.log(newFormData);

    addDoc(collection(db, "products"), newFormData)
    .then((docRef) => {
        updateDoc(docRef, {
          productId: docRef.id
        })
    })
  }

  return (
    <div className="dashboard-products">
      <form onSubmit={handleSubmit} className="formS1">

        <div className="fRow fButtons--center">
          <button type='submit' className="p-auth--button buttonS2">ADD PRODUCT</button>
        </div>
      </form>
    </div>
  )
}

export default DASHBOARD_PRODUCTS