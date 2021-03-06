import './PersoonInformatie.css';
import { useState, useEffect, useContext } from "react";
import { Button } from '../../Styling/Button'
import { connectieString, postRequest, uitleningToevoegen } from '../../../Constanten';
import Popup from 'reactjs-popup';
import ExemplaarInformatie from '../Boeken/ExemplaarInformatie';
import { TableStyle } from '../../Styling/Table';
import MaakBoekTabel from '../Boeken/BoekTabel';
import { persoonContext } from '../../../App';
import { ZoekveldStyling } from '../../Styling/ZoekveldStyling';
import '../../Styling/Popup.css'


function PersoonInformatie(props) {

    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [personen, setPersonen] = useState([]);
    const [gezochtePersonen, setGezochtePersonen] = useState([]);
    const [naam, setNaam] = useState('')
    const [succesBericht, setSuccesBericht] = useState('');
    const [uitleningToegevoegd, setUitleningToegevoegd] = useState(false);
    const [huidigPersoon, setHuidigPersoon] = useState(null);
    const [nieuweUitlening, setNieuweUitlening] = useState(false);
    const persoon = useContext(persoonContext);
    const [uitDienstPopUp, setUitDienstPopUp] = useState(false);
    const [uitDienstPersoon, setUitDienstPersoon] = useState(null);


    const haalPersonenOp = () => {
        fetch("http://localhost:8080/personen/")
            .then((res) => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    if (Object.entries(result).length > 0) {
                        setPersonen(result);
                        setSuccesBericht("Gevonden!")
                        setGezochtePersonen(result);
                    } else {
                        setSuccesBericht("Geen overeenkomend persoon gevonden")
                    }

                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    };

    useEffect(() => {
        haalPersonenOp();
    }, [uitDienstPopUp]);

    

    const haalPersonenOpNaam = (naam) => {
        setNaam(naam);

        let filterData = personen.filter(v => v.naam.toLowerCase().includes(naam.toLowerCase()));
        if (Object.entries(filterData).length > 0) {
            setGezochtePersonen(filterData);
            setSuccesBericht("Personen gevonden")
        } else {
            setGezochtePersonen(personen);
            setSuccesBericht("Geen overeenkomend persoon gevonden")
        }

    };

    const setUitleningInfo = (persoon) => {
        setNieuweUitlening(true);
        setHuidigPersoon(persoon.id);
        setUitleningToegevoegd(false);
    }

    const setUitDienstInfo = (persoonId) => {
        setUitDienstPopUp(true);
        setUitDienstPersoon(persoonId);
    }

    const verwijderPersoonsGegevens = (persoonId) => {
        const response = fetch("http://localhost:8080/uitdienst/" + persoonId, {
            method: 'GET'
        })
        setUitDienstPopUp(false);
        return response;
    }

    return (
        <div>
            <ZoekveldStyling>
            <h1>
            <input type="string" placeholder='Zoek op naam ...' defaultValue={naam}
                onChange={e => { haalPersonenOpNaam(e.target.value) }} />
            <button onClick={() => haalPersonenOpNaam()}>Zoek</button>
            </h1>
            </ZoekveldStyling>
            <TableStyle>
                <table>
                    <thead>
                        <tr>
                            <th>Naam</th>
                            <th>Email</th>
                            <th>Uitlenen</th>
                            {/* Dit zie je alleen als je op PersoonInformatie.js zit:*/}
                            {!props.exemplaar &&
                            <th>Uit Dienst</th>
                            }
                            {/* {props.exemplaar ? <th></th> : null} */}
                        </tr>
                    </thead>
                    <tbody>
                        {gezochtePersonen.map(persoon =>
                            <tr key={persoon.id}>
                                <td>
                                    {persoon.naam}
                                </td>
                                <td>
                                    {persoon.email}
                                </td>
                                {/* Dit wordt aangeroepen als je vanaf BoekTabel.js komt: */}
                                {leenUitTabel(persoon, props.nieuweUitleningToevoegen, props.exemplaar)}
                                {/* Dit zie je als je van op PersoonInformatie.js zit:*/}
                                {!props.exemplaar &&
                                    <td >
                                        <Button onClick={() => setUitleningInfo(persoon)}>Uitlenen</Button>
                                    </td>
                                }
                                {!props.exemplaar &&
                                <td>
                                    <button className = "Knop3" onClick={() => setUitDienstInfo(persoon.id)}>Uit Dienst</button>
                                </td>
                                }
                            </tr>
                        )
                        }
                    </tbody>
                </table>
            </TableStyle>
            <Popup open={nieuweUitlening} modal onClose={() => setNieuweUitlening(false)} closeOnDocumentClick={false}>
                <div className="boekPopup">
                    <button className="close" onClick={() => setNieuweUitlening(false)}> &times; </button>
                    <MaakBoekTabel persoon = {huidigPersoon}/>
                </div>
            </Popup>

            <Popup open={uitDienstPopUp} modal onClose={() => setUitDienstPopUp(false)} closeOnDocumentClick={false}>
                <div className = "bevestiging">
                    <button className = "close" onClick={() => setUitDienstPopUp(false)}> &times; </button>
                    <p className = "vraag">Weet je het zeker dat je de naam en email wil verwijderen?</p>
                    <button className = "knop1" onClick={() => verwijderPersoonsGegevens(uitDienstPersoon)}>Ja</button>
                    <button className = "knop2" onClick={() => setUitDienstPopUp(false)}>Nee</button>
                </div>
            </Popup>
        </div>
    );


}
export default PersoonInformatie;

const leenUitTabel = (persoon, nieuweUitleningToevoegen, exemplaar) => {
    if (exemplaar) {
        return (
            <td>
                <Button onClick={() => nieuweUitleningToevoegen(persoon.id, exemplaar, 0)}>Leen uit</Button>
            </td>
        );
    }
    return null;
}

