import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Table, Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const DemandeEnchereAdmin = () => {
  const { t, i18n } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);
  const [starClicked, setStarClicked] = useState(false);

  // State for editing modal
  const [showEditModal, setShowEditModal] = useState(false);

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

  const handleValidation = (action) => {
    Swal.fire({
      title: t("Êtes-vous sûr(e) ?"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: t("Oui"),
      cancelButtonText: t("Non, annuler !"),
      closeOnConfirm: false,
      closeOnCancel: false,
    }).then((result) => {
      if (result.isConfirmed) {
        if (action === "valider") {
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
              <div className="col-6">
                <div className="form-group">
                  <label htmlFor="recherche">
                    <h6>{t("Recherche")}</h6>
                  </label>
                  <input id="recherche" className="form-control" />
                </div>
              </div>
              <div className="col-6 form-group">
                <h6>{t("Statut")}</h6>
                <select className="choices form-select">
                  <option value="" disabled selected></option>
                  <option value="square">{t("Approuver")}</option>
                  <option value="rectangle">{t("En attente")}</option>
                  <option value="rectangle">{t("Refuser")}</option>
                </select>
              </div>
            </div>
            {isMobile ? (
              <Table responsive="sm">
                <tbody>
                  <tr>
                    <td>{t("Photo de Profile")}</td>
                    <td>
                      <img
                        style={{ borderRadius: "50px" }}
                        className="imgtable"
                        src="./Mazed.jpg"
                        alt="img"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>{t("Nom")}</td>
                    <td>Lorem</td>
                  </tr>
                  <tr>
                    <td>{t("Prénom")}</td>
                    <td>Lorem</td>
                  </tr>
                  <tr>
                    <td>{t("Ancien produit")}</td>
                    <td>
                      <img
                        className="imgtable"
                        src="./Mazed.jpg"
                        alt="img"
                        onClick={handleAncienModalShow}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>{t("Nouveau produit")}</td>
                    <td>
                      <img
                        className="imgtable"
                        src="./Mazed.jpg"
                        alt="img"
                        onClick={handleNouveauModalShow}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>{t("Statut")}</td>
                    <td>
                      <button className="btn btn-secondary">
                        {t("Publié")}
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td>{t("Valider")}</td>
                    <td>
                      <i
                        className="fa-solid fa-circle-check text-success"
                        onClick={() => handleValidation("valider")}
                      ></i>
                    </td>
                  </tr>
                  <tr>
                    <td>{t("Refuser")}</td>
                    <td>
                      <i
                        className="fa-solid fa-circle-xmark text-danger"
                        onClick={() => handleValidation("refuser")}
                      ></i>
                    </td>
                  </tr>
                </tbody>
              </Table>
            ) : (
              <Table responsive="sm">
                <thead>
                  <tr>
                    <th>{t("Photo de Profile")}</th>
                    <th>{t("Nom")}</th>
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
                  <tr>
                    <td>
                      <img
                        style={{ borderRadius: "50px" }}
                        className="imgtable"
                        src="./Mazed.jpg"
                        alt="img"
                      />
                    </td>
                    <td>lorem</td>
                    <td>Lorem</td>
                    <td>
                      <img
                        className="imgtable"
                        src="./Mazed.jpg"
                        alt="img"
                        onClick={handleAncienModalShow}
                      />
                    </td>
                    <td>
                      <img
                        className="imgtable"
                        src="./Mazed.jpg"
                        alt="img"
                        onClick={handleNouveauModalShow}
                      />
                    </td>
                    <td>
                      <button className="btn btn-secondary">
                        {t("Publié")}
                      </button>
                    </td>
                    <td>Action</td>
                    <td>
                      <i
                        className="fa-solid fa-circle-check text-success"
                        onClick={() => handleValidation("valider")}
                      ></i>
                    </td>
                    <td>
                      <i
                        className="fa-solid fa-circle-xmark text-danger"
                        onClick={() => handleValidation("refuser")}
                      ></i>
                    </td>
                  </tr>
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
                  <textarea
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
