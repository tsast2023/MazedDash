import React, { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import { Table, Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { GlobalState } from "../GlobalState";
import axios from "axios";
import Cookies from "js-cookie";
const DemandeProduitAdmin = () => {
  const token = Cookies.get("token");
  const state = useContext(GlobalState);
  const demandes = state.demandes;
  const {
    identifiantDemCat ,
    setidentifiantDemCat,
    statusDemCat ,
    setstatusDemCat,
    pageDemCat,
    setpageDemCat,
    actionDemCat,
    setactionDemCat,
  } = useContext(GlobalState)
  const { t, i18n } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);
  const [starClicked, setStarClicked] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [label, setLabel] = useState("");
  const [image, setImage] = useState(null);
  const [initialStock, setInitialStock] = useState("");
  const [currentStock, setCurrentStock] = useState("");
  const [color, setColor] = useState("#ffffff");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState();
    const MODIFICATION = "MODIFICATION";
    const CHANGEMENT_STATUT = "CHANGEMENT_STATUT";
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1212);
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleValidation =  (action, status, id , actionDem) => {
    console.log(action, status, id);
    Swal.fire({
      title: t("Êtes-vous sûr(e) ?"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: t("Oui"),
      cancelButtonText: t("Non, annuler !"),
      closeOnConfirm: false,
      closeOnCancel: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (action === "valider") {
          await traiterDemandeCategory(id, status , actionDem);
          Swal.fire({
            title: "Valider",
            text: "Votre élément est validé :)",
            icon: "success",
            confirmButtonColor: "#8c111b",
          });
        } else {
          Swal.fire({
            title: "Refuser",
            text: "Votre élément est refusé :)",
            icon: "error",
            confirmButtonColor: "#8c111b",
          });
        }
      } else {
        Swal.fire({
          title: "Annulé",
          text: "Votre élément est en sécurité :)",
          icon: "error",
          confirmButtonColor: "#8c111b",
        });
      }
    });
  };
  const traiterDemandeCategory = async (demandeId, status , actionDem) => {
    try {
      console.log(token, demandeId, status);
      if(actionDem ===  CHANGEMENT_STATUT) {
          const res = await axios.post(
        `http://localhost:8081/api/demandes/desactivation-categorie?demandeId=${demandeId}&statusDemande=${status}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(res.data);

      }else if(actionDem === MODIFICATION){
          const res = await axios.post(
        `http://localhost:8081/api/demandes/traiterDemandeModificationCategorie?demandeId=${demandeId}&statusDemande=${status}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(res.data);
        
      }
    
    } catch (error) {
      console.log(error);
    }
  };

  const showModal = (item) => {
    setShowEditModal(true);
    console.log(item);
    setCategory(item);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  return (
    <div className="content-container">
      <section className="section">
        <div className="card">
          <div className="card-header">
            <h2 className="new-price">{t("Demande Categorie")}</h2>
          </div>
          <div className="card-body">
          <div className="row ">
              <div className="col-4">
                <div className="form-group">
                  <label htmlFor="recherche">
                    <h6>{t("Recherche")}</h6>
                  </label>
                  <input required value={identifiantDemCat} onChange={e=>setidentifiantDemCat(e.target.value)} id="recherche" className="form-control" />
                </div>
              </div>
              <div className="col-4 form-group">
                <h6>{t("Statut")}</h6>
                <select value={statusDemCat} onChange={e=>setstatusDemCat(e.target.value)} className="choices form-select">
                <option value=""  selected></option>
                  <option value="APPROUVER">{t("Approuver")}</option>
                  <option value="EN_ATTENTE">{t("En attente")}</option>
                  <option value="REFUSER">{t("Refuser")}</option>
                </select>
              </div>
              <div className="col-4 form-group">
                <h6>{t("Action")}</h6>
                <select value={actionDemCat} onChange={e=>setactionDemCat(e.target.value)} className="choices form-select">
                <option value=""  selected></option>
                  <option value="CHANGEMENT_STATUT">{t("CHANGEMENT_STATUT")}</option>
                  <option value="MODIFICATION">{t("MODIFICATION")}</option>
                
                </select>
              </div>
            </div>
            {isMobile ? (
              <Table responsive="sm">
                <tbody>
                  {demandes &&
                    demandes?.map((item) => (
                      <>
                         <tr>
                    <td>{t("Photo de Profile")}</td>
                                <td>
  <img
    style={{ borderRadius: "50px" }}
    className="imgtable"
    src={
      item?.administrateur?.photoDeProfil || "/user.png"
    }
    alt="img"
  />
</td>
                  </tr>
                  <td>{t("Identifiant")}</td>
                  <td>{item?.administrateur?.identifiant}</td>
                  <tr>
                    <td>{t("Nom")}</td>
                    <td>{item?.administrateur?.nomFamille}</td>
                  </tr>
                  <tr>
                    <td>{t("Prénom")}</td>
                    <td>{item?.administrateur?.prenom}</td>
                  </tr>
                        <tr>
                          <td>{t("Ancien categorie")}</td>
                          <td>
                            <button
                              onClick={() => showModal(item.oldCategorie)}
                              class="btn btn-primary"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td>{t("Nouveau categorie")}</td>
                          <td>
                            <button
                              onClick={() => showModal(item.newCategorie)}
                              class="btn btn-primary"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td>{t("Statut")}</td>
                               <td>
        <span
          className={
            item.status === "EN_ATTENTE"
              ? "badge bg-info"
              : item.status === "REFUSER"
              ? "badge bg-danger"
              : "badge bg-success"
          }
        >
          {item.status}
        </span>
      </td>
                        </tr>
                        <tr>
                          <td>{t("Valider")}</td>
                          <td>
                            {item.status === "EN_ATTENTE" ? (
                              <i
                                className="fa-solid fa-circle-check text-success"
                                onClick={() =>
                                  handleValidation(
                                    "valider",
                                    "APPROUVER",
                                    item.id, 
                                    item.action
                                  )
                                }
                              ></i>
                            ) : (
                              <h6>-</h6>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td>{t("Refuser")}</td>
                          <td>
                            {item.status === "EN_ATTENTE" ? (
                              <i
                                className="fa-solid fa-circle-xmark text-danger"
                                onClick={() =>
                                  handleValidation(
                                    "refuser",
                                    "REFUSER",
                                    item.id, 
                                    item.action
                                  )
                                }
                              ></i>
                            ) : (
                              <h6>-</h6>
                            )}
                          </td>
                        </tr>
                      </>
                    ))}
                </tbody>
              </Table>
            ) : (
              <Table responsive="sm">
                <thead>
                  <tr>
                   <th>{t("Photo de Profile")}</th>
                    <th>{t("Identifiant")}</th>
                    <th>{t("Nom")}</th>
                    <th>{t("Prénom")}</th>
                    <th>{t("Ancien categorie")}</th>
                    <th>{t("Nouveau categorie")}</th>
                    <th>{t("Statut")}</th>
                    <th>{t("Action")}</th>
                    <th>{t("Valider")}</th>
                    <th>{t("Refuser")}</th>
                  </tr>
                </thead>
                <tbody>
                  {demandes &&
                    demandes?.map((item) => (
                      <tr>
                                    <td>
  
  <img
    style={{ borderRadius: "50px" }}
    className="imgtable"
    src={item?.administrateur?.photoDeProfil || "/user.png"}
    alt="img"
    onError={(e) => {
      e.target.onerror = null; // évite une boucle infinie si l'image par défaut échoue aussi
      e.target.src = "/user.png"; // image par défaut
    }}
  />
</td>
                    <td>{item?.administrateur?.identifiant}</td>
                    <td>{item?.administrateur?.nomFamille}</td>
                    <td>{item?.administrateur?.prenom}</td>
                        <td>
                          <button
                            onClick={() => showModal(item.oldCategorie)}
                            class="btn btn-primary"
                          >
                            View
                          </button>
                        </td>
                        <td>
                          <button
                            onClick={() => showModal(item.newCategorie)}
                            class="btn btn-primary"
                          >
                            View
                          </button>
                        </td>
                             <td>
        <span
          className={
            item.status === "EN_ATTENTE"
              ? "badge bg-info"
              : item.status === "REFUSER"
              ? "badge bg-danger"
              : "badge bg-success"
          }
        >
          {item.status}
        </span>
      </td>
                        <td>{item.action}</td>
                        <td>
                          {item.status === "EN_ATTENTE" ? (
                            <i
                              className="fa-solid fa-circle-check text-success"
                              onClick={() =>
                                handleValidation(
                                  "valider",
                                  "APPROUVER",
                                  item.id,
                                  item.action
                                )
                              }
                            ></i>
                          ) : (
                            <h6>-</h6>
                          )}
                        </td>
                        <td>
                          {item.status === "EN_ATTENTE" ? (
                            <i
                              className="fa-solid fa-circle-xmark text-danger"
                              onClick={() =>
                                handleValidation("valider", "REFUSER", item.id , item.action)
                              }
                            ></i>
                          ) : (
                            <h6>-</h6>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            )}
          </div>
        </div>
      </section>

      <Modal
        show={showEditModal}
        onHide={handleCloseEditModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>{t("Categorie")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="form form-vertical">
            <div className="form-body">
              <div className="row">
                <div className="col-12">
                  <div className="form-group">
                    <label htmlFor="label">{t("Libellé")}</label>
                    <input
                      type="text"
                      className="form-control"
                      id="label"
                      maxLength="25"
                      value={category ? category.nomCategorie : ""}
                      
                    />
                  </div>
                </div>
                {/* <div className="col-12">
                  <div className="form-group">
                    <label htmlFor="image">{t("Image")}</label>
                   <img src={""}/>
                  </div>
                </div> */}

                {/* <div className="col-12">
                  <button type="submit" className="btn btn-primary">
                    {t("Sauvegarder")}
                  </button>
                </div> */}
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DemandeProduitAdmin;
