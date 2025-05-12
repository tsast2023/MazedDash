import React, { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import { Table, Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { GlobalState } from "../GlobalState";
import Cookies from "js-cookie";
import axios from "axios";
const DemandeEnchereAdmin = () => {
  const token = Cookies.get("token");
  const { t, i18n } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);
  const [starClicked, setStarClicked] = useState(false);
  const state = useContext(GlobalState);
  const[bid , setBid]= useState()
  const demandesBid = state.demandesBid;
    const {
    identifiantDemBid,
    setidentifiantDemBid,
    statusDemBid,
    setstatusDemBid,
    actionDemBid,
    setactionDemBid,
    pageDemBid,
    setpageDemBid
    } = useContext(GlobalState)
  // State for editing modal
  const [showEditModal, setShowEditModal] = useState(false);
  const MODIFICATION = "MODIFICATION";
const ANNULATION = "ANNULATION";


  // State for showing modals for images
  const [showAncienModal, setShowAncienModal] = useState(false);
  const [showNouveauModal, setShowNouveauModal] = useState(false);

  const [label, setLabel] = useState("");
  const [image, setImage] = useState(null);
  const [initialStock, setInitialStock] = useState("");
  const [currentStock, setCurrentStock] = useState("");
  const [color, setColor] = useState("#ffffff");
  const [description, setDescription] = useState("");

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
          await traiterDemandeBid(id, status , actionDem);
          Swal.fire({
            title: "Valider",
            text: "Votre élément est validé :)",
            icon: "success",
            confirmButtonColor: "#8c111b",
          });
        } else {
          await traiterDemandeBid(id, status , actionDem);
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
  const traiterDemandeBid = async (demandeId, status , actionDem) => {
    try {
      console.log(token, demandeId, status);
      if(actionDem === MODIFICATION) {
         const res = await axios.post(
        `http://localhost:8081/api/demandes/traiterDemandeModificationEnchere?demandeId=${demandeId}&statusDemande=${status}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(res.data);

      }else if (actionDem === ANNULATION){
         const res = await axios.post(
        `http://localhost:8081/api/demandes/traiterDemandeAnnulationEnchere?demandeId=${demandeId}&statusDemande=${status}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(res.data);

      }
     
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      label,
      image,
      initialStock,
      currentStock,
      color,
      description,
    });
    setShowEditModal(false);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleEditClick = () => {
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

   const showModal = (item) => {
    setShowEditModal(true);
    console.log(item);
    setBid(item);
  };

  const handleAncienModalClose = () => setShowAncienModal(false);
  const handleNouveauModalClose = () => setShowNouveauModal(false);

  const handleAncienModalShow = () => setShowAncienModal(true);
  const handleNouveauModalShow = () => setShowNouveauModal(true);

  return (
    <div className="content-container">
      <section className="section">
        <div className="card">
          <div className="card-header">
            <h2 className="new-price">{t("Demande Enchére")}</h2>
          </div>
          <div className="card-body">
            <div className="row ">
              <div className="col-4">
                <div className="form-group">
                  <label htmlFor="recherche">
                    <h6>{t("Recherche")}</h6>
                  </label>
                  <input required value={identifiantDemBid} onChange={e=>setidentifiantDemBid(e.target.value)} id="recherche" className="form-control" />
                </div>
              </div>
              <div className="col-4 form-group">
                <h6>{t("Statut")}</h6>
                <select value={statusDemBid} onChange={e=>setstatusDemBid(e.target.value)} className="choices form-select">
                <option value=""  selected></option>
                  <option value="APPROUVER">{t("Approuver")}</option>
                  <option value="EN_ATTENTE">{t("En attente")}</option>
                  <option value="REFUSER">{t("Refuser")}</option>
                </select>
              </div>
              <div className="col-4 form-group">
                <h6>{t("Action")}</h6>
                <select value={actionDemBid} onChange={e=>setactionDemBid(e.target.value)} className="choices form-select">
                <option value=""  selected></option>
                  <option value="ANNULATION">{t("ANNULATION")}</option>
                  <option value="MODIFICATION">{t("MODIFICATION")}</option>
                
                </select>
              </div>
            </div>
            {isMobile ? (
              <Table responsive="sm">
                  <tbody>
                  {demandesBid &&
                    demandesBid?.map((item) => ( 
                      <> 
                  
                  <tr>
                    <td>{t("Photo de Profile")}</td>
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
                  </tr>
                  <tr>
                     <td>{t("Identifiant")}</td>
                  <td>{item?.administrateur?.identifiant}</td>

                  </tr>
                  <tr>
                    <td>{t("Nom")}</td>
                    <td>{item?.administrateur?.nomFamille}</td>
                  </tr>
                  <tr>
                    <td>{t("Prénom")}</td>
                    <td>{item?.administrateur?.prenom}</td>
                  </tr>
                  <tr>
                    <td>{t("Ancien produit")}</td>
                     <td>
                            <button
                              onClick={() => showModal(item.oldEnchere)}
                              class="btn btn-primary"
                            >
                              View
                            </button>
                          </td>
                  </tr>
                  <tr>
                    <td>{t("Nouveau produit")}</td>
                     <td>
                            <button
                              onClick={() => showModal(item.newEnchere)}
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
                    <th>{t("Nom")}</th>
                    <th>{t("Identifiant")}</th>
                    <th>{t("Prénom")}</th>
                    <th>{t("Ancien Enchére")}</th>
                    <th>{t("Nouveau Enchére")}</th>
                    <th>{t("Statut")}</th>
                    <th>{t("Action")}</th>
                    <th>{t("Valider")}</th>
                    <th>{t("Refuser")}</th>
                  </tr>
                </thead>
                <tbody>
                    {demandesBid &&
                    demandesBid?.map((item) => (
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
                              onClick={handleAncienModalShow}
                              class="btn btn-primary"
                            >
                              View
                            </button>
                          </td>
                    <td>
                            <button
                              onClick={handleNouveauModalShow}
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

      {/* Edit Modal */}
      <Modal
        show={showEditModal}
        onHide={handleCloseEditModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>{t("Modifier de Produit")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="form form-vertical" onSubmit={handleSubmit}>
            <div className="form-body">
              <div className="row">
                <div className="col-12">
                  <label>{t("Image")}</label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={handleImageChange}
                  />
                </div>
                <div className="col-12">
                  <label>{t("Label")}</label>
                  <input
                    type="text"
                    className="form-control"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                  />
                </div>
                <div className="col-12">
                  <label>{t("Stock Initial")}</label>
                  <input
                    type="number"
                    className="form-control"
                    value={initialStock}
                    onChange={(e) => setInitialStock(e.target.value)}
                  />
                </div>
                <div className="col-12">
                  <label>{t("Stock Actuel")}</label>
                  <input
                    type="number"
                    className="form-control"
                    value={currentStock}
                    onChange={(e) => setCurrentStock(e.target.value)}
                  />
                </div>
                <div className="col-12">
                  <label>{t("Couleur")}</label>
                  <input
                    type="color"
                    className="form-control"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                  />
                </div>
                <div className="col-12">
                  <label>{t("Description")}</label>
                  <textarea required 
                    className="form-control"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>
            <Button variant="primary" type="submit" className="mt-3">
              {t("Enregistrer")}
            </Button>
          </form>
        </Modal.Body>
      </Modal>

      {/* Ancien Enchère Modal */}
      <Modal show={showAncienModal} onHide={handleAncienModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t("Ancien Enchére")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="info-container">
            <div className="info-row">
              <p>
                <strong>Nom Produits</strong>
              </p>
              <p className="data">Product Name Here</p>
            </div>
            <div className="info-row">
              <p>
                <strong>Nom Catégorie</strong>
              </p>
              <p className="data">Category Name Here</p>
            </div>
            <div className="info-row">
              <p>
                <strong>Date Déclenchemant</strong>
              </p>
              <p className="data">Trigger Date Here</p>
            </div>
            <div className="info-row">
              <p>
                <strong>Date Fermeture</strong>
              </p>
              <p className="data">Close Date Here</p>
            </div>
            <div className="info-row">
              <p>
                <strong>Date Publication</strong>
              </p>
              <p className="data">Publish Date Here</p>
            </div>
            <div className="info-row">
              <p>
                <strong>Extension Time</strong>
              </p>
              <p className="data">Extension Time Here</p>
            </div>
            <div className="info-row">
              <p>
                <strong>Numbre de Participant attendu</strong>
              </p>
              <p className="data">Expected Participants Here</p>
            </div>
            <div className="info-row">
              <p>
                <strong>Numbre de Participant réel</strong>
              </p>
              <p className="data">Actual Participants Here</p>
            </div>
            <div className="info-row">
              <p>
                <strong>Valeur Majoration</strong>
              </p>
              <p className="data">Value Here</p>
            </div>
            <div className="info-row">
              <p>
                <strong>Autofinnancement</strong>
              </p>
              <p className="data">Self-Financing Here</p>
            </div>
            <div className="info-row">
              <p>
                <strong>Facilité</strong>
              </p>
              <p className="data">Facility Here</p>
            </div>
            <div className="info-row">
              <p>
                <strong>Couc de clic</strong>
              </p>
              <p className="data">Click Cost Here</p>
            </div>
            <div className="info-row">
              <p>
                <strong>Frais d'inscription</strong>
              </p>
              <p className="data">Registration Fee Here</p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleAncienModalClose}>
            {t("Fermer")}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Nouveau Enchère Modal */}
      <Modal show={showNouveauModal} onHide={handleNouveauModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t("Nouveau Enchére")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="info-container">
            <div className="info-row">
              <p>
                <strong>Nom Produits</strong>
              </p>
              <p className="data">Product Name Here</p>
            </div>
            <div className="info-row">
              <p>
                <strong>Nom Catégorie</strong>
              </p>
              <p className="data">Category Name Here</p>
            </div>
            <div className="info-row">
              <p>
                <strong>Date Déclenchemant</strong>
              </p>
              <p className="data">Trigger Date Here</p>
            </div>
            <div className="info-row">
              <p>
                <strong>Date Fermeture</strong>
              </p>
              <p className="data">Close Date Here</p>
            </div>
            <div className="info-row">
              <p>
                <strong>Date Publication</strong>
              </p>
              <p className="data">Publish Date Here</p>
            </div>
            <div className="info-row">
              <p>
                <strong>Extension Time</strong>
              </p>
              <p className="data">Extension Time Here</p>
            </div>
            <div className="info-row">
              <p>
                <strong>Numbre de Participant attendu</strong>
              </p>
              <p className="data">Expected Participants Here</p>
            </div>
            <div className="info-row">
              <p>
                <strong>Numbre de Participant réel</strong>
              </p>
              <p className="data">Actual Participants Here</p>
            </div>
            <div className="info-row">
              <p>
                <strong>Valeur Majoration</strong>
              </p>
              <p className="data">Value Here</p>
            </div>
            <div className="info-row">
              <p>
                <strong>Autofinnancement</strong>
              </p>
              <p className="data">Self-Financing Here</p>
            </div>
            <div className="info-row">
              <p>
                <strong>Facilité</strong>
              </p>
              <p className="data">Facility Here</p>
            </div>
            <div className="info-row">
              <p>
                <strong>Couc de clic</strong>
              </p>
              <p className="data">Click Cost Here</p>
            </div>
            <div className="info-row">
              <p>
                <strong>Frais d'inscription</strong>
              </p>
              <p className="data">Registration Fee Here</p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleNouveauModalClose}>
            {t("Fermer")}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DemandeEnchereAdmin;
