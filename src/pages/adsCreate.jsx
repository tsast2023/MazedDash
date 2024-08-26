import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useTranslation } from "react-i18next";
import axios from "axios";
import Cookies from "js-cookie";

function AnnonceCreator() {
  const token = Cookies.get('token');
  const { t } = useTranslation();
  const [fileInputType, setFileInputType] = useState("");
  const [type, setTypeAnnonce] = useState("");
  const [contenu, setAnnonce] = useState(null);
  const [description, setDescripton] = useState(); // To hold the uploaded file as Base64
  const [datePublication, setDatePublication] = useState();
  const [showPlanifierModal, setShowPlanifierModal] = useState(false);

  const handleTypeChange = (e) => {
    const selectedType = e.target.value;
    setFileInputType(selectedType);
    setTypeAnnonce(selectedType); // Set the type to the state as well
  };

  // Handle file input based on the selected type
  const handleFileInput = () => {
    if (fileInputType === "image" || fileInputType === "video") {
      return (
        <input
          type="file"
          className="form-control mb-3" // Add bottom margin for spacing between inputs
          accept={fileInputType === "video" ? "video/*" : "image/*"}
          onChange={handleFileUpload} // Call the upload handler
        />
      );
    }
    return null;
  };

  // Handle file upload and convert to Base64
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to an Array
    const filePromises = files.map(file =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result); // Resolve with the Base64 result
        };
        reader.onerror = reject;
        reader.readAsDataURL(file); // Read file as Base64
      })
    );

    // Wait for all promises to resolve and set Base64 data to state
    Promise.all(filePromises)
      .then(base64Files => {
        setAnnonce(base64Files); // Save Base64 representation to state
      })
      .catch(err => {
        console.error("Error converting file to Base64:", err);
      });
  };

  const publishNow = async () => {
    try {
      console.log(contenu, type, description);
      const res = await axios.post(
        `http://192.168.0.101:8081/api/annonce/createAnnonce?contenu=${contenu.toString()}&type=${type}&description=${description}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const scheduledAds = async () => {
    try {
      const res = await axios.post(
        `http://192.168.0.101:8081/api/annonce/planifier?contenu=${contenu}&type=${type}&description=${description}&datePublication=${datePublication}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="content-container">
      <div className="col-md-12">
        <div className="card">
          <div className="card-header">
            <h2 className="new-price">{t("Création d'annonce")}</h2>
          </div>
          <div className="card-content">
            <div className="card-body">
              <form className="form form-vertical">
                <div className="form-body">
                  <div className="row">
                    <div className="col-12">
                      <div className="form-group mb-3">
                        <label htmlFor="type-annonce">{t("Type de l'annonce")}</label>
                        <div className="position-relative">
                          <select
                            className="form-control"
                            id="type-annonce"
                            onChange={handleTypeChange}
                          >
                            <option value="">{t("Sélectionner le type d'annonce")}</option>
                            <option value="image">{t("Image")}</option>
                            <option value="video">{t("Vidéo")}</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 mb-3" id="file-input-container">
                      {handleFileInput()}
                    </div>
                    <div className="">
                      <h6 className="">Description:</h6>
                      <textarea
                        className="form-control"
                        name="description"
                        onChange={e => setDescripton(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-end mt-3">
                  <Button variant="secondary" className="me-2">
                    {t("Annuler")}
                  </Button>
                  <Button
                    variant="warning"
                    className="me-2"
                    onClick={() => setShowPlanifierModal(true)}
                  >
                    {t("Planifier")}
                  </Button>
                  <Button variant="info" onClick={publishNow}>
                    {t("Publier immédiatement")}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Modal
        show={showPlanifierModal}
        onHide={() => setShowPlanifierModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{t("Planifier la publication")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group mb-3">
            <label htmlFor="publicationDate">{t("Date")}</label>
            <input
              type="datetime-local"
              id="publicationDate"
              className="form-control"
              onChange={(e) => setDatePublication(e.target.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="light"
            onClick={() => setShowPlanifierModal(false)}
          >
            {t("Annuler")}
          </Button>
          <Button variant="secondary" onClick={scheduledAds}>
            {t("Planifier")}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AnnonceCreator;
