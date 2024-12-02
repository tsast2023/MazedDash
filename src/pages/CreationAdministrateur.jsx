import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { GlobalState } from "../GlobalState";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CreationAdministrateur() {
  const token = Cookies.get("token");
  const state = useContext(GlobalState);
  const roles = state.Roles;
  const [data, setData] = useState({
    prenom: "",
    numTel: "",
    email: "",
    identifiant: "",
    roleName: (roles && roles[0]?.name) || "",
    password: "",
  });

  const goBack = () => {
    window.history.back(); // Simulate a browser back button
  };

  const { t, i18n } = useTranslation();

  const submitAdmin = async (e) => {
    e.preventDefault();
    console.log(data);
    try {
      const res = await axios.post(
        "http://localhost:8081/admin/createAdmin",
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(res);
      toast.success(t("Action créée avec succès"));
      window.location.href = "/ListeAdministrateur";
    } catch (error) {
      console.log(error);
      toast.error(t("Echec de création"));
    }
  };

  return (
    <div className="content-container">
      <div id="app">
        <div id="main">
          <header className="mb-3">
            <a href="#" className="burger-btn d-block d-xl-none">
              <i className="bi bi-justify fs-3" />
            </a>
          </header>
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <h2 className="new-price">{t("Ajouter un administrateur")}</h2>
              </div>
              <div className="card-content">
                <div className="card-body">
                  <form onSubmit={submitAdmin} className="form form-vertical">
                    <div className="form-body">
                      <div className="row">
                        <div className="col-12">
                          <div className="form-group">
                            <label htmlFor="email-id-icon">{t("Nom")}</label>
                            <div className="position-relative">
                              <input
                                onChange={(e) =>
                                  setData({ ...data, prenom: e.target.value })
                                }
                                type="text"
                                className="form-control"
                                id="email-id-icon"
                                maxLength={25}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="form-group">
                            <label htmlFor="email-id-icon">{t("Email")}</label>
                            <div className="position-relative">
                              <input
                                onChange={(e) =>
                                  setData({ ...data, email: e.target.value })
                                }
                                type="email"
                                className="form-control"
                                id="email-id-icon"
                                maxLength={25}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="form-group">
                            <label htmlFor="email-id-icon">
                              {t("Identifiant")}
                            </label>
                            <div className="position-relative">
                              <input
                                onChange={(e) =>
                                  setData({
                                    ...data,
                                    identifiant: e.target.value,
                                  })
                                }
                                type="text"
                                className="form-control"
                                id="email-id-icon"
                                maxLength={25}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="form-group">
                            <label htmlFor="email-id-icon">
                              {t("mot de passe")}
                            </label>
                            <div className="position-relative">
                              <input
                                onChange={(e) =>
                                  setData({ ...data, password: e.target.value })
                                }
                                type="text"
                                className="form-control"
                                id="email-id-icon"
                                maxLength={25}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="form-group">
                          <label htmlFor="email-id-icon">
                            {t("Numéro de téléphone")}
                          </label>
                          <div className="input-group mb-3">
                            <input
                              onChange={(e) =>
                                setData({ ...data, numTel: e.target.value })
                              }
                              type="text"
                              className="form-control"
                              aria-label="Username"
                              aria-describedby="basic-addon1"
                            />
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="form-group">
                            <label htmlFor="email-id-icon">{t("Role")}</label>
                            <fieldset className="form-group mb-3">
                              <select
                                value={data.roleName} // Bind select value to state
                                onChange={(e) =>
                                  setData({ ...data, roleName: e.target.value })
                                }
                                className="form-select"
                                id="basicSelect"
                              >
                                {roles &&
                                  roles.map((item) => (
                                    <option key={item?.name} value={item?.name}>
                                      {item?.name}
                                    </option>
                                  ))}
                              </select>
                            </fieldset>
                          </div>
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-secondary me-2"
                          onClick={goBack}
                        >
                          {t("Annuler")}
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary"
                          id="suivantBtn"
                        >
                          {t("Enregistrer")}  
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreationAdministrateur;
