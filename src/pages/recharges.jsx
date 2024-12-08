import React, { useContext, useState, useEffect } from "react";
import Swal from "sweetalert2";
import { GlobalState } from "../GlobalState";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { Table } from "react-bootstrap";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import ReactPaginate from 'react-paginate';

function Recharges() {
  const token = Cookies.get("token");
  const { t, i18n } = useTranslation();
  const state = useContext(GlobalState);
  const cartes = state.cartes;
  const [carteRech, setCarteRech] = useState({
    quantity: 0,
    montant: 0
  });
  const [isMobile, setIsMobile] = useState(false);
  const {   
    numcard,
    setNumCard,
    statusRech,
    setStatusRech,
    pageCardRech,
    setpageCardRech,
    size,
    setSize
  } = useContext(GlobalState)
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
  const handlePageChange = (selectedPage) => {
    setpageCardRech(selectedPage.selected);
    console.log(pageCardRech) // React Paginate is 0-indexed, so we add 1
  };
  const handleDelete = (id, itemName) => {
    Swal.fire({
      title: t("Êtes-vous sûr(e) ?"),
      text: t("Veuillez entrer le nom de l'élément pour confirmer la suppression."),
      icon: "warning",
      input: "text",
      inputPlaceholder: t("Entrez le nom de l'élément"),
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: t("Oui, supprimez-le !"),
      cancelButtonText: t("Non, annuler !"),
      preConfirm: (inputValue) => {
        if (inputValue !== itemName) {
          Swal.showValidationMessage(t("Le nom ne correspond pas."));
          return false;
        }
        return true;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        deleteItem(id);
        Swal.fire({
          title: t("Supprimé"),
          text: t("Votre élément a été supprimé :)"),
          icon: "success",
          confirmButtonColor: "#b0210e",
        }).then(() => {
          window.location.reload(); // Reload after the alert is confirmed
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: t("Annulé"),
          text: t("Votre élément est en sécurité :)"),
          icon: "error",
          confirmButtonColor: "#b0210e",
        });
      }
    });
  };
  
  const deleteItem = async (id) => {
    try {
      const res = await axios.delete(
        `http://localhost:8081/api/carte/deleteCarte?id=${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  };
  

  const addCarte = async (e) => {
    e.preventDefault();
    console.log(carteRech)
    try {
      const res = await axios.post(
        `http://localhost:8081/api/carte/generer?quantity=${carteRech.quantity}&montant=${carteRech.montant}`,
        
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(res.data);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };
  const notify = () => {
    toast.success(t("Action créée avec succès"));
  };
  return (
    <div id="main">
      <header className="mb-3">
        <a href="#" className="burger-btn d-block d-xl-none">
          <i className="bi bi-justify fs-3"></i>
        </a>
      </header>

      <section id="form-and-scrolling-components">
        <div className="row">
          <div className="col-md-6 col-12">
            <div className="card">
              <div className="card-content">
                <div className="card-body">
                  <div className="form-group">
                    <h2 className="new-price">
                      {t("Vous souhaitez ajouter une nouvelle carte ?")}
                    </h2>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      data-bs-toggle="modal"
                      data-bs-target="#inlineForm"
                    >
                      <i className="bi bi-plus"></i>
                      {t("Ajouter")}
                    </button>

                    <div
                      className="modal fade text-left"
                      id="inlineForm"
                      tabIndex="-1"
                      role="dialog"
                      aria-labelledby="myModalLabel33"
                      aria-hidden="true"
                    >
                      <div
                        className="modal-dialog modal-dialog-centered modal-dialog-scrollable"
                        role="document"
                      >
                        <div className="modal-content">
                          <div className="modal-header">
                            <h4 className="modal-title" id="myModalLabel33">
                              {t("Ajouter une nouvelle carte")}
                            </h4>
                            <button
                              type="button"
                              className="btn-close"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                            ></button>
                          </div>
                          <form onSubmit={addCarte}>
                            <div className="modal-body">
                              <label htmlFor="serialNumber">
                                {t("quantity")}
                              </label>
                              <div className="form-group">
                                <input
                                  id="serialNumber"
                                  type="number"
                                  placeholder={t("Écrivez ici")}
                                  className="form-control"
                                  maxLength="25"
                                  onChange={(e) =>
                                    setCarteRech({
                                      ...carteRech,
                                      quantity: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <label htmlFor="serialNumber">
                                {t("montant")}
                              </label>
                              <div className="form-group">
                                <input
                                  id="serialNumber"
                                  type="text"
                                  placeholder={t("Écrivez ici")}
                                  className="form-control"
                                  maxLength="25"
                                  onChange={(e) =>
                                    setCarteRech({
                                      ...carteRech,
                                      montant: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              {/* <label htmlFor="value">{t("Valeur")}</label>
                              <div className="form-group">
                                <input
                                  id="value"
                                  type="text"
                                  placeholder={t("Écrivez ici")}
                                  className="form-control"
                                  maxLength="25"
                                  onChange={(e) =>
                                    setCarteRech({
                                      ...carteRech,
                                      valeur: e.target.value,
                                    })
                                  }
                                />
                              </div> */}
                            </div>
                            <div className="modal-footer">
                              <button
                                type="button"
                                className="btn btn-light-secondary"
                                data-bs-dismiss="modal"
                              >
                                <i className="bx bx-x d-block d-sm-none"></i>
                                <span className="btn btn-secondary">
                                  {t("Annuler")}
                                </span>
                              </button>
                              <button
                                type="submit"
                                className="btn btn-primary"
                                data-bs-dismiss="modal"
                              >
                                <i className="bx bx-check d-block d-sm-none"></i>
                                {/* <span
                                  className="btn btn-primary"
                                  onClick={notify}
                                > */}
                                  {t("Enregistrer")}
                                {/* </span> */}
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section mt-4">
        <div className="card">
          <div className="card-header">
            <h2 className="new-price">{t("Liste des cartes ajoutées")}</h2>
          </div>
          <div className="card-content">
            <div className="card-body">
            <div className="row ">
        <div className="col-4">
          <div className="form-group">
            <label htmlFor="recherche">
              <h6>{t("Numéro de série")}</h6>
            </label>
            <input required value={numcard} onChange={e=>setNumCard(e.target.value)} id="recherche" className="form-control" />
          </div>
        </div>
        <div className="col-4 form-group">
          <h6>{t("Statut")}</h6>
          <select value={statusRech} onChange={e=>setStatusRech(e.target.value)} className="choices form-select">
            <option value=""  selected></option>
            <option value="UTILISER">{t("Utiliser")}</option>
            <option value="NONUTILISER">{t("Non Utiliser")}</option>
          </select>
        </div><div className="col-4 form-group">
          <h6>{t("nombre des pages")}</h6>
          <input type="text" value={size} onChange={e=>setSize(e.target.value)} className="form-control" />
        </div>
        

       <ReactPaginate
        previousLabel={"← Previous"}
        nextLabel={"Next →"}
        breakLabel={"..."}
        pageCount={3} // Total number of pages
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        onPageChange={handlePageChange}
        containerClassName={"pagination"}
        activeClassName={"active"}
        className="react-paginate"
      />
      </div>
              {isMobile ? (
                <Table responsive="sm">
                  <tbody>
                    {cartes ? (
                      cartes?.content?.map((item) => (
                        <React.Fragment key={item.id}>
                          <tr>
                            <td>{t("Numéro de série")}</td>
                            <td className="text-bold-500">{item.numSérie}</td>
                          </tr>
                          <tr>
                            <td>{t("Valeur")}</td>
                            <td>{item.valeur}</td>
                          </tr>
                          <tr>
                            <td>{t("Valeur Bonus")}</td>
                            <td>{item.valeurBonusRecharge}</td>
                          </tr>
                          <tr>
                            <tr>
                              <td>{t("Statut")}</td>
                              <td>
                                <span
                                  className={
                                    item.statuscarte === "NONUTILISER"
                                      ? "badge bg-success"
                                      : "badge bg-danger"
                                  }
                                >
                                  {item.statuscarte}
                                </span>
                              </td>
                            </tr>
                            <td>{t("Supprimer")}</td>
                            <td>
                              <i
                                className="fa-solid fa-trash deleteIcon"
                                onClick={() => handleDelete(item.id , item.numSérie)}
                              ></i>
                            </td>
                          </tr>
                        </React.Fragment>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2">loading</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              ) : (
                <div className="table-responsive datatable-minimal">
                  <Table className="table" id="table2">
                    <thead>
                      <tr>
                        <th>{t("Numéro de série")}</th>
                        <th>{t("Valeur")}</th>
                        <th>{t("Valeur Bonus")}</th>
                        <th>{t("Statut")}</th>
                        <th>{t("Supprimer")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartes ? (
                        cartes?.content?.map((item) => (
                          <tr key={item.id}>
                            <td className="text-bold-500">{item.numSérie}</td>
                            <td>{item.valeur}</td>
                            <td>{item.valeurBonusRecharge}</td>
                            <td>
                              <span
                                className={
                                  item.statuscarte === "NONUTILISER"
                                    ? "badge bg-success"
                                    : "badge bg-danger"
                                }
                              >
                                {item.statuscarte}
                              </span>
                            </td>

                            <td>
                              <i
                                className="fa-solid fa-trash deleteIcon"
                                onClick={() => handleDelete(item.id , item.numSérie)}
                              ></i>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4">loading</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Recharges;
