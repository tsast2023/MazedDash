import axios from "axios";
import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from 'react-toastify';

const Notification = () => {
  const token = Cookies.get("token");
  const { t, i18n } = useTranslation();  // Access the i18n instance
  const [isMobile, setIsMobile] = useState(false);
  const [Notification, setNotification] = useState({
    titleAr: "",
    titleEn: "",
    titleFr: "",
    bodyAr: "",
    bodyFR: "",
    bodyEn: "",
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

  // Effect to change the direction based on the selected language
  // useEffect(() => {
  //   const direction = i18n.language === "ar" ? "rtl" : "ltr";
  //   document.documentElement.dir = direction; // Set the direction of the document
  // }, [i18n.language]);

  const sendNotofication = async (e) => {
    e.preventDefault();
    
    try {
      const res = await axios.post(
        "http://localhost:8081/Notification/sendToAll",
        Notification,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("response:",res.data);
    } catch (error) {
      console.log(error);
    }
  };
  
  const notify = () => {
    toast.success(t("Action créée avec succès"));
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
                  <h2 className="new-price">
                    {t("Enovyer des notifications")}
                  </h2>
                </div>
                <div className="card-content">
                  <div className="card-body">
                    <form onSubmit={sendNotofication} className="row">
                      <div className="col-12">
                        <div className="form-group">
                          <label htmlFor="fr">{t("title(francais)")}</label>
                          <input
                            onChange={(e) =>
                              setNotification({
                                ...Notification,
                                titleFr: e.target.value,
                              })
                            }
                            type="text"
                            id="fr"
                            className="form-control"
                            required
                          />

                          <label htmlFor="fr">{t("body(francais)")}</label>
                          <textarea required 
                            onChange={(e) =>
                              setNotification({
                                ...Notification,
                                bodyFR: e.target.value,
                              })
                            }
                            type="text"
                            id="fr"
                            className="form-control"
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="en">{t("title(englais)")}</label>
                          <input
                            onChange={(e) =>
                              setNotification({
                                ...Notification,
                                titleEn: e.target.value,
                              })
                            }
                            type="text"
                            id="en"
                            className="form-control"
                            required
                          />
                          <label htmlFor="en">{t("body(englais)")}</label>
                          <textarea required 
                            onChange={(e) =>
                              setNotification({
                                ...Notification,
                                bodyEn: e.target.value,
                              })
                            }
                            type="text"
                            id="en"
                            className="form-control"
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="ar">{t("title(arabe)")}</label>
                          <input
                            onChange={(e) =>
                              setNotification({
                                ...Notification,
                                titleAr: e.target.value,
                              })
                            }
                            type="text"
                            id="ar"
                            className="form-control"
                            required
                          />
                          <label htmlFor="ar">{t("body(arabe)")}</label>
                          <textarea required 
                            onChange={(e) =>
                              setNotification({
                                ...Notification,
                                bodyAr: e.target.value,
                              })
                            }
                            type="text"
                            id="ar"
                            className="form-control"
                            required
                          />
                          <br />
                        </div>
                      </div>
                      <div className="col-12 d-flex justify-content-end">
                      <Button type="submit" className="btn btn-primary me-1 mb-1" onClick={notify}>
                        {t("Envoyer a tous")}
                      </Button>
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
  );
};

export default Notification;
