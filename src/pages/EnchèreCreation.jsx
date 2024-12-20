import React, { useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import "../css/EnchèreCreation.css";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { GlobalState } from "../GlobalState";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { Watch } from "react-loader-spinner";
import "react-toastify/dist/ReactToastify.css";
function EnchèreCreation() {
  const token = Cookies.get("token");
  const state = useContext(GlobalState);
  const categories = state.Categories;
  
  const { t, i18n } = useTranslation();

  const [steps, setSteps] = useState(0);
  const fileInputRef = React.createRef();

  const [data, setData] = useState({
    ville: "Sousse",
    ref: "",
    prixMazedOnline: 0,
    prixAchat:0,
    libProduct: "",
    avocat: "",
    notaire: "",
    description: "",
    categoryName: categories ? categories[0].nomCategorie : "",
    // New fields
    villeArabe: "",
    descriptionAr: "",
    descriptionEn: "",
    libProduitAr: "",
    libProduitEn: "",
  });

  const [dataConfig, setDataConfig] = useState({
    coutClic: 0,
    coutParticipation: 0,
    valeurMajoration: [],
    facilité: false,
    valeurFacilité: 0,
    galerie: [],
    datedeclenchement: Date.now(),
    datefermeture: Date.now(),
    unité: "MOIS",
    nombreParticipantAttendu: 0,
    nombreMois: 0,
    extensionTime: 0,
    contractEnchere: null,
    contractEnchereAr: null,
    contractEnchereEn: null,
    autoFinancement: 0,
  });

  const [showEmail2, setShowEmail2] = useState(false);
  const [showFac, setShowFac] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [critereInputs, setCritereInputs] = useState([
    { label: "", value: "" },
  ]); // Main criteria
  const [critereInputsAr, setCritereInputsAr] = useState([
    { label: "", value: "" },
  ]); // Arabic criteria
  const [critereInputsEn, setCritereInputsEn] = useState([
    { label: "", value: "" },
  ]); // English criteria
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

  const handleGalerieChange = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to Array

    if (files.length === 0) {
      console.error("No files selected");
      return; // Exit early if no files
    }

    setDataConfig((prevData) => ({
      ...prevData,
      galerie: files, // Store the files array directly in the state
    }));

    console.log("Selected files:", files); // Log the selected files for debugging
  };

  const handleFileChange = (e) => {
    const { id, files } = e.target; // Destructure id and files
    const file = files[0];

    // Update state based on input id
    setDataConfig((prevState) => ({
      ...prevState,
      [id]: file, // Use the id of the input as the key in state
    }));
    console.log(dataConfig);
  };

  const handleCheckbox2Change = () => {
    setShowEmail2(!showEmail2);
    setShowFac(!showFac);
    setDataConfig({ ...dataConfig, facilité: showFac });
  };

  useEffect(() => {
    if (categories && categories.length > 0) {
      setData((prevData) => ({
        ...prevData,
        categoryName: categories[0].nomCategorie, // Set first category as default
      }));
    }
  }, [categories]);

  const addBid = async () => {
    try {
      const bidData = {
        ...data,
        critére: critereInputs.reduce((acc, input) => {
          if (input.label && input.value) {
            acc[input.label] = input.value;
          }
          return acc;
        }, {}),
        critéreAr: critereInputsAr.reduce((acc, input) => {
          if (input.label && input.value) {
            acc[input.label] = input.value;
          }
          return acc;
        }, {}),
        critéreEn: critereInputsEn.reduce((acc, input) => {
          if (input.label && input.value) {
            acc[input.label] = input.value;
          }
          return acc;
        }, {}),
      };

      console.log(bidData);

      // Make the request
      const res = await axios.post(
        "http://localhost:8081/api/bid/createBrouillon",
        bidData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log(res.data);
      localStorage.setItem("idenchere", res.data.id);
      setSteps(steps + 1);
    } catch (error) {
      console.error("Error adding bid:", error);
    }
  };

  const addBidConfig = async () => {
    console.log(dataConfig);
    console.log(valeurMajoration);
    console.log(localStorage.getItem("idenchere"));

    const resolveWithSomeData = new Promise(async (resolve, reject) => {
      try {
        const formData = new FormData();
        Object.keys(dataConfig).forEach((key) => {
          formData.append(key, dataConfig[key]);
        });

        // Add IdEnchere to FormData
        formData.append("IdEnchere", localStorage.getItem("idenchere"));
        const valeurMajorationArray = String(valeurMajoration)
          .split(",")
          .map(Number);
        console.log(valeurMajorationArray);
        valeurMajorationArray.forEach((value) => {
          formData.append("valeurMajoration", value);
        });

        // Check for required files
        if (
          !dataConfig.contractEnchere ||
          !dataConfig.contractEnchereAr ||
          !dataConfig.contractEnchereEn ||
          !dataConfig.galerie
        ) {
          reject(new Error("Missing required files"));
          return;
        }

        formData.append("ContractEnchere", dataConfig.contractEnchere);
        formData.append("ContractEnchereAr", dataConfig.contractEnchereAr);
        formData.append("ContractEnchereEn", dataConfig.contractEnchereEn);

        for (const file of dataConfig.galerie) {
          formData.append("galerie", file);
        }

        const res = await axios.post(
          "http://localhost:8081/api/bid/publishBidNow",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log(res.data);
        localStorage.removeItem("idenchere");
        resolve(res.data);
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(resolveWithSomeData, {
      pending: {
        render() {
          return (
            <div style={{display:"flex", alignItems:"center", justifyContent:"space-around"}}>
              <Watch
                visible={true}
                height="30"
                width="30"
                radius="48"
                color="#4fa94d"
                ariaLabel="watch-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
              "Uploading bid configuration..."
            </div>
          );
        },
        icon: false,
      },
      success: {
        render({ data }) {
          return `Bid successfully published!`;
        },
        icon: "🟢",
      },
      error: {
        render({ data }) {
          return `Error: ${data.message}`;
        },
      },
    });
  };

  const addScheduledbid = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(dataConfig).forEach((key) => {
        formData.append(key, dataConfig[key]);
      });

      // Add IdEnchere and publicationDate to FormData
      formData.append("IdEnchere", localStorage.getItem("idenchere"));
      formData.append("publicationDate", dateScheduled);
      formData.append("valeurMajoration", valeurMajoration);
      // Add ContractEnchere file to FormData
      if (dataConfig.contractEnchere) {
        formData.append("ContractEnchere", dataConfig.contractEnchere);
      } else {
        console.error("ContractEnchere file is missing.");
        return;
      }

      // Add ContractEnchereAr file to FormData
      if (dataConfig.contractEnchereAr) {
        formData.append("ContractEnchereAr", dataConfig.contractEnchereAr);
      } else {
        console.error("ContractEnchereAr file is missing.");
        return;
      }

      // Add ContractEnchereEn file to FormData
      if (dataConfig.contractEnchereEn) {
        formData.append("ContractEnchereEn", dataConfig.contractEnchereEn);
      } else {
        console.error("ContractEnchereEn file is missing.");
        return;
      }
      for (const file of dataConfig.galerie) {
        formData.append("galerie", file);
      }
      // Send the request with FormData
      const res = await axios.post(
        "http://localhost:8081/api/bid/scheduleBidPublication",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(res.data);
    } catch (error) {
      console.error("Error scheduling bid:", error);
    }
  };

  const handleCritereChange = (index, field, value, language) => {
    console.log(critereInputs);
    if (language === "ar") {
      const newCritereInputsAr = [...critereInputsAr];
      newCritereInputsAr[index][field] = value;
      setCritereInputsAr(newCritereInputsAr);
    } else if (language === "en") {
      const newCritereInputsEn = [...critereInputsEn];
      newCritereInputsEn[index][field] = value;
      setCritereInputsEn(newCritereInputsEn);
    } else {
      const newCritereInputs = [...critereInputs];
      newCritereInputs[index][field] = value;
      setCritereInputs(newCritereInputs);
    }
  };

  const addCritereInput = (language) => {
    if (language === "ar") {
      setCritereInputsAr([...critereInputsAr, { label: "", value: "" }]);
    } else if (language === "en") {
      setCritereInputsEn([...critereInputsEn, { label: "", value: "" }]);
    } else {
      setCritereInputs([...critereInputs, { label: "", value: "" }]);
    }
  };

  // State for valeurMajoration
  const [valeurMajoration, setValeurMajoration] = useState([]);
  const [newValue, setNewValue] = useState("");

  const handleAddValue = () => {
    if (newValue) {
      setValeurMajoration([...valeurMajoration, parseInt(newValue)]);
      setNewValue(""); // Clear input field after adding
    }
  };

  // Handler for input change
  const handleInputChange = (e) => {
    setNewValue(e.target.value);
  };

  const handleDeleteValue = (index) => {
    setValeurMajoration(valeurMajoration.filter((_, i) => i !== index));
  };

  return (
    <>
      {steps === 0 && (
        <div className="content-container">
          <div className="page-heading">
            <section id="basic-vertical-layouts">
              <div className="match-height">
                <div>
                  <div className="card">
                    <div className="card-header">
                      <h2 className="new-price">{t("Création De Enchere")}</h2>
                    </div>
                    <div className="card-content">
                      <div className="card-body">
                        <form className="form form-vertical">
                          <div className="form-body">
                            <div className="row">
                              <div className="col-12">
                                <div className="form-group">
                                  <label htmlFor="ref">{t("Référence")}</label>
                                  <input
                                    onChange={(e) =>
                                      setData({ ...data, ref: e.target.value })
                                    }
                                    type="text"
                                    id="ref"
                                    className="form-control"
                                    required
                                  />
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="form-group">
                                  <label htmlFor="prixMazedOnline">
                                    {t("Prix Mazed Online")}
                                  </label>
                                  <input
                                    onChange={(e) =>
                                      setData({
                                        ...data,
                                        prixMazedOnline: e.target.value,
                                      })
                                    }
                                    type="number"
                                    id="prixMazedOnline"
                                    className="form-control"
                                    required
                                  />
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="form-group">
                                  <label htmlFor="prixMazedOnline">
                                    {t("Prix Achat")}
                                  </label>
                                  <input
                                    onChange={(e) =>
                                      setData({
                                        ...data,
                                        prixAchat: e.target.value,
                                      })
                                    }
                                    type="number"
                                    id="prixMazedOnline"
                                    className="form-control"
                                    required
                                  />
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="form-group">
                                  <label htmlFor="notaire">
                                    {t("Notaire")}
                                  </label>
                                  <input
                                    onChange={(e) =>
                                      setData({
                                        ...data,
                                        notaire: e.target.value,
                                      })
                                    }
                                    type="text"
                                    id="notaire"
                                    className="form-control"
                                    required
                                  />
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="form-group">
                                  <label htmlFor="avocat">{t("Avocat")}</label>
                                  <input
                                    onChange={(e) =>
                                      setData({
                                        ...data,
                                        avocat: e.target.value,
                                      })
                                    }
                                    type="text"
                                    id="avocat"
                                    className="form-control"
                                    required
                                  />
                                </div>
                              </div>
                              <div className="col-12">
                                <label>{t("Catégorie")}</label>
                                <fieldset className="form-group">
                                  <select
                                    onChange={(e) =>
                                      setData({
                                        ...data,
                                        categoryName: e.target.value,
                                      })
                                    }
                                    className="form-select"
                                    required
                                  >
                                    {categories &&
                                      categories.map((item, index) => (
                                        <option
                                          key={index}
                                          value={item.nomCategorie}
                                        >
                                          {item.nomCategorie}
                                        </option>
                                      ))}
                                  </select>
                                </fieldset>
                              </div>
                              <div className="col-12">
                                <label>{t("Produit")}</label>
                                <div className="form-group">
                                  <input
                                    onChange={(e) =>
                                      setData({
                                        ...data,
                                        libProduct: e.target.value,
                                      })
                                    }
                                    type="text"
                                    id="libProduct"
                                    className="form-control"
                                    required
                                  />
                                </div>
                              </div>
                              <div className="col-12">
                                <label>{t("Description")}</label>
                                <div className="form-group">
                                  <textarea required 
                                    onChange={(e) =>
                                      setData({
                                        ...data,
                                        description: e.target.value,
                                      })
                                    }
                                    id="description"
                                    className="form-control"
                                    
                                  />
                                </div>
                              </div>

                              <div className="col-12">
                                <label>{t("Ville")}</label>
                                <fieldset className="form-group">
                                  <select
                                    onChange={(e) =>
                                      setData({
                                        ...data,
                                        ville: e.target.value,
                                      })
                                    }
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
                                  <label htmlFor="villeArabe">
                                    {t("Ville Arabe")}
                                  </label>
                                  <input
                                    onChange={(e) =>
                                      setData({
                                        ...data,
                                        villeArabe: e.target.value,
                                      })
                                    }
                                    type="text"
                                    id="villeArabe"
                                    className="form-control"
                                  />
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="form-group">
                                  <label htmlFor="descriptionAr">
                                    {t("Description Arabe")}
                                  </label>
                                  <textarea required 
                                    onChange={(e) =>
                                      setData({
                                        ...data,
                                        descriptionAr: e.target.value,
                                      })
                                    }
                                    id="descriptionAr"
                                    className="form-control"
                                  />
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="form-group">
                                  <label htmlFor="descriptionEn">
                                    {t("Description Anglaise")}
                                  </label>
                                  <textarea required 
                                    onChange={(e) =>
                                      setData({
                                        ...data,
                                        descriptionEn: e.target.value,
                                      })
                                    }
                                    id="descriptionEn"
                                    className="form-control"
                                  />
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="form-group">
                                  <label htmlFor="libProduitAr">
                                    {t("Produit Arabe")}
                                  </label>
                                  <input
                                    onChange={(e) =>
                                      setData({
                                        ...data,
                                        libProduitAr: e.target.value,
                                      })
                                    }
                                    type="text"
                                    id="libProduitAr"
                                    className="form-control"
                                  />
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="form-group">
                                  <label htmlFor="libProduitEn">
                                    {t("Produit Anglais")}
                                  </label>
                                  <input
                                    onChange={(e) =>
                                      setData({
                                        ...data,
                                        libProduitEn: e.target.value,
                                      })
                                    }
                                    type="text"
                                    id="libProduitEn"
                                    className="form-control"
                                  />
                                </div>
                              </div>

                              {/* Inputs for Main Criteria */}
                              <div className="col-12">
                                <h5>{t("Critères")}</h5>
                                {critereInputs.map((critere, index) => (
                                  <div key={index} className="form-group">
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={critere.label}
                                      onChange={(e) =>
                                        handleCritereChange(
                                          index,
                                          "label",
                                          e.target.value,
                                          "fr"
                                        )
                                      }
                                    />
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={critere.value}
                                      onChange={(e) =>
                                        handleCritereChange(
                                          index,
                                          "value",
                                          e.target.value,
                                          "fr"
                                        )
                                      }
                                    />
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  className="btn btn-secondary"
                                  onClick={() => addCritereInput("fr")}
                                >
                                  {t("Ajouter un critère")}
                                </button>
                                <br />
                                <br />
                              </div>

                              {/* Inputs for Arabic Criteria */}
                              <div className="col-12">
                                <h5>{t("Critères Arabe")}</h5>
                                {critereInputsAr.map((critere, index) => (
                                  <div key={index} className="form-group">
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={critere.label}
                                      onChange={(e) =>
                                        handleCritereChange(
                                          index,
                                          "label",
                                          e.target.value,
                                          "ar"
                                        )
                                      }
                                    />
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={critere.value}
                                      onChange={(e) =>
                                        handleCritereChange(
                                          index,
                                          "value",
                                          e.target.value,
                                          "ar"
                                        )
                                      }
                                    />
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  className="btn btn-secondary"
                                  onClick={() => addCritereInput("ar")}
                                >
                                  {t("Ajouter un critère en Arabe")}
                                </button>
                                <br />
                                <br />
                              </div>

                              {/* Inputs for English Criteria */}
                              <div className="col-12">
                                <h5>{t("Critères Anglais")}</h5>
                                {critereInputsEn.map((critere, index) => (
                                  <div key={index} className="form-group">
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={critere.label}
                                      onChange={(e) =>
                                        handleCritereChange(
                                          index,
                                          "label",
                                          e.target.value,
                                          "en"
                                        )
                                      }
                                    />
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={critere.value}
                                      onChange={(e) =>
                                        handleCritereChange(
                                          index,
                                          "value",
                                          e.target.value,
                                          "en"
                                        )
                                      }
                                    />
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  className="btn btn-secondary"
                                  onClick={() => addCritereInput("en")}
                                >
                                  {t("Ajouter un critère en Anglais")}
                                </button>
                              </div>

                              <br />
                              <div className="col-12 d-flex justify-content-end">
                                <button
                                  type="reset"
                                  className="btn btn-secondary me-1 mb-1"
                                >
                                  {t("Annuler")}
                                </button>
                                <a
                                  onClick={addBid}
                                  className="btn btn-primary me-1 mb-1"
                                  style={{ color: "white" }}
                                >
                                  {t("Suivant")}
                                </a>
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
                                    <label htmlFor="participation-cost">
                                      {t("Cout Du Participation")}
                                    </label>
                                    <input
                                      onChange={(e) =>
                                        setDataConfig({
                                          ...dataConfig,
                                          coutParticipation: e.target.value,
                                        })
                                      }
                                      type="number"
                                      id="participation-cost"
                                      className="form-control"
                                      required
                                    />
                                  </div>
                                </div>
                                <div className="col-12">
                                  <div className="form-group">
                                    <label htmlFor="click-cost">
                                      {t("Cout Du Clic")}
                                    </label>
                                    <input
                                      onChange={(e) =>
                                        setDataConfig({
                                          ...dataConfig,
                                          coutClic: e.target.value,
                                        })
                                      }
                                      type="number"
                                      id="click-cost"
                                      className="form-control"
                                      required
                                    />
                                  </div>
                                </div>
                                <div className="col-12">
                                  <div className="form-group">
                                    <label htmlFor="extension-time">
                                      {t("Extension Time")}
                                    </label>
                                    <input
                                      onChange={(e) =>
                                        setDataConfig({
                                          ...dataConfig,
                                          extensionTime: e.target.value,
                                        })
                                      }
                                      type="number"
                                      id="extension-time"
                                      className="form-control"
                                      required
                                    />
                                  </div>
                                </div>
                                <div className="col-12">
                                  <div className="form-group">
                                    <label htmlFor="auto-financement">
                                      {t("Auto Financement")}
                                    </label>
                                    <input
                                      onChange={(e) =>
                                        setDataConfig({
                                          ...dataConfig,
                                          autoFinancement: e.target.value,
                                        })
                                      }
                                      type="number"
                                      id="auto-financement"
                                      className="form-control"
                                      required
                                    />
                                  </div>
                                </div>
                                <div className="col-12">
                                  <label>{t("Galerie")}</label>
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
                                  <div className="form-group">
                                    <label htmlFor="contractEnchere">
                                      {t("Contrat")}
                                    </label>
                                    <input
                                      onChange={handleFileChange}
                                      type="file"
                                      id="contractEnchere" // Unique id for each input
                                      className="form-control"
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
                                      required
                                    />
                                  </div>
                                </div>
                                <div className="col-12">
                                  <div className="form-group">
                                    <label htmlFor="valeur-majoration">
                                      {t("Valeur de majoration")}
                                    </label>
                                    <div className="input-group">
                                      <input
                                        type="number"
                                        value={newValue}
                                        onChange={handleInputChange}
                                        className="form-control"
                                        id="valeur-majoration"
                                        required
                                      />
                                      <button
                                        className="btn btn-primary ms-1"
                                        type="button"
                                        onClick={handleAddValue}
                                      >
                                        Add
                                      </button>
                                    </div>
                                  </div>
                                  <div className="form-group">
                                    <ul className="list-group">
                                      {valeurMajoration.map((value, index) => (
                                        <li
                                          key={index}
                                          className="list-group-item d-flex justify-content-between align-items-center"
                                        >
                                          {value}
                                          <button
                                            className="btn btn-secondary ms-3"
                                            type="button"
                                            onClick={() =>
                                              handleDeleteValue(index)
                                            }
                                          >
                                            X
                                          </button>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
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
                                        onChange={(e) =>
                                          setDataConfig({
                                            ...dataConfig,
                                            valeurFacilité: e.target.value,
                                          })
                                        }
                                        type="number"
                                        id="email-id-vertical2"
                                        className="col-6 form-control"
                                        required
                                      />
                                    </div>
                                  )}
                                  {showFac && (
                                    <fieldset
                                      style={{ padding: "0px", margin: "0px" }}
                                      id="fac"
                                      className="col-6 form-group"
                                    >
                                      <select
                                        onChange={(e) =>
                                          setDataConfig({
                                            ...dataConfig,
                                            unité: e.target.value,
                                          })
                                        }
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
                                  <label htmlFor="expected-participants">
                                    {t("Nb attendu des participants")}
                                  </label>
                                  <div className="form-group">
                                    <input
                                      onChange={(e) =>
                                        setDataConfig({
                                          ...dataConfig,
                                          nombreParticipantAttendu:
                                            e.target.value,
                                        })
                                      }
                                      type="number"
                                      id="expected-participants"
                                      className="form-control"
                                      maxLength={25}
                                      required
                                    />
                                  </div>
                                  <label htmlFor="launch-date">
                                    {t("Date de Lancement")}
                                  </label>
                                  <div className="form-group">
                                    <input
                                      onChange={(e) =>
                                        setDataConfig({
                                          ...dataConfig,
                                          datedeclenchement: e.target.value,
                                        })
                                      }
                                      type="datetime-local"
                                      id="launch-date"
                                      className="form-control"
                                      required
                                    />
                                  </div>
                                  <label htmlFor="closing-date">
                                    {t("Date de Fermeture")}
                                  </label>
                                  <div className="form-group">
                                    <input
                                      onChange={(e) =>
                                        setDataConfig({
                                          ...dataConfig,
                                          datefermeture: e.target.value,
                                        })
                                      }
                                      type="datetime-local"
                                      id="closing-date"
                                      className="form-control"
                                      required
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </form>
                        </div>
                        <Modal
                          show={showModal}
                          onHide={() => setShowModal(false)}
                          centered
                        >
                          <Modal.Header closeButton>
                            <Modal.Title>{t("Planifier")}</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <form
                              onSubmit={(e) => addScheduledbid(e)}
                              className="mb-3"
                            >
                              <label htmlFor="dateInput" className="form-label">
                                {t("Date")}
                              </label>
                              <input
                                onChange={(e) =>
                                  setDateScheduled(e.target.value)
                                }
                                type="datetime-local"
                                className="form-control"
                                id="dateInput"
                              />
                              <Button
                                variant="secondary"
                                onClick={() => setShowModal(false)}
                              >
                                {t("Fermer")}
                              </Button>
                              <Button type="submit" variant="primary">
                                {t("Planifier")}
                              </Button>
                            </form>
                          </Modal.Body>
                        </Modal>
                        <br />
                        <div className="modal-footer">
                          <button
                            type="button"
                            className="btn btn-primary ms-1"
                            onClick={() => setShowModal(true)}
                          >
                            <span className="d-none d-sm-block">
                              {t("Planifier")}
                            </span>
                          </button>
                          <button
                            onClick={addBidConfig}
                            type="button"
                            className="btn btn-primary ms-1"
                          >
                            <span className="d-none d-sm-block">
                              {t("Publier")}
                            </span>
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary ms-1"
                            onClick={() => setSteps(steps - 1)}
                          >
                            <span className="d-none d-sm-block">
                              {t("Annuler")}
                            </span>
                          </button>
                        </div>
                        <br />
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

export default EnchèreCreation;
