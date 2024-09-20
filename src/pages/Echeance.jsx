import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export function Echeance() {
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    amount: "",
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1212);
    };

    window.addEventListener("resize", handleResize);

    // Initial check
    handleResize();

    // Clean up the event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleModalOpen = () => {
    setIsModalOpen(true);
    // This ensures that the modal is visible when the button is clicked.
    const modal = new window.bootstrap.Modal(
      document.getElementById("editModal")
    );
    modal.show();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated data:", formData);
    // Here you can handle form submission, update the state or make an API call
    // Hide the modal after submission
    const modal = window.bootstrap.Modal.getInstance(
      document.getElementById("editModal")
    );
    modal.hide();
  };

  return (
    <div className="content-container">
      <div id="main">
        <header className="mb-3">
          <a href="#" className="burger-btn d-block d-xl-none">
            <i className="bi bi-justify fs-3"></i>
          </a>
        </header>
        <section className="section">
          <div className="row" id="table-contexual">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h2 className="new-price">{t("Liste echéance")}</h2>
                </div>
                <div className="card-content">
                <div className="card-body">
                  <div className="row ">
                      <div className="col-6">
                        <div className="form-group">
                          <label htmlFor="recherche">
                            <h6>{t("Numéro de téléphone")}</h6>
                          </label>
                          <input id="recherche" className="form-control" />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="form-group">
                          <label htmlFor="recherche">
                            <h6>{t("Pseudo")}</h6>
                          </label>
                          <input id="recherche" className="form-control" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="table-responsive">
                    {isMobile ? (
                      <table className="table">
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
                            <td>fdfdf</td>
                          </tr>
                          <tr>
                            <td>{t("Prénom")}</td>
                            <td>Lorem</td>
                          </tr>
                          <tr>
                            <td>{t("pseudo")}</td>
                            <td>Lorem Lorem</td>
                          </tr>
                          <tr>
                            <td>{t("Numéro de téléphone")}</td>
                            <td>Lorem</td>
                          </tr>
                          <tr>
                            <td>{t("Email")}</td>
                            <td>Lorem Lorem</td>
                          </tr>
                          <tr>
                            <td>{t("Date de paiement")}</td>
                            <td>Lorem</td>
                          </tr>
                          <tr>
                            <td>{t("Montant à payer")}</td>
                            <td>Lorem Lorem</td>
                          </tr>
                          <tr>
                            <td>{t("Montant restant")}</td>
                            <td>Lorem Lorem</td>
                          </tr>
                          <tr>
                            <td>{t("Montant à payer chaque mois")}</td>
                            <td>Lorem Lorem</td>
                          </tr>
                          <tr>
                            <td>{t("Modifier")}</td>
                            <td>
                              <button className="btn">
                                <i className="fa-solid fa-pen-to-square"></i>
                              </button>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan="2">
                              <hr />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    ) : (
                      <table className="table">
                        <thead>
                          <tr>
                            <th>{t("Photo de Profile")}</th>
                            <th>{t("Nom")}</th>
                            <th>{t("Prénom")}</th>
                            <th>{t("pseudo")}</th>
                            <th>{t("Numéro de téléphone")}</th>
                            <th>{t("Email")}</th>
                            <th>{t("Date de paiement")}</th>
                            <th>{t("Montant à payer")}</th>
                            <th>{t("Montant restant")}</th>
                            <th>{t("Montant à payer chaque mois")}</th>
                            <th>{t("Modifier")}</th>
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
                            <td>fdfdf</td>
                            <td>Lorem</td>
                            <td>Lorem Lorem</td>
                            <td>Lorem</td>
                            <td>Lorem Lorem</td>
                            <td>Lorem</td>
                            <td>Lorem Lorem</td>
                            <td className="text-bold-500">
                              {t("Lorem Lorem")}
                            </td>
                            <td>Lorem Lorem</td>
                            <td>
                              <button className="btn">
                                <i
                                  className="fa-solid fa-pen-to-square"
                                  onClick={handleModalOpen}
                                ></i>
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div
          className="modal fade"
          id="editModal"
          tabIndex="-1"
          aria-labelledby="editModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="editModalLabel">
                  {t("Modifier Echéance")}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">
                      {t("Date de paiement")}
                    </label>
                    <input
                      type="datetime-local"
                      name="datetime"
                      value={formData.datetime}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">{t("Montant à payer")}</label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  <div className="modal-footer">
                    <button type="submit" className="btn btn-primary">
                      {t("Enregistrer")}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      {t("Fermer")}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
