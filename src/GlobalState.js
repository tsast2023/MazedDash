import React , {createContext , useState , useEffect} from 'react'
import  axios  from 'axios'
import Cookies from "js-cookie"

export const GlobalState = createContext()

export const DataProvider = ({children}) => {
 const token = Cookies.get('token');
  const [Categories , setCategories] = useState();
  const [Acheteur , setAcheteur] = useState();
  const [Vendeur , setVendeur] = useState();
  const [Products , setProducts] = useState();
  const [tutoriel , setTutotiel]= useState();
  const [carteRech , setCarteRech] = useState();
  const[bids , setBids] = useState();
  const[permissions , setPermissions] = useState();
  const[roles , setRoles] = useState();
  const[admins , setAdmins] = useState();
  const [commandes , setCommandes] = useState();
  const [users , setUsers] = useState();
  const [termes , setTermes] = useState();
  const [questions , setQuestions]= useState();
  const [annonces , setAnnonces] = useState();
  const [demandeT , setDemandeT] = useState();
  const [echeances , setEcheances] = useState();
  const [winners , setWinners] = useState();
  const [notifications , setNotifications] = useState();
  const [me , setMe] = useState();
  const [demandeCat , setDemandeCat] = useState();
  const [numTel , setnumTel] = useState("");
  const [pseudo , setpseudo] = useState("");
  const [statusDemande , setstatusDemande] = useState("");
  const [typeRecharge , settypeRecharge] = useState("");
  const [pageTransfert , setpageTransfert] = useState(0);
  const [traffic , setTraffic] = useState();
  const [numcard , setNumCard] = useState("");
  const [statusRech , setStatusRech] = useState("");
  const [pageCardRech , setpageCardRech] = useState(0);
  const [userPseudo , setUserPseudo] = useState("");
  const [userNumtel , setUserNumtel] = useState("");
  const [userStatus , setUserStatus] = useState("");
  const [pageUser , setpageUser] = useState(0);
  const [size , setSize] = useState(20);
  const [statusBid, setStatusBid] = useState(""); // Assuming StatusEnchere is an enum, you can also set a default here
  const [nomCategorie, setNomCategorie] = useState('');
  
  const [nomProduit, setNomProduit] = useState('');
  
 
  const [ville, setVille] = useState('');
  const [pageBid, setPageBid] = useState(0);


  const [pseudoAds ,setpseudoAds] = useState("");
  const [numTelAds ,setnumTelAds] = useState("");
  const [actionAnnonceAds ,setactionAnnonceAds] = useState("");
  const [pageAds , setpageAds] = useState(0);

  const [identifiantDemCat , setidentifiantDemCat] = useState("");
  const [statusDemCat , setstatusDemCat] = useState("");
  const [actionDemCat , setactionDemCat] = useState("");
  const [pageDemCat , setpageDemCat] = useState(0);

  useEffect(()=>{
    const getAllAcheteur = async() =>{
      try {
          const  res = await axios.get('http://localhost:8081/admin/users/Acheteur', {headers : {Authorization: `Bearer ${token}`}});
          console.log("Acheteur:",res.data);
          setAcheteur(res.data)
      } catch (error) {
          console.log(error);
      }
  }
  const getAllVendeur = async() =>{
    try {
        const  res = await axios.get('http://localhost:8081/admin/users/Vendeur', {headers : {Authorization: `Bearer ${token}`}});
        console.log("Vendeur:",res.data);
        setVendeur(res.data)
    } catch (error) {
        console.log(error);
    }
}

    const getAllCategories = async() =>{
        try {
            const  res = await axios.get('http://localhost:8081/api/categories/getAll', {headers : {Authorization: `Bearer ${token}`}});
            console.log("categories:",res.data);
            setCategories(res.data)
        } catch (error) {
            console.log(error);
        }
    }
    // const getAllProducts = async() =>{
    //     try {
    //         const  res = await axios.get('http://localhost:8081/api/product/getAll');
    //         console.log("Products:",res.data);
    //         setProducts(res.data)
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }
    const getAllTuto = async ()=>{
      try {
        const res = await axios.get('http://localhost:8081/api/tuto/getAll', {headers : {Authorization: `Bearer ${token}`}});
          console.log('tutorial:' , res.data);
          setTutotiel(res.data)
      } catch (error) {
        console.log(error)
      }
    }
    
    
    const getAllPermissions = async()=>{
      try {
        const res = await axios.get('http://localhost:8081/admin/permission/permissions', {headers : {Authorization: `Bearer ${token}`}})
        console.log("all permissions:" , res.data)
        setPermissions(res.data)
      } catch (error) {
        console.log(error)
      }
    }
    const getAllRoles = async()=>{
      try {
        const res = await axios.get('http://localhost:8081/admin/role/allRoles', {headers : {Authorization: `Bearer ${token}`}})
        console.log("all roles:" , res.data)
        setRoles(res.data)
      } catch (error) {
        console.log(error)
      }
    }
    const getAllAdmin = async()=>{
      try {
        const res = await axios.get('http://localhost:8081/admin/users/Admin', {headers : {Authorization: `Bearer ${token}`}})
        console.log("all Admins:" , res.data)
        setAdmins(res.data)
      } catch (error) {
        console.log(error)
      }
    }
    // const getAllCommandes = async()=>{
    //   try {
    //     const res = await axios.get('http://localhost:8081/api/commandes')
    //     console.log("all Commandes:" , res.data)
    //     setCommandes(res.data)
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }

    // const getAllTermes = async()=>{
    //   try {
    //     const res = await axios.get('http://localhost:8081/api/termes/getAll', {headers : {Authorization: `Bearer ${token}`}})
    //     console.log("all termes:" , res.data)
    //     setTermes(res.data)
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }
    const getAllQuestions = async()=>{
      try {
        const res = await axios.get('http://localhost:8081/api/questions', {headers : {Authorization: `Bearer ${token}`}})
        console.log("all questions:" , res.data)
        setQuestions(res.data)
      } catch (error) {
        console.log(error)
      }
    }
    
    
    const getAllEcheances = async()=>{
      try {
        const res = await axios.get('http://localhost:8081/api/echeance', {headers : {Authorization: `Bearer ${token}`}})
        console.log("all echeances:" , res.data , token)
        setEcheances(res.data)
      } catch (error) {
        console.log(error , token)
      }
    }
    // const getAllWinners = async()=>{
    //   try {
    //     const res = await axios.get('http://localhost:8081/api/bid/winners', {headers : {Authorization: `Bearer ${token}`}})
    //     console.log("all winners:" , res.data , token)
    //     setWinners(res.data)
    //   } catch (error) {
    //     console.log(error , token)
    //   }
    // }
    const getAllNotifications = async()=>{
      try {
        const res = await axios.get('http://localhost:8081/admin/noticationByLangue', {headers : {Authorization: `Bearer ${token}`}})
        console.log("all notifications:" , res.data , token)
        setNotifications(res.data)
      } catch (error) {
        console.log(error , token)
      }
    }
    const getMe = async()=>{
      try {
        const res = await axios.get('http://localhost:8081/api/auth/user/me', {headers : {Authorization: `Bearer ${token}`}})
        console.log("my account:" , res.data)
        setMe(res.data)
      } catch (error) {
        console.log(error , token)
      }
    }
    
    const getTrafic= async()=>{
      try {
        const res = await axios.get('http://localhost:8081/api/bid/trafic', {headers : {Authorization: `Bearer ${token}`}})
        console.log("All trafic:" , res.data)
        setTraffic(res.data)
      } catch (error) {
        console.log(error , token)
      }
    }
// getAllTermes()
getTrafic()
getAllVendeur()
getAllAcheteur()
// getAllCommandes();
getAllAdmin();     
getAllCategories();
// getAllProducts();
getAllTuto();

getAllPermissions();
getAllRoles();
getAllQuestions();


getAllEcheances();
// getAllWinners();
getAllNotifications();
getMe();

  } , [token ])
  useEffect(()=>{
    const getCarteRechar = async()=>{
      try {
        const res = await axios.get(`http://localhost:8081/api/carte/filter?numSerie=${numcard}&statusCarte=${statusRech}&page=${pageCardRech}&size=${size}`, {headers : {Authorization: `Bearer ${token}`}});
        console.log('cartes:' , res.data);
        setCarteRech(res.data);
      } catch (error) {
        console.log(error)
      }
    }
    getCarteRechar();

  } ,[ numcard , statusRech , pageCardRech , size] )

  useEffect(()=>{
    const getAllUsers = async()=>{
    console.log(userPseudo,userStatus , pageUser)
      try {
        const res = await axios.get(`http://localhost:8081/admin/filtredUser?pseudo=${userPseudo}&status=${userStatus}&page=${pageUser}&size=${size}`, {headers : {Authorization: `Bearer ${token}`}})
        console.log("all Users:" , res.data)
        setUsers(res.data)
      } catch (error) {
        console.log(error)
      }
    }
    getAllUsers();

  } , [userPseudo , userStatus , pageUser , size])

  useEffect(()=>{
    console.log(nomProduit)
    const getAllBids = async()=>{
      let url = `http://localhost:8081/api/bid/filter?nomProduit=${nomProduit}&nomCategorie=${nomCategorie}&ville=${ville}&page=${pageBid}&size=${size}`
      try {
        if(statusBid !== ""){
          url = url + `&status=${statusBid}`
        }

        const res = await axios.get(url, {headers : {Authorization: `Bearer ${token}`}})
        console.log("all bids:" , res.data)
        setBids(res.data)
      } catch (error) {
        console.log(error)
      }
    }
    getAllBids();

  } , [nomCategorie  , statusBid  , nomProduit , ville  , pageBid , size])
   
  useEffect(()=>{
    const getAllAnnonces = async()=>{
      try {
        const res = await axios.get(`http://localhost:8081/api/annonce/filter?pseudo=${pseudoAds}&numTel=${numTelAds}&actionAnnonce=${actionAnnonceAds}&page=${pageAds}`, {headers : {Authorization: `Bearer ${token}`}})
        console.log("all annonces:" , res.data)
        setAnnonces(res.data)
      } catch (error) {
        console.log(error)
      }
    }
    getAllAnnonces();
  },[pseudoAds , numTelAds , actionAnnonceAds ,pageAds ])
  useEffect(()=>{
    const getAllDemandeCategories = async()=>{
      try {
        let  url = `http://localhost:8081/api/demandes`///filter?identifiant=${identifiantDemCat}&page=${pageDemCat}
        if (actionDemCat){
          url += `&action=${actionDemCat}`
        }
        const res = await axios.get(url, {headers : {Authorization: `Bearer ${token}`}})
        console.log("All demandes:" , res.data)
        setDemandeCat(res.data)
      } catch (error) {
        console.log(error , token)
      }
    }
    getAllDemandeCategories();
  } , [identifiantDemCat , statusDemCat , pageDemCat , actionDemCat ])
  useEffect(()=>{
    const getAllDemandesTransfert = async()=>{
      try {
        const res = await axios.get(`http://localhost:8081/api/demandeTransfert/filter?numTel=${numTel}&pseudo=${pseudo}&statusDemande=${statusDemande}&typeRecharge=${typeRecharge}&page=${pageTransfert}&size=${size}`, {headers : {Authorization: `Bearer ${token}`}})
        console.log("all demandes transferts:" , res.data , token)
        setDemandeT(res.data)
      } catch (error) {
        console.log(error , token)
      }
    }
    getAllDemandesTransfert()
  }, [pseudo , statusDemande , typeRecharge , pageTransfert , size ])
  const state ={
    Categories : Categories,
    Products : Products,
    tutorials : tutoriel,
    bids : bids,
    cartes: carteRech,
    Permissions : permissions,
    Roles : roles,
    Admins :  admins,
    Commandes : commandes,
    Users : users,
    Termes:termes,
    Questions : questions,
    Annonces : annonces,
    Bids : bids,
    demandesT : demandeT,
    echeances : echeances,
    winners : winners,
    notifications: notifications,
    Me : me,
    demandes: demandeCat,
    Traffic : traffic,
    
    //for demandes transferts
    numTel,
    setnumTel,      
    pseudo,
    setpseudo,
    statusDemande,
    setstatusDemande,
    typeRecharge,
    settypeRecharge,
    pageTransfert,
    setpageTransfert,
    //for carte recharges
    numcard,
    setNumCard,
    statusRech,
    setStatusRech,
    pageCardRech,
    setpageCardRech,
    userPseudo ,
    setUserPseudo,
    userStatus ,
    setUserStatus,
    pageUser,
    setpageUser,
    //for bid
    statusBid,
    setStatusBid,
    nomCategorie ,
    setNomCategorie,
    nomProduit ,
    setNomProduit,
    ville ,
    setVille,
    pageBid,
    setPageBid,
    pseudoAds,
    setpseudoAds,
    numTelAds,
    setnumTelAds,
    actionAnnonceAds,
    setactionAnnonceAds,
    pageAds,
    setpageAds,
    //for demande category
    identifiantDemCat ,
    setidentifiantDemCat,
    statusDemCat ,
    setstatusDemCat,
    actionDemCat,
    setactionDemCat,
    pageDemCat,
    setpageDemCat,
    size,
    setSize

  }

  return(
    <GlobalState.Provider value={state}>
        {children}
    </GlobalState.Provider>
  )
}