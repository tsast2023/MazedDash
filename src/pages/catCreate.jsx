import React, { useContext, useEffect, useState } from "react";
import Choices from "choices.js";
import "choices.js/public/assets/styles/choices.css";
import { GlobalState } from "../GlobalState";
import { useTranslation } from "react-i18next";
import axios from "axios";
import Cookies from 'js-cookie'
import { toast } from 'react-toastify';

const CatCreate = () => {
  const token = Cookies.get('token')
  const [isEnabled, setIsEnabled] = useState(false);
  const [category, setcategory] = useState({nomCategorieArabe:"" ,nomCategorieEnglish:"",nomCategorie:"" ,icon:""});
  const [inputs, setInputs] = useState([]);
  const state = useContext(GlobalState);
  const { t, i18n } = useTranslation();

  const goBack = () => {
    window.history.back(); // Simulate a browser back button
  };

  const notify = () => {
    toast.success(t("Action créée avec succès"));
  };


  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Assuming only one file is uploaded
    if (file) {
        setcategory((prevState) => ({ ...prevState, icon: file })); // Set file directly
    }
};
  

const submitCat = async (e) => {
  e.preventDefault(); // Prevent default form submission
  console.log(category); // Log the category object for debugging

  // Create FormData object
  const formData = new FormData();
  formData.append("nomCategorieArabe", category.nomCategorieArabe);
  formData.append("nomCategorieEnglish", category.nomCategorieEnglish);
  formData.append("nomCategorie", category.nomCategorie);
  
  // Append the icon file directly
  if (category.icon) {
      formData.append("icon", category.icon); // This should be the file from input
  } else {
      console.error("No icon file selected"); // Handle case when no file is selected
  }

  try {
      const res = await axios.post(
          "http://localhost:8081/api/categories/addCategorie",
          formData, // Send FormData
          {
              headers: {
                  "Content-Type": "multipart/form-data", // Axios sets this automatically
                  Authorization: `Bearer ${token}` // Set the authorization header
              }
          }
      );

      console.log(res.data); // Log the response data
  } catch (error) {
      console.error("Error creating category:", error.response?.data || error.message);
  }
};

  return (
    <div className="content-container">
      <form onSubmit={submitCat} className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h2 className="card-title">{t("Créer une catégorie")}</h2>
         
        </div>
        <div className="card-body">
          <div className="row">
            <div  className="col-md-12">
              <div className="form-group">
                <label htmlFor="basicInput">{t("Libellé")}</label>
                <input
                  onChange={(e) => setcategory({...category , nomCategorie:e.target.value})}
                    
                  type="text"
                  className="form-control"
                  id="basicInput"
                />
              </div>
              <div className="form-group">
                <label htmlFor="basicInput">{t("Libellé(englais)")}</label>
                <input
                  onChange={(e) => setcategory({...category , nomCategorieEnglish:e.target.value})}
                    
                  type="text"
                  className="form-control"
                  id="basicInput"
                />
              </div>
              <div className="form-group">
                <label htmlFor="basicInput">{t("Libellé(arabe)")}</label>
                <input
                  onChange={(e) => setcategory({...category , nomCategorieArabe:e.target.value})}
                    
                  type="text"
                  className="form-control"
                  id="basicInput"
                />
              </div>
              <div className="form-group">
                <label htmlFor="basicInput">{t("Icon")}</label>
                <input
                  onChange={handleImageChange}
                  type="file"
                  className="form-control"
                  id="basicInput"
                  placeholder="Enter text"
                />
              </div>
            
            </div>
          </div>
        </div>
        <div className="card-footer d-flex justify-content-end">
          <button type="button" className="btn btn-secondary me-3" onClick={goBack}>
            {t("Annuler")}
          </button>
          <button type="submit" className="btn btn-primary" onClick={notify}>
            {t("Enregistrer")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CatCreate;
