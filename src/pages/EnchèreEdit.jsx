import React, { useState , useContext , useEffect } from 'react';
import { useTranslation } from "react-i18next";
import Swal from 'sweetalert2';
import '../css/EnchèreCreation.css';
import { GlobalState } from '../GlobalState';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Cookies from 'js-cookie';
function EnchèreEdit(props) {
  const token = Cookies.get('token');
  const state = useContext(GlobalState);
  const categories = state.Categories;
  const { t, i18n } = useTranslation();
  console.log(props)
  const [steps, setSteps] = useState(0);
  const fileInputRef = React.createRef();
  console.log(props.selectedItem)
  const [data, setData] = useState({
      ville:props.selectedItem.ville,
      ref: props.selectedItem.ref,
      prixMazedOnline: props.selectedItem.prixMazedOnline,
      nomProduit: props.selectedItem.nomProduit,
      avocat: props.selectedItem.avocat,
      notaire:props.selectedItem.notaire,
      galerie: [],
      description:props.selectedItem.description,
      categoryName: props.selectedItem.categoryName , // Default value if exists
      // New fields
      villeArabe:props.selectedItem.villeArabe,
      descriptionAr: props.selectedItem.descriptionAr,
      descriptionEn:props.selectedItem.descriptionEn,
      nomProduitAr: props.selectedItem.nomProduitAr,
      nomProduitEn: props.selectedItem.nomProduitEn,
      critére: props.selectedItem.critére, // Main criteria
      critéreAr: props.selectedItem.critéreAr, // Arabic criteria
      critéreEn: props.selectedItem.critéreEn, // English criteria
      coutClic: props.selectedItem.coutClic,
      coutParticipation: props.selectedItem.coutParticipation,
      valeurMajoration: props.selectedItem.valeurMajoration,
      facilité: props.selectedItem.facilité,
      valeurFacilité: props.selectedItem.valeurFacilité,
      datedeclenchement: props.selectedItem.datedeclenchement,
      datefermeture: props.selectedItem.datefermeture,
      unité: props.selectedItem.unité,
      nombreParticipantAttendu: props.selectedItem.nombreParticipantAttendu,
      nombreMois: props.selectedItem.nombreMois,
      extensionTime: props.selectedItem.extensionTime,
      contractEnchereid: "",
      contractEnchereEnid:"",
      contractEnchereArid:"",
      autoFinancement: props.selectedItem.autoFinancement
    
  });



  const [showEmail2, setShowEmail2] = useState(props.selectedItem.facilité);
  const [showFac, setShowFac] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [critereInputs, setCritereInputs] = useState([{ label: "", value: "" }]); // Main criteria
  const [critereInputsAr, setCritereInputsAr] = useState([{ label: "", value: "" }]); // Arabic criteria
  const [critereInputsEn, setCritereInputsEn] = useState([{ label: "", value: "" }]); // English criteria
  const [dateScheduled, setDateScheduled] = useState(Date.now());
  
  const confirmAction = (actionType) => {
      Swal.fire({
          title: t("Êtes-vous sûr?"),
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: t("Oui"),
          cancelButtonText: t("Non, annuler!"),
      }).then((result) => {
          if (result.isConfirmed) {
              Swal.fire(t("Terminé"), t("L'élément a été ajoutée"), "secondary");
          }
      });
  };

  const handleGalerieChange = (event) => {
      const files = Array.from(event.target.files);
      const filePromises = files.map(file => {
          return new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                  resolve(reader.result);
              };
              reader.onerror = reject;
              reader.readAsDataURL(file);
          });
      });

      Promise.all(filePromises)
          .then(base64Files => {
              setData(prevData => ({
                  ...prevData,
                  galerie: base64Files
              }));
          })
          .catch(error => {
              console.error("Error converting files to base64:", error);
          });
  };

  const handleFileChange = (e) => {
    const { id, files } = e.target;  // Destructure id and files
    const file = files[0];

    // Update state based on input id
    setData((prevState) => ({
      ...prevState,
      [id]: file, // Use the id of the input as the key in state
    }));
    console.log(data)
  };

  const handleCheckbox2Change = () => {
      setShowEmail2(!showEmail2);
      setShowFac(!showFac);
      setData({ ...data, facilité: showFac });
  };

  useEffect(() => {
      if (categories && categories.length > 0) {
          setData(prevData => ({
              ...prevData,
              categoryName: categories[0].nomCategorie // Set first category as default
          }));
      }
  }, [categories]);

  const updateBid = async (id) => {
      try {
         
        const formData = new FormData();

    // Append regular data fields
    formData.append('ville', data.ville);
    formData.append('ref', data.ref);
    formData.append('prixMazedOnline', data.prixMazedOnline);
    formData.append('nomProduit', data.nomProduit);
    formData.append('avocat', data.avocat);
    formData.append('notaire', data.notaire);
    formData.append('description', data.description);
    formData.append('categoryName', data.categoryName);
    formData.append('villeArabe', data.villeArabe);
    formData.append('descriptionAr', data.descriptionAr);
    formData.append('descriptionEn', data.descriptionEn);
    formData.append('nomProduitAr', data.nomProduitAr);
    formData.append('nomProduitEn', data.nomProduitEn);
    formData.append('coutClic', data.coutClic);
    formData.append('coutParticipation', data.coutParticipation);
    console.log('valeur de majoration :' , valeurMajoration)
    const valeurMajorationArray = String(valeurMajoration).split(',').map(Number);
        valeurMajorationArray.forEach(value => {
            formData.append('valeurMajoration', value);
        });
    formData.append('facilité', data.facilité);
    formData.append('valeurFacilité', data.valeurFacilité);
    formData.append('datedeclenchement', data.datedeclenchement);
    formData.append('datefermeture', data.datefermeture);
    formData.append('unité', data.unité);
    formData.append('nombreParticipantAttendu', data.nombreParticipantAttendu);
    formData.append('nombreMois', data.nombreMois);
    formData.append('extensionTime', data.extensionTime);
    formData.append('autoFinancement', data.autoFinancement);

    // Append criteria maps
    if (data.critére) {
      Object.keys(data.critére).forEach(key => {
        formData.append(`critere[${key}]`, data.critére[key]);
      });
    }
    if (data.critéreAr) {
      Object.keys(data.critéreAr).forEach(key => {
        formData.append(`critereAr[${key}]`, data.critéreAr[key]);
      });
    }
    if (data.critéreEn) {
      Object.keys(data.critéreEn).forEach(key => {
        formData.append(`critereEn[${key}]`, data.critéreEn[key]);
      });
    }

    // Append gallery files (if any)
    if (data.galerie && data.galerie.length > 0) {
      data.galerie.forEach((file, index) => {
        formData.append(`galerie`, file);
      });
    }

    // Append contract files
    if (data.contractEnchereid) {
      formData.append('ContractEnchere', data.contractEnchereid);
    }
    if (data.contractEnchereArid) {
      formData.append('contractEnchereArid', data.contractEnchereArid);
    }
    if (data.contractEnchereEnid) {
      formData.append('contractEnchereEnid', data.contractEnchereEnid);
    }

          const res = await axios.put(`http://localhost:8081/api/bid/${id}`, formData, {
              headers: { Authorization: `Bearer ${token}` },
              'Content-Type': 'multipart/form-data',
          });
          console.log(res.data);
          
      } catch (error) {
          console.error("Error adding bid:", error);
      }
  };

//   const addBidConfig = async () => {
//       try {
//           const formData = new FormData();
//           Object.keys(data).forEach(key => {
//               formData.append(key, data[key]);
//           });

//           // Add IdEnchere to FormData
//           formData.append('IdEnchere', localStorage.getItem('idenchere'));

//           // Add ContractEnchere file to FormData
//           if (data.ContractEnchere) {
//               formData.append('ContractEnchere', data.ContractEnchere);
//           } else {
//               console.error('ContractEnchere file is missing.');
//               return;
//           }

//           // Send the request with FormData
//           const res = await axios.post(
//               "http://localhost:8081/api/bid/publishBidNow",
//               formData,
//               {
//                   headers: {
//                       Authorization: `Bearer ${token}`,
//                       'Content-Type': 'multipart/form-data',
//                   },
//               }
//           );

//           console.log(res);
//           localStorage.removeItem('idenchere');
//       } catch (error) {
//           console.log(error);
//       }
//   };

//   const addScheduledbid = async (e) => {
//       e.preventDefault();
//       try {
//           const formData = new FormData();
//           Object.keys(data).forEach(key => {
//               formData.append(key, data[key]);
//           });

//           // Add IdEnchere and publicationDate to FormData
//           formData.append('IdEnchere', localStorage.getItem('idenchere'));
//           formData.append('publicationDate', dateScheduled);

//           // Send the request with FormData
//           const res = await axios.post(
//               "http://localhost:8081/api/bid/scheduleBidPublication",
//               formData,
//               {
//                   headers: {
//                       Authorization: `Bearer ${token}`,
//                       'Content-Type': 'multipart/form-data',
//                   },
//               }
//           );

//           console.log(res.data);
//       } catch (error) {
//           console.error("Error scheduling bid:", error);
//       }
//   };

//   const handleCritereChange = (index, field, value, language) => {
//       if (language === 'ar') {
//           const newCritereInputsAr = [...critereInputsAr];
//           newCritereInputsAr[index][field] = value;
//           setCritereInputsAr(newCritereInputsAr);
//       } else if (language === 'en') {
//           const newCritereInputsEn = [...critereInputsEn];
//           newCritereInputsEn[index][field] = value;
//           setCritereInputsEn(newCritereInputsEn);
//       } else {
//           const newCritereInputs = [...critereInputs];
//           newCritereInputs[index][field] = value;
//           setCritereInputs(newCritereInputs);
//       }
//   };

//   const addCritereInput = (language) => {
//       if (language === 'ar') {
//           setCritereInputsAr([...critereInputsAr, { label: "", value: "" }]);
//       } else if (language === 'en') {
//           setCritereInputsEn([...critereInputsEn, { label: "", value: "" }]);
//       } else {
//           setCritereInputs([...critereInputs, { label: "", value: "" }]);
//       }
//   };

  // State for valeurMajoration
  const [valeurMajoration, setValeurMajoration] = useState(props.selectedItem.valeurMajoration);
  const [newValue, setNewValue] = useState('');

  const handleAddValue = () => {
      if (newValue) {
          setValeurMajoration([...valeurMajoration, parseInt(newValue)]);
          setNewValue(''); // Clear input field after adding
      }
  };

  // Handler for input change
  const handleInputChange = (e) => {
      setNewValue(e.target.value);
  };

  const handleDeleteValue = (index) => {
      setValeurMajoration(valeurMajoration.filter((_, i) => i !== index));
  };


    const demandeEnchereEdit = async()=>{
        try {
            const res = await axios.put(`http://localhost:8081/api/demandes/createModificationEnchereRequest` , {});
            console.log(res.data)
        } catch (error) {
            console.log(error)
        }
    }
  return (
      <>
          {steps === 0 && (
              <div className='content-container'>
                  <div className="page-heading">
                      <section id="basic-vertical-layouts">
                          <div className="match-height">
                              <div>
                                  <div className="card">
                                      <div className="card-header">
                                          <h2 className="new-price">{t("edit De Enchere")}</h2>
                                      </div>
                                      <div className="card-content">
                                          <div className="card-body">
                                              <form className="form form-vertical">
                                                  <div className="form-body">
                                                      <div className="row">
                                                          <div className="col-12">
                                                              <div className="form-group">
                                                                  <label htmlFor="ref">{t("Reference")}</label>
                                                                  <input
                                                                      onChange={e => setData({ ...data, ref: e.target.value })}
                                                                      value={data.ref}
                                                                      type="text" 
                                                                      id="ref" 
                                                                      className="form-control" 
                                                                      placeholder={t("Reference")} 
                                                                      required 
                                                                  />
                                                              </div>
                                                          </div>
                                                          <div className="col-12">
                                                              <div className="form-group">
                                                                  <label htmlFor="prixMazedOnline">{t("Prix Mazed Online")}</label>
                                                                  <input
                                                                      onChange={e => setData({ ...data, prixMazedOnline: e.target.value })}
                                                                      value={data.prixMazedOnline}
                                                                      type="number" 
                                                                      id="prixMazedOnline" 
                                                                      className="form-control" 
                                                                      placeholder={t("prix mazad")} 
                                                                      required 
                                                                  />
                                                              </div>
                                                          </div>
                                                          <div className="col-12">
                                                              <div className="form-group">
                                                                  <label htmlFor="notaire">{t("Notaire")}</label>
                                                                  <input
                                                                      onChange={e => setData({ ...data, notaire: e.target.value })}
                                                                      value={data.notaire}
                                                                      type="text" 
                                                                      id="notaire" 
                                                                      className="form-control" 
                                                                      placeholder={t("Notaire")} 
                                                                      required 
                                                                  />
                                                              </div>
                                                          </div>
                                                          <div className="col-12">
                                                              <div className="form-group">
                                                                  <label htmlFor="avocat">{t("Avocat")}</label>
                                                                  <input
                                                                      onChange={e => setData({ ...data, avocat: e.target.value })}
                                                                      value={data.avocat}
                                                                      type="text" 
                                                                      id="avocat" 
                                                                      className="form-control" 
                                                                      placeholder={t("Avocat")} 
                                                                      required 
                                                                  />
                                                              </div>
                                                          </div>
                                                          <div className="col-12">
                                                              <label>{t("categorie")}</label>
                                                              <fieldset className="form-group">
                                                                  <select 
                                                                      onChange={e => setData({ ...data, categoryName: e.target.value })} 
                                                                      value={data.categoryName}
                                                                      className="form-select" 
                                                                      required
                                                                  >
                                                                      {categories && categories.map((item, index) => (
                                                                          <option key={index} value={item.nomCategorie}>{item.nomCategorie}</option>
                                                                      ))}
                                                                  </select>
                                                              </fieldset>
                                                          </div>
                                                          <div className="col-12">
                                                              <label>{t("Produit")}</label>
                                                              <div className="form-group">
                                                                  <input
                                                                      onChange={e => setData({ ...data, nomProduit: e.target.value })}
                                                                      value={data.nomProduit}
                                                                      type="text" 
                                                                      id="nomProduit" 
                                                                      className="form-control" 
                                                                      placeholder={t("Produits")} 
                                                                      required 
                                                                  />
                                                              </div>
                                                          </div>
                                                          <div className="col-12">
                                                              <label>{t("description")}</label>
                                                              <div className="form-group">
                                                                  <textarea
                                                                      onChange={e => setData({ ...data, description: e.target.value })}
                                                                      value={data.description}
                                                                      id="description" 
                                                                      className="form-control" 
                                                                      placeholder={t("description")} 
                                                                      required 
                                                                  />
                                                              </div>
                                                          </div>
                                                          <div className="col-12">
                                                              <label>{t("galerie")}</label>
                                                              <div className="form-group">
                                                                  <input 
                                                                      onChange={handleGalerieChange} 
                                                                      type="file" 
                                                                      multiple 
                                                                      id="galerie" 
                                                                      className="form-control" 
                                                                      required 
                                                                  />
                                                              </div>
                                                          </div>
                                                          <div className="col-12">
                                                              <label>{t("Ville")}</label>
                                                              <fieldset className="form-group">
                                                                  <select 
                                                                      onChange={e => setData({ ...data, ville: e.target.value })} 
                                                                      value={data.ville}
                                                                      className="form-select" 
                                                                      required
                                                                  >
                                                                      <option>{t("Sousse")}</option>
                                                                      <option>{t("Gafsa")}</option>
                                                                      <option>{t("Tunis")}</option>
                                                                      <option>{t("Ariana")}</option>
                                                                      <option>{t("Béja")}</option>
                                                                      <option>{t("Ben Arous")}</option>
                                                                      <option>{t("Bizerte")}</option>
                                                                      <option>{t("Gabes")}</option>
                                                                      <option>{t("Jendouba")}</option>
                                                                      <option>{t("Kairouan")}</option>
                                                                      <option>{t("Kasserine")}</option>
                                                                      <option>{t("Kebili")}</option>
                                                                      <option>{t("La Manouba")}</option>
                                                                      <option>{t("Le Kef")}</option>
                                                                      <option>{t("Mahdia")}</option>
                                                                      <option>{t("Médenine")}</option>
                                                                      <option>{t("Monastir")}</option>
                                                                      <option>{t("Nabeul")}</option>
                                                                      <option>{t("Sfax")}</option>
                                                                      <option>{t("Sidi Bouzid")}</option>
                                                                      <option>{t("Siliana")}</option>
                                                                      <option>{t("Tataouine")}</option>
                                                                      <option>{t("Tozeur")}</option>
                                                                      <option>{t("Zaghouan")}</option>
                                                                  </select>
                                                              </fieldset>
                                                          </div>

                                                          {/* New Input Fields for Additional Attributes */}
                                                          <div className="col-12">
                                                              <div className="form-group">
                                                                  <label htmlFor="villeArabe">{t("Ville Arabe")}</label>
                                                                  <input
                                                                      onChange={e => setData({ ...data, villeArabe: e.target.value })}
                                                                      value={data.villeArabe}
                                                                      type="text"
                                                                      id="villeArabe"
                                                                      className="form-control"
                                                                      placeholder={t("Ville Arabe")}
                                                                  />
                                                              </div>
                                                          </div>
                                                          <div className="col-12">
                                                              <div className="form-group">
                                                                  <label htmlFor="descriptionAr">{t("Description Arabe")}</label>
                                                                  <textarea
                                                                      onChange={e => setData({ ...data, descriptionAr: e.target.value })}
                                                                      value={data.descriptionAr}
                                                                      id="descriptionAr"
                                                                      className="form-control"
                                                                      placeholder={t("Description Arabe")}
                                                                  />
                                                              </div>
                                                          </div>
                                                          <div className="col-12">
                                                              <div className="form-group">
                                                                  <label htmlFor="descriptionEn">{t("Description Anglaise")}</label>
                                                                  <textarea
                                                                      onChange={e => setData({ ...data, descriptionEn: e.target.value })}
                                                                      value={data.descriptionEn}
                                                                      id="descriptionEn"
                                                                      className="form-control"
                                                                      placeholder={t("Description Anglaise")}
                                                                  />
                                                              </div>
                                                          </div>
                                                          <div className="col-12">
                                                              <div className="form-group">
                                                                  <label htmlFor="nomProduitAr">{t("Produit Arabe")}</label>
                                                                  <input
                                                                      onChange={e => setData({ ...data, nomProduitAr: e.target.value })}
                                                                      value={data.nomProduitAr}
                                                                      type="text"
                                                                      id="nomProduitAr"
                                                                      className="form-control"
                                                                      placeholder={t("Produit Arabe")}
                                                                  />
                                                              </div>
                                                          </div>
                                                          <div className="col-12">
                                                              <div className="form-group">
                                                                  <label htmlFor="nomProduitEn">{t("Produit Anglais")}</label>
                                                                  <input
                                                                      onChange={e => setData({ ...data, nomProduitEn: e.target.value })}
                                                                      value={data.nomProduitEn}                                                                      type="text"
                                                                      id="nomProduitEn"
                                                                      className="form-control"
                                                                      placeholder={t("Produit Anglais")}
                                                                  />
                                                              </div>
                                                          </div>
                                                          
                                                          {/* Inputs for Main Criteria */}
                                                          {/* <div className="col-12">
                                                              <h5>{t("Critères")}</h5>
                                                              {critereInputs.map((critere, index) => (
                                                                  <div key={index} className="form-group">
                                                                      <input
                                                                          type="text"
                                                                          className="form-control"
                                                                          placeholder={t("Label")}
                                                                          value={critere.label}
                                                                          onChange={(e) => handleCritereChange(index, "label", e.target.value, 'fr')}
                                                                          
                                                                      />
                                                                      <input
                                                                          type="text"
                                                                          className="form-control"
                                                                          placeholder={t("Valeur")}
                                                                          value={critere.value}
                                                                          onChange={(e) => handleCritereChange(index, "value", e.target.value, 'fr')}
                                                                      />
                                                                  </div>
                                                              ))}
                                                              <button type="button" className="btn btn-secondary" onClick={() => addCritereInput('fr')}>
                                                                  {t("Ajouter un critère")}
                                                              </button>
                                                          </div> */}

                                                          {/* Inputs for Arabic Criteria */}
                                                          {/* <div className="col-12">
                                                              <h5>{t("Critères Arabe")}</h5>
                                                              {critereInputsAr.map((critere, index) => (
                                                                  <div key={index} className="form-group">
                                                                      <input
                                                                          type="text"
                                                                          className="form-control"
                                                                          placeholder={t("Label Arabe")}
                                                                          value={critere.label}
                                                                          onChange={(e) => handleCritereChange(index, "label", e.target.value, 'ar')}
                                                                      />
                                                                      <input
                                                                          type="text"
                                                                          className="form-control"
                                                                          placeholder={t("Valeur Arabe")}
                                                                          value={critere.value}
                                                                          onChange={(e) => handleCritereChange(index, "value", e.target.value, 'ar')}
                                                                      />
                                                                  </div>
                                                              ))}
                                                              <button type="button" className="btn btn-secondary" onClick={() => addCritereInput('ar')}>
                                                                  {t("Ajouter un critère en Arabe")}
                                                              </button>
                                                          </div> */}

                                                          {/* Inputs for English Criteria */}
                                                          {/* <div className="col-12">
                                                              <h5>{t("Critères Anglais")}</h5>
                                                              {critereInputsEn.map((critere, index) => (
                                                                  <div key={index} className="form-group">
                                                                      <input
                                                                          type="text"
                                                                          className="form-control"
                                                                          placeholder={t("Label Anglais")}
                                                                          value={critere.label}
                                                                          onChange={(e) => handleCritereChange(index, "label", e.target.value, 'en')}
                                                                      />
                                                                      <input
                                                                          type="text"
                                                                          className="form-control"
                                                                          placeholder={t("Valeur Anglais")}
                                                                          value={critere.value}
                                                                          onChange={(e) => handleCritereChange(index, "value", e.target.value, 'en')}
                                                                      />
                                                                  </div>
                                                              ))}
                                                              <button type="button" className="btn btn-secondary" onClick={() => addCritereInput('en')}>
                                                                  {t("Ajouter un critère en Anglais")}
                                                              </button>
                                                          </div> */}

                                                          <br />
                                                          <div className="col-12 d-flex justify-content-end">
                                                              <button type="reset" className="btn btn-secondary me-1 mb-1">
                                                                  {t("Annuler")}
                                                              </button>
                                                              <a onClick={()=>setSteps(steps+1)} className="btn btn-primary me-1 mb-1" style={{ color: 'white' }}>{t("Suivant")}</a>
                                                          </div>
                                                      </div>
                                                  </div>
                                              </form>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </section>
                  </div>
              </div>
          )}

          {steps === 1 && (
              <div className="content-container">
                  <div id="main">
                      <header className="mb-3">
                          <a href="#" className="burger-btn d-block d-xl-none">
                              <i className="bi bi-justify fs-3" />
                          </a>
                      </header>
                      <div className="page-heading">
                          <section id="basic-vertical-layouts">
                              <div className="match-height">
                                  <div>
                                      <div className="card">
                                          <div className="card-header">
                                              <h2 className="new-price" id="myModalLabel33">
                                                  {t("Configuration De L'enchere")}
                                              </h2>
                                          </div>
                                          <div className="card-content">
                                              <div className="card-body">
                                                  <form className="form form-vertical">
                                                      <div className="form-body">
                                                          <div className="row">
                                                              <div className="col-12">
                                                                  <div className="form-group">
                                                                      <label htmlFor="participation-cost">{t("Cout Du Participation")}</label>
                                                                      <input
                                                                          onChange={e => setData({ ...data, coutParticipation: e.target.value })}
                                                                          value={data.coutParticipation}
                                                                          type="number"
                                                                          id="participation-cost"
                                                                          className="form-control"
                                                                          placeholder={t("Ecrire Ici")}
                                                                          required
                                                                      />
                                                                  </div>
                                                              </div>
                                                              <div className="col-12">
                                                                  <div className="form-group">
                                                                      <label htmlFor="click-cost">{t("Cout Du Clic")}</label>
                                                                      <input
                                                                          onChange={e => setData({ ...data, coutClic: e.target.value })}
                                                                          value={data.coutClic}
                                                                          type="number"
                                                                          id="click-cost"
                                                                          className="form-control"
                                                                          placeholder={t("Ecrire Ici")}
                                                                          required
                                                                      />
                                                                  </div>
                                                              </div>
                                                              <div className="col-12">
                                                                  <div className="form-group">
                                                                      <label htmlFor="extension-time">{t("Extension Time")}</label>
                                                                      <input
                                                                          onChange={e => setData({ ...data, extensionTime: e.target.value })}
                                                                          value={data.extensionTime}
                                                                          type="number"
                                                                          id="extension-time"
                                                                          className="form-control"
                                                                          placeholder={t("Ecrire Ici")}
                                                                          required
                                                                      />
                                                                  </div>
                                                              </div>
                                                              <div className="col-12">
                                                                  <div className="form-group">
                                                                      <label htmlFor="auto-financement">{t("Auto Financement")}</label>
                                                                      <input
                                                                          onChange={e => setData({ ...data, autoFinancement: e.target.value })}
                                                                          value={data.autoFinancement}
                                                                          type="number"
                                                                          id="auto-financement"
                                                                          className="form-control"
                                                                          placeholder={t("Ecrire Ici")}
                                                                          required
                                                                      />
                                                                  </div>
                                                              </div>
                                                              <div className="col-12">
        <div className="form-group">
          <label htmlFor="contractEnchere">
            {t("Contrat")}
          </label>
          <input
            onChange={handleFileChange}
            type="file"
            id="contractEnchere" // Unique id for each input
            className="form-control"
            placeholder={t("Ecrire Ici")}
            required
          />
        </div>
      </div>
      <div className="col-12">
        <div className="form-group">
          <label htmlFor="contractEnchereAr">
            {t("Contrat (Arabe)")}
          </label>
          <input
            onChange={handleFileChange}
            type="file"
            id="contractEnchereAr" // Unique id for Arabic contract
            className="form-control"
            placeholder={t("Ecrire Ici")}
            required
          />
        </div>
      </div>
      <div className="col-12">
        <div className="form-group">
          <label htmlFor="contractEnchereEn">
            {t("Contrat (Anglais)")} 
          </label>
          <input
            onChange={handleFileChange}
            type="file"
            id="contractEnchereEn" // Unique id for English contract
            className="form-control"
            placeholder={t("Ecrire Ici")}
            required
          />
        </div>
      </div>
                                                              <div className='col-12'>
                                                                  <label htmlFor="valeur-majoration">{t("Valeur de majoration")}</label><br />
                                                                  <input
                                                                      type="number"
                                                                      value={newValue}
                                                                      onChange={handleInputChange}
                                                                      placeholder="Add valeurMajoration"
                                                                  />
                                                                  <button className="btn btn-primary ms-1" type="button" onClick={handleAddValue}>Add</button>
                                                                  {/* Display the list */}
                                                                  <ul>
                                                                      {valeurMajoration.map((value, index) => (
                                                                          <li key={index}>
                                                                              {value}
                                                                              <button className="btn btn-secondary ms-3" type="button" onClick={() => handleDeleteValue(index)}>
                                                                                  X
                                                                              </button>
                                                                          </li>
                                                                      ))}
                                                                  </ul>
                                                              </div>
                                                              <div className="row">
                                                                  <div className="col-12 checkbox">
                                                                      <input
                                                                          type="checkbox"
                                                                          id="checkbox2"
                                                                          className="col-6 form-check-input"
                                                                          checked={showEmail2}
                                                                          onChange={handleCheckbox2Change}
                                                                      />
                                                                      <span>Facilité</span>
                                                                  </div>
                                                                  {showEmail2 && (
                                                                      <div className="col-6">
                                                                          <input
                                                                              onChange={e => setData({ ...data, valeurFacilité: e.target.value })}
                                                                              value={data.valeurFacilité}
                                                                              type="number"
                                                                              id="email-id-vertical2"
                                                                              className="col-6 form-control"
                                                                              placeholder="Ecrire Ici"
                                                                              required
                                                                          />
                                                                      </div>
                                                                  )}
                                                                  {showEmail2 && (
                                                                      <fieldset
                                                                          style={{ padding: "0px", margin: "0px" }}
                                                                          id="fac"
                                                                          className="col-6 form-group"
                                                                      >
                                                                          <select
                                                                              onChange={e => setData({ ...data, unité: e.target.value })}
                                                                              value={data.unité}
                                                                              className="form-select"
                                                                              id="basicSelect"
                                                                              required
                                                                          >
                                                                              <option value={"MOIS"}>Mois</option>
                                                                              <option value={"ANNEE"}>L'année</option>
                                                                          </select>
                                                                      </fieldset>
                                                                  )}
                                                              </div>
                                                              <div className="col-12">
                                                                  <label htmlFor="expected-participants">{t("Nb attendu des participants")}</label>
                                                                  <div className="form-group">
                                                                      <input
                                                                          onChange={e => setData({ ...data, nombreParticipantAttendu: e.target.value })}
                                                                          value={data.nombreParticipantAttendu}
                                                                          type="number"
                                                                          id="expected-participants"
                                                                          className="form-control"
                                                                          placeholder={t("Écrivez ici")}
                                                                          maxLength={25}
                                                                          required
                                                                      />
                                                                  </div>
                                                                  <label htmlFor="launch-date">{t("Date de Lancement")}</label>
                                                                  <div className="form-group">
                                                                      <input
                                                                          onChange={e => setData({ ...data, datedeclenchement: e.target.value })}
                                                                          value={data.datedeclenchement}
                                                                          type="datetime-local"
                                                                          id="launch-date"
                                                                          className="form-control"
                                                                          placeholder={t("Écrivez ici")}
                                                                          required
                                                                      />
                                                                  </div>
                                                                  <label htmlFor="closing-date">{t("Date de Fermeture")}</label>
                                                                  <div className="form-group">
                                                                      <input
                                                                          onChange={e => setData({ ...data, datefermeture: e.target.value })}
                                                                          value={data.datefermeture}
                                                                          type="datetime-local"
                                                                          id="closing-date"
                                                                          className="form-control"
                                                                          placeholder={t("Écrivez ici")}
                                                                          required
                                                                      />
                                                                  </div>
                                                              </div>
                                                          </div>
                                                      </div>
                                                  </form>
                                              </div>
                                              {/* <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                                                  <Modal.Header closeButton>
                                                      <Modal.Title>{t("Planifier")}</Modal.Title>
                                                  </Modal.Header>
                                                  <Modal.Body>
                                                      <form onSubmit={e => addScheduledbid(e)} className="mb-3">
                                                          <label htmlFor="dateInput" className="form-label">{t("Date")}</label>
                                                          <input onChange={e => setDateScheduled(e.target.value)} type="datetime-local" className="form-control" id="dateInput" />
                                                          <Button variant="secondary" onClick={() => setShowModal(false)}>
                                                              {t("Fermer")}
                                                          </Button>
                                                          <Button type='submit' variant="primary">
                                                              {t("Planifier")}
                                                          </Button>
                                                      </form>
                                                  </Modal.Body>
                                              </Modal> */}
                                              <br />
                                              <div className="modal-footer">
                                                  {/* <button
                                                      type="button"
                                                      className="btn btn-primary ms-1"
                                                      onClick={() => setShowModal(true)}
                                                  >
                                                      <span className="d-none d-sm-block">{t("Planifier")}</span>
                                                  </button> */}
                                                  <button
                                                      onClick={()=>updateBid(props.selectedItem.id)}
                                                      type="button"
                                                      className="btn btn-primary ms-1"
                                                  >
                                                      <span className="d-none d-sm-block">{t("Publier")}</span>
                                                  </button>
                                                  <button
                                                      type="button"
                                                      className="btn btn-primary ms-1"
                                                      onClick={() => setSteps(steps - 1)}
                                                  >
                                                      <span className="d-none d-sm-block">{t("Annuler")}</span>
                                                  </button>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                              <br />
                          </section>
                      </div>
                  </div>
              </div>
          )}
      </>
  );
}


export default EnchèreEdit;
